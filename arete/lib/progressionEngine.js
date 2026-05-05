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
