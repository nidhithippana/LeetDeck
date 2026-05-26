import { useState } from 'react';
import { BookmarkPlus, Check } from 'lucide-react';
import type { CardState, Rating } from '../types';
import { applyRating, formatInterval, isNew, newCard } from '../srs/sm2';

const RATINGS: { value: Rating; label: string; sub: string; cls: string }[] = [
  { value: 'again', label: 'Again',  sub: 'Just met it', cls: 'bg-rose-600 hover:bg-rose-700' },
  { value: 'hard',  label: 'Hard',   sub: 'Shaky',       cls: 'bg-amber-600 hover:bg-amber-700' },
  { value: 'good',  label: 'Good',   sub: 'Solid',       cls: 'bg-emerald-600 hover:bg-emerald-700' },
  { value: 'easy',  label: 'Easy',   sub: 'Mastered',    cls: 'bg-sky-600 hover:bg-sky-700' },
];

type Props = {
  problemId: string;
  card: CardState | undefined;
  onMark: (rating: Rating) => Promise<void>;
};

export default function MarkFamiliarityPanel({ problemId, card, onMark }: Props) {
  const [submitting, setSubmitting] = useState<Rating | null>(null);
  const [success, setSuccess] = useState<Rating | null>(null);
  const [error, setError] = useState<string | null>(null);

  const base = card ?? newCard(problemId);

  const handle = async (rating: Rating) => {
    if (submitting) return;
    setSubmitting(rating);
    setError(null);
    try {
      await onMark(rating);
      setSuccess(rating);
      // Reset the success indicator after a moment so the user can re-rate.
      setTimeout(() => setSuccess(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(null);
    }
  };

  // Render different states
  const cardExists = card !== undefined;
  const cardStatus = card
    ? isNew(card)
      ? 'new'
      : 'in deck'
    : 'unseen';

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="mb-3 flex items-start gap-2">
        <BookmarkPlus size={16} className="mt-0.5 shrink-0 text-indigo-500" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Already know this one?
          </div>
          <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            If you've solved this before (or are joining mid-prep), mark your familiarity. The card
            will be added to your deck and scheduled accordingly — no need to re-solve from scratch.
          </div>
          {cardExists && (
            <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Currently: {cardStatus} · next due {card!.dueDate}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {RATINGS.map((r) => {
          const preview = applyRating(base, r.value);
          const isBusy = submitting === r.value;
          const justRated = success === r.value;
          return (
            <button
              key={r.value}
              onClick={() => handle(r.value)}
              disabled={submitting !== null}
              className={`flex flex-col items-center rounded-md px-3 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${r.cls}`}
            >
              <span className="flex items-center gap-1 text-xs font-semibold">
                {justRated && <Check size={11} />}
                {isBusy ? '…' : r.label}
              </span>
              <span className="text-[10px] opacity-80">{r.sub}</span>
              <span className="text-[10px] font-mono opacity-90">
                +{formatInterval(preview.intervalDays)}
              </span>
            </button>
          );
        })}
      </div>

      {success && !submitting && (
        <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          Added to your deck. Next review: <strong className="font-mono">{applyRating(base, success).dueDate}</strong>.
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}
    </div>
  );
}
