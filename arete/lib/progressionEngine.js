// ============================================================
// ARETÉ — Progression Engine v1.0
// Evidence-based: Double progression, RIR-based autoregulation
// Israetel, Helms, Zourdos
// ============================================================

/**
 * Główna funkcja decyzyjna — co zrobić z ciężarem następnym razem
 */
export function getProgressionDecision({ sets, targetRepMin, targetRepMax, targetRir, loadIncrement = 2.5 }) {
  if (!sets || sets.length === 0) return null

  // 1. Ból — zawsze pierwszy
  const hasPain = sets.some(s => (s.pain_score ?? 0) >= 4)
  if (hasPain) {
    return {
      decision: 'flag_pain',
      label: '⚠ Ból — nie progresuj',
      color: '#EF6B73',
      reason: 'Ból 4/10 lub wyżej. Nie zwiększaj obciążenia. Zgłoś trenerowi.',
    }
  }

  const completedSets = sets.filter(s => s.completed !== false)
  if (completedSets.length === 0) return null

  const avgRir = completedSets.reduce((sum, s) => sum + (s.rir_actual ?? targetRir), 0) / completedSets.length
  const allAtTopRange = completedSets.every(s => s.reps >= targetRepMax)
  const allInRange = completedSets.every(s => s.reps >= targetRepMin)
  const anyBelowRange = completedSets.some(s => s.reps < targetRepMin)
  const tooHard = avgRir <= 0 && anyBelowRange

  // 2. Za ciężko — obniż
  if (tooHard) {
    return {
      decision: 'reduce_weight',
      label: '↓ Obniż ciężar',
      color: '#E8A020',
      reason: `Zbyt blisko upadku (RIR ~${avgRir.toFixed(1)}) i poniżej zakresu powtórzeń. Obniż o ${loadIncrement}–${loadIncrement * 2} kg.`,
      suggestedChange: -loadIncrement,
    }
  }

  // 3. Wszystkie serie na górnym zakresie + dobry RIR — dodaj ciężar
  if (allAtTopRange && avgRir >= targetRir - 0.5) {
    return {
      decision: 'increase_weight',
      label: '↑ Dodaj ciężar',
      color: '#47D18C',
      reason: `Wszystkie serie ${targetRepMax} powtórzeń z RIR ~${avgRir.toFixed(1)}. Dodaj ${loadIncrement} kg następnym razem.`,
      suggestedChange: loadIncrement,
    }
  }

  // 4. W zakresie ale nie na górze — dodaj powtórzenia
  if (allInRange && !allAtTopRange) {
    return {
      decision: 'add_reps',
      label: '→ Dodaj powtórzenia',
      color: '#D4B570',
      reason: `Zostań przy tym samym ciężarze i dobij do ${targetRepMax} powtórzeń.`,
      suggestedChange: 0,
    }
  }

  // 5. Poniżej zakresu ale nie za ciężko — zostań
  return {
    decision: 'hold',
    label: '= Zostań',
    color: '#8F9AAF',
    reason: 'Utrzymaj ciężar i powtórzenia. Skup się na technice i RIR.',
    suggestedChange: 0,
  }
}

/**
 * Status objętości tygodniowej względem MEV/MRV
 */
export function getVolumeStatus({ weeklySets, mev, mavMin, mavMax, mrv }) {
  if (weeklySets < mev) {
    return { status: 'below_mev', label: 'Poniżej MEV', color: '#E8A020', message: 'Objętość za niska — za mało bodźca do hipertrofii.' }
  }
  if (weeklySets >= mavMin && weeklySets <= mavMax) {
    return { status: 'productive', label: 'Produktywna', color: '#47D18C', message: 'Objętość w optymalnym zakresie hipertroficznym.' }
  }
  if (weeklySets > mavMax && weeklySets <= mrv) {
    return { status: 'high', label: 'Wysoka', color: '#D4B570', message: 'Wysoka objętość — monitoruj regenerację.' }
  }
  return { status: 'above_mrv', label: 'Powyżej MRV', color: '#EF6B73', message: 'Przekroczone MRV — rozważ deload.' }
}

/**
 * Analiza alertów dla klienta (coach decision engine)
 */
export function getClientAlerts({ missedCheckins, adherencePct, avgSleepHours, maxPainScore, weightTrendPct, strengthDropSessions }) {
  const alerts = []
  let severity = 'green'

  const upgrade = (s) => {
    const order = ['green', 'yellow', 'orange', 'red']
    if (order.indexOf(s) > order.indexOf(severity)) severity = s
  }

  if (missedCheckins >= 1) {
    alerts.push('Brak cotygodniowego check-inu')
    upgrade('orange')
  }
  if (adherencePct < 80) {
    alerts.push(`Adherence ${adherencePct}% — nie zmieniaj kalorii, popraw wykonanie`)
    upgrade('orange')
  }
  if (avgSleepHours < 6) {
    alerts.push('Średni sen poniżej 6h — ryzyko przeciążenia')
    upgrade('yellow')
  }
  if (maxPainScore >= 4) {
    alerts.push(`Ból ${maxPainScore}/10 — wymagana reakcja trenera`)
    upgrade('red')
  }
  if (strengthDropSessions >= 2) {
    alerts.push('Spadek siły przez 2 sesje — sprawdź regenerację')
    upgrade('orange')
  }
  if (Math.abs(weightTrendPct ?? 0) < 0.25 && adherencePct >= 90) {
    alerts.push('Waga stoi mimo dobrego adherence — rozważ korektę kalorii')
    upgrade('yellow')
  }

  const statusMap = { green: 'On Track', yellow: 'Monitor', orange: 'Needs Attention', red: 'Critical' }
  return { severity, alerts, status: statusMap[severity] }
}

