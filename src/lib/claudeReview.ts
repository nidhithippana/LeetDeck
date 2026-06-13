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

export type ReviewFeedback = {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  summary: string;
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

Evaluate their response on these criteria:
1. Requirements gathering (did they clarify scope?)
2. Architecture completeness (are the right components present?)
3. Scalability and performance considerations
4. Data storage and schema design
5. Handling failures and edge cases
6. Communication clarity and structure

Return ONLY a valid JSON object with exactly this structure (no other text, no markdown fences):
{
  "score": <integer 1-10>,
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "gaps": ["<critical gap 1>", "<critical gap 2>", "<critical gap 3>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"],
  "summary": "<1-2 sentence overall assessment referencing their specific response>"
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
