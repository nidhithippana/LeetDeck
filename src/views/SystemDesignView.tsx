import { BookOpen, CheckCircle2, RotateCcw, Layers } from "lucide-react";
import LeetDeckLogo from "../components/LeetDeckLogo";
import UserMenu from "../components/UserMenu";
import type { User } from "@supabase/supabase-js";
import type { SdSrsState, SDTopicStat } from "../srs/useSdSrs";
import { SD_CARDS } from "../data/systemDesign";
import { usePageTitle } from "../lib/usePageTitle";

function TopicRow({ stat }: { stat: SDTopicStat }) {
  const allDone = stat.due === 0;
  const pct = stat.total > 0 ? (stat.touched / stat.total) * 100 : 0;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {stat.topic}
          </span>
          {stat.due > 0 && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              {stat.due} due
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all ${
              pct === 100
                ? "bg-emerald-500"
                : "bg-indigo-400 dark:bg-indigo-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
          {stat.touched} / {stat.total}
        </div>
        {allDone ? (
          <CheckCircle2 size={14} className="ml-auto mt-0.5 text-emerald-500" />
        ) : (
          <RotateCcw
            size={12}
            className="ml-auto mt-0.5 text-slate-300 dark:text-slate-600"
          />
        )}
      </div>
    </div>
  );
}

export default function SystemDesignView({
  sdSrs,
  user,
  onStartReview,
  onSignOut,
  onOpenSettings,
}: {
  sdSrs: SdSrsState;
  user: User;
  onStartReview: () => void;
  onSignOut: () => Promise<void>;
  onOpenSettings?: () => void;
}) {
  const dueCount = sdSrs.dueCards.length;
  const reviewedCount = sdSrs.todayReviewed.length;
  const totalReviewed = Object.values(sdSrs.cards).filter(
    (c) => c.totalReviews > 0
  ).length;
  const dueReviewCount = sdSrs.dueCards.filter((id) => !!sdSrs.cards[id]).length;
  const dueNewCount = sdSrs.dueCards.filter((id) => !sdSrs.cards[id]).length;

  usePageTitle(
    dueCount > 0 ? `System Design (${dueCount} due)` : "System Design"
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <LeetDeckLogo size={22} withWordmark />
            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              System Design
            </span>
          </div>
          <UserMenu
            user={user}
            onSignOut={onSignOut}
            onOpenSettings={onOpenSettings}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Layers size={13} /> System Design
          </div>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Due today
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {dueCount}
            </div>
            {dueCount > 0 && (
              <div className="mt-1 flex gap-2 text-[10px] font-medium">
                {dueReviewCount > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">{dueReviewCount} review{dueReviewCount !== 1 ? 's' : ''}</span>
                )}
                {dueNewCount > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400">{dueNewCount} new</span>
                )}
              </div>
            )}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Reviewed today
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {reviewedCount}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cards seen
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalReviewed}
              <span className="ml-1 text-base font-normal text-slate-400 dark:text-slate-500">
                / {SD_CARDS.length}
              </span>
            </div>
          </div>
        </div>

        {dueCount === 0 ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40">
            <CheckCircle2
              className="mx-auto text-emerald-600 dark:text-emerald-400"
              size={36}
            />
            <div className="mt-2 text-lg font-bold text-emerald-900 dark:text-emerald-200">
              {reviewedCount > 0
                ? "All done for today!"
                : "Nothing due right now"}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-400">
              {reviewedCount > 0
                ? "Come back tomorrow for your next system design review."
                : "You're ahead — check back tomorrow."}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={onStartReview}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <BookOpen size={18} />
              Start Today's Review — {dueCount} card{dueCount !== 1 ? "s" : ""}
            </button>
            {(dueReviewCount > 0 || dueNewCount > 0) && (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                {[
                  dueReviewCount > 0 && `${dueReviewCount} review${dueReviewCount !== 1 ? 's' : ''}`,
                  dueNewCount > 0 && `${dueNewCount} new${sdSrs.currentNewTopic ? ` · Topic: ${sdSrs.currentNewTopic}` : ''}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </div>
        )}

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Topics
          </h2>
          <div className="space-y-2">
            {sdSrs.topicStats.map((stat) => (
              <TopicRow key={stat.topic} stat={stat} />
            ))}
          </div>
        </section>

        {reviewedCount > 0 && (
          <section className="space-y-2 pt-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Reviewed today
            </h2>
            <div className="space-y-1.5">
              {sdSrs.todayReviewed.map((id) => {
                const card = SD_CARDS.find((c) => c.id === id);
                if (!card) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-md border border-slate-100 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <CheckCircle2
                      size={14}
                      className="shrink-0 text-emerald-500"
                    />
                    <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-300">
                      {card.front}
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {card.topic}
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
