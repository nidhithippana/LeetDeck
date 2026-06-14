const AI_KEY_STORAGE = 'leetdeck.ai.key';

export function getAIKey(): string {
  if (typeof window === 'undefined') return '';
  // User-entered key in Settings always takes priority over env var
  const legacy = window.localStorage.getItem('leetdeck.anthropic.key');
  const current = window.localStorage.getItem(AI_KEY_STORAGE);
  if (legacy && !current) {
    window.localStorage.setItem(AI_KEY_STORAGE, legacy);
  }
  const stored = current ?? legacy ?? '';
  if (stored) return stored;
  return (import.meta.env.VITE_OPENAI_API_KEY as string | undefined) ?? '';
}

export function saveAIKey(key: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AI_KEY_STORAGE, key.trim());
}

async function openaiRequest(apiKey: string, body: object): Promise<Response> {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
}

export type StepCoverage = {
  step: string;
  covered: 'yes' | 'partial' | 'missing';
  note: string;
};

export type QuestioningFeedback = {
  overall: 'strong' | 'adequate' | 'weak' | 'none';
  summary: string;
  betterQuestions: string[];
};

export type ReviewFeedback = {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  summary: string;
  frameworkCoverage?: StepCoverage[];
  questioningFeedback?: QuestioningFeedback;
};

