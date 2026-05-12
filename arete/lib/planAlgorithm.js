// ============================================================
// ARETÉ — Plan Algorithm v5.0
// ============================================================
// Evidence:
//   Israetel — MEV/MAV/MRV, frequency, deload, volume ramp
//   Helms    — RIR periodization, autoregulation
//   Schoenfeld — hypertrophy mechanisms, rep ranges
//   Nuckols  — volume-frequency tradeoffs
//   Zourdos  — RPE/RIR in practice
// ============================================================

// ─── VOLUME LANDMARKS (weekly sets per muscle) ────────────────────────────────
const VOLUME_LANDMARKS = {
  chest:          { beginner:{mev:8, mav:14,mrv:18}, intermediate:{mev:10,mav:16,mrv:20}, advanced:{mev:12,mav:18,mrv:22} },
  back:           { beginner:{mev:10,mav:15,mrv:20}, intermediate:{mev:12,mav:18,mrv:22}, advanced:{mev:14,mav:20,mrv:25} },
  shoulders_lat:  { beginner:{mev:6, mav:10,mrv:14}, intermediate:{mev:8, mav:12,mrv:16}, advanced:{mev:10,mav:14,mrv:20} },
  shoulders_rear: { beginner:{mev:6, mav:10,mrv:14}, intermediate:{mev:8, mav:12,mrv:16}, advanced:{mev:10,mav:14,mrv:18} },
  biceps:         { beginner:{mev:6, mav:10,mrv:14}, intermediate:{mev:8, mav:12,mrv:16}, advanced:{mev:10,mav:14,mrv:18} },
  triceps:        { beginner:{mev:6, mav:10,mrv:14}, intermediate:{mev:8, mav:12,mrv:16}, advanced:{mev:10,mav:14,mrv:18} },
  quads:          { beginner:{mev:8, mav:14,mrv:18}, intermediate:{mev:10,mav:16,mrv:20}, advanced:{mev:12,mav:18,mrv:22} },
  hamstrings:     { beginner:{mev:6, mav:10,mrv:14}, intermediate:{mev:8, mav:12,mrv:16}, advanced:{mev:10,mav:14,mrv:18} },
  glutes:         { beginner:{mev:6, mav:12,mrv:16}, intermediate:{mev:8, mav:14,mrv:20}, advanced:{mev:10,mav:16,mrv:22} },
  calves:         { beginner:{mev:6, mav:10,mrv:14}, intermediate:{mev:8, mav:12,mrv:16}, advanced:{mev:10,mav:14,mrv:20} },
  abs:            { beginner:{mev:6, mav:10,mrv:14}, intermediate:{mev:8, mav:12,mrv:16}, advanced:{mev:10,mav:14,mrv:18} },
  forearms:       { beginner:{mev:4, mav:8, mrv:12}, intermediate:{mev:6, mav:10,mrv:14}, advanced:{mev:8, mav:12,mrv:16} },
}

// ─── SESSION SET CAPS (max hard sets per muscle per session) ──────────────────
const MUSCLE_SIZE_CLASS = {
  chest:'large', back:'large', quads:'large', hamstrings:'large', glutes:'large',
  shoulders_lat:'medium', shoulders_rear:'medium',
  biceps:'small', triceps:'small', calves:'small', abs:'small', forearms:'small',
}
const SESSION_CAPS = { large:6, medium:5, small:4 }

// ─── RIR PROGRESSION per week index 0-5 (Helms periodization) ────────────────
const RIR_BY_WEEK = {
  beginner:     [3, 3, 2, 2, 2, 5],
  intermediate: [3, 2, 2, 1, 1, 5],
  advanced:     [2, 2, 1, 1, 0, 5],
}

// ─── REP RANGES (Schoenfeld: sweet spot 6-20, per muscle/goal) ───────────────
function getRepRange(goal, muscle) {
  const isHeavy = ['quads','chest','back','hamstrings','glutes'].includes(muscle)
  const isLight = ['calves','abs','shoulders_rear','forearms'].includes(muscle)

  if (goal === 'Wzrost siły')                   return isHeavy ? '3-6'  : '6-10'
  if (goal === 'Redukcja tkanki tłuszczowej')   return isHeavy ? '8-12' : isLight ? '15-25' : '10-20'
  // Hypertrophy / Recomp / Health
  if (muscle === 'forearms') return '12-20'
  if (isHeavy) return '6-12'
  if (isLight) return '12-20'
  return '8-15'
}

