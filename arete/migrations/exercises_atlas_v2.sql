-- ════════════════════════════════════════════════════════════════════════════
-- Areté Exercise Atlas V2 — Migration
-- ════════════════════════════════════════════════════════════════════════════
-- 
-- Bezpieczna migracja: NIE wywala istniejących danych, NIE modyfikuje wartości.
-- Tylko dodaje brakujące kolumny i indeksy.
-- 
-- Można uruchomić wielokrotnie (idempotent — wszędzie `if not exists`).
-- 
-- Po tej migracji uruchom seed atlasu V2:
--   node arete/scripts/seedAtlasV2.js
-- 
-- Seed używa `upsert onConflict: 'name'` — istniejące rekordy (z UUID-ami które
-- mają aktywne plany!) zostają zachowane, nowe ćwiczenia dostają nowe UUID-y.
-- 
-- Migracja: 17 maja 2026
-- Autor: Areté Exercise Atlas Refactor
-- ════════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Dodaj brakujące kolumny (idempotent)
-- ────────────────────────────────────────────────────────────────────────────

alter table exercises 
  add column if not exists aliases text[] default '{}',
  add column if not exists primary_muscles text[] default '{}',
  add column if not exists secondary_muscles text[] default '{}',
  add column if not exists role text,
  add column if not exists exercise_family text,
  add column if not exists variant_type text;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Indeksy dla wydajności wyszukiwania
-- ────────────────────────────────────────────────────────────────────────────

-- GIN dla array search (aliases lookup)
create index if not exists idx_exercises_aliases 
  on exercises using gin (aliases);

create index if not exists idx_exercises_primary_muscles 
  on exercises using gin (primary_muscles);

-- B-tree dla equality filters
create index if not exists idx_exercises_family 
  on exercises (exercise_family);

create index if not exists idx_exercises_muscle_group 
  on exercises (muscle_group);

create index if not exists idx_exercises_tier 
  on exercises (tier);

-- Unique na name (klucz upsertu) — sprawdź czy już istnieje
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'exercises_name_key'
  ) then
    alter table exercises add constraint exercises_name_key unique (name);
  end if;
end $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 3. Sanity check — pokazuje stan przed seedem
-- ────────────────────────────────────────────────────────────────────────────

-- Liczba ćwiczeń per partia (oczekujemy migracji do ~240)
select 
  muscle_group,
  count(*) as count,
  count(name_pl) as with_name_pl,
  count(aliases) filter (where array_length(aliases, 1) > 0) as with_aliases
from exercises
group by muscle_group
order by count desc;

-- Liczba aktywnych planów które używają exercise_id
-- (KRYTYCZNE: po seedzie te plany muszą dalej działać)
select count(*) as active_plans_count
from training_plans
where is_active = true;

-- Sprawdź zakres sfr_rating
select 
  min(sfr_rating) as sfr_min,
  max(sfr_rating) as sfr_max,
  avg(sfr_rating)::numeric(4,2) as sfr_avg,
  count(distinct tier) as tier_variants
from exercises
where sfr_rating is not null;

-- ────────────────────────────────────────────────────────────────────────────
-- ROLLBACK PLAN (na wypadek awarii)
-- ────────────────────────────────────────────────────────────────────────────
-- 
-- Migracja jest dodawcza — żadnych destrukcyjnych operacji.
-- Jeśli chcesz cofnąć:
--   
--   alter table exercises drop column if exists aliases;
--   alter table exercises drop column if exists primary_muscles;
--   alter table exercises drop column if exists secondary_muscles;
--   alter table exercises drop column if exists role;
--   alter table exercises drop column if exists exercise_family;
--   alter table exercises drop column if exists variant_type;
--   
--   drop index if exists idx_exercises_aliases;
--   drop index if exists idx_exercises_primary_muscles;
--   drop index if exists idx_exercises_family;
--   drop index if exists idx_exercises_muscle_group;
--   drop index if exists idx_exercises_tier;
-- 
-- Istniejące dane nie ucierpią — DROP COLUMN usuwa tylko kolumnę, nie rekordy.
-- ════════════════════════════════════════════════════════════════════════════
