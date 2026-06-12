import { useCallback, useMemo, useState } from 'react';
import type { CardState, Rating } from '../types';
import { applyRating, isDue, newCard, todayISO } from './sm2';
import { SD_CARDS, SD_TOPICS } from '../data/systemDesign';

const CARDS_KEY = 'leetdeck.sd.cards';
const SESSION_KEY = 'leetdeck.sd.session';
const DAILY_NEW_KEY = 'leetdeck.sd.dailyNew';
const DEFAULT_DAILY_NEW = 10;

function loadDailyNewPref(): number {
  if (typeof window === 'undefined') return DEFAULT_DAILY_NEW;
  const raw = window.localStorage.getItem(DAILY_NEW_KEY);
  if (raw === null) return DEFAULT_DAILY_NEW;
  const n = parseInt(raw, 10);
  return isNaN(n) ? DEFAULT_DAILY_NEW : Math.max(0, Math.min(30, n));
}

export function saveDailyNewPref(n: number) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DAILY_NEW_KEY, String(Math.max(0, Math.min(30, n))));
}

type Session = {
  date: string;
  reviewed: string[];
  newSeen: string[];
};

function loadCards(): Record<string, CardState> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(CARDS_KEY) ?? '{}') as Record<string, CardState>;
  } catch {
    return {};
  }
}

function saveCards(cards: Record<string, CardState>) {
  window.localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

function loadSession(): Session {
  if (typeof window === 'undefined') return { date: todayISO(), reviewed: [], newSeen: [] };
  try {
    const raw = JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? '{}') as Partial<Session>;
    if (raw.date === todayISO()) {
      return { date: raw.date, reviewed: raw.reviewed ?? [], newSeen: raw.newSeen ?? [] };
    }
  } catch {
    // fall through
  }
  return { date: todayISO(), reviewed: [], newSeen: [] };
}

function saveSession(session: Session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export type SDTopicStat = {
  topic: string;
  total: number;
  due: number;
  touched: number;
};

export type SdSrsState = {
  cards: Record<string, CardState>;
  todayReviewed: string[];
  newSeenToday: string[];
  dueCards: string[];
  dueByTopic: Record<string, number>;
  topicStats: SDTopicStat[];
  dailyNewLimit: number;
  matureCount: number;
  currentNewTopic: string | null;
  rateCard: (cardId: string, rating: Rating) => void;
  setDailyNewLimit: (n: number) => void;
};

export function useSdSrs(): SdSrsState {
  const [cards, setCards] = useState<Record<string, CardState>>(() => loadCards());
  const [session, setSession] = useState<Session>(() => loadSession());
  const [dailyNewLimit, setDailyNewLimitState] = useState<number>(() => loadDailyNewPref());

  const today = todayISO();

  const matureCount = useMemo(
    () => Object.values(cards).filter((c) => c.intervalDays >= 21).length,
    [cards]
  );

  const setDailyNewLimit = useCallback((n: number) => {
    const clamped = Math.max(0, Math.min(30, n));
    saveDailyNewPref(clamped);
    setDailyNewLimitState(clamped);
  }, []);

  // Unseen cards in topic order (SD_TOPICS defines the learning sequence)
  const allNewCardsOrdered = useMemo(() => {
    const result: string[] = [];
    for (const topic of SD_TOPICS) {
      for (const c of SD_CARDS.filter((c) => c.topic === topic && !cards[c.id])) {
        result.push(c.id);
      }
    }
    return result;
  }, [cards]);

  const budgetRemaining = useMemo(
    () => Math.max(0, dailyNewLimit - session.newSeen.length),
    [dailyNewLimit, session.newSeen.length]
  );

  const dueCards = useMemo(() => {
    // Due reviews: previously seen, SRS says it's time
    const reviewsDue = SD_CARDS.map((c) => c.id).filter((id) => {
      if (session.reviewed.includes(id)) return false;
      const card = cards[id];
      return card && isDue(card, today);
    });

    // New cards: never seen, ordered by topic, up to today's budget
    const newCards = allNewCardsOrdered
      .filter((id) => !session.reviewed.includes(id) && !session.newSeen.includes(id))
      .slice(0, budgetRemaining);

    return [...reviewsDue, ...newCards];
  }, [cards, session.reviewed, session.newSeen, today, allNewCardsOrdered, budgetRemaining]);

  // The topic of the next unseen card (shown in the dashboard as "learning next")
  const currentNewTopic = useMemo(() => {
    const firstNew = allNewCardsOrdered.find(
      (id) => !session.reviewed.includes(id) && !session.newSeen.includes(id)
    );
    if (!firstNew) return null;
    return SD_CARDS.find((c) => c.id === firstNew)?.topic ?? null;
  }, [allNewCardsOrdered, session]);

  const dueByTopic = useMemo(() => {
    const out: Record<string, number> = {};
    for (const sdCard of SD_CARDS) {
      if (dueCards.includes(sdCard.id)) {
        out[sdCard.topic] = (out[sdCard.topic] ?? 0) + 1;
      }
    }
    return out;
  }, [dueCards]);

  const topicStats = useMemo<SDTopicStat[]>(
    () =>
      SD_TOPICS.map((topic) => {
        const topicCards = SD_CARDS.filter((c) => c.topic === topic);
        const due = topicCards.filter((c) => dueCards.includes(c.id)).length;
        const touched = topicCards.filter((c) => {
          const card = cards[c.id];
          return card && card.totalReviews > 0;
        }).length;
        return { topic, total: topicCards.length, due, touched };
      }),
    [dueCards, cards]
  );

  const rateCard = useCallback(
    (cardId: string, rating: Rating) => {
      const t = todayISO();
      const isNew = !cards[cardId];
      const existing = cards[cardId] ?? newCard(cardId);
      const updated = applyRating(existing, rating, t);

      setCards((prev) => {
        const next = { ...prev, [cardId]: updated };
        saveCards(next);
        return next;
      });

      setSession((prev) => {
        const reviewed = prev.reviewed.includes(cardId)
          ? prev.reviewed
          : [...prev.reviewed, cardId];
        const newSeen =
          isNew && !prev.newSeen.includes(cardId)
            ? [...prev.newSeen, cardId]
            : prev.newSeen;
        const next: Session = { date: t, reviewed, newSeen };
        saveSession(next);
        return next;
      });
    },
    [cards]
  );

  return {
    cards,
    todayReviewed: session.reviewed,
    newSeenToday: session.newSeen,
    dueCards,
    dueByTopic,
    topicStats,
    dailyNewLimit,
    matureCount,
    currentNewTopic,
    rateCard,
    setDailyNewLimit,
  };
}
