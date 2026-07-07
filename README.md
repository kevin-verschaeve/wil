# WIL — Festival & Danse

Mobile app (Android / iOS) for the WIL festival and the association's year-round dance
lessons, built with [Expo](https://expo.dev) (React Native + TypeScript) and
[Supabase](https://supabase.com) (Postgres, auth, row-level security).

## Features

**Festival**
- 📅 **Programme** — timetable of the current edition, filterable by day and by stage
- 🎵 **Line-up** — artists with bios and their performances
- ❤️ **Mon planning** — users register to activities (concerts, workshops, balls) and see
  their own day-by-day schedule; capacity-limited workshops refuse registrations when full
- 🗺️ **Plan du site** — floorplan with points of interest and a legend
- ℹ️ **Infos pratiques** — editable bilingual info pages (access, tickets, on-site…)

**Dance association**
- 🕺 **Cours** — the season's weekly lessons with level, schedule, location and teacher
- ✍️ Registration with automatic **waitlist** when a lesson is full
- 👀 Teachers see the participant list of their own lessons

**Administration** (role-gated, in-app)
- Editions (one per year, one “current”), stages, artists, activities
- Lessons and their participants
- Info pages (FR/EN content)

**Cross-cutting**
- 🔐 Email/password auth (Supabase), roles: `member`, `teacher`, `admin`
- 🌍 i18n French / English (French default, switchable in the profile)
- 🌙 Automatic light / dark theme
- Browsing is open to everyone; signing in is only needed to register

## Getting started

### 1. Create the Supabase project

1. Create a project on [supabase.com](https://supabase.com).
2. In the SQL editor, run the files in `supabase/migrations/` **in order**
   (`00000000000001_init.sql`, then `00000000000002_fix_profiles_policies.sql`, …).
3. (Optional) Run `supabase/seed.sql` for demo content — an edition, artists,
   activities, info pages and lessons.

> Alternatively, with the [Supabase CLI](https://supabase.com/docs/guides/cli):
> `supabase link --project-ref <ref> && supabase db push && supabase db seed`

### 2. Configure the app

```bash
cp .env.example .env
# fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
# (Supabase dashboard → Settings → API)
```

### 3. Run

```bash
npm install
npx expo start
```

Open the app with [Expo Go](https://expo.dev/go), an emulator, or the web preview.

### 4. Make yourself admin

Sign up in the app, then in Supabase (SQL editor):

```sql
update public.profiles set role = 'admin' where id = (
  select id from auth.users where email = 'you@example.com'
);
```

The **Administration** entry appears in the “Plus” tab after restarting the app
(or signing out/in). Use `role = 'teacher'` for teachers — when a lesson's
`teacher_id` points at their profile they can see its participant list.

## Building for the stores

The app is a standard Expo project — use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android   # .aab for Google Play
eas build --platform ios       # .ipa for the App Store
```

Remember to set the two `EXPO_PUBLIC_*` variables as
[EAS environment variables](https://docs.expo.dev/eas/environment-variables/) so
release builds are connected to Supabase.

## Architecture

```
src/
  app/                 # expo-router file-based navigation
    (auth)/            # sign-in / sign-up (modals)
    (tabs)/            # Programme, Line-up, Mon planning, Cours, Plus
    activity/[id]      # activity details + registration
    artist/[id]        # artist details + performances
    lesson/[id]        # lesson details, registration, participants
    info/[slug]        # bilingual info pages
    floorplan          # site map with POIs
    admin/             # role-gated management screens
  components/          # UI kit (Button, Card, Chip…) + domain cards
  hooks/               # React Query data hooks (use-festival, use-lessons…)
  lib/                 # supabase client, types, date formatting
  locales/             # fr.ts / en.ts dictionaries
  providers/           # AuthProvider (session + profile), LocaleProvider
supabase/
  migrations/          # schema, triggers, row-level security
  seed.sql             # demo data
```

**Security model** — all authorization lives in Postgres RLS policies, not in the
client: public content is world-readable, users can only write their own
registrations, `is_admin()` gates every admin mutation, and teachers can only read
registrations of their own lessons. Capacity rules (activity full, lesson waitlist)
are enforced by database triggers, so they hold even under concurrent registrations.

## Troubleshooting

Screens show the underlying Supabase error message under “Une erreur est
survenue”. The common ones:

- **“Could not find the table 'public.editions' in the schema cache” (PGRST205)**
  — PostgREST hasn't picked up the new tables yet. In the SQL editor run
  `notify pgrst, 'reload schema';` (or just wait a minute), then pull to retry.
- **“infinite recursion detected in policy for relation profiles”** — you are on
  the old schema; run `supabase/migrations/00000000000002_fix_profiles_policies.sql`.
- **“permission denied for table …”** — the API roles (`anon`, `authenticated`)
  are missing SQL grants on the tables; run
  `supabase/migrations/00000000000003_grants.sql`. (RLS still controls which
  rows each user can actually read or write.)
- **Profile shows no name/role after sign-up** — the profile row is created by
  the `on_auth_user_created` trigger; check it exists in `public.profiles`, then
  use the retry button on the profile screen (the app retries automatically too).

## Development

```bash
npx tsc --noEmit   # typecheck
npx eslint .       # lint
```
