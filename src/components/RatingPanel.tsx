import { useState } from 'react';
import type { CardState, Rating } from '../types';
import { applyRating, formatInterval, newCard } from '../srs/sm2';

const RATINGS: { value: Rating; label: string; cls: string }[] = [
  { value: 'again', label: 'Again', cls: 'bg-rose-600 hover:bg-rose-700' },
  { value: 'hard',  label: 'Hard',  cls: 'bg-amber-600 hover:bg-amber-700' },
  { value: 'good',  label: 'Good',  cls: 'bg-emerald-600 hover:bg-emerald-700' },
  { value: 'easy',  label: 'Easy',  cls: 'bg-sky-600 hover:bg-sky-700' },
];

export default function RatingPanel({
  problemId,
  card,
  onRate,
}: {
  problemId: string;
  /** Current card state from the DB, or undefined if the problem hasn't been seen before. */
  card: CardState | undefined;
  onRate: (rating: Rating) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState<Rating | null>(null);

  const base = card ?? newCard(problemId);

  const handle = async (rating: Rating) => {
    if (submitting) return;
    setSubmitting(rating);
    try {
      await onRate(rating);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
      <div className="mb-3 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
        How well did you recall this?
      </div>
      <div className="grid grid-cols-4 gap-2">
        {RATINGS.map((r) => {
          const preview = applyRating(base, r.value);
          const isBusy = submitting === r.value;
          return (
            <button
              key={r.value}
              onClick={() => handle(r.value)}
              disabled={submitting !== null}
              className={`flex flex-col items-center rounded-md px-3 py-2.5 text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${r.cls}`}
            >
              <span className="text-sm font-semibold">
                {isBusy ? '…' : r.label}
              </span>
              <span className="text-[11px] opacity-90">
                +{formatInterval(preview.intervalDays)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-emerald-700/80 dark:text-emerald-300/80">
        Your rating sets the next review date.
        <strong className="ml-1 font-semibold">Again</strong> resets the streak for this card;
        <strong className="ml-1 font-semibold">Easy</strong> pushes it furthest.
      </p>
    </div>
  );
}
