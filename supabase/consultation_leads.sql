create table public.consultation_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  company_brand text,
  selected_session_id text not null,
  selected_session_name text not null,
  selected_session_price_cents integer not null,
  selected_session_price_label text not null,
  project_summary text not null,
  audience text not null,
  core_features text not null,
  platform_needed text,
  desired_timeline text not null,
  budget_range text,
  reference_links text,
  additional_notes text,
  status text not null default 'intake_submitted',
  payment_status text not null default 'pending',
  stripe_checkout_session_id text,
  stripe_customer_email text
);

alter table public.consultation_leads enable row level security;

create policy "Allow anonymous inserts on consultation_leads"
on public.consultation_leads
for insert
to anon
with check (true);

-- Admin allowlist for authenticated dashboard access.
create table if not exists public.admin_allowlist (
  email text primary key
);

alter table public.admin_allowlist enable row level security;

create or replace function public.is_approved_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_allowlist
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_approved_admin() from public;
grant execute on function public.is_approved_admin() to authenticated;

insert into public.admin_allowlist (email)
values ('bryantlabs.dev@gmail.com')
on conflict (email) do nothing;

drop policy if exists "Allow anonymous inserts on consultation_leads"
on public.consultation_leads;

create policy "Allow anonymous inserts on consultation_leads"
on public.consultation_leads
for insert
to anon
with check (true);

drop policy if exists "Allow approved admin select on consultation_leads"
on public.consultation_leads;

create policy "Allow approved admin select on consultation_leads"
on public.consultation_leads
for select
to authenticated
using (public.is_approved_admin());

drop policy if exists "Allow approved admin update on consultation_leads"
on public.consultation_leads;

create policy "Allow approved admin update on consultation_leads"
on public.consultation_leads
for update
to authenticated
using (public.is_approved_admin())
with check (public.is_approved_admin());
