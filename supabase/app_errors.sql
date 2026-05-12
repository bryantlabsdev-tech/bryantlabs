-- Bryant Labs operational error logging
-- Run supabase/admin_identity.sql first, then paste into Supabase SQL editor.

create table if not exists public.app_errors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,
  severity text not null default 'error',
  message text not null,
  details jsonb not null default '{}'::jsonb,
  resolved boolean not null default false,
  resolved_at timestamptz null
);

create index if not exists app_errors_created_at_idx
on public.app_errors (created_at desc);

create index if not exists app_errors_resolved_idx
on public.app_errors (resolved, created_at desc);

create index if not exists app_errors_source_idx
on public.app_errors (source);

alter table public.app_errors enable row level security;

revoke all on table public.app_errors from anon;
revoke all on table public.app_errors from authenticated;

grant insert on table public.app_errors to anon;
grant select, update on table public.app_errors to authenticated;

drop policy if exists "app_errors_anon_insert" on public.app_errors;
drop policy if exists "app_errors_admin_select" on public.app_errors;
drop policy if exists "app_errors_admin_update" on public.app_errors;

create policy "app_errors_anon_insert"
on public.app_errors
for insert
to anon
with check (true);

create policy "app_errors_admin_select"
on public.app_errors
for select
to authenticated
using (public.is_approved_bryantlabs_admin());

create policy "app_errors_admin_update"
on public.app_errors
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('projects@bryantlabs.dev')
)
with check (public.is_approved_bryantlabs_admin());
