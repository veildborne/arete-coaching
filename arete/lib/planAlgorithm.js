// ============================================================
// ARETÉ — Plan Algorithm v3.0 — Decision Engine
// Obsługuje nową ankietę v2 (priority_muscles, equipment[],
// pain_areas[], stress_level, sleep_quality, knows_rir)
// ============================================================

// ─── MEV (Minimum Effective Volume) per muscle per staż ───────────────────────
const MEV = {
  chest:          { '0-6 miesięcy': 8,  '6-12 miesięcy': 10, '1-2 lata': 10, '2-3 lata': 12, '3-5 lat': 12, '5+ lat': 14 },
  back:           { '0-6 miesięcy': 10, '6-12 miesięcy': 12, '1-2 lata': 12, '2-3 lata': 14, '3-5 lat': 14, '5+ lat': 16 },
  shoulders_lat:  { '0-6 miesięcy': 6,  '6-12 miesięcy': 8,  '1-2 lata': 8,  '2-3 lata': 10, '3-5 lat': 10, '5+ lat': 12 },
  shoulders_rear: { '0-6 miesięcy': 4,  '6-12 miesięcy': 6,  '1-2 lata': 6,  '2-3 lata': 8,  '3-5 lat': 8,  '5+ lat': 10 },
  biceps:         { '0-6 miesięcy': 6,  '6-12 miesięcy': 8,  '1-2 lata': 8,  '2-3 lata': 10, '3-5 lat': 10, '5+ lat': 12 },
  triceps:        { '0-6 miesięcy': 6,  '6-12 miesięcy': 8,  '1-2 lata': 8,  '2-3 lata': 10, '3-5 lat': 10, '5+ lat': 12 },
  quads:          { '0-6 miesięcy': 8,  '6-12 miesięcy': 10, '1-2 lata': 10, '2-3 lata': 12, '3-5 lat': 12, '5+ lat': 14 },
  hamstrings:     { '0-6 miesięcy': 6,  '6-12 miesięcy': 8,  '1-2 lata': 8,  '2-3 lata': 10, '3-5 lat': 10, '5+ lat': 12 },
  glutes:         { '0-6 miesięcy': 6,  '6-12 miesięcy': 8,  '1-2 lata': 8,  '2-3 lata': 10, '3-5 lat': 12, '5+ lat': 14 },
  calves:         { '0-6 miesięcy': 6,  '6-12 miesięcy': 8,  '1-2 lata': 8,  '2-3 lata': 10, '3-5 lat': 10, '5+ lat': 12 },
  abs:            { '0-6 miesięcy': 6,  '6-12 miesięcy': 8,  '1-2 lata': 8,  '2-3 lata': 10, '3-5 lat': 10, '5+ lat': 12 },
}

// ─── DECISION ENGINE ──────────────────────────────────────────────────────────
// Zamienia odpowiedzi ankiety w parametry planu

