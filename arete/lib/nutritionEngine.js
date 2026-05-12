// lib/nutritionEngine.js
// Areté Adaptive Nutrition Engine
// Sources: Mifflin-St Jeor, Helms, McDonald, Israetel, Nuckols

export function calculateBMR({ sex, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return Math.round(sex === 'female' ? base - 161 : base + 5)
}

export function estimateTDEE({ bmr, trainingDays, averageSteps = 7000 }) {
  let actMult
  if (trainingDays <= 1) actMult = 1.25
  else if (trainingDays <= 2) actMult = 1.35
  else if (trainingDays <= 3) actMult = 1.45
  else if (trainingDays <= 4) actMult = 1.55
  else if (trainingDays <= 5) actMult = 1.625
  else actMult = 1.725

  if (averageSteps < 4000) actMult -= 0.05
  else if (averageSteps > 10000) actMult += 0.05

  return Math.round(bmr * actMult)
}

export function classifyAggressiveness({ targetCalories, tdee }) {
  const deficitPct = ((tdee - targetCalories) / tdee) * 100
  if (deficitPct < -5) return { label: 'bulk', labelPl: 'Nadwyżka', color: '#52B788', deficitPct }
  if (deficitPct < 5)  return { label: 'maintenance', labelPl: 'Utrzymanie', color: '#D4B570', deficitPct }
  if (deficitPct < 10) return { label: 'conservative', labelPl: 'Ostrożny', color: '#52B788', deficitPct }
  if (deficitPct < 20) return { label: 'moderate', labelPl: 'Umiarkowany', color: '#D4B570', deficitPct }
  if (deficitPct < 25) return { label: 'aggressive', labelPl: 'Agresywny', color: '#E8A020', deficitPct }
  return { label: 'very_aggressive', labelPl: 'Bardzo agresywny', color: '#EF6B73', deficitPct }
}

export function generateWarnings({ targetCalories, bmr, fatGrams, weightKg, sex, trainingDays, carbGrams, deficitPct }) {
  const warnings = []
  if (targetCalories < Math.round(bmr * 1.15))
    warnings.push('Kalorie poniżej bezpiecznego minimum (BMR × 1.15). Ryzyko katabolizmu.')
  if (sex === 'female' && targetCalories < 1600)
    warnings.push('Kalorie < 1600 kcal dla kobiety. Weryfikacja trenera wymagana.')
  if (fatGrams < Math.round(weightKg * 0.6))
    warnings.push(`Tłuszcz < 0.6g/kg (min.). Ryzyko zaburzeń hormonalnych.`)
  if (deficitPct > 25)
    warnings.push('Deficyt > 25% TDEE. Wymagana ręczna akceptacja trenera.')
  if (carbGrams < 100 && trainingDays >= 3)
    warnings.push('Węglowodany < 100g przy 3+ treningach/tydz. Może osłabić progresję.')
  return warnings
}

export function calculateMacros({ targetCalories, weightKg, goal }) {
  const proteinMulti = goal === 'fat_loss' ? 2.2 : goal === 'lean_gain' ? 1.8 : 2.0
  const protein_g = Math.round(weightKg * proteinMulti)
  const fatFromKg = weightKg * 0.8
  const fatFromPct = (targetCalories * 0.20) / 9
  const fat_g = Math.round(Math.max(fatFromKg, fatFromPct) / 5) * 5
  const proteinKcal = protein_g * 4
  const fatKcal = fat_g * 9
  const carbsKcal = Math.max(0, targetCalories - proteinKcal - fatKcal)
  const carbs_g = Math.round(carbsKcal / 4)
  return { protein_g, fat_g, carbs_g }
}

const CEL_MAP = {
  'Redukcja tkanki tłuszczowej': 'fat_loss',
  'Budowa masy mięśniowej': 'lean_gain',
  'Rekompozycja': 'recomp',
  'Wzrost siły': 'lean_gain',
  'Utrzymanie formy': 'maintenance',
}

export function calculateNutritionFromQuestionnaire(q, overrideCalories = null) {
  if (!q) return null
  const weightKg = parseFloat(q.waga_kg) || 0
  const heightCm = parseFloat(q.wzrost_cm) || 0
  const age = parseFloat(q.wiek) || 25
  const sex = q.plec === 'Kobieta' ? 'female' : 'male'
  const trainingDays = parseInt(q.dni_tydzien) || 3
  const averageSteps = parseInt(q.srednie_kroki) || 7000
  const goal = CEL_MAP[q.cel] || 'fat_loss'
  if (!weightKg || !heightCm) return null

  const bmr = calculateBMR({ sex, weightKg, heightCm, age })
  const tdee = estimateTDEE({ bmr, trainingDays, averageSteps })

  let deficitRate = 0
  if (goal === 'fat_loss') deficitRate = 0.15
  else if (goal === 'lean_gain') deficitRate = -0.07

  const calculatedCalories = Math.round(tdee * (1 - deficitRate))
  const targetCalories = overrideCalories || calculatedCalories

  const macros = calculateMacros({ targetCalories, weightKg, goal })
  const aggr = classifyAggressiveness({ targetCalories, tdee })
  const warnings = generateWarnings({
    targetCalories,
    bmr,
    fatGrams: macros.fat_g,
    weightKg,
    sex,
    trainingDays,
    carbGrams: macros.carbs_g,
    deficitPct: aggr.deficitPct,
  })

  const deficitKcal = tdee - targetCalories
  const weeklyRateKg = Math.round((deficitKcal * 7) / 7700 * 100) / 100

  return {
    bmr,
    tdee,
    targetCalories,
    deficitKcal,
    deficitPct: Math.round(aggr.deficitPct * 10) / 10,
    aggressiveness: aggr.label,
    aggressivenessLabelPl: aggr.labelPl,
    aggressivenessColor: aggr.color,
    ...macros,
    proteinPerKg: Math.round((macros.protein_g / weightKg) * 10) / 10,
    warnings,
    weeklyRateKg,
    goal,
    sex,
    weightKg,
    trainingDays,
    rationale: `BMR ${bmr} kcal × ${(tdee / bmr).toFixed(2)} (aktywność) = TDEE ${tdee} kcal. Cel: ${targetCalories} kcal (${Math.round(aggr.deficitPct)}% ${deficitKcal > 0 ? 'deficyt' : 'surplus'}). Białko ${(macros.protein_g / weightKg).toFixed(1)}g/kg.`,
  }
}
