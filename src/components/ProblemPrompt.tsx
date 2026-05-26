import { ExternalLink } from 'lucide-react';
import type { Problem } from '../types';

const diffStyles: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Medium: 'bg-amber-100 text-amber-700 ring-amber-200',
  Hard: 'bg-rose-100 text-rose-700 ring-rose-200',
};

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const tok = match[0];
    if (tok.startsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-slate-900 dark:text-slate-100">
          {tok.slice(2, -2)}
        </strong>
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.875em] text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderPrompt(prompt: string): React.ReactNode {
  const blocks = prompt.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (/^\d+\.\s/m.test(block)) {
      const items = block.split(/\n(?=\d+\.\s)/);
      return (
        <ol key={i} className="list-decimal space-y-1.5 pl-6 text-slate-700 dark:text-slate-300">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item.replace(/^\d+\.\s/, ''))}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="text-slate-700 dark:text-slate-300">
        {renderInline(block)}
      </p>
    );
  });
}

export default function ProblemPrompt({ problem }: { problem: Problem }) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${diffStyles[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {problem.topic}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {problem.title}
        </h1>
      </header>

      <section className="space-y-3 text-[15px] leading-relaxed">
        {renderPrompt(problem.prompt)}
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Examples
        </h2>
        {problem.examples.map((ex, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800/60"
          >
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Input:&nbsp;</span>
              <span className="text-slate-800 dark:text-slate-200">{ex.input}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Output:&nbsp;</span>
              <span className="text-slate-800 dark:text-slate-200">{ex.output}</span>
            </div>
            {ex.explanation && (
              <div className="mt-1">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Explanation:&nbsp;</span>
                <span className="text-slate-600 dark:text-slate-400">{ex.explanation}</span>
              </div>
            )}
          </div>
        ))}
      </section>

      {problem.constraints && problem.constraints.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Constraints
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {problem.constraints.map((c, i) => (
              <li key={i} className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(problem.leetcodeUrl || problem.neetcodeUrl) && (
        <section className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
          {problem.leetcodeUrl && (
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              LeetCode <ExternalLink size={11} />
            </a>
          )}
          {problem.neetcodeUrl && (
            <a
              href={problem.neetcodeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              NeetCode <ExternalLink size={11} />
            </a>
          )}
        </section>
      )}
    </div>
  );
}