function buildDecisionParams(q) {
  // 1. Poziom doświadczenia
  const expMap = {
    '0-6 miesięcy': 'beginner',
    '6-12 miesięcy': 'beginner',
    '1-2 lata': 'intermediate',
    '2-3 lata': 'intermediate',
    '3-5 lat': 'advanced',
    '5+ lat': 'advanced',
  }
  const experience = expMap[q.staz] || 'intermediate'

  // 2. Recovery capacity (0.7 - 1.0)
  let recoveryModifier = 1.0
  const sleepHours = q.sen
  const sleepQuality = parseInt(q.sleep_quality) || 3
  const stressLevel = parseInt(q.stress_level) || 3
  const isPhysicalJob = q.praca === 'physical'

  if (sleepHours === 'less_6') recoveryModifier -= 0.15
  else if (sleepHours === '6_7') recoveryModifier -= 0.05
  else if (sleepHours === 'more_8') recoveryModifier += 0.05

  if (sleepQuality <= 2) recoveryModifier -= 0.10
  else if (sleepQuality >= 4) recoveryModifier += 0.05

  if (stressLevel >= 4) recoveryModifier -= 0.15
  else if (stressLevel >= 3) recoveryModifier -= 0.05

  if (isPhysicalJob) recoveryModifier -= 0.10

  recoveryModifier = Math.max(0.65, Math.min(1.15, recoveryModifier))

  // 3. Priorytety mięśniowe (nowa ankieta = tablica, stara = tekst)
  let priorityMuscles = []
  let avoidMuscles = []

  if (Array.isArray(q.priority_muscles)) {
    priorityMuscles = q.priority_muscles
  } else if (q.priorytetowe_partie) {
    // fallback stara ankieta
    const PRIORITY_MAP = {
      'pośladki': 'glutes', 'plecy': 'back', 'barki': 'shoulders_lat',
      'klatka': 'chest', 'nogi': 'quads', 'uda': 'hamstrings',
      'biceps': 'biceps', 'triceps': 'triceps', 'brzuch': 'abs', 'łydki': 'calves',
    }
    const lower = q.priorytetowe_partie.toLowerCase()
    priorityMuscles = Object.entries(PRIORITY_MAP)
      .filter(([key]) => lower.includes(key))
      .map(([, val]) => val)
      .filter((v, i, arr) => arr.indexOf(v) === i)
  }

  if (Array.isArray(q.avoid_growth_muscles)) {
    avoidMuscles = q.avoid_growth_muscles
  }

  // 4. Sprzęt (nowa ankieta = tablica, stara = tekst)
  let equipment = new Set(['bodyweight'])
  if (Array.isArray(q.equipment) && q.equipment.length > 0) {
    q.equipment.forEach(e => equipment.add(e))
    // Inferencja: jeśli ma sztangę → ma też hantle (zazwyczaj)
    if (equipment.has('barbell')) equipment.add('dumbbell')
  } else {
    // Fallback stara ankieta
    const miejsce = (q.miejsce_treningu || '').toLowerCase()
    if (miejsce.includes('pełna') || miejsce.includes('full')) {
      ['barbell','dumbbell','cable','machine','squat_rack','lat_pulldown','leg_press','leg_extension','leg_curl'].forEach(e => equipment.add(e))
    } else if (miejsce.includes('podstawowa')) {
      ['barbell','dumbbell','squat_rack'].forEach(e => equipment.add(e))
    } else if (miejsce.includes('dom') && miejsce.includes('pełne')) {
      ['barbell','dumbbell','cable'].forEach(e => equipment.add(e))
    } else if (miejsce.includes('dom') && miejsce.includes('hantle')) {
      equipment.add('dumbbell')
    }
  }

  // 5. Kontuzje i wykluczenia ćwiczeń
  const painAreas = Array.isArray(q.pain_areas) ? q.pain_areas : []
  const painLevel = parseInt(q.pain_level) || 0
  const excludedMovements = []

  if (painAreas.includes('shoulder') || painAreas.includes('bark')) {
    if (painLevel >= 4) excludedMovements.push('overhead_press', 'upright_row')
    if (painLevel >= 6) excludedMovements.push('bench_press_barbell', 'dips')
  }
  if (painAreas.includes('knee') || painAreas.includes('kolano')) {
    if (painLevel >= 4) excludedMovements.push('barbell_squat', 'lunge')
    if (painLevel >= 6) excludedMovements.push('leg_extension')
  }
  if (painAreas.includes('lower_back') || painAreas.includes('kręgosłup')) {
    if (painLevel >= 4) excludedMovements.push('conventional_deadlift', 'good_morning')
    if (painLevel >= 6) excludedMovements.push('romanian_deadlift', 'barbell_row')
  }
  if (painAreas.includes('elbow') || painAreas.includes('łokieć')) {
    if (painLevel >= 5) excludedMovements.push('dips', 'close_grip_bench')
  }

  // 6. Cardio interference (wpływ cardio na objętość nóg)
  let cardioFactor = 1.0
  const cardioIle = (q.cardio_ile || '').toLowerCase()
  const cardioMatch = cardioIle.match(/(\d+)/)
  const cardioSessions = cardioMatch ? parseInt(cardioMatch[1]) : 0
  if (cardioSessions >= 4) cardioFactor = 0.80
  else if (cardioSessions >= 2) cardioFactor = 0.90

  // 7. Optymalny split per dane
  const days = parseInt(q.dni_tydzien) || 3
  const splitType = chooseSplit(days, priorityMuscles, q.plec, recoveryModifier, experience)

  return {
    experience,
    recoveryModifier,
    priorityMuscles,
    avoidMuscles,
    equipment,
    painAreas,
    painLevel,
    excludedMovements,
    cardioFactor,
    days,
    splitType,
    knowsRir: q.knows_rir === true || q.knows_rir === 'true',
    goal: q.cel || 'Budowa masy mięśniowej',
    staz: q.staz || '1-2 lata',
    plec: q.plec || 'Mężczyzna',
    avoidExercises: parseAvoidedExercises(q.cwiczenia_unikane),
    preferenceMachines: q.preference_machines || 'mixed',
  }
}

