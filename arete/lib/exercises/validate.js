/**
 * Areté Exercise Atlas — Validation
 * 
 * Uruchom przed seedem do Supabase:
 *   node arete/scripts/validateAtlas.js
 * 
 * Sprawdza:
 *   1. Duplikaty id i name
 *   2. Wymagane pola (name, name_pl, muscle_group, tier, sfr_rating, ...)
 *   3. Zakresy wartości (tier ∈ S/A/B/C, sfr_rating ∈ 5-9, ...)
 *   4. Spójność family (exercise_family istnieje w FAMILIES?)
 *   5. Walidacja alternatives[] — każde id musi istnieć w atlasie
 *   6. Pokrycie partii (czy każda partia ma minimum ćwiczeń)
 *   7. Aliasy: brak duplikatów, brak pustych stringów
 * 
 * Zwraca {ok, errors, warnings} — nie throwuje, żeby seed mógł
 * sam zdecydować czy continuować mimo warningów.
 */

const { FAMILIES, getFamilyIds } = require('../../data/exercises/_families');

// ============================================================================
//  Konstanty walidacji
// ============================================================================

const VALID_TIERS = ['S', 'A', 'B', 'C'];
const VALID_ROLES = ['main', 'secondary', 'accessory', 'pump', 'rehab', 'conditioning'];
const VALID_MUSCLE_GROUPS = [
  'chest', 'back',
  'shoulders_front', 'shoulders_lat', 'shoulders_rear',
  'biceps', 'triceps', 'forearms',
  'quads', 'hamstrings', 'glutes', 'calves',
  'abs',
];
const VALID_LOWER_BACK_FATIGUE = ['low', 'medium', 'high'];
const VALID_JOINT_RISK = ['low', 'medium', 'high'];
const VALID_PROGRESSION_TYPES = [
  'double_progression', 'load_progression', 'rep_progression',
  'tempo_control', 'static_hold',
];

const SFR_MIN = 5;
const SFR_MAX = 9;

const REQUIRED_FIELDS = [
  'id', 'name', 'name_pl', 'muscle_group', 'primary_muscles',
  'movement_pattern', 'equipment', 'tier', 'role', 'sfr_rating',
  'compound', 'unilateral',
];

// Minimum ćwiczeń per partia (z planu GPT: target 220-260 total)
const MIN_PER_MUSCLE_GROUP = {
  chest: 20,
  back: 30,
  shoulders_front: 8,
  shoulders_lat: 10,
  shoulders_rear: 10,
  biceps: 14,
  triceps: 14,
  forearms: 6,
  quads: 22,
  hamstrings: 16,
  glutes: 20,
  calves: 8,
  abs: 16,
};

// ============================================================================
//  Helpers
// ============================================================================

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isStringArray(v) {
  return Array.isArray(v) && v.every(x => typeof x === 'string');
}

// ============================================================================
//  Walidacja pojedynczego ćwiczenia
// ============================================================================

/**
 * Sprawdza pojedyncze ćwiczenie. Zwraca listę błędów (puste = OK).
 * @param {import('../../data/exercises/_types').Exercise} ex
 * @param {Set<string>} allIds - Wszystkie id w atlasie (do walidacji alternatives).
 * @returns {{errors: string[], warnings: string[]}}
 */