// ─── DECISION ENGINE ──────────────────────────────────────────────────────────
function buildDecisionParams(q) {
  const expMap = {
    '0-6 miesięcy': 'beginner',
    '6-12 miesięcy': 'beginner',
    '1-2 lata':     'intermediate',
    '2-3 lata':     'advanced',
    '3-5 lat':      'advanced',
    '5+ lat':       'advanced',
  }
  const experience = expMap[q.staz] || 'intermediate'

  // Recovery modifier — affects starting volume
  let recoveryModifier = 1.0
  if (q.sen === 'less_6')   recoveryModifier -= 0.15
  else if (q.sen === '6_7') recoveryModifier -= 0.05
  else if (q.sen === 'more_8') recoveryModifier += 0.05
  const sleepQ = parseInt(q.sleep_quality) || 3
  const stress  = parseInt(q.stress_level)  || 3
  if (sleepQ <= 2) recoveryModifier -= 0.10
  else if (sleepQ >= 4) recoveryModifier += 0.05
  if (stress >= 4) recoveryModifier -= 0.15
  else if (stress >= 3) recoveryModifier -= 0.05
  if (q.praca === 'physical') recoveryModifier -= 0.10
  recoveryModifier = Math.max(0.65, Math.min(1.15, recoveryModifier))

  // Priority / avoid muscles
  let priorityMuscles = []
  let avoidMuscles = []
  if (Array.isArray(q.priority_muscles)) {
    priorityMuscles = q.priority_muscles
  } else if (q.priorytetowe_partie) {
    const MAP = {'pośladki':'glutes','plecy':'back','barki':'shoulders_lat','klatka':'chest','nogi':'quads','uda':'hamstrings','biceps':'biceps','triceps':'triceps','brzuch':'abs','łydki':'calves'}
    const low = q.priorytetowe_partie.toLowerCase()
    priorityMuscles = Object.entries(MAP).filter(([k])=>low.includes(k)).map(([,v])=>v).filter((v,i,a)=>a.indexOf(v)===i)
  }
  if (Array.isArray(q.avoid_growth_muscles)) avoidMuscles = q.avoid_growth_muscles

  // Equipment
  let equipment = new Set(['bodyweight'])
  if (Array.isArray(q.equipment) && q.equipment.length > 0) {
    q.equipment.forEach(e => equipment.add(e))
    if (equipment.has('barbell')) equipment.add('dumbbell')
  } else {
    const miejsce = (q.miejsce_treningu || '').toLowerCase()
    if (miejsce.includes('pełna') || miejsce.includes('full'))
      ['barbell','dumbbell','cable','machine','squat_rack','lat_pulldown','leg_press','leg_extension','leg_curl'].forEach(e=>equipment.add(e))
    else if (miejsce.includes('podstawowa'))
      ['barbell','dumbbell','squat_rack'].forEach(e=>equipment.add(e))
  }

  // Pain / injury exclusions
  const painAreas = Array.isArray(q.pain_areas) ? q.pain_areas : []
  const painLevel = parseInt(q.pain_level) || 0
  const excludedMovements = []
  if (painAreas.includes('shoulder') && painLevel >= 4) excludedMovements.push('overhead_press','upright_row')
  if (painAreas.includes('shoulder') && painLevel >= 6) excludedMovements.push('push','dips')
  if (painAreas.includes('knee')     && painLevel >= 4) excludedMovements.push('squat','lunge')
  if (painAreas.includes('knee')     && painLevel >= 6) excludedMovements.push('isolation')
  if (painAreas.includes('lower_back')&& painLevel >= 4) excludedMovements.push('hinge')
  if (painAreas.includes('lower_back')&& painLevel >= 6) excludedMovements.push('row')
  if (painAreas.includes('elbow')    && painLevel >= 5) excludedMovements.push('close_grip_bench','wrist_curl')
  if (painAreas.includes('wrist')    && painLevel >= 4) excludedMovements.push('wrist_curl')

  // Cardio interference on lower body
  let cardioFactor = 1.0
  const cardioMatch = (q.cardio_ile || '').match(/(\d+)/)
  const cardioSessions = cardioMatch ? parseInt(cardioMatch[1]) : 0
  if (cardioSessions >= 4) cardioFactor = 0.80
  else if (cardioSessions >= 2) cardioFactor = 0.90

  const days = parseInt(q.dni_tydzien) || 3
  const sessionMinutes = parseInt((q.czas_sesji || '').replace(/\D/g, '')) || 60
  const splitType = chooseSplit(days, priorityMuscles, q.plec, recoveryModifier, experience, sessionMinutes)

  // Unilateral preference — triggered by dysproporcja in questionnaire
  const dysproporcja = Array.isArray(q.dysproporcja_obszar) ? q.dysproporcja_obszar : []
  const preferUnilateral = dysproporcja.some(d => ['left_arm','right_arm','shoulders'].includes(d))
    ? ['back','biceps','triceps','shoulders_lat','shoulders_rear','chest']
    : []
  const preferUnilateralLegs = dysproporcja.some(d => ['left_leg','right_leg'].includes(d))
    ? ['quads','hamstrings','glutes','calves']
    : []

  // Training style — affects exercise count per muscle
  const trainingStyle = q.training_style || 'balanced' // 'simple' | 'balanced' | 'varied'

  return {
    experience, recoveryModifier, priorityMuscles, avoidMuscles,
    equipment, painAreas, painLevel, excludedMovements, cardioFactor,
    days, splitType,
    knowsRir: q.knows_rir === true || q.knows_rir === 'true',
    goal: q.cel || 'Budowa masy mięśniowej',
    staz: q.staz || '1-2 lata',
    plec: q.plec || 'Mężczyzna',
    avoidExercises: parseAvoidedExercises(q.cwiczenia_unikane),
    preferenceMachines: q.preference_machines || 'mixed',
    sessionMinutes,
    trainingStyle,
    preferUnilateral,
    preferUnilateralLegs,
  }
}

