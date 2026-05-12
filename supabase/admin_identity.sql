-- Bryant Labs approved admin identity for RLS
-- Keep studio_auth_config.admin_email aligned with ADMIN_EMAIL and VITE_ADMIN_EMAIL.

create table if not exists public.studio_auth_config (
  id integer primary key check (id = 1),
  admin_email text not null
);

insert into public.studio_auth_config (id, admin_email)
values (1, 'projects@bryantlabs.dev')
on conflict (id) do nothing;

alter table public.studio_auth_config enable row level security;

revoke all on table public.studio_auth_config from anon;
revoke all on table public.studio_auth_config from authenticated;

create or replace function public.is_approved_bryantlabs_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = lower(
  (
    select admin_email
    from public.studio_auth_config
    where id = 1
  )
  );
$$;

revoke all on function public.is_approved_bryantlabs_admin() from public;
grant execute on function public.is_approved_bryantlabs_admin() to authenticated;
