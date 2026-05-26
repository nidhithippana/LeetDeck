# LeetDeck

> Anki × NeetCode. A daily LeetCode trainer that uses spaced repetition so the patterns actually stick.

Hosted web app. Users sign in with Google and get a small daily queue (2–3 new problems + due reviews), solve in an in-browser IDE (JavaScript, Python, or TypeScript), rate their recall, and the spaced-repetition engine schedules each problem for the right time.

📐 **Architecture:** [DESIGN.md](DESIGN.md)
🛠️ **First-time setup:** [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
🚀 **Deploy to production:** [DEPLOY.md](DEPLOY.md)

---

## What's in here

| Layer | What it does |
|---|---|
| **Vite + React 19 + TypeScript** | The SPA |
| **Tailwind CSS v4** | Styling |
| **Supabase** | Postgres + auth (Google OAuth), no custom backend |
| **Postgres Row-Level Security** | Authorization at the DB level — users can only ever read/write their own rows |
| **Web Workers** | JS / TS run in a sandboxed worker (3s timeout); Python runs in its own worker via Pyodide |
| **SM-2 spaced repetition** | Anki-style 4-button rating (Again / Hard / Good / Easy) |

---

## Local dev

```bash
git clone <repo> leetdeck && cd leetdeck
npm install
cp .env.example .env       # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev                # http://localhost:3000
```

First-time Supabase + Google OAuth setup is in [SUPABASE_SETUP.md](SUPABASE_SETUP.md) (~15 min). If `.env` isn't filled in, the app shows a friendly "Supabase not configured" page with inline instructions.

---

## Project layout

```
src/
├── App.tsx                  Top-level: config check → mobile splash → AuthGate → AppShell
├── auth/
│   ├── AuthGate.tsx         Renders LandingView if no session
│   └── useSession.ts        Session hook, sign-in/sign-out helpers
├── views/
│   ├── LandingView.tsx      Landing + Continue with Google
│   ├── AppShell.tsx         Router: Today ↔ Problem
│   ├── TodayView.tsx        Daily queue dashboard
│   ├── ProblemView.tsx      Split solver (prompt + IDE + rating)
│   └── MobileSplashView.tsx "Use desktop" for small screens
├── components/
│   ├── CodeEditor.tsx       Styled textarea with tab/indent
│   ├── ProblemPrompt.tsx    Title + difficulty + prompt + examples
│   ├── TestResults.tsx      Pass/fail per case
│   ├── RatingPanel.tsx      Again/Hard/Good/Easy + interval preview
│   ├── SolutionsPanel.tsx   Canonical solutions (post-pass reveal)
│   └── UserMenu.tsx         Avatar + sign-out
├── srs/
│   ├── sm2.ts               Pure SM-2 algorithm + date helpers
│   ├── storage.ts           Supabase reads/writes (profiles, cards, sessions)
│   ├── queue.ts             Daily queue builder
│   └── useSrsState.ts       React hook: data, refresh, rateProblem
├── runner/
│   ├── runTests.ts          Dispatcher by language
│   ├── runJs.ts             JS in a Web Worker
│   ├── runTs.ts             Sucrase strips types → JS worker
│   ├── runPython.ts         Pyodide in its own worker, lazy from CDN
│   └── jsWorkerSource.ts    Shared worker body
├── data/
│   ├── problems.ts          Registry — imports + exports all problems
│   └── problems/            One file per problem (JS + Python + TS)
├── lib/
│   ├── supabase.ts          Supabase client + isSupabaseConfigured flag
│   ├── usePageTitle.ts      Document title per view
│   └── useIsMobile.ts       Viewport breakpoint hook
└── types.ts                 Problem, Language, CardState, etc.

supabase/migrations/         SQL files to run in Supabase SQL Editor:
├── 001_schema.sql           Tables: profiles, cards, sessions
├── 002_rls.sql              Row-Level Security policies
└── 003_triggers.sql         Auto-create profile on first sign-in
```

---

## Adding a new problem

One file per problem under [`src/data/problems/`](src/data/problems/). Copy [`_template.ts`](src/data/problems/_template.ts), fill it in (JS + Python + TS starter and solutions), and add it to the registry in [`src/data/problems.ts`](src/data/problems.ts).

The `Problem` type in [`src/types.ts`](src/types.ts) documents the schema.

---

## Phases (history of how this got built)

1. **Phase 0** — Scaffold (Vite + React + TS + Tailwind)
2. **Phase 1** — Problem bank + static prompt rendering (10 problems)
3. **Phase 2** — IDE + Web Worker test runner (JS only)
4. **Phase 2.5** — Multi-language support (JS + Python + TS)
5. **Phase 3** — Supabase + Google OAuth
6. **Phase 4** — SRS engine (SM-2) + DB-backed storage
7. **Phase 5** — Daily loop wiring (Today view, rating, solutions reveal)
8. **Phase 6** — Polish + deploy prep (day-rollover, page titles, mobile splash, DEPLOY.md)

---

## Status

v1 complete and deployable. See [DESIGN.md §13](DESIGN.md#13-success-criteria-for-v1) for the success criteria.

Out of scope for v1 (intentional): Monaco editor, additional sign-in methods, Java/C++/Go, leaderboards, stats page, paid tier, mobile UI, offline mode. See [DESIGN.md §11](DESIGN.md#11-out-of-scope-for-v1-intentional).
