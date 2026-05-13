-- Bryant Labs CRM follow-up + touch tracking
-- Run after admin_identity.sql and consultation_leads base migrations.

alter table public.consultation_leads
add column if not exists last_contacted_at timestamptz;

alter table public.consultation_leads
add column if not exists next_follow_up_at timestamptz;

alter table public.consultation_leads
add column if not exists follow_up_note text;

alter table public.consultation_leads
add column if not exists updated_at timestamptz not null default now();

comment on column public.consultation_leads.last_contacted_at is
  'Updated when intro email sends, status changes, or admin notes save.';
comment on column public.consultation_leads.next_follow_up_at is
  'Optional manual follow-up reminder date.';
comment on column public.consultation_leads.follow_up_note is
  'Short optional note paired with next follow-up date.';
comment on column public.consultation_leads.updated_at is
  'Last row update; set by application on writes.';
