-- Bryant Labs intro link tracking for consultation_leads
-- Paste into Supabase SQL editor on an existing project.

alter table public.consultation_leads
add column if not exists intro_link_sent_at timestamptz;
