// LeetDeck — daily email reminder Edge Function
//
// Runs on Supabase Edge Functions (Deno runtime). Trigger this every hour:
//   - via Supabase pg_cron (Pro+ plan), or
//   - via an external scheduler like GitHub Actions / cron-job.org / Vercel Cron
//
// For each user where:
//   * reminder_hour is set
//   * the user's local hour (computed from their `timezone`) === reminder_hour
//   * the user has unfinished cards for today
// → sends an email via Resend.
//
// Environment variables required (set as Edge Function secrets):
//   - RESEND_API_KEY: your Resend API key
//   - REMINDER_FROM_EMAIL: e.g. "LeetDeck <reminders@yourdomain.com>"
//   - APP_URL: e.g. "https://leetdeck.app" — included in the email CTA
//
// See REMINDERS_SETUP.md for full deployment instructions.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type Profile = {
  user_id: string;
  display_name: string | null;
  reminder_hour: number;
  timezone: string | null;
  new_per_day: number;
  review_per_day: number;
};

type Card = {
  user_id: string;
  problem_id: string;
  total_reviews: number;
  due_date: string;
};

type Session = {
  user_id: string;
  session_date: string;
  new_completed: string[];
  review_completed: string[];
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('REMINDER_FROM_EMAIL') ?? 'LeetDeck <onboarding@resend.dev>';
const APP_URL = Deno.env.get('APP_URL') ?? 'https://leetdeck.app';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/** Returns the current hour (0-23) in the given IANA timezone. */
function localHour(tz: string): number {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false,
    });
    const hour = parseInt(fmt.format(new Date()), 10);
    return hour === 24 ? 0 : hour; // Intl quirk: midnight returns 24
  } catch {
    return new Date().getUTCHours();
  }
}

/** Local YYYY-MM-DD date string in the user's timezone. */
function localDate(tz: string): string {
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return fmt.format(new Date()); // en-CA gives YYYY-MM-DD
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function sendEmail(to: string, name: string | null, dueCount: number) {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY missing — skipping send');
    return;
  }
  const subject = `🧠 ${dueCount} card${dueCount === 1 ? '' : 's'} waiting on LeetDeck`;
  const greeting = name ? `Hey ${name.split(' ')[0]},` : 'Hey,';
  const body = `${greeting}

You've got ${dueCount} problem${dueCount === 1 ? '' : 's'} queued up for today. A few minutes is all it takes.

Pick up where you left off → ${APP_URL}

— LeetDeck

(You're getting this because you set a daily reminder. Change the time or turn it off in Settings → Daily email reminder.)`;

  const html = `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #0f172a;">
  <h1 style="font-size: 18px; margin: 0 0 16px;">${greeting}</h1>
  <p style="font-size: 15px; line-height: 1.5; margin: 0 0 16px;">
    You've got <strong>${dueCount} problem${dueCount === 1 ? '' : 's'}</strong> queued up for today. A few minutes is all it takes.
  </p>
  <p style="margin: 24px 0;">
    <a href="${APP_URL}" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600;">Pick up where you left off →</a>
  </p>
  <p style="font-size: 12px; color: #64748b; margin-top: 32px;">
    You're getting this because you set a daily reminder. Change the time or turn it off in <a href="${APP_URL}" style="color: #64748b;">Settings → Daily email reminder</a>.
  </p>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, text: body, html }),
  });
  if (!res.ok) {
    console.error('Resend error:', res.status, await res.text());
  }
}

Deno.serve(async (_req) => {
  // 1. Fetch all profiles with reminders enabled
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('user_id, display_name, reminder_hour, timezone, new_per_day, review_per_day')
    .not('reminder_hour', 'is', null);

  if (pErr) {
    return new Response(JSON.stringify({ error: pErr.message }), { status: 500 });
  }

  const candidates: Profile[] = (profiles ?? []).filter((p: Profile) => {
    const tz = p.timezone ?? 'UTC';
    return localHour(tz) === p.reminder_hour;
  });

  if (candidates.length === 0) {
    return new Response(
      JSON.stringify({ ok: true, sent: 0, message: 'No users due for a reminder this hour' }),
      { status: 200 }
    );
  }

  // 2. For each candidate, check if they have due cards
  let sent = 0;
  let skippedNoWork = 0;
  let skippedNoEmail = 0;

  for (const p of candidates) {
    const tz = p.timezone ?? 'UTC';
    const today = localDate(tz);

    // Cards due today
    const { data: cards } = await supabase
      .from('cards')
      .select('user_id, problem_id, total_reviews, due_date')
      .eq('user_id', p.user_id)
      .lte('due_date', today);

    // Today's session log
    const { data: sessionRows } = await supabase
      .from('sessions')
      .select('user_id, session_date, new_completed, review_completed')
      .eq('user_id', p.user_id)
      .eq('session_date', today)
      .maybeSingle();

    const session: Session | null = (sessionRows as Session | null) ?? null;
    const doneNew = new Set(session?.new_completed ?? []);
    const doneReview = new Set(session?.review_completed ?? []);

    // Due reviews = cards with total_reviews > 0 not yet reviewed today
    const dueReviews = (cards ?? []).filter(
      (c: Card) => c.total_reviews > 0 && !doneReview.has(c.problem_id)
    );

    const remainingReviews = Math.max(0, p.review_per_day - doneReview.size);
    const remainingNew = Math.max(0, p.new_per_day - doneNew.size);

    const queueSize = Math.min(dueReviews.length, remainingReviews) + remainingNew;
    if (queueSize === 0) {
      skippedNoWork++;
      continue;
    }

    // Fetch the user's email from auth.users (service role can do this)
    const { data: userData, error: uErr } = await supabase.auth.admin.getUserById(p.user_id);
    if (uErr || !userData.user?.email) {
      skippedNoEmail++;
      continue;
    }

    await sendEmail(userData.user.email, p.display_name, queueSize);
    sent++;
  }

  return new Response(
    JSON.stringify({ ok: true, candidates: candidates.length, sent, skippedNoWork, skippedNoEmail }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
