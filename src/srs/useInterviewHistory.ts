import { useCallback, useState } from 'react';

const HISTORY_KEY = 'leetdeck.interviews.history';

export type InterviewRecord = {
  completedAt: string;
  score: number;
  attempts: number;
};

function loadHistory(): Record<string, InterviewRecord> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(
      window.localStorage.getItem(HISTORY_KEY) ?? '{}'
    ) as Record<string, InterviewRecord>;
  } catch {
    return {};
  }
}

function saveHistory(h: Record<string, InterviewRecord>) {
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

export type InterviewHistoryState = {
  history: Record<string, InterviewRecord>;
  markCompleted: (questionId: string, score: number) => void;
};

export function useInterviewHistory(): InterviewHistoryState {
  const [history, setHistory] = useState<Record<string, InterviewRecord>>(
    () => loadHistory()
  );

  const markCompleted = useCallback((questionId: string, score: number) => {
    setHistory((prev) => {
      const existing = prev[questionId];
      const next: Record<string, InterviewRecord> = {
        ...prev,
        [questionId]: {
          completedAt: new Date().toISOString(),
          score,
          attempts: (existing?.attempts ?? 0) + 1,
        },
      };
      saveHistory(next);
      return next;
    });
  }, []);

  return { history, markCompleted };
}
