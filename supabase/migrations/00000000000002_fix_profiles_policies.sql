-- Fix: the profiles UPDATE policy referenced public.profiles in its WITH CHECK
-- subquery, which Postgres rejects at run time with
-- "infinite recursion detected in policy for relation profiles".
-- Replace it with a plain ownership policy plus a trigger that prevents
-- non-admins from changing roles.

drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- auth.uid() is null for dashboard/SQL-editor/service-role access: allow those.
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'only admins can change roles';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();
