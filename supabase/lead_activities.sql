-- Bryant Labs lightweight lead activity log (append-only)
-- Run after consultation_leads exists and admin_identity.sql.

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.consultation_leads(id) on delete cascade,
  event_type text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists lead_activities_lead_created_idx
on public.lead_activities (lead_id, created_at desc);

alter table public.lead_activities enable row level security;

revoke all on table public.lead_activities from anon;
revoke all on table public.lead_activities from authenticated;

grant select, insert on table public.lead_activities to authenticated;

drop policy if exists "lead_activities_admin_select" on public.lead_activities;
drop policy if exists "lead_activities_admin_insert" on public.lead_activities;

create policy "lead_activities_admin_select"
on public.lead_activities
for select
to authenticated
using (public.is_approved_bryantlabs_admin());

create policy "lead_activities_admin_insert"
on public.lead_activities
for insert
to authenticated
with check (public.is_approved_bryantlabs_admin());
