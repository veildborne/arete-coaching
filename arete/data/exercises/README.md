# Areté Exercise Atlas — Architecture

**Stan: maj 2026 · Refactor V2**

## Filozofia

Areté to coach-led system decyzyjny, nie tracker. Atlas ćwiczeń musi
wspierać **decyzje trenera**: dla kogo, po co, kiedy, czym zastąpić.

Reguła architektoniczna z dyskusji projektowej:

> **Search can be broad. Programming must be specific.**

Czyli: wyszukiwarka rozumie "deadlift" → pokazuje całą rodzinę.
Plan zapisuje konkretne `romanian_deadlift`. Log też.

---

## Struktura plików

```
arete/
├── data/
│   └── exercises/
│       ├── _types.js          ← JSDoc Exercise typedef (DB + local fields)
│       ├── _families.js       ← 22 rodziny (deadlift, squat, bench_press, ...)
│       ├── index.js           ← Main export: exercisesCore = [...all partie]
│       ├── chest.js           ← 22-28 ćwiczeń klatki
│       ├── back.js            ← 35-45 ćwiczeń pleców
│       ├── shoulders_front.js
│       ├── shoulders_lat.js
│       ├── shoulders_rear.js
│       ├── biceps.js
│       ├── triceps.js
│       ├── forearms.js
│       ├── quads.js
│       ├── hamstrings.js
│       ├── glutes.js
│       ├── calves.js
│       └── abs.js
│
├── lib/
│   └── exercises/
│       ├── search.js          ← normalize + searchExercises (PL/EN, NFD diacritics)
│       └── validate.js        ← Audit: duplicates, missing fields, broken alternatives
│
├── migrations/
│   └── exercises_atlas_v2.sql ← ALTER TABLE add: aliases, primary_muscles, etc.
│
└── scripts/
    ├── seedAtlasV2.js         ← Upsert atlasu do Supabase (after migration)
    └── validateAtlas.js       ← Pre-seed validation (standalone)
```

---

## Schema dwuwarstwowa

Każde ćwiczenie ma **23 pola**:

### Warstwa DB (idą do Supabase tabeli `exercises`):

```
id (uuid) — auto-generated przez DB, NIE ma nic wspólnego z semantic id
name (text) — KLUCZ upsertu, unique
name_pl (text)
aliases (text[])
muscle_group (text)
primary_muscles (text[])
secondary_muscles (text[])
movement_pattern (text)
equipment (text[])
tier (text)
role (text)
sfr_rating (integer)
stretch_position (boolean)
compound (boolean)
unilateral (boolean)
lower_back_fatigue (text)
joint_risk (text)
beginner_friendly (boolean)
progression_type (text)
exercise_family (text)
variant_type (text)
description (text)
tier_reason (text)
```

### Warstwa lokalna (TYLKO w plikach .js, NIE w DB):

```
setup (string[])
execution (string[])
cues (string[])
common_mistakes (string[])
best_for (string[])
avoid_if (string[])
best_rep_range (string)
secondary_rep_range (string)
rest_seconds (number)
```

Powód: cues + setup + mistakes to ~80% objętości każdego ćwiczenia.
W DB byłoby to dead weight (algorithm tego nie używa). Lokalnie — UI 
może to czytać przez import.

---

## ID — dwa systemy

| System | Format | Gdzie | Cel |
|---|---|---|---|
| **Semantic** | `barbell_bench_press` | Pliki .js, `alternatives[]` | Reference między ćwiczeniami w atlasie |
| **UUID** | `577b16de-7237-...` | DB, `training_plans.plan_data.exercises[].exercise_id` | Trwały klucz w bazie |

**Mapowanie:** runtime, po `name`. Gdy PlanBuilder potrzebuje cues 
dla ćwiczenia z planu (które ma UUID), robi lookup:

```js
const dbExercise = await supabase.from('exercises').eq('id', uuid).single();
const atlasExercise = getExerciseByName(dbExercise.name);
const cues = atlasExercise.cues; // ← z pliku .js
```

---

## SFR Rating — skala 4-10

