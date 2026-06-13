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

export type ReviewFeedback = {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  summary: string;
  frameworkCoverage?: StepCoverage[];
};

export async function reviewDesign(params: {
  questionTitle: string;
  questionPrompt: string;
  textResponse: string;
  imageDataUrl: string | null;
}): Promise<ReviewFeedback> {
  const apiKey = getAIKey();
  if (!apiKey) {
    throw new Error('No API key found. Add your OpenAI API key in Settings → AI Review.');
  }

  const prompt = `You are an expert system design interviewer at a top-tier tech company.

The candidate was asked: "${params.questionTitle}"

Full question prompt:
${params.questionPrompt}

---
Candidate's written response:
${params.textResponse?.trim() || '(No written response provided)'}

---
${params.imageDataUrl ? 'The candidate also drew a system design diagram (attached image).' : 'The candidate did not draw a diagram.'}

Evaluate their response against the standard SD interview framework. For each of the 6 steps, rate coverage as:
- "yes" = clearly and specifically addressed
- "partial" = mentioned but shallow or incomplete
- "missing" = not addressed at all

The 6 framework steps:
1. Functional requirements — listed 2-3 core operations as verbs, explicitly parked out-of-scope items
2. Non-functional requirements — addressed consistency vs availability, latency target, scale (users/QPS), durability — located where each property applies
3. Core entities & API — defined the data objects (nouns) and endpoints with request/response shapes
4. High-level design — described a clear happy-path flow (Client → entry point → service → storage) for each core operation
5. Deep dive — identified the hard part of this specific problem (e.g. ID generation, fan-out, ranking, dedup, consistency) and presented options with a reasoned choice
6. Scale & operate — added layers to hit non-functional targets: caching, sharding/replication, queues, rate limiting, monitoring

Also factor in seniority signals (rate limiting, SPOF identification, trade-offs called out, hot key/skew handling).

Return ONLY a valid JSON object with exactly this structure (no other text, no markdown fences):
{
  "score": <integer 1-10>,
  "strengths": ["<specific strength referencing their actual response>", "<strength 2>", "<strength 3>"],
  "gaps": ["<critical gap 1>", "<gap 2>", "<gap 3>"],
  "suggestions": ["<actionable suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "summary": "<1-2 sentence overall assessment referencing their specific response>",
  "frameworkCoverage": [
    { "step": "Functional requirements", "covered": "yes"|"partial"|"missing", "note": "<one specific sentence about what they did or didn't cover>" },
    { "step": "Non-functional requirements", "covered": "yes"|"partial"|"missing", "note": "<one specific sentence>" },
    { "step": "Core entities & API", "covered": "yes"|"partial"|"missing", "note": "<one specific sentence>" },
    { "step": "High-level design", "covered": "yes"|"partial"|"missing", "note": "<one specific sentence>" },
    { "step": "Deep dive", "covered": "yes"|"partial"|"missing", "note": "<one specific sentence>" },
    { "step": "Scale & operate", "covered": "yes"|"partial"|"missing", "note": "<one specific sentence>" }
  ]
}

Be constructive, specific, and reference their actual response content. A score of 7+ means ready for senior roles.`;

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
    max_tokens: 1024,
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
