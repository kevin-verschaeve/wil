-- ============================================================
-- Festival & Dance association app — initial schema
-- ============================================================

-- ---------- Enums ----------
create type public.user_role as enum ('member', 'teacher', 'admin');
create type public.activity_category as enum ('concert', 'workshop', 'dance', 'talk', 'other');
create type public.lesson_level as enum ('all', 'beginner', 'intermediate', 'advanced');
create type public.registration_status as enum ('confirmed', 'waitlisted', 'cancelled');

-- ---------- Profiles & roles ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'member',
  created_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers (security definer so RLS policies can use them without recursion).
create or replace function public.get_my_role()
returns public.user_role
language sql
security definer set search_path = public
stable
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'member');
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select public.get_my_role() = 'admin';
$$;

-- ---------- Festival ----------
create table public.editions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  year int not null,
  starts_on date not null,
  ends_on date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  constraint editions_dates check (ends_on >= starts_on)
);

-- Only one current edition at a time.
create unique index editions_one_current on public.editions (is_current) where is_current;

create table public.stages (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions (id) on delete cascade,
  name text not null,
  color text not null default '#7C5CFC',
  sort_order int not null default 0
);

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions (id) on delete cascade,
  name text not null,
  style text not null default '',
  bio text not null default '',
  photo_url text
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions (id) on delete cascade,
  stage_id uuid references public.stages (id) on delete set null,
  artist_id uuid references public.artists (id) on delete set null,
  title text not null,
  description text not null default '',
  category public.activity_category not null default 'concert',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity int, -- null = unlimited
  constraint activities_times check (ends_at > starts_at)
);

create table public.activity_registrations (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (activity_id, user_id)
);

-- ---------- Floorplan ----------
create table public.floorplans (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions (id) on delete cascade,
  name text not null,
  image_url text
);

create table public.floorplan_pois (
  id uuid primary key default gen_random_uuid(),
  floorplan_id uuid not null references public.floorplans (id) on delete cascade,
  name text not null,
  description text not null default '',
  icon text not null default 'location', -- Ionicons icon name
  x numeric not null default 0.5, -- relative 0..1 position on the image
  y numeric not null default 0.5
);

-- ---------- Info pages ----------
create table public.info_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  icon text not null default 'information-circle',
  sort_order int not null default 0,
  published boolean not null default true,
  title_fr text not null,
  title_en text not null default '',
  body_fr text not null default '',
  body_en text not null default ''
);

-- ---------- Dance lessons ----------
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  season text not null, -- e.g. '2026-2027'
  title text not null,
  description text not null default '',
  level public.lesson_level not null default 'all',
  teacher_id uuid references public.profiles (id) on delete set null,
  teacher_name text not null default '',
  weekday int not null default 1, -- 1 = Monday .. 7 = Sunday
  start_time time not null,
  end_time time not null,
  location text not null default '',
  capacity int, -- null = unlimited
  starts_on date,
  ends_on date,
  is_open boolean not null default true,
  constraint lessons_weekday check (weekday between 1 and 7),
  constraint lessons_times check (end_time > start_time)
);

create table public.lesson_registrations (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.registration_status not null default 'confirmed',
  created_at timestamptz not null default now(),
  unique (lesson_id, user_id)
);

-- Waitlist when a lesson is full.
create or replace function public.assign_lesson_registration_status()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  lesson_capacity int;
  confirmed_count int;
begin
  select capacity into lesson_capacity from public.lessons where id = new.lesson_id;
  if lesson_capacity is not null then
    select count(*) into confirmed_count
      from public.lesson_registrations
      where lesson_id = new.lesson_id and status = 'confirmed';
    if confirmed_count >= lesson_capacity then
      new.status := 'waitlisted';
    end if;
  end if;
  return new;
end;
$$;

create trigger lesson_registration_capacity
  before insert on public.lesson_registrations
  for each row execute function public.assign_lesson_registration_status();

