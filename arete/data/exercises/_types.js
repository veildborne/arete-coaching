/**
 * Areté Exercise Atlas — Type definitions
 * 
 * Schema jest podzielony na dwie warstwy:
 *   1) DB layer — pola które idą do Supabase tabeli `exercises` (upsert po name).
 *      To są pola których używa runtime: PlanBuilder, WorkoutLogger, search UI.
 *   2) Local layer — pola które żyją TYLKO w plikach .js w repo.
 *      To są pola edukacyjne: setup, execution, cues, common_mistakes.
 *      UI może je czytać przez import, ale DB ich nie ma.
 *      
 * Powód: cues i setup to ~80% objętości każdego ćwiczenia. Trzymanie tego
 * w DB nie daje żadnych korzyści (algorytm tego nie używa), a robi z 
 * tabeli `exercises` potwora 14000-linijkowego.
 * 
 * @see {@link ./README.md} dla pełnej dokumentacji
 */

// ============================================================================
//  EXERCISE — pełen rekord (DB + lokalne pola)
// ============================================================================

/**
 * @typedef {Object} Exercise
 * 
 * @property {string} id - Semantyczne ID w snake_case (np. 'barbell_bench_press').
 *   Używane lokalnie do referencji w alternatives[] i families.
 *   W DB Supabase generuje osobny uuid; nasz semantic id nie jest tam zapisywany.
 *   Kontrakt: unique w całym atlasie, niezmienne (gdy raz wybrane).
 * 
 * @property {string} name - English canonical name (np. "Barbell Bench Press").
 *   To jest KLUCZ upsertu do DB (onConflict: 'name'). Musi być unique.
 * 
 * @property {string} name_pl - Polska nazwa (np. "Wyciskanie sztangi leżąc").
 * 
 * @property {string[]} aliases - Alternatywne nazwy: skróty (RDL), polskie
 *   warianty, slang, błędne nazwy które ludzie wpisują w wyszukiwarce.
 *   Search normalizuje przed porównaniem (NFD diacritic strip).
 * 
 * @property {MuscleGroup} muscle_group - Główna partia (jeden z 13).
 * @property {string[]} primary_muscles - Konkretne mięśnie pierwszorzędowe
 *   (np. ["chest", "front_delts"]). Wartości free-text — używane do volume
 *   tracking per-muscle w Fazie 6.
 * @property {string[]} secondary_muscles - Mięśnie drugorzędowe.
 * 
 * @property {string} movement_pattern - Wzorzec ruchowy (horizontal_push,
 *   vertical_pull, hip_hinge, squat, etc.). Używane przez algorithm do
 *   balansowania planu (push vs pull, knee vs hip dominant).
 * 
 * @property {string[]} equipment - Lista wymaganego sprzętu
 *   (barbell, dumbbell, cable, machine, bodyweight, bench, etc.).
 *   Używane do filtrowania w PlanBuilder gdy klient ma ograniczony sprzęt.
 * 
 * @property {boolean} unilateral - Czy ćwiczenie wykonywane jest jedną kończyną.
 * @property {boolean} compound - Czy ćwiczenie wielostawowe.
 * 
 * @property {Tier} tier - S/A/B/C — ogólna klasyfikacja dla hipertrofii.
 *   S = first-choice, A = very good, B = situational, C = niche.
 * 
 * @property {Role} role - Rola w sesji: main (compound dający framework),
 *   secondary (uzupełnia main), accessory (izolowane), pump (high-rep finisher),
 *   rehab (prehab/korekta), conditioning (cardio-adjacent).
 * 
 * @property {string} exercise_family - Rodzina ćwiczeń (np. "deadlift",
 *   "bench_press", "lat_pulldown"). Patrz _families.js dla pełnej listy.
 *   Search/UI grupuje po family. NULL jeśli ćwiczenie nie ma rodziny.
 * 
 * @property {string} [variant_type] - Wariant w obrębie rodziny (np. "romanian",
 *   "conventional", "sumo" dla family="deadlift"). NULL jeśli single-variant.
 * 
 * @property {number} sfr_rating - Stimulus-to-Fatigue Ratio, skala 4-10.
 *   PRODUKCYJNY STANDARD. Zachowane z istniejącej bazy 82 ćwiczeń.
 *   Mapowanie semantyczne:
 *     10 = top-tier, must-include (np. cable lateral raise dla bocznych)
 *      9 = excellent (np. lat pulldown, RDL, chest supported row)
 *      8 = bardzo dobre (np. machine chest press, DB shoulder press)
 *      7 = dobre, sytuacyjne (np. dumbbell bench press, BB curl)
 *      6 = słabsze ale użyteczne (np. heavy barbell row dla hipertrofii)
 *      5 = niskie (np. conventional deadlift jako narzędzie hipertrofii)
 *      4 = bardzo niskie (rzadko używać, kontekstowo)
 * 
 * @property {boolean} stretch_position - Czy ćwiczenie obciąża mięsień w 
 *   pozycji rozciągniętej (lengthened bias). Kluczowy parametr dla hipertrofii
 *   wg literatury post-2020 (Schoenfeld, Nuckols).
 * 
 * @property {LowerBackFatigue} lower_back_fatigue - Obciążenie lędźwi:
 *   low/medium/high. Używane do filtrowania ćwiczeń przy klientach z 
 *   problemami lędźwi i do nie-pakowania zbyt wielu spinal-load ćwiczeń
 *   w jedną sesję.
 * 
 * @property {JointRisk} joint_risk - Ryzyko stawowe: low/medium/high.
 *   Używane do filtrowania przy klientach z kontuzjami.
 * 
 * @property {boolean} beginner_friendly - Czy ćwiczenie nadaje się dla 
 *   początkujących (low skill_requirement + safe).
 * 
 * @property {ProgressionType} progression_type - Domyślny model progresji
 *   dla tego ćwiczenia. Używane przez progressionEngine.js.
 * 
 * @property {string[]} alternatives - Lista semantic IDs innych ćwiczeń,
 *   które mogą zastąpić to ćwiczenie (podobny stimulus, podobna funkcja).
 *   Używane przez "Swap exercise" feature w PlanBuilder.
 *   WALIDACJA: każde id musi istnieć w atlasie.
 * 
 * // ============== LOKALNE POLA (nie w DB) ==============
 * 
 * @property {string} description - Krótki opis (1 zdanie). Idzie do DB,
 *   ale pole jest opcjonalne — UI używa go w tooltipie.
 * 
 * @property {string} tier_reason - Krótkie uzasadnienie tieru (np. "S — 
 *   constant tension + safe + stretch"). Idzie do DB. UI w pickerze.
 * 
 * @property {string[]} [setup] - Lista kroków setup (3-5). LOKALNE.
 *   Renderowane w ExerciseDetail modal w workout view.
 * @property {string[]} [execution] - Lista kroków wykonania. LOKALNE.
 * @property {string[]} [cues] - Cues dla trenera/klienta. LOKALNE.
 * @property {string[]} [common_mistakes] - Najczęstsze błędy. LOKALNE.
 * @property {string[]} [best_for] - Komu/kiedy pasuje. LOKALNE.
 * @property {string[]} [avoid_if] - Kontraindykacje. LOKALNE.
 * 
 * @property {string} [best_rep_range] - Optymalny zakres powtórzeń (np. "6-10").
 * @property {string} [secondary_rep_range] - Alternatywny zakres (np. "10-15").
 * @property {number} [rest_seconds] - Sugerowany odpoczynek (np. 180).
 */


