import { GoogleGenAI, Type } from '@google/genai';
import type { Language, Problem } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export const isGeminiConfigured = Boolean(apiKey);

const client = apiKey ? new GoogleGenAI({ apiKey }) : null;

export type AnalysisVerdict = 'optimal' | 'good' | 'suboptimal';

export type SolutionAnalysis = {
  estimatedTimeComplexity: string;
  estimatedSpaceComplexity: string;
  approachName: string;
  /** Name of the closest matching canonical solution, or null if novel. */
  matchesCanonical: string | null;
  verdict: AnalysisVerdict;
  /** 1–2 sentence explanation of the verdict. */
  reasoning: string;
  /** 1 sentence on how to improve. Null if already optimal. */
  suggestion: string | null;
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    estimatedTimeComplexity: {
      type: Type.STRING,
      description: 'Big-O time complexity of the user\'s code, e.g. "O(n)" or "O(n log n)".',
    },
    estimatedSpaceComplexity: {
      type: Type.STRING,
      description: 'Big-O space complexity of the user\'s code.',
    },
    approachName: {
      type: Type.STRING,
      description: 'A 1–3 word label for the approach the user took, e.g. "Brute Force", "Hash Map", "Two Pointers".',
    },
    matchesCanonical: {
      type: Type.STRING,
      nullable: true,
      description: 'Name of the canonical solution this most closely matches, or null if the approach is genuinely novel.',
    },
    verdict: {
      type: Type.STRING,
      enum: ['optimal', 'good', 'suboptimal'],
      description: '"optimal" = matches the best canonical solution. "good" = correct and reasonable but not the best. "suboptimal" = correct but a much better approach exists.',
    },
    reasoning: {
      type: Type.STRING,
      description: '1–2 sentences explaining the verdict — what makes this optimal/good/suboptimal compared to the canonical solutions.',
    },
    suggestion: {
      type: Type.STRING,
      nullable: true,
      description: 'If verdict is not "optimal", one sentence suggesting how to improve. Null otherwise.',
    },
  },
  required: [
    'estimatedTimeComplexity',
    'estimatedSpaceComplexity',
    'approachName',
    'verdict',
    'reasoning',
  ],
};

function buildPrompt(problem: Problem, language: Language, code: string): string {
  const canonical = problem.solutions
    .map(
      (s, i) =>
        `${i + 1}. ${s.name} — time ${s.timeComplexity}, space ${s.spaceComplexity}\n   ${s.explanation.replace(/\n/g, ' ').replace(/`/g, '')}`
    )
    .join('\n');

  return `You are reviewing an interview-prep candidate's solution to a LeetCode-style problem. Your job is to analyze their approach and tell them whether it's the most optimal solution.

# Problem: ${problem.title} (${problem.difficulty})

${problem.prompt.replace(/`/g, '')}

# Canonical solutions (from worst to best)

${canonical}

# The candidate's submitted ${language} code

\`\`\`${language}
${code}
\`\`\`

# Your task

1. Estimate the time and space complexity of the candidate's code (Big-O).
2. Identify which approach they took (compare to the canonical solutions).
3. Render a verdict:
   - "optimal": matches the best canonical solution's complexity and approach
   - "good": correct and reasonable but a measurably better approach exists
   - "suboptimal": correct but the gap to optimal is significant (e.g. O(n²) vs O(n))
4. Explain your reasoning in 1–2 sentences.
5. If not optimal, give a single sentence on how to improve. Don't quote canonical code verbatim.

Be honest. If the candidate found a non-canonical approach that's still optimal, mark it optimal and explain. If they have a subtle bug that passed only by luck, still grade their approach (tests already passed, so focus on complexity).`;
}

// ─── Progressive hints ───────────────────────────────────────────────────

export type ProblemHints = {
  /** Exactly 3 hints, ordered from most-vague (Direction) to most-specific (Approach). */
  hints: string[];
};

const HINTS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    hints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        'Exactly 3 hints, ordered from most-vague to most-specific: Direction, Insight, Approach.',
    },
  },
  required: ['hints'],
};

function buildHintsPrompt(problem: Problem, language: Language, code: string): string {
  return `You are a coding interview tutor. The candidate is solving the problem below and may be stuck. Give them 3 progressive hints — each more specific than the last — **without ever writing code or revealing the full solution**.

# Problem: ${problem.title} (${problem.difficulty})

${problem.prompt.replace(/`/g, '')}

# Candidate's current code (for context only — may be empty or just the starter)

\`\`\`${language}
${code}
\`\`\`

# Your task

Return exactly 3 hints in a JSON array, in this order:

1. **Direction** (vague): A gentle nudge toward the right *category* of approach or data structure. Often phrased as a question. Doesn't say *what to do*, just *what to think about*.
2. **Insight** (specific): The key algorithmic insight needed. Explain *why* a particular technique fits this problem. Still no pseudocode.
3. **Approach** (most specific): A plain-English step-by-step description of the algorithm — like you'd explain it to a friend at a whiteboard. NO code, NO pseudocode, but the full procedure.

Rules:
- Each hint is 1–3 sentences.
- Never write code, pseudocode, or function names that give away the solution.
- If their current code is on the wrong track, gently redirect in hint 2 or 3.
- If their code is empty / just the starter, ignore it.`;
}

export async function getHints(
  problem: Problem,
  language: Language,
  code: string
): Promise<ProblemHints> {
  if (!client) {
    throw new Error(
      'Gemini API not configured. Set VITE_GEMINI_API_KEY in .env to enable hints.'
    );
  }

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: buildHintsPrompt(problem, language, code),
    config: {
      responseMimeType: 'application/json',
      responseSchema: HINTS_SCHEMA,
      temperature: 0.5,
    },
  });

  const text = response.text;
  if (!text) throw new Error('Gemini returned an empty response.');

  try {
    const parsed = JSON.parse(text) as ProblemHints;
    if (!Array.isArray(parsed.hints) || parsed.hints.length === 0) {
      throw new Error('Malformed hints array.');
    }
    return parsed;
  } catch (err) {
    throw new Error(
      'Gemini returned an unparseable response: ' +
        (err instanceof Error ? err.message : String(err))
    );
  }
}

// ─── Solution analysis ───────────────────────────────────────────────────

export async function analyzeSolution(
  problem: Problem,
  language: Language,
  code: string
): Promise<SolutionAnalysis> {
  if (!client) {
    throw new Error(
      'Gemini API not configured. Set VITE_GEMINI_API_KEY in .env to enable analysis.'
    );
  }

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: buildPrompt(problem, language, code),
    config: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) throw new Error('Gemini returned an empty response.');

  try {
    const parsed = JSON.parse(text) as SolutionAnalysis;
    // Defensive: ensure suggestion is null when verdict is optimal.
    if (parsed.verdict === 'optimal') parsed.suggestion = null;
    // matchesCanonical isn't required by schema; default to null.
    if (parsed.matchesCanonical === undefined) parsed.matchesCanonical = null;
    return parsed;
  } catch (err) {
    throw new Error(
      'Gemini returned an unparseable response: ' +
        (err instanceof Error ? err.message : String(err))
    );
  }
}