function validateExercise(ex, allIds) {
  const errors = [];
  const warnings = [];
  const label = ex.id || ex.name || '(no id, no name)';

  // 1. Required fields
  for (const field of REQUIRED_FIELDS) {
    if (ex[field] === undefined || ex[field] === null) {
      errors.push(`[${label}] missing required field: ${field}`);
    }
  }

  // 2. ID format
  if (ex.id && !/^[a-z][a-z0-9_]*$/.test(ex.id)) {
    errors.push(`[${label}] id must be snake_case lowercase, got: "${ex.id}"`);
  }

  // 3. String fields non-empty
  if (!isNonEmptyString(ex.name)) errors.push(`[${label}] name must be non-empty string`);
  if (!isNonEmptyString(ex.name_pl)) errors.push(`[${label}] name_pl must be non-empty string`);

  // 4. Enums
  if (ex.muscle_group && !VALID_MUSCLE_GROUPS.includes(ex.muscle_group)) {
    errors.push(`[${label}] invalid muscle_group: "${ex.muscle_group}" (allowed: ${VALID_MUSCLE_GROUPS.join(', ')})`);
  }
  if (ex.tier && !VALID_TIERS.includes(ex.tier)) {
    errors.push(`[${label}] invalid tier: "${ex.tier}" (allowed: ${VALID_TIERS.join(', ')})`);
  }
  if (ex.role && !VALID_ROLES.includes(ex.role)) {
    errors.push(`[${label}] invalid role: "${ex.role}" (allowed: ${VALID_ROLES.join(', ')})`);
  }
  if (ex.lower_back_fatigue && !VALID_LOWER_BACK_FATIGUE.includes(ex.lower_back_fatigue)) {
    errors.push(`[${label}] invalid lower_back_fatigue: "${ex.lower_back_fatigue}"`);
  }
  if (ex.joint_risk && !VALID_JOINT_RISK.includes(ex.joint_risk)) {
    errors.push(`[${label}] invalid joint_risk: "${ex.joint_risk}"`);
  }
  if (ex.progression_type && !VALID_PROGRESSION_TYPES.includes(ex.progression_type)) {
    errors.push(`[${label}] invalid progression_type: "${ex.progression_type}"`);
  }

  // 5. SFR range
  if (typeof ex.sfr_rating === 'number') {
    if (ex.sfr_rating < SFR_MIN || ex.sfr_rating > SFR_MAX) {
      errors.push(`[${label}] sfr_rating ${ex.sfr_rating} out of range ${SFR_MIN}-${SFR_MAX}`);
    }
  }

  // 6. Arrays must be arrays
  if (ex.primary_muscles && !isStringArray(ex.primary_muscles)) {
    errors.push(`[${label}] primary_muscles must be string array`);
  }
  if (ex.secondary_muscles && !isStringArray(ex.secondary_muscles)) {
    errors.push(`[${label}] secondary_muscles must be string array`);
  }
  if (ex.equipment && !isStringArray(ex.equipment)) {
    errors.push(`[${label}] equipment must be string array`);
  }
  if (ex.aliases && !isStringArray(ex.aliases)) {
    errors.push(`[${label}] aliases must be string array`);
  }

  // 7. Aliases — no duplicates, no empty
  if (Array.isArray(ex.aliases)) {
    const seen = new Set();
    for (const alias of ex.aliases) {
      if (!isNonEmptyString(alias)) {
        errors.push(`[${label}] empty alias detected`);
      }
      const lower = alias.toLowerCase();
      if (seen.has(lower)) {
        warnings.push(`[${label}] duplicate alias: "${alias}"`);
      }
      seen.add(lower);
    }
  }

  // 8. Family validity
  if (ex.exercise_family) {
    const familyIds = getFamilyIds();
    if (!familyIds.includes(ex.exercise_family)) {
      errors.push(`[${label}] exercise_family "${ex.exercise_family}" not in FAMILIES (allowed: ${familyIds.join(', ')})`);
    }
  }

  // 9. Alternatives — each must exist in atlas
  if (Array.isArray(ex.alternatives)) {
    for (const altId of ex.alternatives) {
      if (!allIds.has(altId)) {
        errors.push(`[${label}] alternative "${altId}" does not exist in atlas`);
      }
      if (altId === ex.id) {
        warnings.push(`[${label}] alternatives includes itself`);
      }
    }
  }

  // 10. Boolean fields
  ['stretch_position', 'compound', 'unilateral', 'beginner_friendly'].forEach(field => {
    if (ex[field] !== undefined && typeof ex[field] !== 'boolean') {
      errors.push(`[${label}] ${field} must be boolean, got: ${typeof ex[field]}`);
    }
  });

  // 11. Tier_reason zalecane gdy tier ∈ {S, C}
  if ((ex.tier === 'S' || ex.tier === 'C') && !isNonEmptyString(ex.tier_reason)) {
    warnings.push(`[${label}] tier ${ex.tier} should have tier_reason explaining the rating`);
  }

  return { errors, warnings };
}

// ============================================================================
//  Walidacja całego atlasu
// ============================================================================

/**
 * Waliduje cały atlas (tablica wszystkich ćwiczeń).
 * @param {import('../../data/exercises/_types').Exercise[]} exercises
 * @returns {{
 *   ok: boolean,
 *   errors: string[],
 *   warnings: string[],
 *   stats: {
 *     total: number,
 *     byMuscleGroup: Record<string, number>,
 *     byTier: Record<string, number>,
 *     byRole: Record<string, number>,
 *     byFamily: Record<string, number>,
 *     coverageGaps: string[],
 *   }
 * }}
 */
