-- Fix: "permission denied for table ..." on every table.
-- RLS policies decide WHICH ROWS a role may touch, but the API roles still
-- need SQL-level grants on the tables themselves. Supabase normally sets
-- these up through default privileges, but depending on how the migration
-- was executed they can be missing — so grant them explicitly.
-- Row-level security (already enabled on every table) keeps enforcing
-- who can actually read/write what.

grant usage on schema public to anon, authenticated, service_role;

-- Anonymous visitors browse public content (RLS limits them to reads anyway).
grant select on all tables in schema public to anon;

-- Signed-in users read and write; RLS restricts writes to their own rows
-- (or to admins via is_admin()).
grant select, insert, update, delete on all tables in schema public to authenticated;

grant all on all tables in schema public to service_role;

-- RPCs (registration counters) and helper functions.
grant execute on all functions in schema public to anon, authenticated, service_role;

-- Make sure tables/functions added by future migrations get the same grants.
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