-- Block registration on full activities (no waitlist for festival activities).
create or replace function public.check_activity_capacity()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  max_capacity int;
  current_count int;
begin
  select capacity into max_capacity from public.activities where id = new.activity_id;
  if max_capacity is not null then
    select count(*) into current_count
      from public.activity_registrations
      where activity_id = new.activity_id;
    if current_count >= max_capacity then
      raise exception 'activity_full';
    end if;
  end if;
  return new;
end;
$$;

create trigger activity_registration_capacity
  before insert on public.activity_registrations
  for each row execute function public.check_activity_capacity();

-- ---------- Row level security ----------
alter table public.profiles enable row level security;
alter table public.editions enable row level security;
alter table public.stages enable row level security;
alter table public.artists enable row level security;
alter table public.activities enable row level security;
alter table public.activity_registrations enable row level security;
alter table public.floorplans enable row level security;
alter table public.floorplan_pois enable row level security;
alter table public.info_pages enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_registrations enable row level security;

-- Profiles: users see/update themselves; admins see/update everyone.
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));
create policy "profiles_admin_update" on public.profiles
  for update using (public.is_admin());

-- Teachers may see the profiles of people registered to their lessons.
create policy "profiles_select_teacher_participants" on public.profiles
  for select using (
    exists (
      select 1
      from public.lesson_registrations lr
      join public.lessons l on l.id = lr.lesson_id
      where lr.user_id = profiles.id and l.teacher_id = auth.uid()
    )
  );

-- Public content: everyone (even anonymous) can read; only admins write.
do $$
declare t text;
begin
  foreach t in array array['editions','stages','artists','activities','floorplans','floorplan_pois','lessons']
  loop
    execute format('create policy "%1$s_read_all" on public.%1$s for select using (true);', t);
    execute format('create policy "%1$s_admin_write" on public.%1$s for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- Info pages: everyone reads published pages; admins read/write everything.
create policy "info_pages_read_published" on public.info_pages
  for select using (published or public.is_admin());
create policy "info_pages_admin_write" on public.info_pages
  for all using (public.is_admin()) with check (public.is_admin());

-- Activity registrations: users manage their own; admins see everything.
create policy "activity_reg_select" on public.activity_registrations
  for select using (user_id = auth.uid() or public.is_admin());
create policy "activity_reg_insert_own" on public.activity_registrations
  for insert with check (user_id = auth.uid());
create policy "activity_reg_delete_own" on public.activity_registrations
  for delete using (user_id = auth.uid() or public.is_admin());

-- Lesson registrations: users manage their own; teachers see their lessons'; admins everything.
create policy "lesson_reg_select" on public.lesson_registrations
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.lessons l where l.id = lesson_id and l.teacher_id = auth.uid())
  );
create policy "lesson_reg_insert_own" on public.lesson_registrations
  for insert with check (
    user_id = auth.uid()
    and exists (select 1 from public.lessons l where l.id = lesson_id and l.is_open)
  );
create policy "lesson_reg_delete_own" on public.lesson_registrations
  for delete using (user_id = auth.uid() or public.is_admin());
create policy "lesson_reg_admin_update" on public.lesson_registrations
  for update using (public.is_admin()) with check (public.is_admin());

-- Registration counts must be visible to everyone (to show "12/20 places")
-- without exposing who registered. Security-definer counters:
create or replace function public.lesson_registration_counts()
returns table (lesson_id uuid, confirmed bigint, waitlisted bigint)
language sql
security definer set search_path = public
stable
as $$
  select lesson_id,
         count(*) filter (where status = 'confirmed') as confirmed,
         count(*) filter (where status = 'waitlisted') as waitlisted
  from public.lesson_registrations
  group by lesson_id;
$$;

create or replace function public.activity_registration_counts()
returns table (activity_id uuid, registered bigint)
language sql
security definer set search_path = public
stable
as $$
  select activity_id, count(*) as registered
  from public.activity_registrations
  group by activity_id;
$$;