export async function reviewDesign(params: {
  questionTitle: string;
  questionPrompt: string;
  textResponse: string;
  imageDataUrl: string | null;
  chatHistory?: { role: 'user' | 'ai'; content: string }[];
}): Promise<ReviewFeedback> {
  const apiKey = getAIKey();
  if (!apiKey) {
    throw new Error('No API key found. Add your OpenAI API key in Settings → AI Review.');
  }

  const chatTranscript =
    params.chatHistory && params.chatHistory.length > 0
      ? params.chatHistory
          .map((m) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`)
          .join('\n')
      : null;

  const prompt = `You are an expert system design interviewer at a top-tier tech company evaluating a mock interview.

The candidate was asked: "${params.questionTitle}"

Full question context (what you as the interviewer know):
${params.questionPrompt}

═══════════════════════════════════════════════
SECTION 1 — CLARIFYING QUESTIONS
${chatTranscript
  ? `The candidate asked the following clarifying questions:\n\n${chatTranscript}`
  : 'The candidate asked NO clarifying questions before designing.'}
═══════════════════════════════════════════════
SECTION 2 — WRITTEN RESPONSE
${params.textResponse?.trim() || '(No written response provided)'}
═══════════════════════════════════════════════
SECTION 3 — HIGH-LEVEL DESIGN DIAGRAM
${params.imageDataUrl
  ? 'The candidate drew a system design diagram (attached image). Evaluate it alongside their written response.'
  : 'The candidate did NOT draw a diagram. A missing diagram is a significant gap — high-level design is expected to be visual in real interviews. Deduct points accordingly.'}
═══════════════════════════════════════════════

EVALUATION INSTRUCTIONS:

1. CLARIFYING QUESTIONS: Evaluate whether the candidate asked the right questions before designing.
   Strong questions surface: core use cases, scale (DAU/QPS/storage), latency targets, consistency requirements,
   read/write ratio, geography, specific constraints. Weak questions are vague, redundant, or miss critical unknowns.
   If they asked no questions, that is a serious gap.

2. FRAMEWORK COVERAGE (rate each step):
   - "yes" = clearly and specifically addressed
   - "partial" = mentioned but shallow or incomplete
   - "missing" = not addressed at all

   Steps:
   1. Functional requirements — 2-3 core verbs, explicit out-of-scope parking
   2. Non-functional requirements — availability vs consistency choice, latency target, QPS/scale, durability
   3. Core entities & API — named data objects with fields, endpoint signatures with request/response shapes
   4. High-level design — end-to-end happy-path flow (Client → gateway → service(s) → storage) per operation; MUST include a diagram
   5. Deep dive — identified THE hard problem specific to this question (fan-out, ID gen, ranking, dedup, etc.) with options + reasoned choice
   6. Scale & operate — caching strategy, sharding/replication, queues, rate limiting, monitoring/alerting

3. SUGGESTIONS must be hyper-specific to THIS question — not generic advice.
   BAD: "Add caching"
   GOOD: "Add a Redis sorted set keyed by user_id storing the 800 most recent tweet IDs (score = timestamp) so timeline reads are O(log N) instead of fan-out at read time"
   Each suggestion should tell them exactly WHAT to add, WHERE it fits in their design, and WHY it solves a specific problem.

4. SCORING: Base 1-10. Deduct 1-2 points if no diagram. Deduct 1 point if no clarifying questions.
   7+ = ready for senior roles. Reference their actual words when scoring.

Return ONLY valid JSON, no markdown fences:
{
  "score": <integer 1-10>,
  "summary": "<2-3 sentences: overall verdict referencing their actual response, noting diagram presence/absence and question quality>",
  "strengths": [
    "<specific strength quoting or referencing their actual words>",
    "<strength 2>",
    "<strength 3>"
  ],
  "gaps": [
    "<gap that directly references something missing from their response>",
    "<gap 2>",
    "<gap 3>"
  ],
  "suggestions": [
    "<hyper-specific suggestion: exact data structure/component to add, where it fits, why it solves the bottleneck for THIS problem>",
    "<suggestion 2 — equally specific>",
    "<suggestion 3>",
    "<suggestion 4>"
  ],
  "frameworkCoverage": [
    { "step": "Functional requirements", "covered": "yes"|"partial"|"missing", "note": "<one sentence on what they did or didn't cover>" },
    { "step": "Non-functional requirements", "covered": "yes"|"partial"|"missing", "note": "<one sentence>" },
    { "step": "Core entities & API", "covered": "yes"|"partial"|"missing", "note": "<one sentence>" },
    { "step": "High-level design", "covered": "yes"|"partial"|"missing", "note": "<one sentence — if no diagram, note that explicitly>" },
    { "step": "Deep dive", "covered": "yes"|"partial"|"missing", "note": "<one sentence>" },
    { "step": "Scale & operate", "covered": "yes"|"partial"|"missing", "note": "<one sentence>" }
  ],
  "questioningFeedback": {
    "overall": "strong"|"adequate"|"weak"|"none",
    "summary": "<2 sentences on the quality of their clarifying questions — what they uncovered and what they missed>",
    "betterQuestions": [
      "<a specific question they should have asked or a better version of one they asked, with explanation of why it matters for this problem>",
      "<better question 2>",
      "<better question 3>"
    ]
  }
}`;

  type ContentPart =
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } };

  const content: ContentPart[] = [{ type: 'text', text: prompt }];
  if (params.imageDataUrl) {
    content.push({ type: 'image_url', image_url: { url: params.imageDataUrl } });
  }

  const response = await openaiRequest(apiKey, {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content }],
    max_tokens: 1800,
    temperature: 0.3,
  });

  if (!response.ok) {
    const errText = await response.text();
    let message = `OpenAI API error ${response.status}`;
    try {
      const parsed = JSON.parse(errText) as { error?: { message?: string } };
      if (parsed.error?.message) message = parsed.error.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const text = data.choices[0]?.message?.content ?? '';

  try {
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    return JSON.parse(cleaned) as ReviewFeedback;
  } catch {
    return { score: 0, strengths: [], gaps: [], suggestions: [], summary: text };
  }
}

export type ChatMessage = { role: 'user' | 'ai'; content: string };

export async function chatWithInterviewer(params: {
  questionTitle: string;
  questionPrompt: string;
  messages: ChatMessage[];
}): Promise<string> {
  const apiKey = getAIKey();
  if (!apiKey) {
    throw new Error('No API key found. Add your OpenAI API key in Settings → AI Review.');
  }

  const systemPrompt = `You are playing the role of a senior system design interviewer at a top-tier tech company. The candidate is going to design: "${params.questionTitle}".

Context you know as the interviewer:
${params.questionPrompt}

Rules for you:
- Answer clarifying questions concisely — 1 to 3 sentences max, like a real interviewer
- Give concrete numbers and constraints when asked (scale, latency targets, etc.)
- Do NOT suggest architectures or hint at solutions
- If they ask something off-topic, redirect them briefly
- After 5+ clarifying questions, you can nudge: "I think you have enough to start — what's your approach?"`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...params.messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
  ];

  const response = await openaiRequest(apiKey, {
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 300,
    temperature: 0.7,
  });

  if (!response.ok) {
    const errText = await response.text();
    let message = `OpenAI API error ${response.status}`;
    try {
      const parsed = JSON.parse(errText) as { error?: { message?: string } };
      if (parsed.error?.message) message = parsed.error.message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content?.trim() ?? 'No response.';
}