function validateAtlas(exercises) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(exercises)) {
    return { ok: false, errors: ['Atlas must be an array'], warnings: [], stats: null };
  }

  // Build allIds set for alternatives validation
  const allIds = new Set(exercises.map(e => e.id).filter(Boolean));

  // Check duplicate IDs
  const seenIds = new Set();
  const seenNames = new Set();
  for (const ex of exercises) {
    if (ex.id) {
      if (seenIds.has(ex.id)) {
        errors.push(`Duplicate id: "${ex.id}"`);
      }
      seenIds.add(ex.id);
    }
    if (ex.name) {
      const lower = ex.name.toLowerCase();
      if (seenNames.has(lower)) {
        errors.push(`Duplicate name: "${ex.name}"`);
      }
      seenNames.add(lower);
    }
  }

  // Validate each exercise
  for (const ex of exercises) {
    const result = validateExercise(ex, allIds);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  // ────────────────────────────────────────────────
  //  Statystyki
  // ────────────────────────────────────────────────
  const byMuscleGroup = {};
  const byTier = {};
  const byRole = {};
  const byFamily = {};

  for (const ex of exercises) {
    if (ex.muscle_group) {
      byMuscleGroup[ex.muscle_group] = (byMuscleGroup[ex.muscle_group] || 0) + 1;
    }
    if (ex.tier) byTier[ex.tier] = (byTier[ex.tier] || 0) + 1;
    if (ex.role) byRole[ex.role] = (byRole[ex.role] || 0) + 1;
    if (ex.exercise_family) byFamily[ex.exercise_family] = (byFamily[ex.exercise_family] || 0) + 1;
  }

  // Coverage gaps — które partie nie spełniają minimum
  const coverageGaps = [];
  for (const [mg, min] of Object.entries(MIN_PER_MUSCLE_GROUP)) {
    const actual = byMuscleGroup[mg] || 0;
    if (actual < min) {
      coverageGaps.push(`${mg}: ${actual}/${min}`);
      warnings.push(`Insufficient coverage for ${mg}: ${actual} exercises (minimum ${min})`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      total: exercises.length,
      byMuscleGroup,
      byTier,
      byRole,
      byFamily,
      coverageGaps,
    },
  };
}

/**
 * Pretty-prints raport walidacji do konsoli.
 * @param {ReturnType<typeof validateAtlas>} result
 */
function printReport(result) {
  console.log('\n══════════════════════════════════════════════');
  console.log('  Areté Exercise Atlas — Validation Report');
  console.log('══════════════════════════════════════════════\n');

  if (result.stats) {
    console.log(`TOTAL: ${result.stats.total} exercises\n`);

    console.log('BY MUSCLE GROUP:');
    Object.entries(result.stats.byMuscleGroup)
      .sort((a, b) => b[1] - a[1])
      .forEach(([k, v]) => console.log(`  ${k.padEnd(20)} ${v}`));

    console.log('\nBY TIER:');
    ['S', 'A', 'B', 'C'].forEach(t => {
      const n = result.stats.byTier[t] || 0;
      console.log(`  ${t}: ${n}`);
    });

    console.log('\nBY FAMILY (top 10):');
    Object.entries(result.stats.byFamily)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([k, v]) => console.log(`  ${k.padEnd(25)} ${v}`));

    if (result.stats.coverageGaps.length) {
      console.log('\n⚠ COVERAGE GAPS:');
      result.stats.coverageGaps.forEach(gap => console.log(`  ${gap}`));
    }
  }

  if (result.warnings.length) {
    console.log(`\n⚠ WARNINGS (${result.warnings.length}):`);
    result.warnings.slice(0, 30).forEach(w => console.log(`  ${w}`));
    if (result.warnings.length > 30) {
      console.log(`  ... and ${result.warnings.length - 30} more`);
    }
  }

  if (result.errors.length) {
    console.log(`\n✗ ERRORS (${result.errors.length}):`);
    result.errors.slice(0, 30).forEach(e => console.log(`  ${e}`));
    if (result.errors.length > 30) {
      console.log(`  ... and ${result.errors.length - 30} more`);
    }
  } else {
    console.log('\n✓ NO ERRORS — atlas ready for seed');
  }

  console.log('\n══════════════════════════════════════════════\n');
}

module.exports = {
  validateExercise,
  validateAtlas,
  printReport,
  VALID_TIERS,
  VALID_ROLES,
  VALID_MUSCLE_GROUPS,
};