function parseAvoidedExercises(text) {
  if (!text) return []
  return text.toLowerCase().split(/[,;\n]/).map(s=>s.trim()).filter(Boolean)
}

// ─── SPLIT SELECTION ──────────────────────────────────────────────────────────
function chooseSplit(days, priorityMuscles, plec, recoveryModifier, experience, sessionMinutes) {
  const isLowRecovery    = recoveryModifier < 0.85
  const hasGlutePriority = priorityMuscles.includes('glutes') || priorityMuscles.includes('hamstrings')
  const isKobieta        = plec === 'Kobieta'
  const isBeginner       = experience === 'beginner'
  const isShortSession   = sessionMinutes <= 60
  const isMediumSession  = sessionMinutes > 60 && sessionMinutes <= 75
  const isLongSession    = sessionMinutes > 75

  if (days === 2) return 'fullbody_2'

  if (days === 3) {
    if (isBeginner) return 'fullbody_3'
    // Krótka sesja (<=60 min) → zawsze FBW niezależnie od płci/priorytetu
    if (isShortSession) return 'fullbody_3'
    // Średnia sesja (60-75 min) → LUL tylko gdy glute priority + kobieta
    if (isMediumSession) {
      if (isKobieta && hasGlutePriority) return 'lower_upper_lower'
      return 'fullbody_3'
    }
    // Długa sesja (>75 min) → LUL gdy glute priority
    if (isLongSession) {
      if (hasGlutePriority) return 'lower_upper_lower'
      return 'fullbody_3'
    }
    return 'fullbody_3'
  }

  if (days === 4) {
    if (isShortSession && isBeginner) return 'fullbody_3'
    if (isKobieta && hasGlutePriority) return 'glute_upper_lower_upper'
    return 'upper_lower_4'
  }

  if (days === 5) {
    if (isLowRecovery) return 'upper_lower_4'
    if (isShortSession) return 'upper_lower_4'
    return isKobieta && hasGlutePriority ? 'ppl_glute_5' : 'ppl_5'
  }

  if (days >= 6) {
    if (isLowRecovery || isBeginner || isShortSession) return 'ppl_5'
    return 'ppl_6'
  }

  return 'fullbody_3'
}

