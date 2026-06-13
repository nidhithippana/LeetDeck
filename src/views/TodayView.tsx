import { useEffect, useMemo } from 'react';
import { Flame, Sparkles, RotateCcw, CheckCircle2, SkipForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import LeetDeckLogo from '../components/LeetDeckLogo';
import type { Problem } from '../types';
import { buildDailyQueue } from '../srs/queue';
import type { SrsData } from '../srs/useSrsState';
import UserMenu from '../components/UserMenu';
import type { User } from '@supabase/supabase-js';
import { PROBLEMS, PROBLEMS_BY_ID } from '../data/problems';
import { TOPIC_ORDER } from '../data/topics';
import { usePageTitle } from '../lib/usePageTitle';
import { todayISO } from '../srs/sm2';

const LAST_CELEBRATED_KEY = 'leetdeck.lastCelebrated';

function fireConfetti() {
  const duration = 1200;
  const end = Date.now() + duration;
  const colors = ['#39ff7f', '#22c55e', '#10b981', '#a7f3d0', '#fde68a'];
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

const diffStyles: Record<string, string> = {
  Easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Medium: 'text-amber-700 bg-amber-50 border-amber-200',
  Hard: 'text-rose-700 bg-rose-50 border-rose-200',
};

function ProblemCard({
  problem,
  kind,
  onClick,
  onSkip,
}: {
  problem: Problem;
  kind: 'new' | 'review';
  onClick: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="group flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500">
      <button onClick={onClick} className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${diffStyles[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {problem.topic}
          </span>
        </div>
        <div className="mt-1 truncate text-base font-semibold text-slate-900 dark:text-slate-100">
          {problem.title}
        </div>
      </button>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={onSkip}
          title="Skip for today"
          className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <SkipForward size={13} />
          Skip
        </button>
        <button
          onClick={onClick}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 dark:bg-slate-700"
        >
          {kind === 'new' ? 'Learn' : 'Review'} →
        </button>
      </div>
    </div>
  );
}

export default function TodayView({
  data,
  user,
  onOpenProblem,
  onSignOut,
  onOpenSettings,
  topicFilter,
  onTopicFilterChange,
  skippedToday,
  onSkip,
}: {
  data: SrsData;
  user: User;
  onOpenProblem: (problemId: string, kind: 'new' | 'review') => void;
  onSignOut: () => Promise<void>;
  onOpenSettings?: () => void;
  topicFilter: string | null;
  onTopicFilterChange: (topic: string | null) => void;
  skippedToday: string[];
  onSkip: (problemId: string) => void;
}) {
  const queue = buildDailyQueue({ ...data, topicFilter, skippedIds: skippedToday });
  const { newCards, reviewCards, newDoneCount, reviewDoneCount, newTarget, reviewTarget } = queue;
  const dueCount = newCards.length + reviewCards.length;
  usePageTitle(dueCount > 0 ? `Today (${dueCount} due)` : 'Today');

  // Topics with at least one unseen, unskipped problem → show in "New" group
  // Topics where user has done at least one but none remain unseen → show in "Past topics" group
  const { topicsWithNew, topicsCompleted } = useMemo(() => {
    const seenIds = new Set(Object.keys(data.cards));
    const skipped = new Set(skippedToday);
    const withNew = TOPIC_ORDER.filter((topic) =>
      PROBLEMS.some((p) => p.topic === topic && !seenIds.has(p.id) && !skipped.has(p.id))
    );
    const completed = TOPIC_ORDER.filter((topic) => {
      const anyDone = PROBLEMS.some((p) => p.topic === topic && seenIds.has(p.id));
      const anyUnseen = PROBLEMS.some((p) => p.topic === topic && !seenIds.has(p.id) && !skipped.has(p.id));
      return anyDone && !anyUnseen;
    });
    return { topicsWithNew: withNew, topicsCompleted: completed };
  }, [data.cards, skippedToday]);

  const completedToday = [
    ...data.todaySession.newCompleted.map((id) => ({ id, kind: 'new' as const })),
    ...data.todaySession.reviewCompleted.map((id) => ({ id, kind: 'review' as const })),
  ];

  const allDone = newCards.length === 0 && reviewCards.length === 0;
  const didAnythingToday = completedToday.length > 0;

  useEffect(() => {
    if (!(allDone && didAnythingToday)) return;
    const today = todayISO();
    const last = typeof window !== 'undefined' ? window.localStorage.getItem(LAST_CELEBRATED_KEY) : null;
    if (last === today) return;
    window.localStorage.setItem(LAST_CELEBRATED_KEY, today);
    const t = window.setTimeout(fireConfetti, 200);
    return () => window.clearTimeout(t);
  }, [allDone, didAnythingToday]);

  // Only show the "extra review from X" hint if that topic actually appears in the queue
  const hasTopicInReviews =
    topicFilter !== null &&
    (topicsCompleted as string[]).includes(topicFilter) &&
    reviewCards.some((p) => p.topic === topicFilter);
  const showDropdown = topicsWithNew.length > 0 || topicsCompleted.length > 0;

  const topicDropdown = showDropdown ? (
    <select
      value={topicFilter ?? ''}
      onChange={(e) => onTopicFilterChange(e.target.value || null)}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    >
      <option value="">All topics</option>
      {topicsWithNew.length > 0 && (
        <optgroup label="New available">
          {topicsWithNew.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </optgroup>
      )}
      {topicsCompleted.length > 0 && (
        <optgroup label="Past topics – extra review">
          {topicsCompleted.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </optgroup>
      )}
    </select>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <LeetDeckLogo size={22} withWordmark />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 dark:border-orange-900/50 dark:bg-orange-950/40">
              <Flame size={14} className="text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{data.profile.streak}</span>
              <span className="text-xs text-orange-600 dark:text-orange-400">day</span>
            </div>
            <UserMenu user={user} onSignOut={onSignOut} onOpenSettings={onOpenSettings} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Today
          </div>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Sparkles size={14} /> New today
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {newDoneCount}
              <span className="ml-1 text-base font-normal text-slate-400 dark:text-slate-500">
                / {newTarget}
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <RotateCcw size={14} /> Reviews today
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {reviewDoneCount}
              <span className="ml-1 text-base font-normal text-slate-400 dark:text-slate-500">
                / {reviewTarget}
              </span>
            </div>
          </div>
        </div>

        {allDone && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40">
            <CheckCircle2 className="mx-auto text-emerald-600 dark:text-emerald-400" size={36} />
            <div className="mt-2 text-lg font-bold text-emerald-900 dark:text-emerald-200">
              {didAnythingToday ? 'All done for today!' : 'No problems due'}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-400">
              {didAnythingToday
                ? "Come back tomorrow for your next batch. Streak protected."
                : "You're ahead of the curve — check back tomorrow."}
            </div>
          </div>
        )}

        {newCards.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Sparkles size={14} /> New problems ({newCards.length})
              </h2>
              {topicDropdown}
            </div>
            <div className="space-y-2">
              {newCards.map((p) => (
                <ProblemCard
                  key={p.id}
                  problem={p}
                  kind="new"
                  onClick={() => onOpenProblem(p.id, 'new')}
                  onSkip={() => onSkip(p.id)}
                />
              ))}
            </div>
          </section>
        )}

        {reviewCards.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <RotateCcw size={14} /> Reviews ({reviewCards.length})
              </h2>
              {/* Show topic picker in reviews header when new cards section isn't visible */}
              {newCards.length === 0 && topicDropdown}
            </div>
            {hasTopicInReviews && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                Focusing on <strong className="font-semibold">{topicFilter}</strong> today — your regular due reviews carry over to tomorrow.
              </p>
            )}
            {topicFilter && (topicsCompleted as string[]).includes(topicFilter) && !hasTopicInReviews && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                All <strong className="font-semibold">{topicFilter}</strong> cards were already done today.
              </p>
            )}
            <div className="space-y-2">
              {reviewCards.map((p) => (
                <ProblemCard
                  key={p.id}
                  problem={p}
                  kind="review"
                  onClick={() => onOpenProblem(p.id, 'review')}
                  onSkip={() => onSkip(p.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Dropdown anchor when both sections are empty (filtered to empty topic) */}
        {newCards.length === 0 && reviewCards.length === 0 && !allDone && topicDropdown && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No problems in <strong className="font-semibold">{topicFilter}</strong> right now.
            </p>
            {topicDropdown}
          </div>
        )}

        {skippedToday.length > 0 && (
          <section className="space-y-2 pt-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Skipped today
            </h2>
            <div className="space-y-1.5">
              {skippedToday.map((id) => {
                const problem = PROBLEMS_BY_ID[id];
                if (!problem) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-md border border-slate-100 bg-white px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                  >
                    <SkipForward size={13} className="shrink-0 text-slate-400" />
                    <span className="truncate">{problem.title}</span>
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {problem.topic}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {completedToday.length > 0 && (
          <section className="space-y-2 pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completed today
            </h2>
            <div className="space-y-1.5">
              {completedToday.map(({ id, kind }) => {
                const problem = PROBLEMS_BY_ID[id];
                return (
                  <div
                    key={`${kind}-${id}`}
                    className="flex items-center gap-2 rounded-md border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                  >
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="truncate">{problem?.title ?? id}</span>
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {kind}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
