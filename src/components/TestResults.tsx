import { Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import type { TestRunResult } from '../types';

function fmt(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export default function TestResults({
  result,
  running,
}: {
  result: TestRunResult | null;
  running: boolean;
}) {
  if (running) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Loader2 size={14} className="animate-spin" />
        Running tests…
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">
        Run your code to see results.
      </div>
    );
  }

  if (!result.ok) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
        <div className="min-w-0">
          <div className="font-semibold">Error</div>
          <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs">
            {result.error}
          </pre>
        </div>
      </div>
    );
  }

  const passed = result.results.filter((r) => r.pass).length;
  const total = result.results.length;
  const allPassed = passed === total;

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold ${
          allPassed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
        }`}
      >
        <span>{allPassed ? 'All tests passed' : 'Some tests failed'}</span>
        <span className="font-mono text-xs">
          {passed} / {total}
        </span>
      </div>

      <div className="space-y-2">
        {result.results.map((r, i) => (
          <details
            key={i}
            open={!r.pass}
            className={`rounded-md border ${
              r.pass ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30' : 'border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30'
            }`}
          >
            <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold">
                {r.pass ? (
                  <Check size={14} className="text-emerald-700" />
                ) : (
                  <X size={14} className="text-rose-700" />
                )}
                <span className={r.pass ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}>
                  Test {i + 1}
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{r.durationMs}ms</span>
            </summary>
            <div className="space-y-1 border-t border-slate-200/60 px-3 py-2 font-mono text-xs dark:border-slate-700/40">
              <div className="break-words">
                <span className="text-slate-500 dark:text-slate-400">in:&nbsp;</span>
                <span className="text-slate-800 dark:text-slate-200">{fmt(r.input)}</span>
              </div>
              <div className="break-words">
                <span className="text-slate-500 dark:text-slate-400">expected:&nbsp;</span>
                <span className="text-slate-800 dark:text-slate-200">{fmt(r.expected)}</span>
              </div>
              <div className="break-words">
                <span className="text-slate-500 dark:text-slate-400">got:&nbsp;</span>
                <span className={r.pass ? 'text-slate-800 dark:text-slate-200' : 'text-rose-700 dark:text-rose-400'}>
                  {fmt(r.actual)}
                </span>
              </div>
              {r.error && (
                <div className="break-words">
                  <span className="text-slate-500 dark:text-slate-400">error:&nbsp;</span>
                  <span className="text-rose-700 dark:text-rose-400">{r.error}</span>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
