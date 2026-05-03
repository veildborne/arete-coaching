# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

The Next.js app lives in the `arete/` subdirectory, **not** the repo root. The root `package.json` is empty scaffolding. Always `cd arete` (or run from `arete/`) before invoking npm scripts.

```
arete-coaching/
├── package.json            ← empty wrapper, ignore
└── arete/                  ← actual Next.js 14 app
    ├── app/                ← App Router pages + route handlers
    ├── components/client/  ← shared client components
    ├── lib/                ← Supabase clients, auth roles, plan algorithm
    └── middleware.js       ← auth gate + ?code= interceptor
```

Path alias `@/*` is defined in `arete/jsconfig.json` and resolves relative to `arete/` (so `@/lib/...` = `arete/lib/...`).

## Commands

All from inside `arete/`:

```bash
npm install
npm run dev      # next dev
npm run build    # next build
npm run start    # next start (after build)
```

There is no test runner, linter, or type checker configured. The project is JavaScript (no TypeScript) with Tailwind 3 + PostCSS + Autoprefixer.

Deployment: push to GitHub → Vercel auto-deploys.

## Required environment variables

Set in `.env.local` (gitignored) and in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used by `lib/supabase-admin.js` to bypass RLS

## Architecture

### Auth + role routing

Three Supabase clients, each for a different context — pick the right one:

- `lib/supabase-browser.js` → `createClient()` for `'use client'` components
- `lib/supabase-server.js` → `createClient()` for Server Components & route handlers (uses Next cookies)
- `lib/supabase-admin.js` → `createAdminClient()` uses the service-role key to bypass RLS. **Server-only.** Used in coach-side dashboard pages to read across all clients' data.

Role resolution lives in `lib/auth-roles.js`:
- `isCoachProfile(profile, user)` returns true if `profile.role === 'coach'` **or** `user.email` is in the hardcoded `COACH_EMAILS` set. Adding a coach without flipping their DB role requires editing this file.
- `roleRedirectPath(profile, user)` → `/dashboard` for coaches, `/client` for everyone else.

`middleware.js` (matcher: `/`, `/dashboard/*`, `/client/*`, `/login`, `/auth/callback`):
1. Catches `?code=...` on any matched path and redirects to `/auth/callback` (handles Supabase magic links landing on the wrong route).
2. Redirects unauthenticated users hitting `/dashboard` or `/client` to `/login`.
3. Redirects logged-in users hitting `/login` to their role-appropriate panel.

### Next.js 14 quirks (do not "fix" these)

- `cookies()` from `next/headers` is **synchronous** in Next 14 — no `await`. The codebase relies on this (see `lib/supabase-server.js`, `app/auth/callback/route.js`).
- `createClient()` from the local supabase wrappers is also synchronous.

### Routes

- `/` — landing page (`app/page.js`, ~1600 lines, has its own auth modal, i18n pl/en/el)
- `/login` — separate full-page auth (`app/login/page.js`)
- `/auth/callback` — exchanges Supabase code for session, then role-redirects
- `/api/me/redirect` — sends caller to their role's panel
- `/api/seed-exercises` — **one-time** POST route to seed the `exercises` table; protect or delete after use (warning is in the file)
- Client side: `/client` portal, `/client/questionnaire`, `/client/plan`, `/client/workout` (logger), `/client/checkin`
- Coach side: `/dashboard`, `/dashboard/client/[id]`, `/dashboard/client/[id]/plan/new`

### Plan generation algorithm

`lib/planAlgorithm.js` (`generatePlan(questionnaire, exercises)`) is the core business logic. It is **evidence-based** with explicit references in comments — preserve the model when editing:

- **MEV table** per muscle × training age (`staz`)
- **SPLIT_MAP** for 2–6 days (Full Body, Upper/Lower, PPL, PPLx2)
- **Priority muscles** parsed from Polish free-text (`PRIORITY_MAP`); priority adds +4 sets, capped at 20
- **Equipment filter** from `miejsce_treningu` + `brak_sprzetu` ankiety fields
- **Cardio interference** (Hickson): ≥4 cardio sessions/wk → leg sets ×0.85; ≥2 → ×0.90
- **Stretch-position bonus** (Milo Wolf 2023): ranked higher for hypertrophy/recomp goals
- **Beginner gate**: filters out tier-B isolation lifts for first-year lifters
- **Injury exclusions**: parses `kontuzje_aktualne` for shoulder/knee/back keywords and removes overhead/squat/deadlift accordingly
- **Mesocycle**: 6 weeks, RIR descends each block, week 6 is auto-deload (`deload_sessions`, sets ×0.6, RIR=4)

Output shape consumed by `PlanBuilder` (coach), `PlanViewer`, `WorkoutLogger`, `ClientPortal`. Sessions are keyed `A`, `B`, `C`… each with `exercises[]` carrying `exercise_id`, `sets`, `rep_range`, `rir_target`, `progression`, and a Polish `note` string.

### Supabase tables (inferred from queries)

- `profiles` — `id`, `role` ('coach' | 'client'), `full_name`, `email`, `status`
- `questionnaires` — `client_id`, `data` (jsonb with Polish keys: `dni_tydzien`, `staz`, `cel`, `priorytetowe_partie`, `miejsce_treningu`, `brak_sprzetu`, `cardio_ile`, `kontuzje_aktualne`, `cwiczenia_unikane`…)
- `training_plans` — `client_id`, `is_active`, `plan_data`/`plan_json` (algorithm output)
- `training_logs` — `client_id`, `session_date`, sets/reps/weight/RIR per exercise
- `check_ins` — `client_id`, `week_number`, `body_weight`, `energy_level`, `sleep_quality`, `soreness_level`, `adherence_pct`, `client_notes`
- `exercises` — seeded by `/api/seed-exercises`. Fields: `name`, `name_pl`, `muscle_group`, `equipment[]`, `sfr_rating`, `stretch_position`, `tier`, `compound`, `movement_pattern`. There's a fallback to `exercise_library` in `PlanBuilder`.

### UI conventions

- Polish copy throughout (the user-facing locale is `pl`); landing page also has English & Greek.
- Most pages mix Tailwind classes with inline-style objects. Don't refactor wholesale — match local style.
- Custom theme in `tailwind.config.js`: `bg/surface/surface2/border/gold/text` palette, `font-display` (Cormorant Garamond) and `font-body` (Outfit).
- Client portal (`ClientPortal.js`) uses a deliberately gamified Greek-virtue motif (Ἀρετή archetypes, XP, achievements). It is intentional theming, not placeholder copy.
