-- Bryant Labs consultation_leads RLS migration
-- Paste into Supabase SQL editor on an existing project.

alter table public.consultation_leads enable row level security;

revoke all on table public.consultation_leads from anon;
revoke all on table public.consultation_leads from authenticated;

grant insert on table public.consultation_leads to anon;
grant select, update on table public.consultation_leads to authenticated;

drop policy if exists "Allow anonymous inserts on consultation_leads"
on public.consultation_leads;

drop policy if exists "Allow approved admin select on consultation_leads"
on public.consultation_leads;

drop policy if exists "Allow approved admin update on consultation_leads"
on public.consultation_leads;

drop policy if exists "consultation_leads_anon_insert"
on public.consultation_leads;

drop policy if exists "consultation_leads_admin_select"
on public.consultation_leads;

drop policy if exists "consultation_leads_admin_update"
on public.consultation_leads;

drop function if exists public.is_approved_admin();
drop table if exists public.admin_allowlist;

create policy "consultation_leads_anon_insert"
on public.consultation_leads
for insert
to anon
with check (true);

create policy "consultation_leads_admin_select"
on public.consultation_leads
for select
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('projects@bryantlabs.dev')
);

create policy "consultation_leads_admin_update"
on public.consultation_leads
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('projects@bryantlabs.dev')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('projects@bryantlabs.dev')
);
