// arete/scripts/auditExercises.js
// Audit before Exercise Atlas refactor — read-only

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function audit() {
  console.log('\n══════════════════════════════════════════════')
  console.log('  ARETÉ — Exercise Atlas Audit')
  console.log('══════════════════════════════════════════════\n')

  // 1) Schema tabeli exercises
  const { data: schema, error: schemaErr } = await supabase
    .rpc('exec_sql', { sql: `
      select column_name, data_type, is_nullable
      from information_schema.columns
      where table_name = 'exercises'
      order by ordinal_position
    `})
    .single()

  if (schemaErr) {
    // Fallback: pobierz jeden rekord i wyciągnij klucze
    const { data: sample } = await supabase
      .from('exercises').select('*').limit(1).single()
    console.log('-- KOLUMNY (z próbki, RPC niedostępne) --')
    if (sample) console.log(Object.keys(sample).join('\n'))
    console.log()
  } else {
    console.log('-- KOLUMNY TABELI exercises --')
    console.log(schema)
    console.log()
  }

  // 2) Liczba i partie
  const { data: exercises, error: exErr } = await supabase
    .from('exercises')
    .select('id, name, name_pl, muscle_group, tier, sfr_rating')
    .order('muscle_group')
    .order('name')

  if (exErr) { console.error('Błąd:', exErr); return }

  console.log(`-- TOTAL: ${exercises.length} ćwiczeń --\n`)

  const byMuscle = {}
  exercises.forEach(e => {
    byMuscle[e.muscle_group] = (byMuscle[e.muscle_group] || 0) + 1
  })
  console.log('-- ROZKŁAD PARTII --')
  Object.entries(byMuscle).sort((a,b) => b[1]-a[1])
    .forEach(([m, n]) => console.log(`  ${m.padEnd(20)} ${n}`))
  console.log()

  // 3) Skala SFR — sprawdź zakres
  const sfrValues = exercises.map(e => e.sfr_rating).filter(v => v != null)
  if (sfrValues.length) {
    const min = Math.min(...sfrValues)
    const max = Math.max(...sfrValues)
    console.log(`-- SFR RANGE: ${min} – ${max} (skala obecna w DB) --\n`)
  }

  // 4) Tiery
  const byTier = {}
  exercises.forEach(e => {
    byTier[e.tier || 'NULL'] = (byTier[e.tier || 'NULL'] || 0) + 1
  })
  console.log('-- ROZKŁAD TIERÓW --')
  Object.entries(byTier).sort().forEach(([t, n]) => console.log(`  ${t}: ${n}`))
  console.log()

  // 5) Lista wszystkich ID
  console.log('-- WSZYSTKIE ID (do mapy old→new) --')
  exercises.forEach(e => {
    console.log(`  ${e.id?.padEnd(40) || '(no id)'} ${e.muscle_group?.padEnd(15)} ${e.name}`)
  })
  console.log()

  // 6) Sprawdź czy istnieje tabela training_logs i ile rekordów
  const { count: logsCount, error: logsErr } = await supabase
    .from('training_logs')
    .select('*', { count: 'exact', head: true })

  if (logsErr) {
    console.log('-- training_logs: BŁĄD lub brak tabeli --')
    console.log(logsErr.message)
  } else {
    console.log(`-- training_logs: ${logsCount} rekordów --`)
  }

  // 7) Sample log — sprawdź strukturę exercises JSONB
  const { data: sampleLog } = await supabase
    .from('training_logs')
    .select('id, exercises')
    .limit(1)
    .single()

  if (sampleLog?.exercises) {
    console.log('\n-- STRUKTURA training_logs.exercises (pierwszy log) --')
    const firstEx = Array.isArray(sampleLog.exercises) ? sampleLog.exercises[0] : null
    if (firstEx) {
      console.log('  Klucze:', Object.keys(firstEx).join(', '))
      console.log('  exercise_id:', firstEx.exercise_id || '(brak pola)')
      console.log('  name:', firstEx.name || '(brak pola)')
    }
  }

  console.log('\n══════════════════════════════════════════════')
  console.log('  Audit zakończony. Wyślij output do Alexa.')
  console.log('══════════════════════════════════════════════\n')
}

audit()
