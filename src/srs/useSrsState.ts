import { useCallback, useEffect, useRef, useState } from 'react';
import type { CardState, Profile, Rating, SessionLog } from '../types';
import { applyRating, bumpStreak, newCard, todayISO } from './sm2';
import {
  loadAllCards,
  loadProfile,
  loadTodaySession,
  recordCompletion,
  updateProfile,
  upsertCard,
} from './storage';

export type SrsData = {
  profile: Profile;
  cards: Record<string, CardState>;
  todaySession: SessionLog;
};

export type SrsState = {
  data: SrsData | undefined;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  /**
   * Apply a rating and record the completion. Persists to Supabase with an
   * optimistic local update so the UI feels instant. Also bumps the streak
   * the first time the user completes anything on a new day.
   */
  rateProblem: (
    problemId: string,
    rating: Rating,
    kind: 'new' | 'review'
  ) => Promise<void>;
  /**
   * Mark a problem's familiarity without going through the daily queue. Used by
   * the browse-mode "Mark as already known" flow — for users joining mid-prep
   * who've already mastered some problems and want them scheduled appropriately.
   *
   * Updates the card's SRS state. Does NOT record completion in today's session
   * and does NOT bump the streak (this isn't part of the daily practice).
   */
  markCard: (problemId: string, rating: Rating) => Promise<void>;
};

export function useSrsState(): SrsState {
  const [data, setData] = useState<SrsData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [profile, cards, todaySession] = await Promise.all([
        loadProfile(),
        loadAllCards(),
        loadTodaySession(),
      ]);
      setData({ profile, cards, todaySession });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Day-rollover detection: refresh whenever the local date changes
  // (checked on tab focus and once a minute). Without this, a tab opened
  // late at night still shows yesterday's queue past midnight.
  const lastSeenDateRef = useRef<string>(todayISO());
  useEffect(() => {
    const check = () => {
      const today = todayISO();
      if (today !== lastSeenDateRef.current) {
        lastSeenDateRef.current = today;
        void refresh();
      }
    };
    const interval = window.setInterval(check, 60_000);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [refresh]);

  const rateProblem = useCallback<SrsState['rateProblem']>(
    async (problemId, rating, kind) => {
      if (!data) return;
      const today = todayISO();

      const previousCard = data.cards[problemId] ?? newCard(problemId);
      const updatedCard = applyRating(previousCard, rating, today);

      const alreadyDone =
        kind === 'new'
          ? data.todaySession.newCompleted.includes(problemId)
          : data.todaySession.reviewCompleted.includes(problemId);

      const updatedSession: SessionLog = alreadyDone
        ? data.todaySession
        : {
            ...data.todaySession,
            newCompleted:
              kind === 'new'
                ? [...data.todaySession.newCompleted, problemId]
                : data.todaySession.newCompleted,
            reviewCompleted:
              kind === 'review'
                ? [...data.todaySession.reviewCompleted, problemId]
                : data.todaySession.reviewCompleted,
          };

      const streakNext = bumpStreak(
        { streak: data.profile.streak, lastActiveDate: data.profile.lastActiveDate },
        today
      );
      const updatedProfile: Profile = {
        ...data.profile,
        streak: streakNext.streak,
        lastActiveDate: streakNext.lastActiveDate,
      };

      // Optimistic UI update.
      setData({
        profile: updatedProfile,
        cards: { ...data.cards, [problemId]: updatedCard },
        todaySession: updatedSession,
      });

      // Persist. If any step fails we re-fetch so the UI doesn't drift.
      try {
        await upsertCard(updatedCard);
        if (!alreadyDone) await recordCompletion(problemId, kind);
        const streakChanged =
          updatedProfile.streak !== data.profile.streak ||
          updatedProfile.lastActiveDate !== data.profile.lastActiveDate;
        if (streakChanged) {
          await updateProfile({
            streak: updatedProfile.streak,
            lastActiveDate: updatedProfile.lastActiveDate,
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        await refresh();
      }
    },
    [data, refresh]
  );

  const markCard = useCallback<SrsState['markCard']>(
    async (problemId, rating) => {
      if (!data) return;
      const today = todayISO();

      const previousCard = data.cards[problemId] ?? newCard(problemId);
      const updatedCard = applyRating(previousCard, rating, today);

      // Optimistic update — cards only, no session/profile changes.
      setData({
        ...data,
        cards: { ...data.cards, [problemId]: updatedCard },
      });

      try {
        await upsertCard(updatedCard);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        await refresh();
      }
    },
    [data, refresh]
  );

  return {
    data,
    loading: data === undefined && error === null,
    error,
    refresh,
    rateProblem,
    markCard,
  };
}
