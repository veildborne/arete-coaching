/**
 * Areté Exercise Atlas — Search engine
 * 
 * Wyszukiwanie ćwiczeń odporne na:
 *   - polskie znaki diakrytyczne ("ściąganie" znajduje "sciaganie")
 *   - case sensitivity
 *   - skróty (RDL → Romanian Deadlift)
 *   - synonimy w aliasach
 *   - częściowe dopasowanie ("incline" znajduje wszystkie inclines)
 * 
 * Reguła z dyskusji architektonicznej:
 *   "Search can be broad. Programming must be specific."
 *   Czyli search jest tolerancyjny, ale do planu i do logu zapisujemy 
 *   konkretne exercise.id.
 * 
 * Zero zewnętrznych zależności (no fuse.js, no lunr) — pure JS.
 * Dla ~240 ćwiczeń linear scan jest szybszy niż building index.
 */

/**
 * Normalizuje string do porównania:
 *   - lowercase
 *   - usuwa polskie znaki (NFD + diacritic strip)
 *   - usuwa interpunkcję
 *   - trim
 * 
 * @param {string} value
 * @returns {string}
 * 
 * @example
 *   normalize("Ściąganie drążka") === normalize("sciaganie drazka")  // true
 *   normalize("Lateral Raise!") === normalize("lateral raise")        // true
 */
function normalize(value) {
  if (!value || typeof value !== 'string') return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sprawdza czy query pasuje do exercise.
 * Returns score (0 = brak dopasowania, wyższe = lepsze).
 * 
 * Scoring:
 *   100 = exact match na name lub name_pl
 *    90 = exact match na alias
 *    70 = name lub name_pl zaczyna się od query
 *    60 = alias zaczyna się od query
 *    50 = name lub name_pl zawiera query
 *    40 = alias zawiera query
 *    30 = muscle_group / movement_pattern / equipment zawiera query
 *    20 = exercise_family lub primary_muscles zawiera query
 *     0 = brak dopasowania
 * 
 * @param {import('../../data/exercises/_types').Exercise} exercise
 * @param {string} normalizedQuery - already normalized via normalize()
 * @returns {number}
 */
function matchScore(exercise, normalizedQuery) {
  if (!normalizedQuery) return 0;

  const name = normalize(exercise.name);
  const namePl = normalize(exercise.name_pl);
  const aliases = (exercise.aliases || []).map(normalize);

  // Exact matches
  if (name === normalizedQuery) return 100;
  if (namePl === normalizedQuery) return 100;
  if (aliases.includes(normalizedQuery)) return 90;

  // Starts-with matches
  if (name.startsWith(normalizedQuery)) return 70;
  if (namePl.startsWith(normalizedQuery)) return 70;
  if (aliases.some(a => a.startsWith(normalizedQuery))) return 60;

  // Contains matches
  if (name.includes(normalizedQuery)) return 50;
  if (namePl.includes(normalizedQuery)) return 50;
  if (aliases.some(a => a.includes(normalizedQuery))) return 40;

  // Metadata matches (lower priority)
  const muscle = normalize(exercise.muscle_group);
  const pattern = normalize(exercise.movement_pattern);
  const equipment = (exercise.equipment || []).map(normalize);

  if (muscle.includes(normalizedQuery)) return 30;
  if (pattern.includes(normalizedQuery)) return 30;
  if (equipment.some(e => e.includes(normalizedQuery))) return 30;

  // Family / primary muscles
  const family = normalize(exercise.exercise_family || '');
  const primaries = (exercise.primary_muscles || []).map(normalize);

  if (family.includes(normalizedQuery)) return 20;
  if (primaries.some(p => p.includes(normalizedQuery))) return 20;

  return 0;
}

/**
 * Główna funkcja wyszukiwania.
 * 
 * @param {string} query - User input.
 * @param {import('../../data/exercises/_types').Exercise[]} exercises - Pełen atlas.
 * @param {Object} [options]
 * @param {string} [options.muscle_group] - Filtr po partii.
 * @param {string[]} [options.equipment] - Filtr po sprzęcie (any match).
 * @param {string} [options.tier] - Filtr po tierze.
 * @param {string} [options.role] - Filtr po roli.
 * @param {boolean} [options.beginner_friendly] - Tylko beginner-friendly.
 * @param {number} [options.limit=50] - Max wyników.
 * @returns {import('../../data/exercises/_types').Exercise[]}
 * 
 * @example
 *   searchExercises("RDL", atlas)
 *   searchExercises("sciaganie", atlas, { tier: 'S' })
 *   searchExercises("", atlas, { muscle_group: 'chest', equipment: ['cable'] })
 */
function searchExercises(query, exercises, options = {}) {
  const {
    muscle_group,
    equipment,
    tier,
    role,
    beginner_friendly,
    limit = 50,
  } = options;

  // 1. Apply filters first (cheaper than scoring)
  let filtered = exercises;

  if (muscle_group) {
    filtered = filtered.filter(e => e.muscle_group === muscle_group);
  }
  if (tier) {
    filtered = filtered.filter(e => e.tier === tier);
  }
  if (role) {
    filtered = filtered.filter(e => e.role === role);
  }
  if (beginner_friendly === true) {
    filtered = filtered.filter(e => e.beginner_friendly === true);
  }
  if (equipment && equipment.length) {
    const normalizedEq = equipment.map(normalize);
    filtered = filtered.filter(e => {
      const exEq = (e.equipment || []).map(normalize);
      return normalizedEq.some(req => exEq.includes(req));
    });
  }

  // 2. If no query, return filtered set sorted by tier/SFR
  if (!query || !query.trim()) {
    return filtered
      .slice()
      .sort((a, b) => {
        const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
        const ta = tierOrder[a.tier] ?? 99;
        const tb = tierOrder[b.tier] ?? 99;
        if (ta !== tb) return ta - tb;
        return (b.sfr_rating || 0) - (a.sfr_rating || 0);
      })
      .slice(0, limit);
  }

  // 3. Score and rank
  const normalizedQuery = normalize(query);
  const scored = filtered
    .map(e => ({ exercise: e, score: matchScore(e, normalizedQuery) }))
    .filter(x => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Same score → prefer higher tier
      const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
      const ta = tierOrder[a.exercise.tier] ?? 99;
      const tb = tierOrder[b.exercise.tier] ?? 99;
      if (ta !== tb) return ta - tb;
      return (b.exercise.sfr_rating || 0) - (a.exercise.sfr_rating || 0);
    });

  return scored.slice(0, limit).map(x => x.exercise);
}

/**
 * Grupuje wyniki po exercise_family. Przydatne w UI gdy chcemy pokazać
 * "Deadlift family" z wariantami pod spodem.
 * 
 * @param {import('../../data/exercises/_types').Exercise[]} exercises
 * @returns {Record<string, import('../../data/exercises/_types').Exercise[]>}
 */
function groupByFamily(exercises) {
  const groups = {};
  for (const ex of exercises) {
    const family = ex.exercise_family || '_standalone';
    if (!groups[family]) groups[family] = [];
    groups[family].push(ex);
  }
  return groups;
}

module.exports = {
  normalize,
  matchScore,
  searchExercises,
  groupByFamily,
};
