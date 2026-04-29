// ============================================================
// ARETÉ — Plan Builder Algorithm v2.0
// Evidence-based: MEV/MRV Schoenfeld, SFR, Milo Wolf stretch,
// Hickson interference, compound ratio, equipment filter,
// deload week, progressive overload
// ============================================================

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

const SPLIT_MAP = {
  2: {
    name: 'Full Body x2',
    sessions: ['A', 'B'],
    structure: {
      A: ['quads', 'chest', 'back', 'shoulders_lat', 'biceps'],
      B: ['hamstrings', 'glutes', 'chest', 'back', 'triceps'],
    }
  },
  3: {
    name: 'Full Body x3',
    sessions: ['A', 'B', 'C'],
    structure: {
      A: ['quads', 'chest', 'shoulders_lat', 'triceps'],
      B: ['hamstrings', 'glutes', 'back', 'biceps'],
      C: ['quads', 'chest', 'back', 'shoulders_rear', 'abs'],
    }
  },
  4: {
    name: 'Upper / Lower',
    sessions: ['A', 'B', 'C', 'D'],
    structure: {
      A: ['chest', 'back', 'shoulders_lat', 'biceps'],
      B: ['quads', 'hamstrings', 'glutes', 'calves'],
      C: ['chest', 'back', 'shoulders_rear', 'triceps'],
      D: ['quads', 'hamstrings', 'glutes', 'abs'],
    }
  },
  5: {
    name: 'Push / Pull / Legs',
    sessions: ['A', 'B', 'C', 'D', 'E'],
    structure: {
      A: ['chest', 'shoulders_lat', 'triceps'],
      B: ['back', 'biceps', 'shoulders_rear'],
      C: ['quads', 'hamstrings', 'glutes', 'calves'],
      D: ['chest', 'shoulders_lat', 'triceps'],
      E: ['back', 'biceps', 'abs'],
    }
  },
  6: {
    name: 'PPL x2',
    sessions: ['A', 'B', 'C', 'D', 'E', 'F'],
    structure: {
      A: ['chest', 'shoulders_lat', 'triceps'],
      B: ['back', 'biceps', 'shoulders_rear'],
      C: ['quads', 'hamstrings', 'glutes', 'calves'],
      D: ['chest', 'shoulders_lat', 'triceps'],
      E: ['back', 'biceps', 'abs'],
      F: ['quads', 'hamstrings', 'glutes'],
    }
  },
}

const PRIORITY_MAP = {
  'pośladki': 'glutes', 'glutes': 'glutes',
  'plecy': 'back', 'back': 'back',
  'barki': 'shoulders_lat', 'barki boczne': 'shoulders_lat',
  'klatka': 'chest', 'klatka piersiowa': 'chest', 'chest': 'chest',
  'nogi': 'quads', 'quads': 'quads',
  'uda': 'hamstrings', 'hamstrings': 'hamstrings',
  'biceps': 'biceps', 'bicepsy': 'biceps',
  'triceps': 'triceps', 'tricepsy': 'triceps',
  'brzuch': 'abs', 'abs': 'abs',
  'łydki': 'calves', 'calves': 'calves',
}

