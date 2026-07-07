-- Split info pages into two scopes:
--   edition_id null  → association pages (shown in the "Cours" part, year-round)
--   edition_id set   → festival pages (shown in the "Festival" part for that edition)
alter table public.info_pages
  add column if not exists edition_id uuid references public.editions (id) on delete cascade;
