-- Bryant Labs analytics reset for approved admin testing
-- Run after supabase/admin_identity.sql and supabase/site_events.sql.

create or replace function public.reset_analytics()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count bigint;
begin
  if not public.is_approved_bryantlabs_admin() then
    raise exception 'not authorized to reset analytics'
      using errcode = '42501';
  end if;

  delete from public.site_events;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.reset_analytics() from public;
grant execute on function public.reset_analytics() to authenticated;
