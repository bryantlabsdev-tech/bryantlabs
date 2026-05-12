-- Bryant Labs CRM fields for consultation_leads
-- Paste into Supabase SQL editor on an existing project.

alter table public.consultation_leads
add column if not exists admin_notes text;

alter table public.consultation_leads
alter column status set default 'new';

update public.consultation_leads
set status = 'new'
where status in ('intake_submitted', 'discovery_pending');
