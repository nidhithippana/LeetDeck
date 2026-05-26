import { PROBLEMS } from '../data/problems';
import { topicIndex } from '../data/topics';
import type { CardState, Problem, Profile, SessionLog } from '../types';
import { isDue, isNew, todayISO } from './sm2';

export type DailyQueue = {
  /** Unseen problems queued in NeetCode-roadmap order (topic order, then problem.order). */
  newCards: Problem[];
  /** Due reviews, **randomized stably for the day** so the user can't game the queue. */
  reviewCards: Problem[];
  newDoneCount: number;
  reviewDoneCount: number;
  newTarget: number;
  reviewTarget: number;
};

/**
 * Tiny deterministic string hash (djb2). Used to assign each card a stable
 * pseudo-random "shuffle key" each day, so reviews appear in a different order
 * day-to-day but a consistent order within the same day (across re-renders).
 */
function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function buildDailyQueue(args: {
  profile: Profile;
  cards: Record<string, CardState>;
  todaySession: SessionLog;
}): DailyQueue {
  const { profile, cards, todaySession } = args;
  const today = todayISO();

  const seenIds = new Set(Object.keys(cards));
  const newDoneToday = new Set(todaySession.newCompleted);
  const reviewDoneToday = new Set(todaySession.reviewCompleted);

  // ─── New cards: follow NeetCode roadmap topic order ──────────────────────
  // Sort by [topicIndex, problem.order]. Topics not in TOPIC_ORDER fall to the end.
  const remainingNew = Math.max(0, profile.newPerDay - newDoneToday.size);
  const newCards = PROBLEMS
    .filter((p) => !seenIds.has(p.id))
    .sort((a, b) => {
      const ta = topicIndex(a.topic);
      const tb = topicIndex(b.topic);
      if (ta !== tb) return ta - tb;
      return a.order - b.order;
    })
    .slice(0, remainingNew);

  // ─── Reviews: rotate through the backlog ─────────────────────────────────
  // Primary sort: oldest `lastReviewed` first (round-robin — guarantees every
  // due card is seen before any card repeats within a cycle).
  // Tiebreaker (e.g. cards reviewed on the same day, or fresh cards just
  // marked via familiarity): stable per-day hash so the within-tie order is
  // mixed up but consistent through the day.
  const remainingReview = Math.max(
    0,
    profile.reviewPerDay - reviewDoneToday.size
  );
  const reviewCardStates = Object.values(cards)
    .filter(
      (c) => !isNew(c) && isDue(c, today) && !reviewDoneToday.has(c.problemId)
    )
    .sort((a, b) => {
      // Cards never reviewed (only marked via familiarity) get a synthetic
      // "very old" key so they bubble to the top — they're effectively the
      // most overdue.
      const ar = a.lastReviewed ?? '0000-00-00';
      const br = b.lastReviewed ?? '0000-00-00';
      if (ar !== br) return ar.localeCompare(br);
      return hashStr(a.problemId + today) - hashStr(b.problemId + today);
    });

  const reviewCards = reviewCardStates
    .slice(0, remainingReview)
    .map((c) => PROBLEMS.find((p) => p.id === c.problemId))
    .filter((p): p is Problem => Boolean(p));

  return {
    newCards,
    reviewCards,
    newDoneCount: newDoneToday.size,
    reviewDoneCount: reviewDoneToday.size,
    newTarget: profile.newPerDay,
    reviewTarget: profile.reviewPerDay,
  };
}
