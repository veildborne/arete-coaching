/**
 * Areté Exercise Atlas — Exercise Families
 * 
 * Family + Variant model: warianty biomechaniczne ćwiczeń są SEPARATE EXERCISES,
 * ale linkowane przez `exercise_family` (foreign key textual).
 * 
 * Zasada (z dyskusji architektonicznej):
 *   "Search can be broad. Programming must be specific."
 *   
 * Czyli: użytkownik wpisuje "deadlift" → search znajduje całą rodzinę.
 *        Plan zapisuje konkretne ćwiczenie: "romanian_deadlift".
 * 
 * Co kwalifikuje się do osobnej rodziny:
 *   ✓ Conventional/Sumo/Romanian Deadlift (różny target, fatigue, ROM)
 *   ✓ High/Low Bar Squat (różny target, fatigue distribution)
 *   ✓ Wide/Neutral/Close Lat Pulldown (różny bias, comfort)
 *   ✗ Cable Curl z różnymi attachmentami (kosmetyka)
 *   ✗ Lateral Raise stojąc/siedząc (mała różnica)
 * 
 * @see _types.js dla schema ExerciseFamily
 */

/** @type {import('./_types').ExerciseFamily[]} */
const FAMILIES = [
  // ─────────────────────────────────────────────────────────────────
  // LOWER BODY
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'deadlift',
    display_name: 'Deadlift Family',
    display_name_pl: 'Rodzina martwego ciągu',
    description: 'Hip hinge variants spanning posterior chain emphasis (RDL) to maximum strength (conventional) to glute-dominant (sumo).',
    parent_pattern: 'hip_hinge',
    variant_ids: [
      // Pełna lista wypełniana w validate.js — tu tylko reference
      'conventional_deadlift',
      'sumo_deadlift',
      'romanian_deadlift',
      'dumbbell_romanian_deadlift',
      'single_leg_romanian_deadlift',
      'stiff_leg_deadlift',
      'trap_bar_deadlift',
      'rack_pull',
      'deficit_deadlift',
      'good_morning',
    ],
  },
  {
    id: 'squat',
    display_name: 'Squat Family',
    display_name_pl: 'Rodzina przysiadów',
    description: 'Knee-dominant patterns from quad-biased (front squat, hack squat) to balanced (high bar) to hip-biased (low bar).',
    parent_pattern: 'squat',
    variant_ids: [
      'back_squat',
      'high_bar_squat',
      'low_bar_squat',
      'front_squat',
      'paused_squat',
      'smith_machine_squat',
      'hack_squat',
      'pendulum_squat',
      'belt_squat',
      'v_squat',
      'goblet_squat',
      'cyclist_squat',
      'heel_elevated_squat',
      'sissy_squat',
      'spanish_squat',
    ],
  },
  {
    id: 'leg_press',
    display_name: 'Leg Press Family',
    display_name_pl: 'Rodzina suwnicy',
    description: 'Machine-based knee-dominant patterns. Foot placement changes quad/glute/hamstring bias.',
    parent_pattern: 'squat',
    variant_ids: [
      'leg_press',
      'high_foot_leg_press',
      'low_foot_leg_press',
      'single_leg_leg_press',
    ],
  },
  {
    id: 'split_squat',
    display_name: 'Split Squat Family',
    display_name_pl: 'Rodzina przysiadów rozkrocznych',
    description: 'Single-leg knee-dominant patterns. Bias depends on torso angle and foot placement.',
    parent_pattern: 'squat',
    variant_ids: [
      'bulgarian_split_squat_quad_bias',
      'bulgarian_split_squat_glute_bias',
      'split_squat',
      'smith_machine_split_squat',
      'walking_lunge',
      'reverse_lunge',
      'forward_lunge',
      'curtsy_lunge',
      'step_up',
      'dumbbell_step_up',
    ],
  },
  {
    id: 'hip_thrust',
    display_name: 'Hip Thrust Family',
    display_name_pl: 'Rodzina hip thrust',
    description: 'Hip extension under load with horizontal force vector. Glute-dominant family.',
    parent_pattern: 'hip_extension',
    variant_ids: [
      'barbell_hip_thrust',
      'machine_hip_thrust',
      'smith_machine_hip_thrust',
      'single_leg_hip_thrust',
      'barbell_glute_bridge',
      'smith_machine_glute_bridge',
      'kas_glute_bridge',
      'frog_pump',
    ],
  },
  {
    id: 'leg_curl',
    display_name: 'Leg Curl Family',
    display_name_pl: 'Rodzina uginania nóg',
    description: 'Isolated knee flexion. Seated emphasizes hamstring stretch, lying emphasizes shortened.',
    parent_pattern: 'knee_flexion',
    variant_ids: [
      'seated_leg_curl',
      'lying_leg_curl',
      'standing_leg_curl',
      'single_leg_seated_leg_curl',
      'single_leg_lying_leg_curl',
      'nordic_hamstring_curl',
      'cable_leg_curl',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // UPPER BODY — PUSH
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'bench_press',
    display_name: 'Bench Press Family',
    display_name_pl: 'Rodzina wyciskań poziomych',
    description: 'Horizontal pressing patterns. Incline shifts to upper chest/front delts; decline reduces front delt involvement.',
    parent_pattern: 'horizontal_push',
    variant_ids: [
      'barbell_bench_press',
      'paused_barbell_bench_press',
      'close_grip_bench_press',
      'dumbbell_bench_press',
      'incline_barbell_press',
      'incline_dumbbell_press',
      'low_incline_dumbbell_press',
      'decline_barbell_press',
      'decline_dumbbell_press',
      'smith_machine_bench_press',
      'incline_smith_machine_press',
      'machine_chest_press',
      'incline_machine_chest_press',
      'plate_loaded_chest_press',
      'hammer_strength_chest_press',
      'seated_cable_chest_press',
    ],
  },
  {
    id: 'chest_fly',
    display_name: 'Chest Fly Family',
    display_name_pl: 'Rodzina rozpiętek',
    description: 'Isolated horizontal shoulder adduction. Cable variants offer constant tension; machine variants offer stability.',
    parent_pattern: 'fly_adduction',
    variant_ids: [
      'cable_fly',
      'low_to_high_cable_fly',
      'high_to_low_cable_fly',
      'incline_cable_fly',
      'single_arm_cable_fly',
      'pec_deck',
      'machine_fly',
      'dumbbell_fly',
      'incline_dumbbell_fly',
    ],
  },
  {
    id: 'shoulder_press',
    display_name: 'Shoulder Press Family',
    display_name_pl: 'Rodzina wyciskań nad głowę',
    description: 'Vertical pressing patterns. Standing requires more core stability; seated isolates front/lateral delts.',
    parent_pattern: 'vertical_push',
    variant_ids: [
      'barbell_overhead_press',
      'seated_barbell_overhead_press',
      'dumbbell_shoulder_press',
      'seated_dumbbell_shoulder_press',
      'machine_shoulder_press',
      'smith_machine_shoulder_press',
      'arnold_press',
      'landmine_press',
      'single_arm_landmine_press',
    ],
  },
  {
    id: 'lateral_raise',
    display_name: 'Lateral Raise Family',
    display_name_pl: 'Rodzina unoszeń bokiem',
    description: 'Isolated shoulder abduction. Cable variants offer constant tension through full ROM; lean-away variants emphasize stretch.',
    parent_pattern: 'shoulder_abduction',
    variant_ids: [
      'dumbbell_lateral_raise',
      'seated_dumbbell_lateral_raise',
      'cable_lateral_raise',
      'single_arm_cable_lateral_raise',
      'lean_away_cable_lateral_raise',
      'behind_the_back_cable_lateral_raise',
      'machine_lateral_raise',
      'chest_supported_lateral_raise',
      'incline_bench_lateral_raise',
      'partial_lateral_raise',
      'y_raise',
      'cable_y_raise',
    ],
  },
  {
    id: 'triceps_extension',
    display_name: 'Triceps Extension Family',
    display_name_pl: 'Rodzina prostowania trójgłowego',
    description: 'Isolated elbow extension. Overhead variants stretch long head; pushdown variants emphasize lateral/medial heads.',
    parent_pattern: 'elbow_extension',
    variant_ids: [
      'rope_triceps_pushdown',
      'straight_bar_pushdown',
      'v_bar_pushdown',
      'single_arm_cable_pushdown',
      'reverse_grip_pushdown',
      'overhead_rope_extension',
      'overhead_cable_extension',
      'single_arm_overhead_cable_extension',
      'cross_body_cable_extension',
      'skullcrusher',
      'ez_bar_skullcrusher',
      'dumbbell_skullcrusher',
      'incline_skullcrusher',
      'jm_press',
      'dumbbell_overhead_extension',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // UPPER BODY — PULL
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'lat_pulldown',
    display_name: 'Lat Pulldown Family',
    display_name_pl: 'Rodzina ściągania wyciągu',
    description: 'Vertical pulling on cable. Grip width and orientation change lat/biceps emphasis and shoulder comfort.',
    parent_pattern: 'vertical_pull',
    variant_ids: [
      'lat_pulldown',
      'wide_grip_lat_pulldown',
      'neutral_grip_lat_pulldown',
      'close_grip_lat_pulldown',
      'underhand_lat_pulldown',
      'mag_grip_pulldown',
      'single_arm_lat_pulldown',
      'kneeling_single_arm_lat_pulldown',
      'half_kneeling_cable_pulldown',
    ],
  },
  {
    id: 'pull_up',
    display_name: 'Pull-Up Family',
    display_name_pl: 'Rodzina podciągania',
    description: 'Vertical pulling bodyweight. Chin-up (supinated) shifts toward biceps; pull-up (pronated) emphasizes lats.',
    parent_pattern: 'vertical_pull',
    variant_ids: [
      'pull_up',
      'assisted_pull_up',
      'weighted_pull_up',
      'chin_up',
      'neutral_grip_pull_up',
    ],
  },
  {
    id: 'row',
    display_name: 'Row Family',
    display_name_pl: 'Rodzina wiosłowań',
    description: 'Horizontal pulling. Chest-supported variants eliminate lower back; free-weight variants require core stability.',
    parent_pattern: 'horizontal_pull',
    variant_ids: [
      'barbell_row',
      'pendlay_row',
      'dumbbell_row',
      'single_arm_dumbbell_row',
      'chest_supported_dumbbell_row',
      'chest_supported_t_bar_row',
      't_bar_row',
      'seal_row',
      'meadows_row',
      'seated_cable_row',
      'wide_grip_cable_row',
      'neutral_grip_cable_row',
      'single_arm_cable_row',
      'machine_row',
      'plate_loaded_row',
      'hammer_strength_row',
      'high_row_machine',
      'low_row_machine',
      'single_arm_machine_row',
      'incline_bench_cable_row',
    ],
  },
  {
    id: 'rear_delt_fly',
    display_name: 'Rear Delt Fly Family',
    display_name_pl: 'Rodzina rozpiętek tylnych',
    description: 'Horizontal shoulder abduction with external rotation. Crucial for shoulder health and posture balance.',
    parent_pattern: 'shoulder_horizontal_abduction',
    variant_ids: [
      'reverse_pec_deck',
      'rear_delt_cable_fly',
      'single_arm_rear_delt_cable_fly',
      'bent_over_rear_delt_fly',
      'chest_supported_rear_delt_fly',
      'face_pull',
      'cable_face_pull',
      'rope_face_pull',
    ],
  },
  {
    id: 'biceps_curl',
    display_name: 'Biceps Curl Family',
    display_name_pl: 'Rodzina uginań bicepsa',
    description: 'Elbow flexion isolation. Incline DB stretches long head; preacher isolates short head; cable offers constant tension.',
    parent_pattern: 'elbow_flexion',
    variant_ids: [
      'barbell_curl',
      'ez_bar_curl',
      'dumbbell_curl',
      'alternating_dumbbell_curl',
      'incline_dumbbell_curl',
      'hammer_curl',
      'cross_body_hammer_curl',
      'cable_curl',
      'single_arm_cable_curl',
      'bayesian_cable_curl',
      'preacher_curl',
      'machine_preacher_curl',
      'spider_curl',
      'concentration_curl',
      'cable_hammer_curl',
      'high_cable_curl',
      'drag_curl',
      'zottman_curl',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // ACCESSORY (smaller families)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'calf_raise',
    display_name: 'Calf Raise Family',
    display_name_pl: 'Rodzina wspięć na palce',
    description: 'Plantarflexion. Standing emphasizes gastrocnemius; seated emphasizes soleus.',
    parent_pattern: 'plantarflexion',
    variant_ids: [
      'standing_calf_raise',
      'seated_calf_raise',
      'leg_press_calf_raise',
      'smith_machine_calf_raise',
      'single_leg_standing_calf_raise',
      'donkey_calf_raise',
      'machine_calf_press',
    ],
  },
  {
    id: 'hip_abduction',
    display_name: 'Hip Abduction Family',
    display_name_pl: 'Rodzina odwodzenia biodra',
    description: 'Hip abduction for upper glute (glute medius). Critical for hip stability and glute aesthetics.',
    parent_pattern: 'hip_abduction',
    variant_ids: [
      'hip_abduction_machine',
      'seated_hip_abduction',
      'cable_hip_abduction',
      'standing_cable_hip_abduction',
      'side_lying_hip_abduction',
      'banded_hip_abduction',
    ],
  },
  {
    id: 'back_extension',
    display_name: 'Back Extension Family',
    display_name_pl: 'Rodzina hyperextension',
    description: 'Hip extension prone. Bias changes with foot placement and torso position — can emphasize glutes, hamstrings, or erectors.',
    parent_pattern: 'hip_extension',
    variant_ids: [
      'back_extension',
      '45_degree_back_extension',
      '45_degree_hyperextension_glute_bias',
      '45_degree_hyperextension_hamstring_bias',
      'reverse_hyperextension',
    ],
  },
];

// ============================================================================
//  Helper functions
// ============================================================================

/**
 * Pobiera rodzinę po ID.
 * @param {string} familyId
 * @returns {import('./_types').ExerciseFamily | undefined}
 */
function getFamily(familyId) {
  return FAMILIES.find(f => f.id === familyId);
}

/**
 * Lista wszystkich ID rodzin (do walidacji że exercise.exercise_family istnieje).
 * @returns {string[]}
 */
function getFamilyIds() {
  return FAMILIES.map(f => f.id);
}

module.exports = {
  FAMILIES,
  getFamily,
  getFamilyIds,
};
