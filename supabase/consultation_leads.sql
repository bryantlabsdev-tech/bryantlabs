-- Bryant Labs consultation_leads RLS migration
-- Run supabase/admin_identity.sql first, then paste into Supabase SQL editor.

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
using (public.is_approved_bryantlabs_admin());

create policy "consultation_leads_admin_update"
on public.consultation_leads
for update
to authenticated
using (public.is_approved_bryantlabs_admin())
with check (public.is_approved_bryantlabs_admin());

-- Intake health check (production):
-- 1) Role `anon` must have INSERT on public.consultation_leads.
-- 2) Policy `consultation_leads_anon_insert` must exist with WITH CHECK (true).
-- 3) If public intake returns 502 after Turnstile, inspect app_errors for
--    `intakeInsertFailureHint` (RLS vs missing column) and compare table columns
--    to repo migrations under supabase/ (phone, stripe_customer_email, CRM fields).
