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
