import { useState } from 'react';
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { analyzeSolution, isGeminiConfigured } from '../lib/gemini';
import type { SolutionAnalysis as Analysis } from '../lib/gemini';
import type { Language, Problem } from '../types';

const VERDICT_STYLES = {
  optimal: {
    bg: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/30',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />,
    label: 'Optimal',
  },
  good: {
    bg: 'border-sky-200 bg-sky-50 dark:border-sky-900/40 dark:bg-sky-950/30',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    icon: <TrendingUp size={16} className="text-sky-600 dark:text-sky-400" />,
    label: 'Good, but improvable',
  },
  suboptimal: {
    bg: 'border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    icon: <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />,
    label: 'Suboptimal',
  },
} as const;

type Props = {
  problem: Problem;
  language: Language;
  code: string;
};

export default function SolutionAnalysis({ problem, language, code }: Props) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isGeminiConfigured) return null;

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeSolution(problem, language, code);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!analysis && !loading && !error) {
    return (
      <button
        onClick={handleAnalyze}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-2.5 text-sm font-semibold text-purple-800 transition hover:from-purple-100 hover:to-indigo-100 dark:border-purple-900/40 dark:from-purple-950/30 dark:to-indigo-950/30 dark:text-purple-300 dark:hover:from-purple-900/40 dark:hover:to-indigo-900/40"
      >
        <Sparkles size={14} />
        Analyze my solution with AI
      </button>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <Loader2 size={14} className="animate-spin" />
        Analyzing your code…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900/40 dark:bg-rose-950/30">
        <div className="flex items-start gap-2 text-sm text-rose-800 dark:text-rose-300">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="font-semibold">Analysis failed</div>
            <div className="mt-0.5 text-xs">{error}</div>
            <button
              onClick={handleAnalyze}
              className="mt-2 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const v = VERDICT_STYLES[analysis.verdict];

  return (
    <div className={`space-y-3 rounded-lg border p-4 ${v.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {v.icon}
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${v.badge}`}>
            {v.label}
          </span>
        </div>
        <button
          onClick={handleAnalyze}
          className="text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          title="Re-analyze"
        >
          Re-run
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-white/60 p-2 dark:bg-slate-900/40">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Time
          </div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
            {analysis.estimatedTimeComplexity}
          </div>
        </div>
        <div className="rounded-md bg-white/60 p-2 dark:bg-slate-900/40">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Space
          </div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
            {analysis.estimatedSpaceComplexity}
          </div>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Approach: </span>
          <span className="text-slate-700 dark:text-slate-300">{analysis.approachName}</span>
          {analysis.matchesCanonical && (
            <span className="text-slate-500 dark:text-slate-400">
              {' '}
              (similar to <span className="font-semibold">{analysis.matchesCanonical}</span>)
            </span>
          )}
        </div>
        <div className="text-slate-700 dark:text-slate-300">{analysis.reasoning}</div>
        {analysis.suggestion && (
          <div className="mt-2 rounded-md border border-slate-300/50 bg-white/60 px-2.5 py-2 text-slate-800 dark:border-slate-600/50 dark:bg-slate-900/40 dark:text-slate-200">
            <span className="font-semibold">💡 Suggestion: </span>
            {analysis.suggestion}
          </div>
        )}
      </div>

      <div className="pt-1 text-[10px] text-slate-500 dark:text-slate-400">
        AI-generated · may be wrong · always sanity-check
      </div>
    </div>
  );
}
