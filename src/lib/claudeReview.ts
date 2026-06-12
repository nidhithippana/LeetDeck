const AI_KEY_STORAGE = 'leetdeck.ai.key';

export function getAIKey(): string {
  // Env var takes priority — set VITE_GEMINI_API_KEY in .env
  const envKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (envKey) return envKey;
  if (typeof window === 'undefined') return '';
  // Fall back to manually entered key stored in localStorage
  const legacy = window.localStorage.getItem('leetdeck.anthropic.key');
  const current = window.localStorage.getItem(AI_KEY_STORAGE);
  if (legacy && !current) {
    window.localStorage.setItem(AI_KEY_STORAGE, legacy);
  }
  return current ?? legacy ?? '';
}

export function saveAIKey(key: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AI_KEY_STORAGE, key.trim());
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
    throw new Error(
      'No API key found. Add your Gemini API key in Settings → AI Review.'
    );
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

  type GeminiPart =
    | { text: string }
    | { inline_data: { mime_type: string; data: string } };

  const parts: GeminiPart[] = [{ text: prompt }];

  if (params.imageDataUrl) {
    const base64 = params.imageDataUrl.replace(/^data:image\/png;base64,/, '');
    parts.push({ inline_data: { mime_type: 'image/png', data: base64 } });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    let message = `Gemini API error ${response.status}`;
    try {
      const parsed = JSON.parse(errText) as { error?: { message?: string } };
      if (parsed.error?.message) message = parsed.error.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await response.json()) as {
    candidates: Array<{
      content: { parts: Array<{ text: string }> };
    }>;
  };

  const text = data.candidates[0]?.content?.parts[0]?.text ?? '';

  try {
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    return JSON.parse(cleaned) as ReviewFeedback;
  } catch {
    return { score: 0, strengths: [], gaps: [], suggestions: [], summary: text };
  }
}
