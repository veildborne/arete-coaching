/**
 * Areté Exercise Atlas V2 — Seed script
 * 
 * Uruchom PO migracji exercises_atlas_v2.sql:
 *   cd arete
 *   node scripts/seedAtlasV2.js
 * 
 * Co robi:
 *   1. Waliduje atlas (validateAtlas) — przerywa jeśli są errory.
 *   2. Mapuje semantic id → DB record przez upsert on `name`.
 *   3. Istniejące rekordy zachowują UUID (aktywne plany nie pękają).
 *   4. Pola lokalne (cues, setup, common_mistakes) NIE idą do DB.
 *      Idą TYLKO: name, name_pl, aliases, muscle_group, primary_muscles,
 *      secondary_muscles, movement_pattern, equipment, tier, role,
 *      sfr_rating, stretch_position, compound, unilateral,
 *      lower_back_fatigue, joint_risk, beginner_friendly,
 *      progression_type, exercise_family, variant_type, description, tier_reason.
 * 
 * Co NIE robi:
 *   - NIE usuwa starych ćwiczeń (np. legacy "Cable Fly Low" zostaje).
 *   - NIE zmienia UUID-ów (są kluczem dla aktywnych planów).
 *   - NIE modyfikuje training_plans ani training_logs.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const { exercisesCore } = require('../data/exercises');
const { validateAtlas, printReport } = require('../lib/exercises/validate');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Pola, które faktycznie idą do DB. Reszta (cues, setup, mistakes) zostaje lokalnie.
const DB_FIELDS = [
  'name', 'name_pl', 'aliases',
  'muscle_group', 'primary_muscles', 'secondary_muscles',
  'movement_pattern', 'equipment',
  'tier', 'role',
  'sfr_rating', 'stretch_position', 'compound', 'unilateral',
  'lower_back_fatigue', 'joint_risk', 'beginner_friendly',
  'progression_type', 'exercise_family', 'variant_type',
  'description', 'tier_reason',
];

function toDbRecord(exercise) {
  const record = {};
  for (const field of DB_FIELDS) {
    if (exercise[field] !== undefined) {
      record[field] = exercise[field];
    }
  }
  return record;
}

async function seed() {
  console.log('\n══════════════════════════════════════════════');
  console.log('  Areté Exercise Atlas V2 — Seed');
  console.log('══════════════════════════════════════════════\n');

  // 1. Walidacja
  console.log('[1/4] Walidacja atlasu...');
  const validation = validateAtlas(exercisesCore);
  printReport(validation);

  if (!validation.ok) {
    console.error('\n✗ Walidacja nie przeszła. Napraw errory przed seedem.\n');
    process.exit(1);
  }

  // 2. Pre-check: ile ćwiczeń jest już w DB
  console.log('[2/4] Pre-check DB state...');
  const { count: beforeCount, error: countErr } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('Błąd pobierania licznika:', countErr);
    process.exit(1);
  }
  console.log(`  Ćwiczeń w DB przed seedem: ${beforeCount}`);

  // 3. Confirmation prompt (bezpieczeństwo)
  if (process.argv.indexOf('--yes') === -1) {
    console.log(`\nGotów upsertować ${exercisesCore.length} ćwiczeń.`);
    console.log('Aktywne plany nie ucierpią (upsert on name zachowuje UUID-y).');
    console.log('Aby kontynuować, uruchom ponownie z flagą --yes:');
    console.log('  node scripts/seedAtlasV2.js --yes\n');
    process.exit(0);
  }

  // 4. Seed
  console.log(`\n[3/4] Seeding ${exercisesCore.length} exercises...`);
  
  let success = 0;
  let errors = 0;
  const errorList = [];

  // Batch po 50 dla wydajności (Supabase ma soft limit na payload)
  const BATCH_SIZE = 50;
  for (let i = 0; i < exercisesCore.length; i += BATCH_SIZE) {
    const batch = exercisesCore.slice(i, i + BATCH_SIZE).map(toDbRecord);
    
    const { error } = await supabase
      .from('exercises')
      .upsert(batch, { onConflict: 'name' });

    if (error) {
      errors += batch.length;
      errorList.push({ batch: i / BATCH_SIZE, error: error.message });
      console.error(`  ✗ Batch ${i / BATCH_SIZE}: ${error.message}`);
    } else {
      success += batch.length;
      process.stdout.write(`  ✓ Batch ${i / BATCH_SIZE} (${batch.length} ex.) `);
    }
  }
  console.log('\n');

  // 5. Post-check
  console.log('[4/4] Post-check...');
  const { count: afterCount } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true });

  console.log(`  Ćwiczeń w DB po seedzie: ${afterCount}`);
  console.log(`  Delta: +${afterCount - beforeCount}`);
  console.log(`  Success: ${success} / ${exercisesCore.length}`);
  console.log(`  Errors: ${errors}\n`);

  if (errorList.length) {
    console.log('Szczegóły błędów:');
    errorList.forEach(e => console.log(`  Batch ${e.batch}: ${e.error}`));
  }

  console.log('══════════════════════════════════════════════\n');
}

seed().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
