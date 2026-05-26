# Supabase setup — step-by-step

Phase 3 needs you to provision an external Supabase project and Google OAuth credentials before the auth flow can be tested end-to-end. Total time: ~15 minutes.

Until you finish this, the dev server will show a friendly "Supabase not configured" page instead of the app.

---

## 1. Create a Supabase project

1. Go to <https://supabase.com> and sign up (free).
2. Click **New project**.
3. Pick an organization, a project name (e.g. `leetdeck-dev`), and a strong DB password (save it — Supabase won't show it again).
4. Pick a region close to you.
5. Free tier is fine. Wait ~2 min for provisioning.

---

## 2. Run the SQL migrations

In your Supabase project: **SQL Editor → New query** (left sidebar).

Run each file from `supabase/migrations/` **in order**, one query at a time:

1. Paste the contents of `001_schema.sql`, click **Run**. You should see "Success. No rows returned."
2. Paste `002_rls.sql`, click **Run**.
3. Paste `003_triggers.sql`, click **Run**.

Verify in **Database → Tables** that you now see `profiles`, `cards`, and `sessions`.

---

## 3. Set up Google OAuth

You need credentials from Google Cloud Console.

### 3a. Create OAuth credentials in Google Cloud

1. Go to <https://console.cloud.google.com> and create a new project (or pick an existing one).
2. **APIs & Services → OAuth consent screen**:
   - User type: **External**.
   - App name: `LeetDeck`.
   - User support email: your email.
   - Developer contact email: your email.
   - Save and continue through Scopes (no extra scopes needed) and Test users (add your own Google account so you can sign in during development).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Name: `LeetDeck Web`.
   - **Authorized JavaScript origins** — add:
     - `http://localhost:3000`
   - **Authorized redirect URIs** — add the Supabase callback URL:
     - Get it from Supabase: **Authentication → Providers → Google** → there's a "Callback URL (for OAuth)" shown there. It looks like `https://<your-project-ref>.supabase.co/auth/v1/callback`.
   - Click **Create**.
4. Copy the **Client ID** and **Client Secret** that appear.

### 3b. Plug them into Supabase

1. In Supabase: **Authentication → Providers → Google**.
2. Toggle **Enable Google provider** on.
3. Paste the **Client ID** and **Client Secret**.
4. Click **Save**.

### 3c. Configure auth URLs

In Supabase: **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000`

(You'll add your production domain here later when you deploy.)

---

## 4. Wire up your local `.env`

In your Supabase project: **Project Settings → API**.

Copy these values into a new `.env` file at the project root (copy from `.env.example`):

```bash
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...    # the "anon public" key
```

⚠️ The `anon` key is the one you want — **not** the `service_role` key. The anon key is meant to be public; RLS is what protects user data.

---

## 5. Restart dev server

```bash
npm run dev
```

Visit <http://localhost:3000>.

You should see the **LeetDeck landing page** with a "Continue with Google" button. Click it → Google sign-in → you're redirected back into the app with your avatar in the top-right.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Still seeing "Supabase not configured" after editing `.env` | Restart the dev server. Vite only reads `.env` at startup. |
| Google redirect lands on a blank Supabase error page | The redirect URI in Google Cloud Console doesn't exactly match the one Supabase shows. Check for trailing slashes. |
| Sign-in works but the app loads forever | Probably an RLS issue. Open the browser console and look for a 401/403 error from Supabase. Re-run `002_rls.sql`. |
| `relation "profiles" does not exist` in console | You skipped step 2. Run the migrations. |
| Sign-in succeeds but no row appears in `profiles` | The trigger from `003_triggers.sql` didn't run. Re-run that migration. |
| Google says "This app isn't verified" | Normal for dev. Click "Advanced → Go to LeetDeck (unsafe)". For production, you'd submit for Google's app verification. |

---

When sign-in works locally, you're done with Phase 3 setup. Phase 4 builds the SRS engine on top of the now-functioning database.
