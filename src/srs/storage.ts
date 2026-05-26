import { supabase } from '../lib/supabase';
import type { CardState, Profile, SessionLog } from '../types';
import { todayISO } from './sm2';

// ─── Row ↔ TS mapping ─────────────────────────────────────────────────────
// Tables are snake_case; the TS layer uses camelCase. Map at the boundary.

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  new_per_day: number;
  review_per_day: number;
  streak: number;
  last_active_date: string | null;
  reminder_hour: number | null;
  timezone: string | null;
};

type CardRow = {
  user_id: string;
  problem_id: string;
  repetitions: number;
  ease_factor: number;
  interval_days: number;
  due_date: string;
  last_reviewed: string | null;
  total_reviews: number;
  lapses: number;
};

type SessionRow = {
  user_id: string;
  session_date: string;
  new_completed: string[];
  review_completed: string[];
};

function rowToProfile(r: ProfileRow): Profile {
  return {
    userId: r.user_id,
    displayName: r.display_name,
    avatarUrl: r.avatar_url,
    newPerDay: r.new_per_day,
    reviewPerDay: r.review_per_day,
    streak: r.streak,
    lastActiveDate: r.last_active_date,
    reminderHour: r.reminder_hour,
    timezone: r.timezone,
  };
}

function rowToCard(r: CardRow): CardState {
  return {
    problemId: r.problem_id,
    repetitions: r.repetitions,
    easeFactor: Number(r.ease_factor),
    intervalDays: r.interval_days,
    dueDate: r.due_date,
    lastReviewed: r.last_reviewed,
    totalReviews: r.total_reviews,
    lapses: r.lapses,
  };
}

function rowToSession(r: SessionRow): SessionLog {
  return {
    sessionDate: r.session_date,
    newCompleted: r.new_completed ?? [],
    reviewCompleted: r.review_completed ?? [],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────

async function requireUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  return user.id;
}

// ─── Profile ──────────────────────────────────────────────────────────────

export async function loadProfile(): Promise<Profile> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  // Defensive self-heal: the trigger should have created this on sign-up.
  // If it somehow didn't, create it now from session metadata.
  if (!data) return createProfileFallback(userId);

  return rowToProfile(data as ProfileRow);
}

async function createProfileFallback(userId: string): Promise<Profile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const meta = user?.user_metadata ?? {};
  const row: Partial<ProfileRow> = {
    user_id: userId,
    display_name:
      (meta.full_name as string) || (meta.name as string) || user?.email || null,
    avatar_url: (meta.avatar_url as string) || null,
  };
  const { data, error } = await supabase
    .from('profiles')
    .insert(row)
    .select('*')
    .single();
  if (error) throw error;
  return rowToProfile(data as ProfileRow);
}

export async function updateProfile(
  updates: Partial<
    Pick<
      Profile,
      | 'newPerDay'
      | 'reviewPerDay'
      | 'streak'
      | 'lastActiveDate'
      | 'reminderHour'
      | 'timezone'
    >
  >
): Promise<void> {
  const userId = await requireUserId();
  const row: Partial<ProfileRow> = {};
  if (updates.newPerDay !== undefined) row.new_per_day = updates.newPerDay;
  if (updates.reviewPerDay !== undefined) row.review_per_day = updates.reviewPerDay;
  if (updates.streak !== undefined) row.streak = updates.streak;
  if (updates.lastActiveDate !== undefined) row.last_active_date = updates.lastActiveDate;
  if (updates.reminderHour !== undefined) row.reminder_hour = updates.reminderHour;
  if (updates.timezone !== undefined) row.timezone = updates.timezone;
  const { error } = await supabase.from('profiles').update(row).eq('user_id', userId);
  if (error) throw error;
}

// ─── Cards ────────────────────────────────────────────────────────────────

export async function loadAllCards(): Promise<Record<string, CardState>> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  const out: Record<string, CardState> = {};
  for (const row of (data as CardRow[]) ?? []) {
    out[row.problem_id] = rowToCard(row);
  }
  return out;
}

export async function upsertCard(card: CardState): Promise<void> {
  const userId = await requireUserId();
  const row: CardRow & { updated_at: string } = {
    user_id: userId,
    problem_id: card.problemId,
    repetitions: card.repetitions,
    ease_factor: card.easeFactor,
    interval_days: card.intervalDays,
    due_date: card.dueDate,
    last_reviewed: card.lastReviewed,
    total_reviews: card.totalReviews,
    lapses: card.lapses,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from('cards')
    .upsert(row, { onConflict: 'user_id,problem_id' });
  if (error) throw error;
}

// ─── Sessions ─────────────────────────────────────────────────────────────

export async function loadTodaySession(): Promise<SessionLog> {
  const userId = await requireUserId();
  const today = todayISO();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('session_date', today)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    return { sessionDate: today, newCompleted: [], reviewCompleted: [] };
  }
  return rowToSession(data as SessionRow);
}

/**
 * Record that the user completed `problemId` today, as either a 'new' or 'review'.
 * Idempotent: re-completing the same problem on the same day is a no-op.
 *
 * Read-modify-write — fine for a single user with a single active tab.
 * (Replace with an RPC if we ever need atomic concurrent updates.)
 */
export async function recordCompletion(
  problemId: string,
  kind: 'new' | 'review'
): Promise<SessionLog> {
  const userId = await requireUserId();
  const today = todayISO();

  const current = await loadTodaySession();
  const already =
    kind === 'new'
      ? current.newCompleted.includes(problemId)
      : current.reviewCompleted.includes(problemId);
  if (already) return current;

  const updated: SessionLog = {
    sessionDate: today,
    newCompleted:
      kind === 'new' ? [...current.newCompleted, problemId] : current.newCompleted,
    reviewCompleted:
      kind === 'review'
        ? [...current.reviewCompleted, problemId]
        : current.reviewCompleted,
  };

  const row: SessionRow = {
    user_id: userId,
    session_date: today,
    new_completed: updated.newCompleted,
    review_completed: updated.reviewCompleted,
  };
  const { error } = await supabase
    .from('sessions')
    .upsert(row, { onConflict: 'user_id,session_date' });
  if (error) throw error;
  return updated;
}
