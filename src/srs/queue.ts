import { PROBLEMS } from '../data/problems';
import { topicIndex } from '../data/topics';
import type { CardState, Problem, Profile, SessionLog } from '../types';
import { isDue, isNew, todayISO } from './sm2';

export type DailyQueue = {
  /** Unseen problems queued in NeetCode-roadmap order (topic order, then problem.order). */
  newCards: Problem[];
  /** Due reviews + 2 bonus past-topic cards, **randomized stably for the day**. */
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
  topicFilter?: string | null;
  skippedIds?: string[];
}): DailyQueue {
  const { profile, cards, todaySession, topicFilter, skippedIds = [] } = args;
  const today = todayISO();
  const skipped = new Set(skippedIds);

  const seenIds = new Set(Object.keys(cards));
  const newDoneToday = new Set(todaySession.newCompleted);
  const reviewDoneToday = new Set(todaySession.reviewCompleted);

  // ─── New cards: follow NeetCode roadmap topic order ──────────────────────
  // When topicFilter is set AND that topic still has unseen cards, restrict to it.
  // If the filter points to a completed topic (no unseen left), new cards fall
  // through unfiltered — the bonus reviews section handles the completed topic.
  const filterHasNew = topicFilter
    ? PROBLEMS.some((p) => p.topic === topicFilter && !seenIds.has(p.id) && !skipped.has(p.id))
    : false;

  const remainingNew = Math.max(0, profile.newPerDay - newDoneToday.size);
  const newCards = PROBLEMS
    .filter((p) => !seenIds.has(p.id) && !skipped.has(p.id))
    .filter((p) => !topicFilter || !filterHasNew || p.topic === topicFilter)
    .sort((a, b) => {
      const ta = topicIndex(a.topic);
      const tb = topicIndex(b.topic);
      if (ta !== tb) return ta - tb;
      return a.order - b.order;
    })
    .slice(0, remainingNew);

  // ─── Reviews: rotate through the backlog ─────────────────────────────────
  const remainingReview = Math.max(0, profile.reviewPerDay - reviewDoneToday.size);
  const reviewCardStates = Object.values(cards)
    .filter(
      (c) =>
        !isNew(c) &&
        isDue(c, today) &&
        !reviewDoneToday.has(c.problemId) &&
        !skipped.has(c.problemId)
    )
    .sort((a, b) => {
      const ar = a.lastReviewed ?? '0000-00-00';
      const br = b.lastReviewed ?? '0000-00-00';
      if (ar !== br) return ar.localeCompare(br);
      return hashStr(a.problemId + today) - hashStr(b.problemId + today);
    });

  const reviewCards = reviewCardStates
    .slice(0, remainingReview)
    .map((c) => PROBLEMS.find((p) => p.id === c.problemId))
    .filter((p): p is Problem => Boolean(p));

  // ─── Completed-topic random pick ─────────────────────────────────────────
  // When the user picks a topic they've already finished, grab 1 random card
  // from it (any problem — SRS schedule ignored) and inject it into whichever
  // section fits: reviews if the problem has been seen, new if it hasn't.
  const alreadyShown = new Set([
    ...newDoneToday,
    ...reviewDoneToday,
    ...newCards.map((p) => p.id),
    ...reviewCards.map((p) => p.id),
  ]);

  let topicPickNew: Problem[] = [];
  let topicPickReview: Problem[] = [];

  if (topicFilter && !filterHasNew) {
    const pool = PROBLEMS
      .filter((p) => p.topic === topicFilter && !skipped.has(p.id) && !alreadyShown.has(p.id))
      // Stable daily shuffle so the pick feels fresh each day
      .sort((a, b) => hashStr(a.id + today) - hashStr(b.id + today));

    const picked = pool[0];
    if (picked) {
      if (cards[picked.id]) {
        topicPickReview = [picked];
      } else {
        topicPickNew = [picked];
      }
    }
  }

  // ─── Bonus reviews from past topics (no specific topic selected) ──────────
  // When no completed-topic filter is active, surface 2 soonest-due past cards
  // as light daily reinforcement.
  const touchedTopics = new Set<string>();
  for (const c of Object.values(cards)) {
    if (c.totalReviews > 0) {
      const prob = PROBLEMS.find((p) => p.id === c.problemId);
      if (prob) touchedTopics.add(prob.topic);
    }
  }

  const inQueueOrDone = new Set([
    ...alreadyShown,
    ...topicPickNew.map((p) => p.id),
    ...topicPickReview.map((p) => p.id),
  ]);

  const bonusReviews =
    topicFilter && !filterHasNew
      ? [] // topic pick handles this case
      : PROBLEMS.filter((p) => {
          const c = cards[p.id];
          return (
            touchedTopics.has(p.topic) &&
            c &&
            !isNew(c) &&
            !isDue(c, today) &&
            !inQueueOrDone.has(p.id) &&
            !skipped.has(p.id)
          );
        })
          .sort((a, b) => {
            const da = cards[a.id]?.dueDate ?? '9999-99-99';
            const db = cards[b.id]?.dueDate ?? '9999-99-99';
            return da.localeCompare(db);
          })
          .slice(0, 2);

  return {
    newCards: [...newCards, ...topicPickNew],
    reviewCards: [...reviewCards, ...topicPickReview, ...bonusReviews],
    newDoneCount: newDoneToday.size,
    reviewDoneCount: reviewDoneToday.size,
    newTarget: profile.newPerDay,
    reviewTarget: profile.reviewPerDay,
  };
}
