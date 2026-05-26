import { useEffect, useState } from 'react';
import { Lightbulb, Loader2, AlertTriangle, EyeOff } from 'lucide-react';
import { getHints, isGeminiConfigured } from '../lib/gemini';
import type { Language, Problem } from '../types';

const TIER_LABELS = ['Direction', 'Insight', 'Approach'];
const TIER_COLORS = [
  'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200',
  'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-200',
  'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200',
];

type Props = {
  problem: Problem;
  language: Language;
  code: string;
};

export default function HintsPanel({ problem, language, code }: Props) {
  const [hints, setHints] = useState<string[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset hints whenever the problem changes (different prompt → different hints).
  useEffect(() => {
    setHints([]);
    setRevealedCount(0);
    setError(null);
  }, [problem.id]);

  if (!isGeminiConfigured) return null;

  const fetchHints = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHints(problem, language, code);
      setHints(result.hints);
      setRevealedCount(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const hide = () => {
    setHints([]);
    setRevealedCount(0);
    setError(null);
  };

  // Idle state — no hints fetched yet
  if (hints.length === 0 && !loading && !error) {
    return (
      <button
        onClick={fetchHints}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:from-amber-100 hover:to-yellow-100 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-yellow-950/30 dark:text-amber-300 dark:hover:from-amber-900/40 dark:hover:to-yellow-900/40"
      >
        <Lightbulb size={14} />
        Stuck? Get a hint
      </button>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <Loader2 size={14} className="animate-spin" />
        Thinking up some hints…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900/40 dark:bg-rose-950/30">
        <div className="flex items-start gap-2 text-sm text-rose-800 dark:text-rose-300">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="font-semibold">Couldn't get hints</div>
            <div className="mt-0.5 text-xs">{error}</div>
            <button
              onClick={fetchHints}
              className="mt-2 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Lightbulb size={12} className="text-amber-500" />
          Hints
        </div>
        <button
          onClick={hide}
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          title="Hide hints"
        >
          <EyeOff size={11} /> Hide
        </button>
      </div>

      <div className="space-y-2">
        {hints.slice(0, revealedCount).map((hint, i) => (
          <div
            key={i}
            className={`rounded-lg border p-3 text-sm leading-relaxed ${TIER_COLORS[i] ?? TIER_COLORS[2]}`}
          >
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
              {i + 1}. {TIER_LABELS[i] ?? `Hint ${i + 1}`}
            </div>
            <div>{hint}</div>
          </div>
        ))}
      </div>

      {revealedCount < hints.length ? (
        <button
          onClick={() => setRevealedCount((n) => n + 1)}
          className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-50 dark:border-amber-700/50 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-amber-950/30"
        >
          Reveal next hint ({revealedCount} of {hints.length} shown)
        </button>
      ) : (
        <div className="rounded-md bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          All hints revealed. If you're still stuck, peek at a canonical solution after passing tests.
        </div>
      )}
    </div>
  );
}
