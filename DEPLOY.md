# Deploy to production

Going from `npm run dev` to a real domain on the internet. Roughly **30–60 min** the first time; subsequent deploys are `git push`.

## Prereqs

- Working `npm run dev` locally (means Supabase + Google OAuth already set up)
- A domain you've bought (or plan to use Vercel's default `*.vercel.app` URL)
- A [Vercel](https://vercel.com) account (free tier is fine)
- The project pushed to a GitHub repo (private is fine — Vercel can deploy from private repos)

---

## 1. Push the project to GitHub

```bash
cd ~/Downloads/leetdeck
git init
git add .
git commit -m "initial commit"
gh repo create leetdeck --private --source=. --remote=origin --push
```

(If you don't have `gh` installed: create a private repo at github.com/new, then `git remote add origin <url> && git push -u origin main`.)

`.gitignore` already excludes `.env` and `node_modules` — your Supabase credentials aren't getting checked in.

---

## 2. Deploy to Vercel

### 2a. Connect the repo

1. Go to <https://vercel.com/new>
2. **Import Git Repository** → pick your `leetdeck` repo
3. Vercel auto-detects Vite. Leave the defaults:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 2b. Add environment variables

Before clicking Deploy, expand **Environment Variables** and add **both** values from your local `.env`:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<your-project>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` (the `anon` `public` key) |

Apply to all environments (Production, Preview, Development).

### 2c. Deploy

Click **Deploy**. Wait ~30 seconds. You'll get a URL like `https://leetdeck-abc123.vercel.app`.

**Don't sign in yet** — Google OAuth will reject the redirect. Go to step 3.

---

## 3. Add the Vercel URL to Supabase + Google OAuth

Production has a different URL than localhost, so both Supabase and Google need to learn about it.

### 3a. Supabase — URL Configuration

1. Supabase → **Authentication** → **URL Configuration**
2. **Site URL** → change to your production URL:
   ```
   https://leetdeck-abc123.vercel.app
   ```
   *(Or your custom domain when you add one — see step 4)*
3. **Redirect URLs** → add the production URL (keep `http://localhost:3000` for dev):
   ```
   http://localhost:3000
   https://leetdeck-abc123.vercel.app
   https://*.vercel.app
   ```
   The wildcard line is optional but useful — it lets Vercel preview deploys (one per PR) also sign in.
4. Click **Save**

### 3b. Google Cloud Console — OAuth client

1. <https://console.cloud.google.com> → confirm your **LeetDeck** project is selected
2. ☰ → **APIs & Services** → **Credentials**
3. Click into your **LeetDeck Web** OAuth client
4. **Authorized JavaScript origins** → add:
   ```
   https://leetdeck-abc123.vercel.app
   ```
5. **Authorized redirect URIs** — the Supabase callback URL is the same as before (it's already there from local setup), so no change needed here
6. Click **Save**

Wait ~10 seconds for Google to propagate.

### 3c. Test it

Open your Vercel URL → click **Continue with Google** → should sign in cleanly.

If you get `redirect_uri_mismatch`, the JS origin in step 3b doesn't exactly match the production URL — check for trailing slashes.

---

## 4. (Optional) Add a custom domain

Doable any time after step 3.

1. Buy a domain (Cloudflare Registrar, Namecheap, etc.)
2. In Vercel: **Project Settings** → **Domains** → **Add** → enter your domain (e.g. `leetdeck.app`)
3. Vercel shows you DNS records to add at your registrar (typically an `A` record + a `CNAME` for `www`)
4. Add the records at the registrar — propagation usually takes 5–30 minutes
5. HTTPS via Let's Encrypt is automatic

### 4a. Update Supabase + Google to use the custom domain

1. Supabase → **Authentication** → **URL Configuration**:
   - **Site URL:** `https://leetdeck.app` *(no trailing slash)*
   - **Redirect URLs:** add `https://leetdeck.app`
2. Google Cloud → **Credentials** → **LeetDeck Web** → **Authorized JavaScript origins:** add `https://leetdeck.app`

Test sign-in at the custom domain.

---

## 5. Subsequent deploys

Every `git push` to `main` triggers Vercel to rebuild and redeploy. Usually under a minute.

```bash
git add .
git commit -m "add new problem: longest substring"
git push
```

Vercel emails you when the deploy is live. Preview URLs are generated per PR if you use them.

---

## 6. Publishing the Google OAuth app

By default your OAuth app is in **Testing mode** — only the test users you added in Google Cloud Console can sign in. Everyone else hits "Access blocked."

To open it up to anyone:

1. Google Cloud Console → **APIs & Services** → **OAuth consent screen**
2. **Publish App** → confirm
3. Since you're not requesting "sensitive scopes" (just `openid profile email`), Google approves this instantly — no manual verification process

After publishing, anyone with a Google account can sign in.

> Wait until your app actually works end-to-end and you're ready for real users. Don't publish on day one.

---

## Production smoke checklist

Run through this list after the first deploy and any time you change auth-related config:

- [ ] Sign-in works in normal browsing
- [ ] Sign-in works in incognito (no cached cookies)
- [ ] Avatar appears in top-right after sign-in
- [ ] Solving a problem and rating it persists across page reload
- [ ] Signing out and back in restores the same progress
- [ ] Streak increments after first daily completion
- [ ] "Today" page title shows `(N due)` when there's a queue
- [ ] Mobile/narrow window shows the "Best on desktop" splash, not a broken layout
- [ ] Page reload doesn't show a flash of unauthed content

If any of those fail, that's a real bug — fix before publishing.

---

## Costs at v1 scale

| Service | Plan | Cost |
|---|---|---|
| Vercel | Hobby | Free (100GB bandwidth, unlimited static deploys) |
| Supabase | Free tier | Free (up to 50K monthly active users, 500MB DB, 5GB bandwidth) |
| Google OAuth | n/a | Free |
| Domain | depends on registrar | $10–15/year (optional) |

You can run LeetDeck for **$0/month** until you cross Supabase free-tier limits. Pro is $25/mo and gets you 100K MAU + 8GB DB.