// ─── SPLIT STRUCTURES ─────────────────────────────────────────────────────────
const SPLIT_STRUCTURES = {
  fullbody_2: {
    name: 'Full Body x2',
    sessions: {
      A: { name:'Full Body A', muscles:['quads','chest','back','shoulders_lat','biceps'] },
      B: { name:'Full Body B', muscles:['hamstrings','glutes','back','chest','triceps'] },
    }
  },
  fullbody_3: {
    name: 'Full Body x3',
    sessions: {
      A: { name:'Full Body A', muscles:['quads','chest','shoulders_lat','triceps'] },
      B: { name:'Full Body B', muscles:['hamstrings','glutes','back','biceps'] },
      C: { name:'Full Body C', muscles:['quads','glutes','back','chest','shoulders_rear','abs'] },
    }
  },
  lower_upper_lower: {
    name: 'Lower / Upper / Lower (Glute Focus)',
    sessions: {
      A: { name:'Lower — Glute & Quad', muscles:['glutes','quads','hamstrings','calves'] },
      B: { name:'Upper', muscles:['back','chest','shoulders_lat','biceps','triceps'] },
      C: { name:'Lower — Glute & Ham', muscles:['glutes','hamstrings','quads','abs'] },
    }
  },
  upper_lower_4: {
    name: 'Upper / Lower x2',
    sessions: {
      A: { name:'Upper A', muscles:['chest','back','shoulders_lat','biceps'] },
      B: { name:'Lower A', muscles:['quads','hamstrings','glutes','calves'] },
      C: { name:'Upper B', muscles:['chest','back','shoulders_rear','triceps'] },
      D: { name:'Lower B', muscles:['glutes','hamstrings','quads','abs'] },
    }
  },
  glute_upper_lower_upper: {
    name: 'Glute / Upper / Lower / Upper',
    sessions: {
      A: { name:'Glute Focus',  muscles:['glutes','hamstrings','calves'] },
      B: { name:'Upper A',      muscles:['back','chest','shoulders_lat','biceps'] },
      C: { name:'Lower',        muscles:['quads','glutes','hamstrings','abs'] },
      D: { name:'Upper B',      muscles:['back','shoulders_rear','triceps','shoulders_lat'] },
    }
  },
  ppl_5: {
    name: 'Push / Pull / Legs x1.5',
    sessions: {
      A: { name:'Push',         muscles:['chest','shoulders_lat','triceps'] },
      B: { name:'Pull',         muscles:['back','biceps','shoulders_rear','forearms'] },
      C: { name:'Legs',         muscles:['quads','hamstrings','glutes','calves'] },
      D: { name:'Push B',       muscles:['chest','shoulders_lat','triceps'] },
      E: { name:'Pull B + Abs', muscles:['back','biceps','abs','forearms'] },
    }
  },
  ppl_glute_5: {
    name: 'PPL + Glute Focus (Women)',
    sessions: {
      A: { name:'Lower — Glute',      muscles:['glutes','hamstrings','calves'] },
      B: { name:'Upper Push',         muscles:['chest','shoulders_lat','triceps'] },
      C: { name:'Lower — Quad+Glute', muscles:['quads','glutes','abs'] },
      D: { name:'Upper Pull',         muscles:['back','biceps','shoulders_rear'] },
      E: { name:'Lower — Full',       muscles:['glutes','hamstrings','quads','calves'] },
    }
  },
  ppl_6: {
    name: 'PPL x2',
    sessions: {
      A: { name:'Push A',  muscles:['chest','shoulders_lat','triceps'] },
      B: { name:'Pull A',  muscles:['back','biceps','shoulders_rear','forearms'] },
      C: { name:'Legs A',  muscles:['quads','hamstrings','glutes','calves'] },
      D: { name:'Push B',  muscles:['chest','shoulders_lat','triceps'] },
      E: { name:'Pull B',  muscles:['back','biceps','abs','forearms'] },
      F: { name:'Legs B',  muscles:['glutes','hamstrings','quads'] },
    }
  },
}

// ─── VOLUME CALCULATION ───────────────────────────────────────────────────────
function computeSessionSets(muscle, experience, isPriority, isAvoid, frequency, recoveryModifier, cardioFactor) {
  const L        = VOLUME_LANDMARKS[muscle]?.[experience] || { mev:8, mav:14, mrv:18 }
  const sizeClass = MUSCLE_SIZE_CLASS[muscle] || 'medium'
  const cap       = SESSION_CAPS[sizeClass]

  let weeklyTarget
  if (isAvoid)         weeklyTarget = Math.max(4, Math.round(L.mev * 0.5))
  else if (isPriority) weeklyTarget = Math.round((L.mav + L.mrv) / 2)
  else                 weeklyTarget = Math.round((L.mev + L.mav) / 2)

  // Recovery modifier obcina target ale nie poniżej MEV tygodniowego
  const weeklyMin = L.mev
  weeklyTarget = Math.max(weeklyMin, Math.round(weeklyTarget * recoveryModifier))

  if (['quads','hamstrings','glutes','calves'].includes(muscle))
    weeklyTarget = Math.round(weeklyTarget * cardioFactor)

  // Start na 95% targetu — zostawiamy miejsce na ramp ale nie za dużo
  const weeklyStart = Math.round(weeklyTarget * 0.95)
  const perSession  = Math.max(2, Math.round(weeklyStart / Math.max(1, frequency)))

  // Floor at MEV per session — never drop below regardless of recovery modifier
  const mevPerSession = Math.max(2, Math.round(L.mev / Math.max(1, frequency)))
  return Math.min(Math.max(perSession, mevPerSession), cap)
}

