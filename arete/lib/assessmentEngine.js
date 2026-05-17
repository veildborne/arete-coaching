// lib/assessmentEngine.js
// Areté Assessment Engine — scoring klienta po ankiecie
// Evidence: Israetel (volume landmarks), Helms (RIR/recovery), McDonald (nutrition)

// ─── EXPERIENCE LEVEL ────────────────────────────────────────────────────────

export function calculateExperienceLevel(q) {
  const staz = q.staz || ''
  if (staz === '0-6 miesięcy') return 'beginner'
  if (staz === '6-12 miesięcy') return 'novice'
  if (staz === '1-2 lata') return 'novice'
  if (staz === '2-3 lata') return 'intermediate'
  if (staz === '3-5 lat') return 'intermediate'
  if (staz === '5+ lat') return 'advanced'
  return 'novice'
}

// ─── RECOVERY STATUS ─────────────────────────────────────────────────────────

export function calculateRecoveryStatus(q) {
  let score = 0

  // Sen
  const sen = q.sen || ''
  if (sen === 'more_8') score += 3
  else if (sen === '7_8') score += 2
  else if (sen === '6_7') score += 1
  else score += 0 // less_6

  // Jakość snu
  const sleepQ = parseInt(q.sleep_quality) || 3
  const workFatigue = parseInt(q.work_fatigue_level) || 2
  const wakeUp = parseInt(q.wake_up_fatigue) || 3
  const motivation = parseInt(q.motivation_level) || 3
  score += sleepQ - 1 // 0-4

  // Regularność snu
  if (q.sleep_consistency === 'good') score += 2
  else if (q.sleep_consistency === 'moderate') score += 1

  // Stres
  const stress = parseInt(q.stress_level) || 3
  score += (5 - stress) // odwrócone: stres 1=4pkt, stres 5=0pkt

  // Praca
  if (q.praca === 'sedentary') score += 2
  else if (q.praca === 'mixed') score += 1
  else score += 0 // physical

  score += (5 - workFatigue)
  score += motivation - 1
  score += wakeUp - 1

  // Kroki / NEAT
  const steps = parseInt(q.srednie_kroki) || 5500
  if (steps >= 10000) score += 2
  else if (steps >= 7000) score += 1
  else if (steps < 4000) score -= 1

  // Max możliwy score: 3+4+2+4+4+2+4+4 = 27
  const pct = score / 27

  if (pct >= 0.75) return 'high'
  if (pct >= 0.50) return 'moderate'
  if (pct >= 0.30) return 'low'
  return 'very_low'
}

// ─── VOLUME TOLERANCE ────────────────────────────────────────────────────────

export function calculateVolumeTolerance(q) {
  let score = 4 // default moderate gdy brak danych

  // Zakwasy dół
  if (q.soreness_lower === 'none') score += 3
  else if (q.soreness_lower === '1_day') score += 2
  else if (q.soreness_lower === '2_days') score += 1
  else if (q.soreness_lower === '3_plus') score += 0
  // undefined = brak danych, zostaw default

  // Zakwasy góra
  if (q.soreness_upper === 'none') score += 2
  else if (q.soreness_upper === '1_day') score += 1
  else if (q.soreness_upper === '2_days') score += 0
  else if (q.soreness_upper === '3_plus') score -= 1
  // undefined = brak danych, zostaw default

  // Regeneracja między sesjami
  if (q.performance_drop === 'good') score += 3
  else if (q.performance_drop === 'moderate') score += 1
  else score += 0

  // Max: 9
  if (score >= 7) return 'high'
  if (score >= 4) return 'moderate'
  return 'low'
}

// ─── ADHERENCE RISK ──────────────────────────────────────────────────────────

export function calculateAdherenceRisk(q) {
  let riskScore = 0

  const stress = parseInt(q.stress_level) || 3
  if (stress >= 4) riskScore += 2
  else if (stress === 3) riskScore += 1

  const workFatigue = parseInt(q.work_fatigue_level) || 2
  if (workFatigue >= 4) riskScore += 2
  else if (workFatigue === 3) riskScore += 1

  const weekendAdherence = parseInt(q.weekend_adherence) || 3
  if (weekendAdherence <= 2) riskScore += 2
  else if (weekendAdherence === 3) riskScore += 1

  const motivation = parseInt(q.motivation_level) || 3
  if (motivation <= 2) riskScore += 2

  const czas = q.czas_sesji || '60 min'
  const minuty = parseInt(czas) || 60
  if (minuty >= 90 && workFatigue >= 3) riskScore += 1

  if (riskScore >= 6) return 'high'
  if (riskScore >= 3) return 'moderate'
  return 'low'
}

// ─── READINESS SCORE ─────────────────────────────────────────────────────────

export function calculateReadinessScore(q) {
  const experience = calculateExperienceLevel(q)
  const recovery = calculateRecoveryStatus(q)
  const volumeTolerance = calculateVolumeTolerance(q)
  const adherenceRisk = calculateAdherenceRisk(q)

  let score = 50 // baza

  // Experience
  if (experience === 'advanced') score += 15
  else if (experience === 'intermediate') score += 10
  else if (experience === 'novice') score += 5

  // Recovery
  if (recovery === 'high') score += 20
  else if (recovery === 'moderate') score += 10
  else if (recovery === 'low') score -= 5
  else score -= 15

  // Volume tolerance
  if (volumeTolerance === 'high') score += 10
  else if (volumeTolerance === 'moderate') score += 5
  else score -= 5

  // Adherence risk
  if (adherenceRisk === 'low') score += 5
  else if (adherenceRisk === 'high') score -= 10

  // Pain
  const painLevel = parseInt(q.pain_level) || 0
  if (painLevel >= 6) score -= 15
  else if (painLevel >= 3) score -= 5

  return Math.min(100, Math.max(0, Math.round(score)))
}

