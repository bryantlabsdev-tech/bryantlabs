-- Bryant Labs optional phone on consultation_leads
-- Paste into Supabase SQL editor on an existing project.

alter table public.consultation_leads
add column if not exists phone text;

comment on column public.consultation_leads.phone is
  'Optional US-format phone from project intake; null if not provided.';