function parseAvoidedExercises(text) {
  if (!text) return []
  return text.toLowerCase().split(/[,;\n]/).map(s => s.trim()).filter(Boolean)
}

// ─── WYBÓR SPLITU ─────────────────────────────────────────────────────────────

function chooseSplit(days, priorityMuscles, plec, recoveryModifier, experience) {
  const isLowRecovery = recoveryModifier < 0.85
  const hasGlutePriority = priorityMuscles.includes('glutes') || priorityMuscles.includes('hamstrings')
  const isKobieta = plec === 'Kobieta'
  const isBeginner = experience === 'beginner'

  if (days === 2) return 'fullbody_2'

  if (days === 3) {
    if ((isKobieta || hasGlutePriority) && !isBeginner) return 'lower_upper_lower'
    return 'fullbody_3'
  }

  if (days === 4) {
    if (isKobieta && hasGlutePriority) return 'glute_upper_lower_upper'
    return 'upper_lower_4'
  }

  if (days === 5) {
    if (isLowRecovery) return 'upper_lower_4' // degraduj do 4 dni
    if (isKobieta && hasGlutePriority) return 'ppl_glute_5'
    return 'ppl_5'
  }

  if (days >= 6) {
    if (isLowRecovery || isBeginner) return 'ppl_5' // degraduj
    return 'ppl_6'
  }

  return 'fullbody_3'
}

// ─── STRUKTURY SPLITÓW ────────────────────────────────────────────────────────

