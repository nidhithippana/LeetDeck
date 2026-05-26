-- LeetDeck — schema
-- Run this first in the Supabase SQL Editor.

-- One row per user. Created automatically on first sign-in (see 003_triggers.sql).
create table if not exists public.profiles (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  display_name     text,
  avatar_url       text,
  new_per_day      smallint not null default 3,
  review_per_day   smallint not null default 2,
  streak           int not null default 0,
  last_active_date date,
  created_at       timestamptz not null default now()
);

-- One row per (user, problem) — created the first time the user reviews a problem.
create table if not exists public.cards (
  user_id        uuid not null references auth.users(id) on delete cascade,
  problem_id     text not null,
  repetitions    int not null default 0,
  ease_factor    numeric(4,2) not null default 2.50,
  interval_days  int not null default 0,
  due_date       date not null default current_date,
  last_reviewed  date,
  total_reviews  int not null default 0,
  lapses         int not null default 0,
  updated_at     timestamptz not null default now(),
  primary key (user_id, problem_id)
);

create index if not exists cards_user_due_idx on public.cards (user_id, due_date);

-- One row per (user, date) — tracks what was completed each day.
create table if not exists public.sessions (
  user_id          uuid not null references auth.users(id) on delete cascade,
  session_date     date not null,
  new_completed    text[] not null default '{}',
  review_completed text[] not null default '{}',
  primary key (user_id, session_date)
);
