import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Language, Problem } from '../types';

export default function SolutionsPanel({
  problem,
  language,
}: {
  problem: Problem;
  language: Language;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (problem.solutions.length === 0) return null;

  return (
    <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Reference solutions
      </div>

      <div className="space-y-2">
        {problem.solutions.map((sol, i) => {
          const open = openIdx === i;
          const code = sol.code[language];
          return (
            <div
              key={sol.name}
              className="overflow-hidden rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
            >
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700/40"
              >
                <div className="flex items-center gap-2">
                  {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{sol.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 dark:bg-slate-700">
                    time {sol.timeComplexity}
                  </span>
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 dark:bg-slate-700">
                    space {sol.spaceComplexity}
                  </span>
                </div>
              </button>

              {open && (
                <div className="border-t border-slate-200 dark:border-slate-700">
                  <pre className="overflow-x-auto bg-[#0f172a] px-3 py-2.5 font-mono text-[12px] leading-[1.6] text-slate-100">
                    <code>{code}</code>
                  </pre>
                  <div className="px-3 py-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {sol.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