// ─── WEEKLY PROGRESSION (Israetel ramp + Helms RIR drop) ─────────────────────
// v5: stopniowy ramp zamiast flat + spike
// tydzień 1-2: baseSets
// tydzień 3-4: baseSets + ramp
// tydzień 5:   min(cap, baseSets + ramp*2)   ← zbliżenie do MRV
// tydzień 6:   deload (ceil * 0.5)
function buildWeeksProgression(baseSets, muscle, experience, goal, knowsRir, isPriority = false) {
  const sizeClass = MUSCLE_SIZE_CLASS[muscle] || 'medium'
  const cap       = SESSION_CAPS[sizeClass]
  const rirBase   = RIR_BY_WEEK[experience] || RIR_BY_WEEK.intermediate
  const repRange  = getRepRange(goal, muscle)

  const ramp = isPriority ? 2 : 1  // priority muscles rampa szybciej

  const setsPerWeek = [
    baseSets,
    baseSets,
    Math.min(cap, baseSets + ramp),
    Math.min(cap, baseSets + ramp),
    Math.min(cap, baseSets + ramp * 2),
    Math.max(2, Math.ceil(baseSets * 0.5)), // deload
  ]

  return setsPerWeek.map((sets, i) => {
    const isDeload = i === 5
    let rir = rirBase[i]
    if (!knowsRir) rir = isDeload ? 5 : Math.min(4, rir + 1)

    return {
      week:      i + 1,
      sets,
      rep_range: repRange,
      rir:       isDeload ? (knowsRir ? 4 : 5) : Math.max(0, rir),
      isDeload,
    }
  })
}

// ─── EXERCISE SCORING ─────────────────────────────────────────────────────────
function scoreExercise(ex, params, muscle) {
  let score = 0
  const { experience, priorityMuscles, avoidMuscles, equipment, painAreas,
          painLevel, excludedMovements, goal, plec, preferenceMachines,
          preferUnilateral, preferUnilateralLegs } = params

  score += ({ S:30, A:20, B:10, C:0 }[ex.tier] ?? 10)
  score += (ex.sfr_rating ?? 3) * 3

  // Stretch position bonus (Milo Wolf 2023)
  if (ex.stretch_position && goal !== 'Wzrost siły') score += 10

  if (priorityMuscles.includes(muscle)) score += 15
  if (avoidMuscles.includes(muscle))    score -= 20

  // Equipment filter — hard exclude
  if (ex.equipment?.length > 0) {
    if (!ex.equipment.some(e => equipment.has(e))) return -999
  }

  // Machine vs free weight preference
  const isMachine = ex.equipment?.some(e =>
    ['machine','leg_press','leg_extension','leg_curl','hip_thrust_machine',
     'pec_deck','lat_pulldown','seated_row','abductor','smith_machine','hack_squat'].includes(e))
  if (preferenceMachines === 'machines'     && isMachine)  score += 8
  if (preferenceMachines === 'free_weights' && !isMachine) score += 8

  if (experience === 'beginner') {
    if (ex.beginner_friendly === false) score -= 20
    if (ex.compound && ex.tier === 'B') score -= 5
  }

  // Injury exclusions — match movement_pattern
  if (painLevel >= 4) {
    if (excludedMovements.some(m => ex.movement_pattern === m))
      return -999
  }
  if (painAreas.includes('lower_back') && ex.lower_back_fatigue === 'high') score -= 20
  if (painAreas.includes('shoulder')   && ex.joint_risk === 'high' && painLevel >= 3) score -= 25
  if (painAreas.includes('knee')       && ex.joint_risk === 'high' && painLevel >= 3) score -= 20

  // Goal bonuses
  if (goal === 'Wzrost siły'                 && ex.compound)        score += 15
  if (goal === 'Redukcja tkanki tłuszczowej' && ex.sfr_rating >= 4) score += 8
  if (goal === 'Rekompozycja'                && ex.compound)        score += 5
  if (plec === 'Kobieta' && ['glutes','hamstrings'].includes(muscle) && ex.stretch_position) score += 8

  // Unilateral preference — dysproporcja correction
  if (ex.unilateral && preferUnilateral.includes(muscle))     score += 20
  if (ex.unilateral && preferUnilateralLegs.includes(muscle)) score += 20

  return score
}

