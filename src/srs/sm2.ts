import type { CardState, Rating } from '../types';

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

// ─── Date helpers (ISO YYYY-MM-DD, midnight-aligned) ──────────────────────

export function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function addDaysISO(baseISO: string, days: number): string {
  const d = new Date(baseISO + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + 'T00:00:00').getTime();
  const b = new Date(toISO + 'T00:00:00').getTime();
  return Math.round((b - a) / 86_400_000);
}

// ─── Card lifecycle ───────────────────────────────────────────────────────

export function newCard(problemId: string): CardState {
  return {
    problemId,
    repetitions: 0,
    easeFactor: DEFAULT_EASE,
    intervalDays: 0,
    dueDate: todayISO(),
    lastReviewed: null,
    totalReviews: 0,
    lapses: 0,
  };
}

export function isNew(card: CardState): boolean {
  return card.totalReviews === 0;
}

export function isDue(card: CardState, today = todayISO()): boolean {
  return card.dueDate <= today;
}

// ─── The SM-2 step ────────────────────────────────────────────────────────
//
// Anki-style 4-button rating. Returns a new card with updated schedule.
//
// First review (repetitions == 0):
//   again → due tomorrow, ease -0.2
//   hard  → 1 day
//   good  → 1 day
//   easy  → 4 days, ease +0.15
//
// Second review (repetitions == 1):
//   again → reset, due tomorrow
//   hard  → 3 days,  ease -0.15
//   good  → 6 days
//   easy  → 7 days,  ease +0.15
//
// Third review (repetitions == 2):
//   again → reset to 1 day, ease -0.20, lapse++
//   hard  → 5 days,  ease -0.15   ← completes the 1→3→5 hard ladder
//   good  → interval × ease
//   easy  → interval × ease × 1.3, ease +0.15
//
// Subsequent reviews (repetitions >= 3):
//   again → reset to 1 day, ease -0.20, lapse++
//   hard  → interval × 1.2,        ease -0.15
//   good  → interval × ease
//   easy  → interval × ease × 1.3, ease +0.15

export function applyRating(
  card: CardState,
  rating: Rating,
  today = todayISO()
): CardState {
  const next: CardState = {
    ...card,
    lastReviewed: today,
    totalReviews: card.totalReviews + 1,
  };

  if (rating === 'again') {
    next.repetitions = 0;
    next.intervalDays = 1;
    next.easeFactor = clampEase(card.easeFactor - 0.2);
    next.lapses = card.lapses + 1;
    next.dueDate = addDaysISO(today, 1);
    return next;
  }

  let interval: number;
  if (card.repetitions === 0) {
    interval = rating === 'easy' ? 4 : 1;
  } else if (card.repetitions === 1) {
    if (rating === 'hard') interval = 3;
    else if (rating === 'easy') interval = 7;
    else interval = 6;
  } else if (card.repetitions === 2) {
    const base = Math.max(1, card.intervalDays);
    if (rating === 'hard') interval = 5;
    else if (rating === 'easy') interval = Math.round(base * card.easeFactor * 1.3);
    else interval = Math.round(base * card.easeFactor);
  } else {
    const base = Math.max(1, card.intervalDays);
    if (rating === 'hard') interval = Math.round(base * 1.2);
    else if (rating === 'easy') interval = Math.round(base * card.easeFactor * 1.3);
    else interval = Math.round(base * card.easeFactor);
  }

  let ease = card.easeFactor;
  if (rating === 'hard') ease = clampEase(ease - 0.15);
  else if (rating === 'easy') ease = clampEase(ease + 0.15);
  // 'good' keeps ease

  next.repetitions = card.repetitions + 1;
  next.intervalDays = interval;
  next.easeFactor = round2(ease);
  next.dueDate = addDaysISO(today, interval);
  return next;
}

function clampEase(e: number): number {
  return Math.max(MIN_EASE, e);
}
function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

/**
 * Pretty interval label for the rating buttons ("1d", "6d", "2mo", "1y").
 */
export function formatInterval(days: number): string {
  if (days < 1) return '<1d';
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}

/**
 * Streak update on activity. Call when the user completes ≥1 problem in a day.
 *  - same day as lastActiveDate → no change
 *  - exactly one day after      → streak + 1
 *  - any other gap              → streak resets to 1
 */
export function bumpStreak(
  current: { streak: number; lastActiveDate: string | null },
  today = todayISO()
): { streak: number; lastActiveDate: string } {
  if (current.lastActiveDate === today) {
    return { streak: current.streak, lastActiveDate: today };
  }
  if (current.lastActiveDate && daysBetween(current.lastActiveDate, today) === 1) {
    return { streak: current.streak + 1, lastActiveDate: today };
  }
  return { streak: 1, lastActiveDate: today };
}
