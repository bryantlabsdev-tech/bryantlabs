-- Bryant Labs first-party analytics
-- Run supabase/admin_identity.sql first, then paste into Supabase SQL editor.
-- For admin test resets, also run supabase/reset_analytics.sql.

create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null,
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  session_id text,
  user_agent text
);

create index if not exists site_events_created_at_idx
on public.site_events (created_at desc);

create index if not exists site_events_event_name_idx
on public.site_events (event_name);

alter table public.site_events enable row level security;

revoke all on table public.site_events from anon;
revoke all on table public.site_events from authenticated;

grant insert on table public.site_events to anon;
grant select on table public.site_events to authenticated;

drop policy if exists "site_events_anon_insert" on public.site_events;
drop policy if exists "site_events_admin_select" on public.site_events;

create policy "site_events_anon_insert"
on public.site_events
for insert
to anon
with check (true);

create policy "site_events_admin_select"
on public.site_events
for select
to authenticated
using (public.is_approved_bryantlabs_admin());