function pickExercises(exercises, muscle, count, params) {
  return exercises
    .filter(ex => ex.muscle_group === muscle)
    .filter(ex => {
      if (!params.avoidExercises?.length) return true
      const nameL = (ex.name_pl || ex.name || '').toLowerCase()
      // Split avoid terms and check each — more precise than single includes
      return !params.avoidExercises.some(av =>
        av.split(' ').every(word => nameL.includes(word))
      )
    })
    .map(ex => ({ ex, score: scoreExercise(ex, params, muscle) }))
    .filter(({ score }) => score > -900)
    .sort((a, b) => b.score - a.score)
    .map(({ ex }) => ex)
    .slice(0, count)
}

// ─── PLAN VALIDATOR ───────────────────────────────────────────────────────────
function validatePlan(sessions, splitDef) {
  const errors   = []
  const warnings = []

  Object.entries(sessions).forEach(([key, session]) => {
    if (session.exercises.length === 0) {
      errors.push(`Sesja ${key} (${session.name}) — 0 ćwiczeń. Sprawdź dostępny sprzęt klienta lub seed ćwiczeń w DB.`)
    }
    const totalSets = session.exercises.reduce((s, e) => s + (e.sets || 0), 0)
    if (totalSets > 0 && totalSets < 6) {
      warnings.push(`Sesja ${key}: tylko ${totalSets} serii łącznie — rozważ zwiększenie czasu sesji lub objętości.`)
    }
    // Check that every planned muscle has at least 1 exercise
    const musclesCovered = new Set(session.exercises.map(e => e.muscle_group))
    const sessionDef = splitDef.sessions[key]
    if (sessionDef) {
      sessionDef.muscles.forEach(m => {
        if (!musclesCovered.has(m)) {
          warnings.push(`Sesja ${key}: brak ćwiczenia dla ${m} — brak sprzętu lub conflict z unikaniem.`)
        }
      })
    }
  })

  return { valid: errors.length === 0, errors, warnings }
}

