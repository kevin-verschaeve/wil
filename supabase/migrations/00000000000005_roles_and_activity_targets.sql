-- Roles rework + activity targeting.
--
-- Roles become: member < volunteer < admin (the teacher role is replaced by
-- volunteer — existing teachers are converted). The hierarchy means a user
-- can access activities targeted at their role or below.
--
-- Each festival activity now has a single target audience (target_role):
--   member    → public programme (lessons, parties…), visible to everyone
--   volunteer → organisation tasks ("préparer la salle", "acheter les
--               boissons"…), visible to volunteers and admins only
--   admin     → admin-only activities

-- 1) Rename the role (existing 'teacher' rows become 'volunteer').
--    Skipped when the enum is already up to date (fresh installs).
do $$
begin
  if exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'user_role' and e.enumlabel = 'teacher'
  ) then
    alter type public.user_role rename value 'teacher' to 'volunteer';
  end if;
end $$;

-- 2) Activities get a single target audience.
alter table public.activities
  add column if not exists target_role public.user_role not null default 'member';

-- 3) Role hierarchy helpers.
create or replace function public.role_rank(r public.user_role)
returns int
language sql
immutable
as $$
  select case r when 'admin' then 2 when 'volunteer' then 1 else 0 end;
$$;

create or replace function public.can_access_role(target public.user_role)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select public.role_rank(public.get_my_role()) >= public.role_rank(target);
$$;

grant execute on function public.role_rank(public.user_role), public.can_access_role(public.user_role)
  to anon, authenticated, service_role;

-- 4) Activities are only visible to their target audience (and above).
drop policy if exists "activities_read_all" on public.activities;
drop policy if exists "activities_read_targeted" on public.activities;
create policy "activities_read_targeted" on public.activities
  for select using (public.can_access_role(target_role));

-- 5) Registration is only allowed towards accessible activities.
drop policy if exists "activity_reg_insert_own" on public.activity_registrations;
create policy "activity_reg_insert_own" on public.activity_registrations
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.activities a
      where a.id = activity_id and public.can_access_role(a.target_role)
    )
  );
