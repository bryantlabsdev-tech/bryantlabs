-- Optional one-line note when marking an app_errors row resolved (admin Ops UI).
-- Run in Supabase SQL editor after app_errors base migration.

alter table public.app_errors
add column if not exists resolution_note text;

comment on column public.app_errors.resolution_note is
  'Optional short note from admin when marking resolved; not shown to end users.';
