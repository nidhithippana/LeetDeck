# Email reminders setup

The reminder feature lets users get a daily email at their chosen time when they have cards waiting. It uses **Resend** (email API) + a **Supabase Edge Function** triggered hourly by an **external cron**.

End-to-end setup: ~15 minutes.

---

## 1. Run the migration

In Supabase → **SQL Editor** → paste and run `supabase/migrations/004_reminder.sql`. This adds two columns to `profiles`:

- `reminder_hour smallint` — 0–23, the local hour to send. `NULL` = reminders off.
- `timezone text` — IANA timezone (e.g. `America/Los_Angeles`). Captured from the browser when the user enables reminders.

---

## 2. Sign up for Resend

1. Go to <https://resend.com> → sign up free
2. **API Keys** → **Create API Key** → "Sending access" → copy the key (starts with `re_...`)
3. **Domains** → either:
   - **(easy)** use the default `onboarding@resend.dev` sender — works for testing, free tier 100 emails/day
   - **(production)** add your own domain (`leetdeck.app`) and verify DNS records. Required for sending to anyone besides yourself.

The free tier (3,000 emails/month) is plenty for hundreds of users.

---

## 3. Install Supabase CLI (one-time)

```bash
brew install supabase/tap/supabase
```

(Or [other install methods](https://supabase.com/docs/guides/cli).)

Then link this project:

```bash
cd ~/Downloads/leetdeck
supabase login       # opens browser for token
supabase link --project-ref <your-project-ref>
# project-ref is the prefix of your supabase URL: https://<ref>.supabase.co
```

---

## 4. Set Edge Function secrets

The function needs three secrets. Set them in one command:

```bash
supabase secrets set \
  RESEND_API_KEY=re_yourkeyhere \
  REMINDER_FROM_EMAIL="LeetDeck <onboarding@resend.dev>" \
  APP_URL=https://leetdeck.app
```

Use your own verified-domain email for `REMINDER_FROM_EMAIL` in production. `APP_URL` is whatever URL your app is hosted at (used in the email CTA button).

> `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase — you don't need to set them.

---

## 5. Deploy the Edge Function

```bash
supabase functions deploy send-reminders --no-verify-jwt
```

`--no-verify-jwt` is needed because cron triggers won't have a user JWT.

Test it manually:

```bash
curl -X POST https://<your-project-ref>.supabase.co/functions/v1/send-reminders \
  -H "Authorization: Bearer <your-anon-key>"
```

Expected response when no one is due:
```json
{"ok":true,"sent":0,"message":"No users due for a reminder this hour"}
```

---

## 6. Schedule the function to run hourly

The function must be **invoked every hour** so it can catch each timezone's local hour. Two options:

### Option A: Supabase pg_cron (Pro plan, $25/mo)

In Supabase SQL Editor:

```sql
select cron.schedule(
  'leetdeck-reminders',
  '0 * * * *',  -- top of every hour
  $$
  select net.http_post(
    url := 'https://<your-project-ref>.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Authorization', 'Bearer <your-anon-key>',
      'Content-Type', 'application/json'
    )
  );
  $$
);
```

### Option B: GitHub Actions (free, recommended for free tier)

Create `.github/workflows/reminders.yml` in your repo:

```yaml
name: Trigger LeetDeck reminders
on:
  schedule:
    - cron: '0 * * * *'  # every hour
  workflow_dispatch:       # allow manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST "${{ secrets.SUPABASE_FUNCTION_URL }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json"
```

Add two repo secrets in **Settings → Secrets → Actions**:
- `SUPABASE_FUNCTION_URL` = `https://<your-project-ref>.supabase.co/functions/v1/send-reminders`
- `SUPABASE_ANON_KEY` = your anon key

GitHub Actions cron is "best effort" — usually fires within a couple minutes of the hour. Good enough for daily reminders.

### Option C: cron-job.org (free, easiest)

Sign up at <https://cron-job.org>, create a new cron job that POSTs to your function URL hourly with the Authorization header. Done.

---

## 7. Test end-to-end

1. In LeetDeck → click your avatar → **Settings → Daily email reminder** → toggle on, pick the **next hour** as your reminder time, save.
2. Make sure you have at least one card waiting (do nothing today, or rate something Again).
3. Wait for the next hourly cron trigger (or invoke the function manually with curl).
4. Check your email.

You should get an email titled "🧠 N cards waiting on LeetDeck" with a link back to the app.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Function deploys but returns `sent: 0` even though I expect emails | Check your reminder_hour matches the current hour in your timezone. Run `select id, reminder_hour, timezone from profiles where user_id = ...` to verify what's saved. |
| Emails sent but nothing in inbox | Check spam. If from `onboarding@resend.dev`, deliverability is decent but not perfect. Use your own domain for prod. |
| "RESEND_API_KEY missing" in function logs | Re-run `supabase secrets set` — the secret name is case-sensitive. |
| Function 500s with auth errors | Make sure you deployed with `--no-verify-jwt`. If you used pg_cron, the SQL `net.http_post` call needs the `Authorization` header. |

---

## What gets sent

- **Subject:** `🧠 N cards waiting on LeetDeck`
- **Body:** Brief greeting using `display_name`, count of cards, a CTA button linking to your app
- **From:** whatever you set in `REMINDER_FROM_EMAIL`

To customize: edit `supabase/functions/send-reminders/index.ts` (the `sendEmail` function) and redeploy.