const SPLIT_STRUCTURES = {
  fullbody_2: {
    name: 'Full Body x2',
    sessions: {
      A: { name: 'Full Body A', muscles: ['quads', 'chest', 'back', 'shoulders_lat', 'biceps'] },
      B: { name: 'Full Body B', muscles: ['hamstrings', 'glutes', 'back', 'chest', 'triceps'] },
    }
  },
  fullbody_3: {
    name: 'Full Body x3',
    sessions: {
      A: { name: 'Full Body A', muscles: ['quads', 'chest', 'shoulders_lat', 'triceps'] },
      B: { name: 'Full Body B', muscles: ['hamstrings', 'glutes', 'back', 'biceps'] },
      C: { name: 'Full Body C', muscles: ['quads', 'glutes', 'back', 'chest', 'shoulders_rear', 'abs'] },
    }
  },
  lower_upper_lower: {
    name: 'Lower / Upper / Lower (Glute Focus)',
    sessions: {
      A: { name: 'Lower — Glute & Quad', muscles: ['glutes', 'quads', 'hamstrings', 'calves'] },
      B: { name: 'Upper', muscles: ['back', 'chest', 'shoulders_lat', 'biceps', 'triceps'] },
      C: { name: 'Lower — Glute & Ham', muscles: ['glutes', 'hamstrings', 'quads', 'abs'] },
    }
  },
  upper_lower_4: {
    name: 'Upper / Lower x2',
    sessions: {
      A: { name: 'Upper A', muscles: ['chest', 'back', 'shoulders_lat', 'biceps'] },
      B: { name: 'Lower A', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
      C: { name: 'Upper B', muscles: ['chest', 'back', 'shoulders_rear', 'triceps'] },
      D: { name: 'Lower B', muscles: ['glutes', 'hamstrings', 'quads', 'abs'] },
    }
  },
  glute_upper_lower_upper: {
    name: 'Glute / Upper / Lower / Upper (Women Glute Focus)',
    sessions: {
      A: { name: 'Glute Focus', muscles: ['glutes', 'hamstrings', 'calves'] },
      B: { name: 'Upper A', muscles: ['back', 'chest', 'shoulders_lat', 'biceps'] },
      C: { name: 'Lower', muscles: ['quads', 'glutes', 'hamstrings', 'abs'] },
      D: { name: 'Upper B', muscles: ['back', 'shoulders_rear', 'triceps', 'shoulders_lat'] },
    }
  },
  ppl_5: {
    name: 'Push / Pull / Legs x1.5',
    sessions: {
      A: { name: 'Push', muscles: ['chest', 'shoulders_lat', 'triceps'] },
      B: { name: 'Pull', muscles: ['back', 'biceps', 'shoulders_rear'] },
      C: { name: 'Legs', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
      D: { name: 'Push B', muscles: ['chest', 'shoulders_lat', 'triceps'] },
      E: { name: 'Pull B + Abs', muscles: ['back', 'biceps', 'abs'] },
    }
  },
  ppl_glute_5: {
    name: 'PPL + Glute Focus (Women)',
    sessions: {
      A: { name: 'Lower — Glute', muscles: ['glutes', 'hamstrings', 'calves'] },
      B: { name: 'Upper Push', muscles: ['chest', 'shoulders_lat', 'triceps'] },
      C: { name: 'Lower — Quad + Glute', muscles: ['quads', 'glutes', 'abs'] },
      D: { name: 'Upper Pull', muscles: ['back', 'biceps', 'shoulders_rear'] },
      E: { name: 'Lower — Full', muscles: ['glutes', 'hamstrings', 'quads', 'calves'] },
    }
  },
  ppl_6: {
    name: 'PPL x2',
    sessions: {
      A: { name: 'Push A', muscles: ['chest', 'shoulders_lat', 'triceps'] },
      B: { name: 'Pull A', muscles: ['back', 'biceps', 'shoulders_rear'] },
      C: { name: 'Legs A', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
      D: { name: 'Push B', muscles: ['chest', 'shoulders_lat', 'triceps'] },
      E: { name: 'Pull B', muscles: ['back', 'biceps', 'abs'] },
      F: { name: 'Legs B', muscles: ['glutes', 'hamstrings', 'quads'] },
    }
  },
}

// ─── OBJĘTOŚĆ ─────────────────────────────────────────────────────────────────

function getWeeklyVolume(muscle, staz, isPriority, isAvoid, recoveryModifier) {
  const base = MEV[muscle]?.[staz] ?? 8
  let sets = base

  if (isPriority) sets = Math.min(base + 6, 22)
  if (isAvoid) sets = Math.max(4, Math.round(base * 0.5))

  // Recovery modifier
  sets = Math.round(sets * recoveryModifier)

  return Math.max(4, sets)
}

function getSetsPerSession(muscle, staz, isPriority, isAvoid, sessionsThisWeek, recoveryModifier, cardioFactor) {
  const weekly = getWeeklyVolume(muscle, staz, isPriority, isAvoid, recoveryModifier)
  let perSession = Math.max(2, Math.round(weekly / sessionsThisWeek))

  // Cardio interference dla nóg
  if (['quads','hamstrings','glutes','calves'].includes(muscle)) {
    perSession = Math.round(perSession * cardioFactor)
  }

  return Math.max(2, perSession)
}

// ─── SCORING ĆWICZEŃ ──────────────────────────────────────────────────────────

function scoreExercise(ex, params, muscle) {
  let score = 0
  const { experience, priorityMuscles, avoidMuscles, equipment, painAreas,
          painLevel, excludedMovements, goal, plec, preferenceMachines } = params

  // Tier base
  const tierScore = { S: 30, A: 20, B: 10 }
  score += tierScore[ex.tier] ?? 10

  // SFR rating
  score += (ex.sfr_rating ?? 5) * 2

  // Stretch position bonus (Milo Wolf 2023) — tylko dla hipertrofii
  if (ex.stretch_position && goal !== 'Wzrost siły') score += 8

  // Priority muscle bonus
  if (priorityMuscles.includes(muscle)) score += 15

  // Avoid muscle penalty
  if (avoidMuscles.includes(muscle)) score -= 20

  // Sprzęt — match
  if (ex.equipment && ex.equipment.length > 0) {
    const hasEquip = ex.equipment.some(e => equipment.has(e))
    if (!hasEquip) return -999 // wyklucz
  }

  // Maszyny vs wolne ciężary preferencja
  const isMachine = ex.equipment?.some(e => ['machine','leg_press','leg_extension','leg_curl','hip_thrust_machine','pec_deck','lat_pulldown','seated_row','abductor'].includes(e))
  if (preferenceMachines === 'machines' && isMachine) score += 10
  if (preferenceMachines === 'free_weights' && !isMachine) score += 10

  // Beginner friendly
  if (experience === 'beginner') {
    if (ex.beginner_friendly === false) score -= 15
    if (ex.compound && ex.tier === 'B') score -= 10
  }

  // Ból / kontuzje
  if (painLevel >= 4) {
    if (excludedMovements.some(m => ex.movement_pattern === m || ex.name.toLowerCase().includes(m))) {
      return -999
    }
  }
  if (painAreas.includes('lower_back') && ex.lower_back_fatigue === 'high') {
    score -= 20
  }
  if (painAreas.includes('shoulder') && ex.joint_risk === 'high' && painLevel >= 3) {
    score -= 25
  }

  // Cel — siła preferuje compound
  if (goal === 'Wzrost siły' && ex.compound) score += 15
  if (goal === 'Redukcja tkanki tłuszczowej' && ex.rep_range_max >= 15) score += 5

  // Płeć — kobiety dostają bonus na ćwiczenia glute/ham
  if (plec === 'Kobieta' && ['glutes','hamstrings'].includes(muscle)) {
    if (ex.stretch_position) score += 5
  }

  return score
}

function pickExercises(exercises, muscle, count, params) {
  const { avoidExercises } = params

  const scored = exercises
    .filter(ex => ex.muscle_group === muscle)
    .filter(ex => {
      if (!avoidExercises || avoidExercises.length === 0) return true
      const nameL = (ex.name_pl || ex.name || '').toLowerCase()
      return !avoidExercises.some(av => nameL.includes(av))
    })
    .map(ex => ({ ex, score: scoreExercise(ex, params, muscle) }))
    .filter(({ score }) => score > -900)
    .sort((a, b) => b.score - a.score)
    .map(({ ex }) => ex)

  return scored.slice(0, count)
}

// ─── PROGRESJA ────────────────────────────────────────────────────────────────

function getProgression(staz, isCompound, knowsRir) {
  const beginner = ['0-6 miesięcy', '6-12 miesięcy']
  const intermediate = ['1-2 lata', '2-3 lata']
  if (beginner.includes(staz)) {
    return isCompound ? '+2.5 kg / tydzień' : '+1.25 kg / tydzień'
  }
  if (intermediate.includes(staz)) {
    return isCompound ? '+2.5 kg / 1-2 tyg.' : '+1.25 kg / 1-2 tyg.'
  }
  return isCompound ? '+2.5 kg / 2-3 tyg.' : '+1.25 kg / 2-3 tyg.'
}

function getRepRange(goal, isCompound, knowsRir) {
  if (goal === 'Wzrost siły') return isCompound ? '3-6' : '6-8'
  if (goal === 'Redukcja tkanki tłuszczowej') return isCompound ? '8-12' : '12-20'
  if (goal === 'Zdrowie i sprawność ogólna') return '10-15'
  return isCompound ? '6-10' : '10-15'
}

function getRIR(goal, week, knowsRir) {
  if (!knowsRir) {
    // Dla klientów bez RIR — prostsza progresja
    if (week <= 2) return '3-4'
    if (week <= 4) return '2-3'
    if (week === 5) return '1-2'
    return '4-5' // deload
  }
  if (goal === 'Wzrost siły') return Math.max(0, 3 - Math.floor(week / 2))
  return Math.max(0, 4 - Math.floor(week / 2))
}

// ─── UZASADNIENIE PLANU ───────────────────────────────────────────────────────

function generateRationale(params, splitDef) {
  const { experience, recoveryModifier, priorityMuscles, avoidMuscles,
          days, goal, plec, knowsRir, painAreas } = params

  const lines = []

  lines.push(`Split: ${splitDef.name} — ${days} dni treningowych.`)

  if (recoveryModifier < 0.85) {
    lines.push('Objętość zredukowana — wykryto ograniczoną regenerację (sen, stres, praca fizyczna).')
  } else if (recoveryModifier > 1.0) {
    lines.push('Dobra regeneracja — objętość lekko zwiększona.')
  }

  if (priorityMuscles.length > 0) {
    lines.push(`Priorytet: ${priorityMuscles.join(', ')} — więcej serii i lepsze ćwiczenia dla tych partii.`)
  }

  if (avoidMuscles.length > 0) {
    lines.push(`Partie do nierozbudowywania: ${avoidMuscles.join(', ')} — zredukowana objętość.`)
  }

  if (painAreas.length > 0) {
    lines.push(`Kontuzje/ból (${painAreas.join(', ')}) — wykluczone ryzykowne ćwiczenia.`)
  }

  if (!knowsRir) {
    lines.push('RIR zastąpiony prostszymi wskazówkami intensywności — klient uczy się oceny.')
  }

  if (experience === 'beginner') {
    lines.push('Plan dostosowany dla początkujących — niższy starting volume, prostsze wzorce ruchowe.')
  }

  return lines.join(' ')
}

// ─── GŁÓWNA FUNKCJA ───────────────────────────────────────────────────────────

export function generatePlan(questionnaire, exercises) {
  const q = questionnaire?.data || {}
  const params = buildDecisionParams(q)
  const splitDef = SPLIT_STRUCTURES[params.splitType]

  if (!splitDef) {
    throw new Error(`Unknown split type: ${params.splitType}`)
  }

  // Zlicz ile razy każda partia pojawia się w tygodniu
  const muscleFrequency = {}
  Object.values(splitDef.sessions).forEach(session => {
    session.muscles.forEach(muscle => {
      muscleFrequency[muscle] = (muscleFrequency[muscle] || 0) + 1
    })
  })

  // Zbuduj sesje
  const sessions = {}
  Object.entries(splitDef.sessions).forEach(([sessionKey, sessionDef]) => {
    const usedExercises = new Set()

    sessions[sessionKey] = {
      label: sessionKey,
      name: sessionDef.name,
      exercises: sessionDef.muscles.flatMap(muscle => {
        const isPriority = params.priorityMuscles.includes(muscle)
        const isAvoid = params.avoidMuscles.includes(muscle)
        const freq = muscleFrequency[muscle] || 1
        const sets = getSetsPerSession(
          muscle, params.staz, isPriority, isAvoid,
          freq, params.recoveryModifier, params.cardioFactor
        )

        const exCount = ['abs','calves','shoulders_rear'].includes(muscle) ? 1
          : sets >= 10 ? 2
          : 1

        const picked = pickExercises(
          exercises.filter(e => !usedExercises.has(e.name)),
          muscle, exCount, params
        )

        picked.forEach(ex => usedExercises.add(ex.name))

        return picked.map((ex, idx) => ({
          exercise_id: ex.id,
          name: ex.name,
          name_pl: ex.name_pl,
          muscle_group: muscle,
          sets: idx === 0 ? sets : Math.max(2, Math.round(sets * 0.5)),
          rep_range: getRepRange(params.goal, ex.compound, params.knowsRir),
          rir_target: getRIR(params.goal, 1, params.knowsRir),
          progression: getProgression(params.staz, ex.compound, params.knowsRir),
          stretch_priority: ex.stretch_position && params.goal !== 'Wzrost siły',
          note: [
            isPriority ? '★ priorytet' : '',
            isAvoid ? '↓ maintenance' : '',
            ex.stretch_position && params.goal !== 'Wzrost siły' ? '↔ stretch' : '',
            params.cardioFactor < 1 && ['quads','hamstrings','glutes','calves'].includes(muscle)
              ? '⚠ cardio interference' : '',
          ].filter(Boolean).join(' · '),
        }))
      })
    }
  })

  // Deload (tydzień 6)
  const deloadSessions = {}
  Object.entries(sessions).forEach(([key, session]) => {
    deloadSessions[key] = {
      ...session,
      isDeload: true,
      exercises: session.exercises.map(ex => ({
        ...ex,
        sets: Math.max(2, Math.round(ex.sets * 0.6)),
        rir_target: params.knowsRir ? 4 : '5',
        note: (ex.note ? ex.note + ' · ' : '') + '🔄 deload',
      }))
    }
  })

  // Progresja tygodniowa
  const weeklyProgression = Array.from({ length: 6 }, (_, i) => ({
    week: i + 1,
    rir: getRIR(params.goal, i + 1, params.knowsRir),
    isDeload: i === 5,
    label: i === 5 ? 'Deload' : `Tydzień ${i + 1}`,
  }))

  return {
    split_name: splitDef.name,
    split_type: params.splitType,
    days: params.days,
    goal: params.goal,
    staz: params.staz,
    experience: params.experience,
    recovery_modifier: params.recoveryModifier,
    priority_muscles: params.priorityMuscles,
    avoid_muscles: params.avoidMuscles,
    mesocycle_weeks: 6,
    sessions,
    deload_sessions: deloadSessions,
    weekly_progression: weeklyProgression,
    equipment_used: Array.from(params.equipment),
    cardio_factor: params.cardioFactor,
    rationale: generateRationale(params, splitDef),
    generated_at: new Date().toISOString(),
  }
}