// Progresja tygodniowa wg stażu i ćwiczenia
function getProgression(staz, isCompound) {
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

function parsePriorities(text) {
  if (!text) return []
  const lower = text.toLowerCase()
  return Object.entries(PRIORITY_MAP)
    .filter(([key]) => lower.includes(key))
    .map(([, val]) => val)
    .filter((v, i, arr) => arr.indexOf(v) === i)
}

// Parsuj dostępny sprzęt z ankiety
function parseEquipment(miejsce, brakSprzetu) {
  const available = new Set(['bodyweight'])
  const miejsceLower = (miejsce || '').toLowerCase()
  const brak = (brakSprzetu || '').toLowerCase()

  if (miejsceLower.includes('pełna') || miejsceLower.includes('full')) {
    available.add('barbell')
    available.add('dumbbell')
    available.add('cable')
    available.add('machine')
    available.add('barbell')
  } else if (miejsceLower.includes('podstawowa') || miejsceLower.includes('ławka')) {
    available.add('barbell')
    available.add('dumbbell')
  } else if (miejsceLower.includes('dom') && miejsceLower.includes('pełne')) {
    available.add('barbell')
    available.add('dumbbell')
    available.add('cable')
  } else if (miejsceLower.includes('dom') && miejsceLower.includes('hantle')) {
    available.add('dumbbell')
  }

  // Usuń brakujący sprzęt
  if (brak.includes('hack squat')) available.delete('hack_squat')
  if (brak.includes('cable') || brak.includes('wyciąg')) available.delete('cable')
  if (brak.includes('machine') || brak.includes('maszyn')) available.delete('machine')

  return available
}

// Interference effect — redukcja objętości nóg przy dużym cardio
function cardioInterference(cardioIle) {
  if (!cardioIle) return 1.0
  const lower = cardioIle.toLowerCase()
  // Wyciągnij liczbę sesji
  const match = lower.match(/(\d+)/)
  const sessions = match ? parseInt(match[1]) : 0
  if (sessions >= 4) return 0.85  // -15%
  if (sessions >= 2) return 0.90  // -10%
  return 1.0
}

function setsPerMuscle(muscle, staz, isPriority, cardioFactor) {
  const base = MEV[muscle]?.[staz] ?? 8
  let sets = isPriority ? Math.min(base + 4, 20) : base
  // Interference tylko dla nóg
  if (['quads', 'hamstrings', 'glutes', 'calves'].includes(muscle)) {
    sets = Math.round(sets * cardioFactor)
  }
  return sets
}

function setsPerSession(muscle, staz, isPriority, sessionsPerWeek, cardioFactor) {
  const weekly = setsPerMuscle(muscle, staz, isPriority, cardioFactor)
  return Math.max(2, Math.round(weekly / sessionsPerWeek))
}

function pickExercises(exercises, muscle, count, excludedNames, availableEquipment, staz, goal) {
  const isBeginner = ['0-6 miesięcy', '6-12 miesięcy'].includes(staz)
  const isHypertrophy = goal === 'Budowa masy mięśniowej' || goal === 'Rekompozycja'

  return exercises
    .filter(ex => {
      if (ex.muscle_group !== muscle) return false
      if (excludedNames.includes(ex.name)) return false
      // Equipment filter
      if (ex.equipment && ex.equipment.length > 0) {
        const hasEquip = ex.equipment.some(e => availableEquipment.has(e.toLowerCase()))
        if (!hasEquip) return false
      }
      // Beginnerzy: tylko compound lub tier S/A
      if (isBeginner && !ex.compound && ex.tier === 'B') return false
      return true
    })
    .sort((a, b) => {
      const tierScore = { S: 3, A: 2, B: 1 }
      const tA = tierScore[a.tier] ?? 0
      const tB = tierScore[b.tier] ?? 0
      if (tB !== tA) return tB - tA

      // Hipertrofia: bonus za stretch_position (Milo Wolf 2023)
      if (isHypertrophy) {
        const stretchA = a.stretch_position ? 1 : 0
        const stretchB = b.stretch_position ? 1 : 0
        if (stretchB !== stretchA) return stretchB - stretchA
      }

      // Compound first
      if (b.compound !== a.compound) return (b.compound ? 1 : 0) - (a.compound ? 1 : 0)

      // SFR desc
      return (b.sfr_rating ?? 0) - (a.sfr_rating ?? 0)
    })
    .slice(0, count)
}

function getRepRange(goal, isCompound) {
  if (goal === 'Wzrost siły') return isCompound ? '1-5' : '4-6'
  if (goal === 'Redukcja tkanki tłuszczowej') return '10-15'
  if (goal === 'Zdrowie i sprawność') return '10-15'
  return isCompound ? '6-10' : '10-15' // hipertrofia / rekompozycja
}

function getRIR(goal, week) {
  // RIR spada w trakcie mezocyklu (progresja intensywności)
  if (goal === 'Wzrost siły') return Math.max(0, 3 - Math.floor(week / 2))
  return Math.max(0, 4 - Math.floor(week / 2)) // tyg 1-2: RIR3, 3-4: RIR2, 5: RIR1, 6: deload
}

export function generatePlan(questionnaire, exercises) {
  const q = questionnaire?.data || {}

  const days = parseInt(q.dni_tydzien) || 4
  const staz = q.staz || '1-2 lata'
  const cel = q.cel || 'Budowa masy mięśniowej'
  const priorities = parsePriorities(q.priorytetowe_partie)
  const splitDef = SPLIT_MAP[Math.min(days, 6)] || SPLIT_MAP[4]
  const availableEquipment = parseEquipment(q.miejsce_treningu, q.brak_sprzetu)
  const cardioFactor = cardioInterference(q.cardio_ile)

  // Wykluczone ćwiczenia z ankiety
  const excluded = []
  if (q.cwiczenia_unikane) {
    const unikane = q.cwiczenia_unikane.toLowerCase()
    exercises.forEach(ex => {
      if (
        (ex.name_pl && unikane.includes(ex.name_pl.toLowerCase())) ||
        unikane.includes(ex.name.toLowerCase())
      ) excluded.push(ex.name)
    })
  }

  // Kontuzje → dodatkowe wykluczenia
  if (q.kontuzje_aktualne) {
    const kontuzje = q.kontuzje_aktualne.toLowerCase()
    if (kontuzje.includes('bark') || kontuzje.includes('shoulder')) {
      exercises.filter(ex =>
        ex.movement_pattern === 'push' && ex.name.toLowerCase().includes('overhead')
      ).forEach(ex => excluded.push(ex.name))
    }
    if (kontuzje.includes('kolano') || kontuzje.includes('knee')) {
      exercises.filter(ex =>
        ex.muscle_group === 'quads' && ex.compound
      ).forEach(ex => {
        if (ex.name.toLowerCase().includes('squat')) excluded.push(ex.name)
      })
    }
    if (kontuzje.includes('kręgosłup') || kontuzje.includes('plecy') || kontuzje.includes('back')) {
      exercises.filter(ex =>
        ex.name.toLowerCase().includes('deadlift') ||
        ex.name.toLowerCase().includes('good morning')
      ).forEach(ex => excluded.push(ex.name))
    }
  }

  // Zbuduj sesje
  const sessions = {}
  Object.entries(splitDef.structure).forEach(([sessionKey, muscles]) => {
    sessions[sessionKey] = {
      label: sessionKey,
      exercises: muscles.flatMap(muscle => {
        const isPriority = priorities.includes(muscle)
        const muscleAppearances = Object.values(splitDef.structure)
          .filter(m => m.includes(muscle)).length
        const sets = setsPerSession(muscle, staz, isPriority, muscleAppearances, cardioFactor)
        const exCount = ['abs', 'calves', 'shoulders_rear'].includes(muscle) ? 1 : (sets >= 6 ? 2 : 1)
        const picked = pickExercises(exercises, muscle, exCount, excluded, availableEquipment, staz, cel)

        return picked.map((ex, idx) => ({
          exercise_id: ex.id,
          name: ex.name,
          name_pl: ex.name_pl,
          muscle_group: muscle,
          sets: idx === 0 ? sets : Math.max(2, Math.round(sets * 0.6)),
          rep_range: getRepRange(cel, ex.compound),
          rir_target: getRIR(cel, 1),
          progression: getProgression(staz, ex.compound),
          stretch_priority: ex.stretch_position && cel !== 'Wzrost siły',
          note: [
            isPriority ? '★ priorytet' : '',
            ex.stretch_position && cel !== 'Wzrost siły' ? '↔ stretch' : '',
            cardioFactor < 1 && ['quads','hamstrings','glutes','calves'].includes(muscle)
              ? '⚠ obj. zredukowana (cardio)' : '',
          ].filter(Boolean).join(' · '),
        }))
      })
    }
  })

  // Tydzień deload (tydzień 6) — -40% objętości
  const deloadSessions = {}
  Object.entries(sessions).forEach(([key, session]) => {
    deloadSessions[key] = {
      ...session,
      isDeload: true,
      exercises: session.exercises.map(ex => ({
        ...ex,
        sets: Math.max(2, Math.round(ex.sets * 0.6)),
        rir_target: 4,
        note: (ex.note ? ex.note + ' · ' : '') + '🔄 deload',
      }))
    }
  })

  // Progresja RIR przez mezocykl
  const weeklyProgression = Array.from({ length: 6 }, (_, i) => ({
    week: i + 1,
    rir: getRIR(cel, i + 1),
    isDeload: i === 5,
    label: i === 5 ? 'Deload' : `Tydzień ${i + 1}`,
  }))

  return {
    split_name: splitDef.name,
    days,
    goal: cel,
    staz,
    priorities,
    mesocycle_weeks: 6,
    sessions,
    deload_sessions: deloadSessions,
    weekly_progression: weeklyProgression,
    equipment_used: Array.from(availableEquipment),
    cardio_factor: cardioFactor,
    excluded_exercises: [...new Set(excluded)],
    generated_at: new Date().toISOString(),
  }
}