// ─── RATIONALE ────────────────────────────────────────────────────────────────
function generateRationale(params, splitDef) {
  const sessionMin = params.sessionMinutes || 60
  const splitReason = sessionMin <= 60
    ? `${sessionMin} min sesje — Full Body dla maksymalnej częstotliwości.`
    : sessionMin <= 75
      ? `${sessionMin} min sesje — optymalny balans objętości.`
      : `${sessionMin} min sesje — wystarczający czas na split.`
  const lines = [`Split: ${splitDef.name} — ${params.days} dni treningowych. ${splitReason}`]
  if (params.recoveryModifier < 0.85) lines.push('Niska regeneracja — objętość utrzymana na MEV mimo redukcji.')
  else if (params.recoveryModifier > 1.0) lines.push('Dobra regeneracja — objętość lekko zwiększona.')
  if (params.priorityMuscles.length > 0) lines.push(`Priorytet: ${params.priorityMuscles.join(', ')} — wyższy target volume.`)
  if (params.avoidMuscles.length > 0) lines.push(`Maintenance: ${params.avoidMuscles.join(', ')} — objętość minimalna.`)
  if (params.painAreas.length > 0) lines.push(`Ból/kontuzje (${params.painAreas.join(', ')}) — wykluczone ryzykowne ćwiczenia.`)
  if (!params.knowsRir) lines.push('Intensywność opisana słownie — klient uczy się RIR.')
  if (params.experience === 'beginner') lines.push('Objętość startowa MEV — plan dla początkujących.')
  if (params.cardioFactor < 1) lines.push(`Nogi: -${Math.round((1-params.cardioFactor)*100)}% z powodu wysokiego cardio.`)
  if (params.trainingStyle === 'simple') lines.push('Styl prosty — jedno ćwiczenie per partia, focus na progresji.')
  if (params.trainingStyle === 'varied') lines.push('Styl urozmaicony — więcej ćwiczeń per partia.')
  if (params.preferUnilateral.length > 0 || params.preferUnilateralLegs.length > 0)
    lines.push('Priorytet ćwiczeń unilateralnych — korekcja dysproporcji między stronami.')
  return lines.join(' ')
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function generatePlan(questionnaire, exercises) {
  const q        = questionnaire?.data || {}
  const params   = buildDecisionParams(q)
  const splitDef = SPLIT_STRUCTURES[params.splitType]
  if (!splitDef) throw new Error(`Unknown split type: ${params.splitType}`)

  // Muscle frequency per week
  const muscleFrequency = {}
  Object.values(splitDef.sessions).forEach(session =>
    session.muscles.forEach(m => {
      muscleFrequency[m] = (muscleFrequency[m] || 0) + 1
    })
  )

  // Build sessions
  const sessions = {}
  Object.entries(splitDef.sessions).forEach(([sessionKey, sessionDef]) => {
    const usedExercises = new Set()
    const sessionMinutes = params.sessionMinutes || 60
    const muscleCount = sessionDef.muscles.length

    // Max exercises based on muscle count and training style, not time
    const maxExercises = muscleCount + (params.trainingStyle === 'varied' ? 1 : params.trainingStyle === 'simple' ? 0 : 0)

    const exerciseList = sessionDef.muscles.flatMap(muscle => {
      const isPriority = params.priorityMuscles.includes(muscle)
      const isAvoid    = params.avoidMuscles.includes(muscle)
      const freq       = muscleFrequency[muscle] || 1

      const musclesInSession = sessionDef.muscles.length
      const densityFactor = musclesInSession <= 2 ? 1.0
        : musclesInSession === 3
          ? (sessionMinutes >= 75 ? 0.95 : 0.90)
        : musclesInSession === 4
          ? (sessionMinutes >= 90 ? 0.90 : sessionMinutes >= 75 ? 0.85 : 0.80)
        : (sessionMinutes >= 90 ? 0.85 : sessionMinutes >= 75 ? 0.80 : 0.75)

      const rawSets = computeSessionSets(
        muscle, params.experience, isPriority, isAvoid,
        freq, params.recoveryModifier, params.cardioFactor
      )

      const sets = Math.max(2, isPriority
        ? rawSets
        : Math.round(rawSets * densityFactor)
      )

      // Exercise count per muscle — driven by training_style
      const isSmall = ['abs','calves','shoulders_rear','biceps','triceps','forearms'].includes(muscle)
      let exCount = 1
      if (!isSmall) {
        if (params.trainingStyle === 'simple') {
          exCount = 1
        } else if (params.trainingStyle === 'varied') {
          // Varied: 2 exercises whenever sets >= 4
          exCount = sets >= 4 ? 2 : 1
        } else {
          // Balanced (default): 2 exercises only when many sets and time allows
          const exCountThreshold = sessionMinutes >= 90 ? 4 : sessionMinutes >= 75 ? 5 : 6
          exCount = sets >= exCountThreshold ? 2 : 1
        }
      }

      const picked = pickExercises(
        exercises.filter(e => !usedExercises.has(e.name)),
        muscle, exCount, params
      )
      picked.forEach(ex => usedExercises.add(ex.name))
      picked.sort((a, b) => (b.compound ? 1 : 0) - (a.compound ? 1 : 0))

      return picked.map((ex, idx) => {
        const exSets = idx === 0 ? sets : Math.max(2, Math.round(sets * 0.5))
        const weeks  = buildWeeksProgression(exSets, muscle, params.experience, params.goal, params.knowsRir, isPriority)
        const week1  = weeks[0]

        return {
          exercise_id:      ex.id,
          name:             ex.name,
          name_pl:          ex.name_pl,
          muscle_group:     muscle,
          compound:         ex.compound ?? false,
          stretch_position: ex.stretch_position ?? false,
          sfr_rating:       ex.sfr_rating,
          unilateral:       ex.unilateral ?? false,
          sets:             week1.sets,
          rep_range:        week1.rep_range,
          rir_target:       week1.rir,
          weeks,
          note: [
            isPriority        ? '★ priorytet' : '',
            isAvoid           ? '↓ maintenance' : '',
            ex.stretch_position && params.goal !== 'Wzrost siły' ? '↔ stretch' : '',
            ex.unilateral     ? '⚖ unilateral' : '',
            params.cardioFactor < 1 && ['quads','hamstrings','glutes','calves'].includes(muscle) ? '⚠ cardio' : '',
          ].filter(Boolean).join(' · '),
        }
      })
    })

    // FIX: priority-aware slice — priorytetowe mięśnie nie mogą być ucięte
    const sortedForCap = [...exerciseList].sort((a, b) => {
      const aPrio = params.priorityMuscles.includes(a.muscle_group) ? 0 : 1
      const bPrio = params.priorityMuscles.includes(b.muscle_group) ? 0 : 1
      return aPrio - bPrio
    })

    // Ensure every muscle in sessionDef gets at least 1 exercise
    const musclesCovered = new Set()
    const guaranteed = []
    const overflow = []

    sortedForCap.forEach(ex => {
      if (!musclesCovered.has(ex.muscle_group) && sessionDef.muscles.includes(ex.muscle_group)) {
        guaranteed.push(ex)
        musclesCovered.add(ex.muscle_group)
      } else {
        overflow.push(ex)
      }
    })

    const finalList = [...guaranteed, ...overflow].slice(0, maxExercises)

    // Max serie per sesja — based on experience not time
    const maxSetsPerSession = {
      beginner:     16,
      intermediate: 22,
      advanced:     28,
    }[params.experience] || 22

    let totalSets = 0
    const cappedList = []

    for (const ex of finalList) {
      const exSets = ex.sets || 3
      if (totalSets + exSets <= maxSetsPerSession) {
        cappedList.push(ex)
        totalSets += exSets
      } else if (cappedList.filter(e => e.muscle_group === ex.muscle_group).length === 0) {
        // Musi być przynajmniej 1 ćwiczenie na partię — zredukuj serie
        const reduced = Math.max(2, maxSetsPerSession - totalSets)
        if (reduced >= 2) {
          cappedList.push({ ...ex, sets: reduced })
          totalSets += reduced
        }
      }
    }

    sessions[sessionKey] = {
      label:     sessionKey,
      name:      sessionDef.name,
      exercises: cappedList,
    }
  })

  // Estimate session time as guidance (not a hard limit)
  Object.entries(sessions).forEach(([key, session]) => {
    const estimatedMin = session.exercises.reduce((t, ex) => {
      return t + (ex.sets || 3) * (ex.compound ? 4.5 : 3.5)
    }, 5)
    session.estimated_minutes = Math.round(estimatedMin)
  })

  // Validate before returning
  const validation = validatePlan(sessions, splitDef)

  // Add time guidance warnings (not errors)
  Object.entries(sessions).forEach(([key, session]) => {
    const estimatedMin = session.estimated_minutes
    if (estimatedMin > params.sessionMinutes + 15) {
      validation.warnings.push(
        `Sesja ${key}: szacowany czas ${Math.round(estimatedMin)} min — plan zakłada pełną objętość. Czas sesji to cel, nie limit.`
      )
    }
  })
  if (!validation.valid) {
    throw new Error(
      `Plan generation failed:\n${validation.errors.join('\n')}`
    )
  }

  // Plan-level weekly progression metadata
  const weeklyProgression = [1,2,3,4,5,6].map(week => ({
    week,
    rir:      (RIR_BY_WEEK[params.experience] || RIR_BY_WEEK.intermediate)[week - 1],
    isDeload: week === 6,
    label:    week === 6 ? 'Deload' : `Tydzień ${week}`,
  }))

  return {
    split_name:         splitDef.name,
    split_type:         params.splitType,
    days:               params.days,
    goal:               params.goal,
    staz:               params.staz,
    experience:         params.experience,
    recovery_modifier:  params.recoveryModifier,
    priority_muscles:   params.priorityMuscles,
    avoid_muscles:      params.avoidMuscles,
    training_style:     params.trainingStyle,
    has_dysproporcja:   params.preferUnilateral.length > 0 || params.preferUnilateralLegs.length > 0,
    mesocycle_weeks:    6,
    current_week:       1,
    rir_start:          (RIR_BY_WEEK[params.experience] || RIR_BY_WEEK.intermediate)[0],
    sessions,
    weekly_progression: weeklyProgression,
    equipment_used:     [...params.equipment],
    cardio_factor:      params.cardioFactor,
    rationale:          generateRationale(params, splitDef),
    validation_warnings: validation.warnings,
    generated_at:       new Date().toISOString(),
  }
}