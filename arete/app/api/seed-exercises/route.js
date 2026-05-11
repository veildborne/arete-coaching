import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// TIER LISTA:
// S — najlepsze dla hipertrofii: wysoki stimulus, stretch position, bezpieczne, łatwa progresja
// A — bardzo dobre, skill-dependent lub mniej stretch
// B — przydatne sytuacyjnie, gorszy SFR
// C — rzadko używane, głównie różnorodność

// unilateral: true — ćwiczenie wykonywane jedną kończyną (wykrywa asymetrię, korekta dysproporcji)

const EXERCISES = [

  // ══════════════════════════════════════════════════════════════════════════
  // KLATKA PIERSIOWA
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Incline Dumbbell Press',
    name_pl: 'Wyciskanie hantli na ławce skośnej',
    muscle_group: 'chest',
    equipment: ['dumbbell'],
    tier: 'S', compound: true, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'push', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Cable Fly Low',
    name_pl: 'Rozpiętki na wyciągu dolnym',
    muscle_group: 'chest',
    equipment: ['cable'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'fly', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Pec Deck',
    name_pl: 'Rozpiętki na maszynie (Pec Deck)',
    muscle_group: 'chest',
    equipment: ['machine', 'pec_deck'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'fly', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Flat Dumbbell Press',
    name_pl: 'Wyciskanie hantli na ławce płaskiej',
    muscle_group: 'chest',
    equipment: ['dumbbell'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'push', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Barbell Bench Press',
    name_pl: 'Wyciskanie sztangi na ławce płaskiej',
    muscle_group: 'chest',
    equipment: ['barbell'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'push', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Incline Barbell Press',
    name_pl: 'Wyciskanie sztangi na ławce skośnej',
    muscle_group: 'chest',
    equipment: ['barbell'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'push', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Smith Machine Incline Press',
    name_pl: 'Wyciskanie na ławce skośnej w suwnicy',
    muscle_group: 'chest',
    equipment: ['smith_machine'],
    tier: 'A', compound: true, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'push', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Dip Chest',
    name_pl: 'Dipy na klatkę',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'push', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Single Arm Cable Fly',
    name_pl: 'Rozpiętki na wyciągu jedną ręką',
    muscle_group: 'chest',
    equipment: ['cable'],
    tier: 'A', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'fly', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PLECY
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Chest Supported Row',
    name_pl: 'Wiosłowanie z podparciem klatki',
    muscle_group: 'back',
    equipment: ['machine', 'dumbbell'],
    tier: 'S', compound: true, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'row', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Seated Cable Row',
    name_pl: 'Wiosłowanie wyciągiem siedzącym',
    muscle_group: 'back',
    // FIX: dodano 'seated_row' — klient zaznacza ten sprzęt osobno w ankiecie
    equipment: ['cable', 'seated_row'],
    tier: 'S', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'row', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Lat Pulldown',
    name_pl: 'Ściąganie drążka wyciągu górnego',
    muscle_group: 'back',
    // FIX: dodano 'lat_pulldown' — klient zaznacza ten sprzęt osobno w ankiecie
    equipment: ['cable', 'lat_pulldown'],
    tier: 'S', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'vertical_pull', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Cable Pullover',
    name_pl: 'Pullover na wyciągu',
    muscle_group: 'back',
    equipment: ['cable'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'pullover', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Dumbbell Row',
    name_pl: 'Wiosłowanie hantlem',
    muscle_group: 'back',
    equipment: ['dumbbell'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'row', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Pull Up',
    name_pl: 'Podciąganie na drążku',
    muscle_group: 'back',
    equipment: ['bodyweight', 'pull_up_bar'],
    tier: 'A', compound: true, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'vertical_pull', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Straight Arm Pulldown',
    name_pl: 'Ściąganie ramion prostych',
    muscle_group: 'back',
    equipment: ['cable'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'pullover', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Barbell Row',
    name_pl: 'Wiosłowanie sztangą',
    muscle_group: 'back',
    equipment: ['barbell'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'row', lower_back_fatigue: 'high', joint_risk: 'low',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Deadlift',
    name_pl: 'Martwy ciąg',
    muscle_group: 'back',
    equipment: ['barbell'],
    tier: 'B', compound: true, sfr_rating: 6, stretch_position: false,
    movement_pattern: 'hinge', lower_back_fatigue: 'high', joint_risk: 'medium',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Single Arm Cable Row',
    name_pl: 'Wiosłowanie wyciągiem jedną ręką',
    muscle_group: 'back',
    equipment: ['cable'],
    tier: 'A', compound: true, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'row', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Single Arm Lat Pulldown',
    name_pl: 'Ściąganie wyciągu górnego jedną ręką',
    muscle_group: 'back',
    equipment: ['cable', 'lat_pulldown'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'vertical_pull', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BARKI BOCZNE
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Cable Lateral Raise',
    name_pl: 'Unoszenie na wyciągu bokiem',
    muscle_group: 'shoulders_lat',
    equipment: ['cable'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'lateral_raise', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Machine Lateral Raise',
    name_pl: 'Unoszenie bokiem na maszynie',
    muscle_group: 'shoulders_lat',
    equipment: ['machine'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'lateral_raise', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Leaning Lateral Raise',
    name_pl: 'Unoszenie bokiem w odchyleniu',
    muscle_group: 'shoulders_lat',
    equipment: ['dumbbell', 'cable'],
    tier: 'A', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'lateral_raise', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Dumbbell Lateral Raise',
    name_pl: 'Unoszenie hantli bokiem',
    muscle_group: 'shoulders_lat',
    equipment: ['dumbbell'],
    tier: 'A', compound: false, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'lateral_raise', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Overhead Press',
    name_pl: 'Wyciskanie nad głowę (OHP)',
    muscle_group: 'shoulders_lat',
    equipment: ['barbell'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'overhead_press', lower_back_fatigue: 'medium', joint_risk: 'medium',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Dumbbell Shoulder Press',
    name_pl: 'Wyciskanie hantli nad głowę',
    muscle_group: 'shoulders_lat',
    equipment: ['dumbbell'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'overhead_press', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Machine Shoulder Press',
    name_pl: 'Wyciskanie na maszynie nad głowę',
    muscle_group: 'shoulders_lat',
    equipment: ['machine'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'overhead_press', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Single Arm Dumbbell Press',
    name_pl: 'Wyciskanie hantla jedną ręką',
    muscle_group: 'shoulders_lat',
    equipment: ['dumbbell'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'overhead_press', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: false, unilateral: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BARKI TYLNE
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Face Pull',
    name_pl: 'Face Pull',
    muscle_group: 'shoulders_rear',
    equipment: ['cable'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'rear_delt', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Reverse Pec Deck',
    name_pl: 'Rozpiętki odwrócone na maszynie',
    muscle_group: 'shoulders_rear',
    equipment: ['machine', 'pec_deck'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'rear_delt', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Cable Rear Delt Fly',
    name_pl: 'Rozpiętki tylne na wyciągu',
    muscle_group: 'shoulders_rear',
    equipment: ['cable'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'rear_delt', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Dumbbell Rear Delt Fly',
    name_pl: 'Rozpiętki tylne hantlami',
    muscle_group: 'shoulders_rear',
    equipment: ['dumbbell'],
    tier: 'B', compound: false, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'rear_delt', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BICEPS
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Incline Dumbbell Curl',
    name_pl: 'Uginanie hantlami na ławce skośnej',
    muscle_group: 'biceps',
    equipment: ['dumbbell'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Cable Curl',
    name_pl: 'Uginanie na wyciągu',
    muscle_group: 'biceps',
    equipment: ['cable'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Preacher Curl',
    name_pl: 'Uginanie na modliszce',
    muscle_group: 'biceps',
    equipment: ['barbell', 'machine'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Barbell Curl',
    name_pl: 'Uginanie ze sztangą',
    muscle_group: 'biceps',
    equipment: ['barbell'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Hammer Curl',
    name_pl: 'Uginanie neutralne (Hammer)',
    muscle_group: 'biceps',
    equipment: ['dumbbell'],
    tier: 'B', compound: false, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Spider Curl',
    name_pl: 'Spider Curl',
    muscle_group: 'biceps',
    equipment: ['barbell', 'dumbbell'],
    tier: 'B', compound: false, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Single Arm Cable Curl',
    name_pl: 'Uginanie na wyciągu jedną ręką',
    muscle_group: 'biceps',
    equipment: ['cable'],
    tier: 'A', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TRICEPS
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Overhead Triceps Extension',
    name_pl: 'Prostowanie ramion nad głową',
    muscle_group: 'triceps',
    equipment: ['cable', 'dumbbell'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'triceps_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Single Arm Overhead Extension',
    name_pl: 'Prostowanie ramienia nad głową jedną ręką',
    muscle_group: 'triceps',
    equipment: ['cable', 'dumbbell'],
    tier: 'A', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'triceps_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Skull Crusher',
    name_pl: 'Łamanie czaszki',
    muscle_group: 'triceps',
    equipment: ['barbell', 'dumbbell'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'triceps_extension', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Cable Pushdown',
    name_pl: 'Prostowanie ramion na wyciągu',
    muscle_group: 'triceps',
    equipment: ['cable'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'triceps_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Close Grip Bench Press',
    name_pl: 'Wyciskanie wąskim chwytem',
    movement_pattern: 'close_grip_bench',
    muscle_group: 'triceps',
    equipment: ['barbell'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: false,
    lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Dip Triceps',
    name_pl: 'Dipy na triceps',
    muscle_group: 'triceps',
    equipment: ['bodyweight'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'push', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: false, unilateral: false,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // QUADY
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Hack Squat',
    name_pl: 'Hack squat',
    muscle_group: 'quads',
    equipment: ['hack_squat'],
    tier: 'S', compound: true, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'squat', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Leg Press',
    name_pl: 'Leg press / suwnica',
    muscle_group: 'quads',
    equipment: ['leg_press'],
    tier: 'S', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'squat', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Bulgarian Split Squat',
    name_pl: 'Przysiad bułgarski',
    muscle_group: 'quads',
    equipment: ['dumbbell', 'barbell'],
    tier: 'A', compound: true, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'lunge', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: false, unilateral: true,
  },
  {
    name: 'Leg Extension',
    name_pl: 'Prostowanie nóg na maszynie',
    muscle_group: 'quads',
    equipment: ['leg_extension'],
    tier: 'A', compound: false, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'isolation', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Single Leg Extension',
    name_pl: 'Prostowanie nóg na maszynie (jedna noga)',
    muscle_group: 'quads',
    equipment: ['leg_extension'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'isolation', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Single Leg Press',
    name_pl: 'Leg press jedną nogą',
    muscle_group: 'quads',
    equipment: ['leg_press'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'squat', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Barbell Squat',
    name_pl: 'Przysiad ze sztangą',
    muscle_group: 'quads',
    equipment: ['barbell'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'squat', lower_back_fatigue: 'high', joint_risk: 'medium',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Walking Lunge',
    name_pl: 'Wykroki w chodzie',
    muscle_group: 'quads',
    equipment: ['dumbbell', 'barbell'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'lunge', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: false, unilateral: true,
  },
  {
    name: 'Reverse Lunge',
    name_pl: 'Wykroki w tył',
    muscle_group: 'quads',
    equipment: ['dumbbell', 'barbell', 'bodyweight'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'lunge', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HAMSTRINGI
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Seated Leg Curl',
    name_pl: 'Uginanie nóg siedząc',
    muscle_group: 'hamstrings',
    equipment: ['leg_curl'],
    tier: 'S', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'isolation', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Romanian Deadlift',
    name_pl: 'Martwy ciąg rumuński',
    muscle_group: 'hamstrings',
    equipment: ['barbell', 'dumbbell'],
    tier: 'S', compound: true, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'hinge', lower_back_fatigue: 'medium', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Lying Leg Curl',
    name_pl: 'Uginanie nóg leżąc',
    muscle_group: 'hamstrings',
    equipment: ['leg_curl'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'isolation', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Single Leg Curl',
    name_pl: 'Uginanie nóg siedząc (jedna noga)',
    muscle_group: 'hamstrings',
    equipment: ['leg_curl'],
    tier: 'A', compound: false, sfr_rating: 9, stretch_position: true,
    movement_pattern: 'isolation', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Single Leg Romanian Deadlift',
    name_pl: 'Martwy ciąg rumuński na jednej nodze',
    muscle_group: 'hamstrings',
    equipment: ['dumbbell', 'barbell'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'hinge', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: false, unilateral: true,
  },
  {
    name: 'Stiff Leg Deadlift',
    name_pl: 'Martwy ciąg na prostych nogach',
    muscle_group: 'hamstrings',
    equipment: ['barbell', 'dumbbell'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'hinge', lower_back_fatigue: 'medium', joint_risk: 'low',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Nordic Curl',
    name_pl: 'Nordic curl',
    muscle_group: 'hamstrings',
    equipment: ['bodyweight'],
    tier: 'B', compound: false, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'isolation', lower_back_fatigue: 'low', joint_risk: 'medium',
    beginner_friendly: false, unilateral: false,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // POŚLADKI
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Hip Thrust Machine',
    name_pl: 'Hip thrust na maszynie',
    muscle_group: 'glutes',
    equipment: ['hip_thrust_machine'],
    tier: 'S', compound: true, sfr_rating: 10, stretch_position: false,
    movement_pattern: 'hip_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Hip Thrust Barbell',
    name_pl: 'Hip thrust ze sztangą',
    muscle_group: 'glutes',
    equipment: ['barbell'],
    tier: 'S', compound: true, sfr_rating: 9, stretch_position: false,
    movement_pattern: 'hip_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Single Leg Hip Thrust',
    name_pl: 'Hip thrust na jednej nodze',
    muscle_group: 'glutes',
    equipment: ['bodyweight', 'barbell'],
    tier: 'A', compound: true, sfr_rating: 9, stretch_position: false,
    movement_pattern: 'hip_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: false, unilateral: true,
  },
  {
    name: 'Cable Pull Through',
    name_pl: 'Przeciąganie liny przez nogi',
    muscle_group: 'glutes',
    equipment: ['cable'],
    tier: 'A', compound: true, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'hip_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Abduction Machine',
    name_pl: 'Odwodzenie na maszynie',
    muscle_group: 'glutes',
    equipment: ['abductor'],
    tier: 'A', compound: false, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'abduction', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Cable Kickback',
    name_pl: 'Odpychanie nogi na wyciągu',
    muscle_group: 'glutes',
    equipment: ['cable'],
    tier: 'A', compound: false, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'hip_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Glute Bridge',
    name_pl: 'Mostek pośladkowy',
    muscle_group: 'glutes',
    equipment: ['bodyweight', 'barbell'],
    tier: 'B', compound: true, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'hip_extension', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ŁYDKI
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Seated Calf Raise',
    name_pl: 'Wspięcia na palce siedząc',
    muscle_group: 'calves',
    equipment: ['machine'],
    tier: 'S', compound: false, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'calf_raise', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Standing Calf Raise',
    name_pl: 'Wspięcia na palce stojąc',
    muscle_group: 'calves',
    equipment: ['machine', 'barbell'],
    tier: 'A', compound: false, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'calf_raise', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Single Leg Calf Raise',
    name_pl: 'Wspięcia na palce na jednej nodze',
    muscle_group: 'calves',
    equipment: ['bodyweight', 'dumbbell'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: true,
    movement_pattern: 'calf_raise', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Leg Press Calf Raise',
    name_pl: 'Wspięcia na palce na leg pressie',
    muscle_group: 'calves',
    equipment: ['leg_press'],
    tier: 'B', compound: false, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'calf_raise', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BRZUCH
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Cable Crunch',
    name_pl: 'Spięcia brzucha na wyciągu',
    muscle_group: 'abs',
    equipment: ['cable'],
    tier: 'S', compound: false, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'crunch', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Hanging Leg Raise',
    name_pl: 'Unoszenie nóg w zwisie',
    muscle_group: 'abs',
    equipment: ['bodyweight', 'pull_up_bar'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'crunch', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Machine Crunch',
    name_pl: 'Spięcia brzucha na maszynie',
    muscle_group: 'abs',
    equipment: ['machine'],
    tier: 'A', compound: false, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'crunch', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Ab Wheel Rollout',
    name_pl: 'Rollout kołem brzusznym',
    muscle_group: 'abs',
    equipment: ['other'],
    tier: 'B', compound: false, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'crunch', lower_back_fatigue: 'medium', joint_risk: 'low',
    beginner_friendly: false, unilateral: false,
  },
  {
    name: 'Plank',
    name_pl: 'Deska',
    muscle_group: 'abs',
    equipment: ['bodyweight'],
    tier: 'C', compound: false, sfr_rating: 5, stretch_position: false,
    movement_pattern: 'isometric', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRZEDRAMIONA (FOREARMS)
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Barbell Wrist Curl',
    name_pl: 'Zginanie nadgarstków ze sztangą',
    muscle_group: 'forearms',
    equipment: ['barbell'],
    tier: 'A', compound: false, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'wrist_curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Dumbbell Wrist Curl',
    name_pl: 'Zginanie nadgarstków z hantlem',
    muscle_group: 'forearms',
    equipment: ['dumbbell'],
    tier: 'A', compound: false, sfr_rating: 7, stretch_position: true,
    movement_pattern: 'wrist_curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: true,
  },
  {
    name: 'Reverse Curl',
    name_pl: 'Uginanie odwróconym chwytem',
    muscle_group: 'forearms',
    equipment: ['barbell', 'dumbbell'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Cable Reverse Curl',
    name_pl: 'Uginanie odwróconym chwytem na wyciągu',
    muscle_group: 'forearms',
    equipment: ['cable'],
    tier: 'A', compound: false, sfr_rating: 8, stretch_position: false,
    movement_pattern: 'curl', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
  {
    name: 'Farmers Carry',
    name_pl: 'Farmers carry (spacer z obciążeniem)',
    muscle_group: 'forearms',
    equipment: ['dumbbell', 'barbell'],
    tier: 'B', compound: false, sfr_rating: 7, stretch_position: false,
    movement_pattern: 'carry', lower_back_fatigue: 'low', joint_risk: 'low',
    beginner_friendly: true, unilateral: false,
  },
]

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error, data } = await supabaseAdmin
    .from('exercises')
    .upsert(EXERCISES, { onConflict: 'name' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const byMuscle = EXERCISES.reduce((acc, ex) => {
    acc[ex.muscle_group] = (acc[ex.muscle_group] || 0) + 1
    return acc
  }, {})

  const unilateralCount = EXERCISES.filter(e => e.unilateral).length

  return NextResponse.json({
    ok: true,
    seeded: EXERCISES.length,
    unilateral: unilateralCount,
    by_muscle: byMuscle,
    message: `Zaktualizowano ${EXERCISES.length} ćwiczeń (${unilateralCount} unilateral).`,
  })
}