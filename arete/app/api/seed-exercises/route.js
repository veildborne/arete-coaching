import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ONE-TIME SEED — wywołaj raz: POST /api/seed-exercises
// Usuń lub zabezpiecz po użyciu!

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const EXERCISES = [
  // ── KLATKA ─────────────────────────────────────────────────────────────────
  { name: 'Barbell Bench Press', name_pl: 'Wyciskanie sztangi na ławce płaskiej', muscle_group: 'chest', equipment: ['barbell'], sfr_rating: 8, stretch_position: false },
  { name: 'Incline Barbell Press', name_pl: 'Wyciskanie sztangi na ławce skośnej', muscle_group: 'chest', equipment: ['barbell'], sfr_rating: 8, stretch_position: false },
  { name: 'Incline Dumbbell Press', name_pl: 'Wyciskanie hantli na ławce skośnej', muscle_group: 'chest', equipment: ['dumbbell'], sfr_rating: 9, stretch_position: true },
  { name: 'Flat Dumbbell Press', name_pl: 'Wyciskanie hantli na ławce płaskiej', muscle_group: 'chest', equipment: ['dumbbell'], sfr_rating: 8, stretch_position: true },
  { name: 'Cable Fly (Low)', name_pl: 'Rozpiętki na wyciągu dolnym', muscle_group: 'chest', equipment: ['cable'], sfr_rating: 9, stretch_position: true },
  { name: 'Pec Deck', name_pl: 'Rozpiętki na maszynie (Pec Deck)', muscle_group: 'chest', equipment: ['machine'], sfr_rating: 9, stretch_position: true },
  { name: 'Dip (Chest)', name_pl: 'Dipy na klatkę', muscle_group: 'chest', equipment: ['bodyweight'], sfr_rating: 7, stretch_position: true },
  { name: 'Smith Machine Incline Press', name_pl: 'Wyciskanie na ławce skośnej w suwnicy', muscle_group: 'chest', equipment: ['smith_machine'], sfr_rating: 7, stretch_position: false },

  // ── PLECY ──────────────────────────────────────────────────────────────────
  { name: 'Pull-Up', name_pl: 'Podciąganie na drążku', muscle_group: 'back', equipment: ['bodyweight'], sfr_rating: 9, stretch_position: true },
  { name: 'Lat Pulldown', name_pl: 'Ściąganie drążka wyciągu górnego', muscle_group: 'back', equipment: ['cable'], sfr_rating: 8, stretch_position: true },
  { name: 'Seated Cable Row', name_pl: 'Wiosłowanie wyciągiem siedzącym', muscle_group: 'back', equipment: ['cable'], sfr_rating: 8, stretch_position: true },
  { name: 'Barbell Row', name_pl: 'Wiosłowanie sztangą', muscle_group: 'back', equipment: ['barbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Dumbbell Row', name_pl: 'Wiosłowanie hantlem', muscle_group: 'back', equipment: ['dumbbell'], sfr_rating: 8, stretch_position: true },
  { name: 'Chest-Supported Row', name_pl: 'Wiosłowanie z podparciem klatki', muscle_group: 'back', equipment: ['machine', 'dumbbell'], sfr_rating: 9, stretch_position: true },
  { name: 'Straight Arm Pulldown', name_pl: 'Ściąganie ramion prostych', muscle_group: 'back', equipment: ['cable'], sfr_rating: 8, stretch_position: true },
  { name: 'Cable Pullover', name_pl: 'Pullover na wyciągu', muscle_group: 'back', equipment: ['cable'], sfr_rating: 8, stretch_position: true },
  { name: 'T-Bar Row', name_pl: 'Wiosłowanie T-barem', muscle_group: 'back', equipment: ['barbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Deadlift', name_pl: 'Martwy ciąg', muscle_group: 'back', equipment: ['barbell'], sfr_rating: 6, stretch_position: false },

  // ── BARKI BOCZNE ───────────────────────────────────────────────────────────
  { name: 'Dumbbell Lateral Raise', name_pl: 'Unoszenie hantli bokiem', muscle_group: 'shoulders_lateral', equipment: ['dumbbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Cable Lateral Raise', name_pl: 'Unoszenie na wyciągu bokiem', muscle_group: 'shoulders_lateral', equipment: ['cable'], sfr_rating: 9, stretch_position: true },
  { name: 'Machine Lateral Raise', name_pl: 'Unoszenie bokiem na maszynie', muscle_group: 'shoulders_lateral', equipment: ['machine'], sfr_rating: 9, stretch_position: true },
  { name: 'Leaning Lateral Raise', name_pl: 'Unoszenie bokiem w odchyleniu', muscle_group: 'shoulders_lateral', equipment: ['dumbbell', 'cable'], sfr_rating: 9, stretch_position: true },

  // ── BARKI TYLNE ────────────────────────────────────────────────────────────
  { name: 'Face Pull', name_pl: 'Face Pull', muscle_group: 'shoulders_rear', equipment: ['cable'], sfr_rating: 9, stretch_position: true },
  { name: 'Reverse Pec Deck', name_pl: 'Rozpiętki odwrócone na maszynie', muscle_group: 'shoulders_rear', equipment: ['machine'], sfr_rating: 9, stretch_position: true },
  { name: 'Dumbbell Rear Delt Fly', name_pl: 'Rozpiętki tylne hantlami', muscle_group: 'shoulders_rear', equipment: ['dumbbell'], sfr_rating: 7, stretch_position: true },
  { name: 'Cable Rear Delt Fly', name_pl: 'Rozpiętki tylne na wyciągu', muscle_group: 'shoulders_rear', equipment: ['cable'], sfr_rating: 8, stretch_position: true },

  // ── BICEPS ─────────────────────────────────────────────────────────────────
  { name: 'Barbell Curl', name_pl: 'Uginanie ze sztangą', muscle_group: 'biceps', equipment: ['barbell'], sfr_rating: 8, stretch_position: false },
  { name: 'Incline Dumbbell Curl', name_pl: 'Uginanie hantlami na ławce skośnej', muscle_group: 'biceps', equipment: ['dumbbell'], sfr_rating: 9, stretch_position: true },
  { name: 'Cable Curl', name_pl: 'Uginanie na wyciągu', muscle_group: 'biceps', equipment: ['cable'], sfr_rating: 9, stretch_position: true },
  { name: 'Hammer Curl', name_pl: 'Uginanie neutralne (Hammer)', muscle_group: 'biceps', equipment: ['dumbbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Preacher Curl', name_pl: 'Uginanie na modliszce', muscle_group: 'biceps', equipment: ['barbell', 'machine'], sfr_rating: 8, stretch_position: true },
  { name: 'Spider Curl', name_pl: 'Spider Curl', muscle_group: 'biceps', equipment: ['barbell', 'dumbbell'], sfr_rating: 8, stretch_position: false },

  // ── TRICEPS ────────────────────────────────────────────────────────────────
  { name: 'Overhead Triceps Extension', name_pl: 'Prostowanie ramion nad głową', muscle_group: 'triceps', equipment: ['cable', 'dumbbell'], sfr_rating: 9, stretch_position: true },
  { name: 'Cable Pushdown', name_pl: 'Prostowanie ramion na wyciągu', muscle_group: 'triceps', equipment: ['cable'], sfr_rating: 8, stretch_position: false },
  { name: 'Skull Crusher', name_pl: 'Łamanie czaszki', muscle_group: 'triceps', equipment: ['barbell', 'dumbbell'], sfr_rating: 8, stretch_position: true },
  { name: 'Dip (Triceps)', name_pl: 'Dipy na triceps', muscle_group: 'triceps', equipment: ['bodyweight'], sfr_rating: 7, stretch_position: false },
  { name: 'Close Grip Bench Press', name_pl: 'Wyciskanie wąskim chwytem', muscle_group: 'triceps', equipment: ['barbell'], sfr_rating: 7, stretch_position: false },
  { name: 'JM Press', name_pl: 'JM Press', muscle_group: 'triceps', equipment: ['barbell'], sfr_rating: 7, stretch_position: false },

  // ── QUADY ──────────────────────────────────────────────────────────────────
  { name: 'Barbell Squat', name_pl: 'Przysiad ze sztangą', muscle_group: 'quads', equipment: ['barbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Leg Press', name_pl: 'Leg press', muscle_group: 'quads', equipment: ['machine'], sfr_rating: 8, stretch_position: true },
  { name: 'Hack Squat', name_pl: 'Hack squat', muscle_group: 'quads', equipment: ['machine'], sfr_rating: 8, stretch_position: true },
  { name: 'Bulgarian Split Squat', name_pl: 'Przysiad bułgarski', muscle_group: 'quads', equipment: ['dumbbell', 'barbell'], sfr_rating: 9, stretch_position: true },
  { name: 'Leg Extension', name_pl: 'Prostowanie nóg na maszynie', muscle_group: 'quads', equipment: ['machine'], sfr_rating: 7, stretch_position: false },
  { name: 'Pendulum Squat', name_pl: 'Pendulum squat', muscle_group: 'quads', equipment: ['machine'], sfr_rating: 8, stretch_position: true },
  { name: 'Front Squat', name_pl: 'Przysiad ze sztangą z przodu', muscle_group: 'quads', equipment: ['barbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Walking Lunge', name_pl: 'Wykroki w chodzie', muscle_group: 'quads', equipment: ['dumbbell', 'barbell'], sfr_rating: 7, stretch_position: true },

  // ── HAMSTRINGI ─────────────────────────────────────────────────────────────
  { name: 'Romanian Deadlift', name_pl: 'Martwy ciąg rumuński', muscle_group: 'hamstrings', equipment: ['barbell', 'dumbbell'], sfr_rating: 9, stretch_position: true },
  { name: 'Lying Leg Curl', name_pl: 'Uginanie nóg leżąc', muscle_group: 'hamstrings', equipment: ['machine'], sfr_rating: 8, stretch_position: true },
  { name: 'Seated Leg Curl', name_pl: 'Uginanie nóg siedząc', muscle_group: 'hamstrings', equipment: ['machine'], sfr_rating: 9, stretch_position: true },
  { name: 'Nordic Curl', name_pl: 'Nordic curl', muscle_group: 'hamstrings', equipment: ['bodyweight'], sfr_rating: 7, stretch_position: false },
  { name: 'Good Morning', name_pl: 'Good morning', muscle_group: 'hamstrings', equipment: ['barbell'], sfr_rating: 7, stretch_position: true },
  { name: 'Stiff-Leg Deadlift', name_pl: 'Martwy ciąg na prostych nogach', muscle_group: 'hamstrings', equipment: ['barbell', 'dumbbell'], sfr_rating: 8, stretch_position: true },

  // ── POŚLADKI ───────────────────────────────────────────────────────────────
  { name: 'Hip Thrust', name_pl: 'Hip thrust', muscle_group: 'glutes', equipment: ['barbell', 'machine'], sfr_rating: 9, stretch_position: false },
  { name: 'Cable Pull Through', name_pl: 'Przeciąganie liny przez nogi', muscle_group: 'glutes', equipment: ['cable'], sfr_rating: 8, stretch_position: true },
  { name: 'Glute Bridge', name_pl: 'Mostek pośladkowy', muscle_group: 'glutes', equipment: ['bodyweight', 'barbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Abduction Machine', name_pl: 'Odwodzenie na maszynie', muscle_group: 'glutes', equipment: ['machine'], sfr_rating: 7, stretch_position: false },

  // ── ŁYDKI ──────────────────────────────────────────────────────────────────
  { name: 'Standing Calf Raise', name_pl: 'Wspięcia na palce stojąc', muscle_group: 'calves', equipment: ['machine', 'barbell'], sfr_rating: 7, stretch_position: true },
  { name: 'Seated Calf Raise', name_pl: 'Wspięcia na palce siedząc', muscle_group: 'calves', equipment: ['machine'], sfr_rating: 8, stretch_position: true },
  { name: 'Leg Press Calf Raise', name_pl: 'Wspięcia na palce na leg pressie', muscle_group: 'calves', equipment: ['machine'], sfr_rating: 7, stretch_position: true },

  // ── BRZUCH ─────────────────────────────────────────────────────────────────
  { name: 'Cable Crunch', name_pl: 'Spięcia brzucha na wyciągu', muscle_group: 'abs', equipment: ['cable'], sfr_rating: 8, stretch_position: false },
  { name: 'Hanging Leg Raise', name_pl: 'Unoszenie nóg w zwisie', muscle_group: 'abs', equipment: ['bodyweight'], sfr_rating: 8, stretch_position: false },
  { name: 'Ab Wheel Rollout', name_pl: 'Rollout kołem', muscle_group: 'abs', equipment: ['other'], sfr_rating: 7, stretch_position: true },
  { name: 'Plank', name_pl: 'Deska', muscle_group: 'abs', equipment: ['bodyweight'], sfr_rating: 5, stretch_position: false },
  { name: 'Machine Crunch', name_pl: 'Spięcia brzucha na maszynie', muscle_group: 'abs', equipment: ['machine'], sfr_rating: 7, stretch_position: false },

  // ── OHP (barki przednie) ───────────────────────────────────────────────────
  { name: 'Overhead Press', name_pl: 'Wyciskanie nad głowę (OHP)', muscle_group: 'shoulders_lateral', equipment: ['barbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Dumbbell Shoulder Press', name_pl: 'Wyciskanie hantli nad głowę', muscle_group: 'shoulders_lateral', equipment: ['dumbbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Arnold Press', name_pl: 'Arnold Press', muscle_group: 'shoulders_lateral', equipment: ['dumbbell'], sfr_rating: 7, stretch_position: false },
  { name: 'Machine Shoulder Press', name_pl: 'Wyciskanie na maszynie nad głowę', muscle_group: 'shoulders_lateral', equipment: ['machine'], sfr_rating: 7, stretch_position: false },
]

export async function POST(request) {
  // Basic guard — usuń po użyciu lub dodaj secret check
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabaseAdmin
    .from('exercises')
    .upsert(EXERCISES, { onConflict: 'name' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    seeded: EXERCISES.length,
    message: `Dodano ${EXERCISES.length} ćwiczeń do bazy.`,
  })
}