**UWAGA:** Skala 4-10 jest produkcyjnym standardem (7-stopniowa rozdzielczość).
Powód użycia tej skali: zachowanie zgodności z istniejącymi 82 ćwiczeniami w bazie,
oraz większa rozdzielczość niż klasyczna 1-5 z literatury RP.

**Mapowanie semantyczne:**

| SFR | Znaczenie |
|---|---|
| 10 | Top-tier, must-include w planie dla docelowej partii |
| 9 | Excellent — first-choice dla hipertrofii |
| 8 | Bardzo dobre, dobrze tolerowane przez większość |
| 7 | Dobre, sytuacyjne (zależy od klienta/sprzętu) |
| 6 | Słabsze ale użyteczne w specyficznych kontekstach |
| 5 | Niskie — głównie różnorodność lub specyfika |
| 4 | Bardzo niskie — rzadko używać |

---

## Workflow: dodanie nowej partii

1. **Stwórz plik** `data/exercises/<partia>.js` z tablicą exercises.
2. **Każde ćwiczenie** musi mieć wszystkie wymagane pola (zobacz `_types.js`).
3. **Uruchom walidację:** `node scripts/validateAtlas.js`
4. **Jeśli OK** — commit + push.
5. **Po zakończeniu wszystkich partii** — uruchom migration + seed:
   ```bash
   # 1. Migracja DB (przez Supabase SQL Editor lub psql)
   # Wklej zawartość migrations/exercises_atlas_v2.sql
   
   # 2. Seed
   node scripts/seedAtlasV2.js          # dry run, pokazuje plan
   node scripts/seedAtlasV2.js --yes    # faktyczny upsert
   ```

---

## Walidacja — co sprawdza

`validate.js` przed seedem sprawdza:

- ✓ Brak duplikatów `id` i `name`
- ✓ Wymagane pola wypełnione (name, name_pl, muscle_group, tier, sfr_rating, ...)
- ✓ Zakresy wartości (tier ∈ S/A/B/C, sfr_rating ∈ 5-9, etc.)
- ✓ Format ID — snake_case lowercase
- ✓ Spójność `exercise_family` (istnieje w `_families.js`?)
- ✓ Walidacja `alternatives[]` — każde id istnieje w atlasie
- ✓ Pokrycie partii — minimum ćwiczeń per muscle_group
- ✓ Aliasy — brak duplikatów, brak pustych

---

## Migracja vs. legacy ćwiczeń

**Stare 82 ćwiczenia w DB pozostają nietknięte** — mają UUID-y które
mogą być w aktywnych planach. Seed używa `upsert onConflict: 'name'`:

- Jeśli ćwiczenie z taką samą `name` już istnieje → update istniejącego
  rekordu (zachowuje UUID). Aktywne plany dalej działają.
- Jeśli nie istnieje → INSERT z nowym UUID.

**Po pełnym seedzie** w DB będzie ~240 ćwiczeń. Stare 82 są nadpisane
przez nowe definicje (jeśli mają taką samą `name`).

---

## Plan sesji refactoru

Sesje Claude Code, każda = 1 partia + walidacja + commit:

1. **Back** (35-45 ćwiczeń) — największa partia, najwięcej rodzin
2. **Glutes + Hamstrings** (28+18 = 46 ćwiczeń razem)
3. **Quads + Calves** (28+12 = 40 ćwiczeń)
4. **Shoulders** (lat+rear+front, ~36 ćwiczeń)
5. **Chest** (22-28 ćwiczeń)
6. **Arms** (biceps+triceps+forearms, ~45 ćwiczeń)
7. **Abs + final audit + migracja DB + seed**

Łącznie 7 sesji Claude Code. Każda ~1-2h.

---

## Ratings — kto wystawia

**Decyzja: B (ja generuję, korekty post-hoc).** 

Powód: 240 ćwiczeń × review każdego = 20-30h. To zatrzymuje MVP.
Lepsze podejście:
1. Generujemy całość z ratings.
2. W produkcji widzimy jak algorithm dobiera ćwiczenia.
3. Gdy konkretny tier/SFR wygląda źle (np. trener powiedział "cable
   kickback nie powinien być S") — punktowa korekta przez UPDATE.

Audit ratings dopiero gdy będzie sygnał z user feedback, nie z góry.
