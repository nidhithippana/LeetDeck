-- LeetDeck — daily email reminders
-- Adds reminder_hour (local hour 0-23) and timezone (IANA, e.g. "America/New_York").
-- The send-reminders Edge Function runs hourly (UTC) and emails users whose
-- local hour matches their reminder_hour AND who have due cards.
--
-- Run this in the Supabase SQL Editor after migrations 001-003.

alter table public.profiles
  add column if not exists reminder_hour smallint
  check (reminder_hour is null or (reminder_hour >= 0 and reminder_hour <= 23));

alter table public.profiles
  add column if not exists timezone text;

comment on column public.profiles.reminder_hour is
  'Local-time hour (0-23) at which to email the user that cards are waiting. NULL disables reminders.';

comment on column public.profiles.timezone is
  'IANA timezone string captured from the browser (e.g. "America/Los_Angeles"). Used by the send-reminders Edge Function to determine local time.';