// ============================================================================
//  ENUMS — wartości dozwolone dla pól z ograniczonym setem
// ============================================================================

/**
 * Lista dozwolonych muscle_group. ZACHOWANA z produkcji (nie zmieniamy istniejących).
 * shoulders_front dodany jako nowy (algorytm jeszcze go nie używa — sprawdzić w 
 * audicie czy DashboardClient/PlanBuilder się nie wysypie).
 * 
 * @typedef {(
 *  'chest' | 
 *  'back' |
 *  'shoulders_front' |
 *  'shoulders_lat' |
 *  'shoulders_rear' |
 *  'biceps' |
 *  'triceps' |
 *  'forearms' |
 *  'quads' |
 *  'hamstrings' |
 *  'glutes' |
 *  'calves' |
 *  'abs'
 * )} MuscleGroup
 */

/** @typedef {'S' | 'A' | 'B' | 'C'} Tier */

/** 
 * @typedef {(
 *  'main' |
 *  'secondary' |
 *  'accessory' |
 *  'pump' |
 *  'rehab' |
 *  'conditioning'
 * )} Role
 */

/** @typedef {'low' | 'medium' | 'high'} LowerBackFatigue */

/** @typedef {'low' | 'medium' | 'high'} JointRisk */

/**
 * @typedef {(
 *  'double_progression' |
 *  'load_progression' |
 *  'rep_progression' |
 *  'tempo_control' |
 *  'static_hold'
 * )} ProgressionType
 */


// ============================================================================
//  EXERCISE FAMILY — grupowanie wariantów ćwiczeń
// ============================================================================

/**
 * @typedef {Object} ExerciseFamily
 * @property {string} id - Family id (np. "deadlift").
 * @property {string} display_name - "Deadlift Family"
 * @property {string} display_name_pl - "Rodzina martwego ciągu"
 * @property {string} description - Co łączy tę rodzinę.
 * @property {string} parent_pattern - movement_pattern wspólny dla rodziny
 *   (np. "hip_hinge" dla deadlift family).
 * @property {string[]} variant_ids - Lista semantic IDs ćwiczeń w rodzinie.
 *   Wypełniana automatycznie w validate.js — TYLKO referencja, nie source of truth.
 */


// ============================================================================
//  Export — żeby JSDoc był widoczny w innych plikach
// ============================================================================

module.exports = {
  // Tylko dla side-effect importu w JSDoc.
  // Same typy są dostępne globalnie po `@typedef`.
}