/**
 * Henselmans — frequency optimization
 * Ile razy w tygodniu trenować daną partię
 */
export function getOptimalFrequency({ weeklyVolume, recoveryCapacity, experience }) {
  // Im więcej serii tygodniowo, tym więcej sesji potrzeba
  // Henselmans: max ~10 serii efektywnych per sesja per mięsień
  const maxSetsPerSession = experience === 'beginner' ? 6 : experience === 'advanced' ? 12 : 8
  const minFrequency = Math.ceil(weeklyVolume / maxSetsPerSession)

  // Recovery modifier (Henselmans: większe mięśnie regenerują wolniej)
  const recoveryMod = recoveryCapacity < 0.85 ? 1 : 2

  return {
    minFrequency: Math.max(1, minFrequency),
    recommended: Math.min(minFrequency + recoveryMod, 4),
    reason: `${weeklyVolume} serii/tydzień → min ${Math.max(1, minFrequency)} sesji dla optymalnego bodźca per sesja.`
  }
}

/**
 * Nuckols — load/volume trade-off
 * Czy lepiej więcej serii z mniejszym ciężarem czy mniej z większym
 */
export function getLoadVolumeBalance({ goal, experience, rir }) {
  if (goal === 'Wzrost siły') {
    return {
      recommendation: 'heavy',
      repRange: '3-6',
      sets: experience === 'advanced' ? '4-6' : '3-5',
      rir: '2-3',
      reason: 'Siła — wyższe obciążenie, mniej powtórzeń, długie przerwy (3-5 min).'
    }
  }

  if (goal === 'Redukcja tkanki tłuszczowej') {
    return {
      recommendation: 'moderate',
      repRange: '8-15',
      sets: '3-4',
      rir: '1-2',
      reason: 'Redukcja — umiarkowane obciążenie, wyższy zakres powtórzeń, krótsze przerwy.'
    }
  }

  // Hipertrofia — Nuckols: szeroki zakres działa (6-30 powt.) jeśli blisko upadku
  return {
    recommendation: 'varied',
    repRange: experience === 'beginner' ? '8-15' : '6-20',
    sets: experience === 'advanced' ? '4-6' : '3-4',
    rir: rir <= 1 ? '0-2' : '1-3',
    reason: 'Hipertrofia — szeroki zakres powtórzeń działa. Ważne: blisko upadku (RIR 0-3).'
  }
}

/**
 * Trexler — metabolic adaptation detection
 * Czy klient wymaga przerwy dietowej (diet break)
 */
export function checkMetabolicAdaptation({ weightTrend7Days, weeksInDeficit, adherencePct, energyLevel }) {
  const alerts = []
  let needsDietBreak = false

  // Waga stoi mimo dobrego adherence > 2 tygodnie
  if (Math.abs(weightTrend7Days) < 0.1 && adherencePct >= 85 && weeksInDeficit >= 4) {
    alerts.push('Waga stoi mimo dobrego adherence — możliwa adaptacja metaboliczna.')
    needsDietBreak = weeksInDeficit >= 8
  }

  // Niska energia przez długi czas
  if (energyLevel <= 2 && weeksInDeficit >= 6) {
    alerts.push('Niska energia przez 6+ tygodni redukcji — rozważ przerwę dietową (2 tyg. na TDEE).')
    needsDietBreak = true
  }

  return {
    needsDietBreak,
    alerts,
    recommendation: needsDietBreak
      ? 'Diet break 2 tygodnie na TDEE (Trexler 2014) — reset leptyny i metabolizmu.'
      : weeksInDeficit >= 4 && adherencePct >= 85
        ? 'Rozważ refeed day 1x/tydzień.'
        : null
  }
}

/**
 * Schoenfeld — stretch-mediated hypertrophy scoring
 * Bonus dla ćwiczeń z długą pozycją rozciągnięcia
 */
export function getStretchBonus({ stretchPosition, goal, muscleGroup }) {
  if (!stretchPosition) return 0
  if (goal === 'Wzrost siły') return 0

  // Schoenfeld 2023: stretch position szczególnie ważna dla:
  // biceps (incline curl), triceps (overhead), pecs (fly), glutes (RDL/split squat)
  const highPriorityMuscles = ['biceps', 'triceps', 'chest', 'glutes', 'hamstrings']

  return highPriorityMuscles.includes(muscleGroup) ? 10 : 5
}
