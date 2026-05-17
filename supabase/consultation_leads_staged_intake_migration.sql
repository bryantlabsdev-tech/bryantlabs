-- Bryant Labs staged intake (Stage 1 "quick" brief) — consultation_leads columns
--
-- Prerequisites:
--   - public.consultation_leads already exists (base table from your project).
--   - Prior migrations applied as needed: consultation_leads.sql (RLS),
--     consultation_leads_phone_migration.sql, consultation_leads_crm_migration.sql, etc.
--
-- Behavior:
--   - ADD ONLY: new nullable columns; no drops; existing rows unchanged except optional backfill.
--   - Safe for legacy / full-brief rows (NULL intake_stage = unknown / pre-migration).
--   - RLS unchanged: anon INSERT still works when the app sends these keys (PostgREST ignores unknown keys if... actually unknown keys ERROR; so deploy API mapping AFTER or WITH this migration).
--
-- Deploy order (recommended):
--   1) Run this migration in Supabase SQL editor (or supabase db push).
--   2) Deploy API change to populate intake_stage (and optionally engagement_shape) in mapIntakePayloadToLeadRow.

begin;

-- ---------------------------------------------------------------------------
-- intake_stage
-- ---------------------------------------------------------------------------
-- Values used by the app today: 'quick' | 'full' (readIntakePayload defaults missing -> 'full').
-- NULL = row created before this column existed, or legacy imports.
-- No CHECK constraint: allows future stages (e.g. 'stage2') without another migration.

alter table public.consultation_leads
  add column if not exists intake_stage text;

comment on column public.consultation_leads.intake_stage is
  'Staged intake discriminator: quick (Stage 1 brief), full (legacy long form), or future stage labels. Null for legacy rows.';

-- ---------------------------------------------------------------------------
-- engagement_shape
-- ---------------------------------------------------------------------------
-- Optional routing label (e.g. "New product or MVP"). Today the browser may only
-- embed this inside additional_notes unless the API is extended to send a dedicated field.

alter table public.consultation_leads
  add column if not exists engagement_shape text;

comment on column public.consultation_leads.engagement_shape is
  'Optional buyer-selected engagement type from intake; keep nullable for legacy and quick briefs with no selection.';

-- ---------------------------------------------------------------------------
-- Optional: backfill intake_stage for rows that already contain the Stage 1 tag in notes
-- (written by mapIntakePayloadToLeadRow since quick brief shipped). Idempotent.
-- ---------------------------------------------------------------------------

update public.consultation_leads
set intake_stage = 'quick'
where intake_stage is null
  and position('[Stage 1: quick brief]' in coalesce(additional_notes, '')) > 0;

-- ---------------------------------------------------------------------------
-- Indexes (lightweight, optional filtering in admin / analytics)
-- ---------------------------------------------------------------------------

-- Recent quick-brief intakes (partial index stays small if quick is a minority).
create index if not exists consultation_leads_quick_created_at_idx
  on public.consultation_leads (created_at desc)
  where intake_stage = 'quick';

-- If you filter CRM by stage + status often, consider a composite later; not added here
-- to avoid unused indexes.

commit;

-- =============================================================================
-- RLS / policies
-- =============================================================================
-- No changes required:
--   - anon: INSERT with check (true) — new nullable columns do not restrict inserts.
--   - authenticated: SELECT/UPDATE unchanged.
-- Ensure grants remain: grant insert on public.consultation_leads to anon;
-- (see supabase/consultation_leads.sql)

-- =============================================================================
-- ROLLBACK (run manually only if you need to remove the migration)
-- =============================================================================
-- begin;
-- drop index if exists public.consultation_leads_quick_created_at_idx;
-- alter table public.consultation_leads drop column if exists engagement_shape;
-- alter table public.consultation_leads drop column if exists intake_stage;
-- commit;
-- WARNING: rollback destroys values stored in those columns after deploy.