// ─── STRATEGY PROFILE ────────────────────────────────────────────────────────

export function selectStrategyProfile(q, readinessScore) {
  const goal = q.cel || ''
  const recovery = calculateRecoveryStatus(q)

  if (goal === 'Redukcja tkanki tłuszczowej') {
    if (readinessScore >= 75 && recovery === 'high') return 'standard_fat_loss'
    if (readinessScore >= 55) return 'standard_fat_loss'
    if (readinessScore >= 40) return 'conservative_fat_loss'
    return 'health_first'
  }
  if (goal === 'Budowa masy mięśniowej') {
    if (recovery === 'high' || recovery === 'moderate') return 'lean_gain'
    return 'conservative_fat_loss'
  }
  if (goal === 'Rekompozycja (masa + redukcja)') return 'recomp'
  if (goal === 'Wzrost siły') return 'lean_gain'
  return 'health_first'
}

// ─── FATIGUE RISK FLAGS ───────────────────────────────────────────────────────

export function generateFatigueRiskFlags(q) {
  const flags = []

  if (['6_7', 'less_6'].includes(q.sen)) flags.push('sleep_suboptimal')
  if (parseInt(q.sleep_quality) <= 2) flags.push('sleep_quality_poor')
  if (parseInt(q.stress_level) >= 4) flags.push('high_stress')
  if (q.praca === 'physical') flags.push('physical_work')
  if (parseInt(q.work_fatigue_level) >= 4) flags.push('high_work_fatigue')
  if (q.performance_drop === 'poor') flags.push('poor_session_recovery')
  if (q.soreness_lower === '3_plus') flags.push('slow_lower_recovery')
  if (q.soreness_upper === '3_plus') flags.push('slow_upper_recovery')
  if (parseInt(q.pain_level) >= 4) flags.push('pain_risk')
  if (q.pms_hunger_effect === 'high') flags.push('pms_hunger_high')
  if (parseInt(q.hunger_control) <= 2) flags.push('poor_hunger_control')
  if (parseInt(q.weekend_adherence) <= 2) flags.push('weekend_adherence_risk')
  const steps = parseInt(q.srednie_kroki) || 5500
  if (steps < 4000) flags.push('low_neat_risk')

  return flags
}

// ─── TRAINING AGGRESSIVENESS ─────────────────────────────────────────────────

export function calculateTrainingAggressiveness(readinessScore, volumeTolerance) {
  if (readinessScore >= 75 && volumeTolerance === 'high') return 'aggressive'
  if (readinessScore >= 55 && volumeTolerance !== 'low') return 'moderate'
  return 'conservative'
}

// ─── NUTRITION AGGRESSIVENESS ────────────────────────────────────────────────

export function calculateNutritionAggressiveness(q, readinessScore) {
  const recovery = calculateRecoveryStatus(q)
  const hungerControl = parseInt(q.hunger_control) || 3
  const steps = parseInt(q.srednie_kroki) || 5500
  if (steps < 4000 && readinessScore < 65) return 'conservative'

  if (readinessScore >= 75 && recovery === 'high' && hungerControl >= 4) return 'aggressive'
  if (readinessScore >= 55 && hungerControl >= 3) return 'moderate'
  return 'conservative'
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function calculateAssessmentScores(q) {
  try {
    if (!q) return null

    const experience_level = calculateExperienceLevel(q)
    const recovery_status = calculateRecoveryStatus(q)
    const volume_tolerance = calculateVolumeTolerance(q)
    const adherence_risk = calculateAdherenceRisk(q)
    const readiness_score = calculateReadinessScore(q)
    const strategy_profile = selectStrategyProfile(q, readiness_score)
    const fatigue_risk_flags = generateFatigueRiskFlags(q)
    const training_aggressiveness = calculateTrainingAggressiveness(readiness_score, volume_tolerance)
    const nutrition_aggressiveness = calculateNutritionAggressiveness(q, readiness_score)

    const STRATEGY_LABELS = {
      standard_fat_loss: 'Standardowa redukcja',
      conservative_fat_loss: 'Ostrożna redukcja',
      aggressive_mini_cut: 'Agresywna redukcja',
      recomp: 'Rekompozycja',
      lean_gain: 'Budowa masy',
      health_first: 'Priorytet zdrowia',
    }

    const EXPERIENCE_LABELS = {
      beginner: 'Początkujący',
      novice: 'Nowicjusz',
      intermediate: 'Średniozaawansowany',
      advanced: 'Zaawansowany',
    }

    const RECOVERY_LABELS = {
      high: 'Dobra',
      moderate: 'Umiarkowana',
      low: 'Niska',
      very_low: 'Bardzo niska',
    }

    return {
      experience_level,
      experience_label: EXPERIENCE_LABELS[experience_level],
      recovery_status,
      recovery_label: RECOVERY_LABELS[recovery_status],
      volume_tolerance,
      adherence_risk,
      readiness_score,
      strategy_profile,
      strategy_label: STRATEGY_LABELS[strategy_profile] || strategy_profile,
      fatigue_risk_flags,
      training_aggressiveness,
      nutrition_aggressiveness,
    }
  } catch (e) {
    console.error('[AssessmentEngine] Error:', e)
    return null
  }
}
