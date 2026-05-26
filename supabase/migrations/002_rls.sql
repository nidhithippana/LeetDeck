-- LeetDeck — Row-Level Security
-- Run this AFTER 001_schema.sql.
--
-- Each user can only read/write their own rows. Enforced at the DB level,
-- so even if the browser bypasses the UI, the database rejects the query.

alter table public.profiles enable row level security;
alter table public.cards    enable row level security;
alter table public.sessions enable row level security;

-- Profiles
drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own" on public.profiles
  for select using (user_id = auth.uid());

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert with check (user_id = auth.uid());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Cards
drop policy if exists "cards: select own" on public.cards;
create policy "cards: select own" on public.cards
  for select using (user_id = auth.uid());

drop policy if exists "cards: insert own" on public.cards;
create policy "cards: insert own" on public.cards
  for insert with check (user_id = auth.uid());

drop policy if exists "cards: update own" on public.cards;
create policy "cards: update own" on public.cards
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "cards: delete own" on public.cards;
create policy "cards: delete own" on public.cards
  for delete using (user_id = auth.uid());

-- Sessions
drop policy if exists "sessions: select own" on public.sessions;
create policy "sessions: select own" on public.sessions
  for select using (user_id = auth.uid());

drop policy if exists "sessions: insert own" on public.sessions;
create policy "sessions: insert own" on public.sessions
  for insert with check (user_id = auth.uid());

drop policy if exists "sessions: update own" on public.sessions;
create policy "sessions: update own" on public.sessions
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
