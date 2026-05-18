/**
 * Areté Exercise Atlas — Main index
 * 
 * Eksportuje cały atlas jako pojedynczą tablicę przez merge wszystkich partii.
 * 
 * Każda partia żyje w osobnym pliku (chest.js, back.js, ...) z powodów
 * developer experience — IDE radzi sobie z 1500-linijkowym plikiem,
 * 14000-linijkowy zabija intellisense.
 */

const chestExercises = require('./chest');
const backExercises = require('./back');
const shouldersFrontExercises = require('./shoulders_front');
const shouldersLatExercises = require('./shoulders_lat');
const shouldersRearExercises = require('./shoulders_rear');
const bicepsExercises = require('./biceps');
const tricepsExercises = require('./triceps');
const forearmsExercises = require('./forearms');
const quadsExercises = require('./quads');
const hamstringsExercises = require('./hamstrings');
const glutesExercises = require('./glutes');
const calvesExercises = require('./calves');
const absExercises = require('./abs');

/** @type {import('./_types').Exercise[]} */
const exercisesCore = [
  ...chestExercises,
  ...backExercises,
  ...shouldersFrontExercises,
  ...shouldersLatExercises,
  ...shouldersRearExercises,
  ...bicepsExercises,
  ...tricepsExercises,
  ...forearmsExercises,
  ...quadsExercises,
  ...hamstringsExercises,
  ...glutesExercises,
  ...calvesExercises,
  ...absExercises,
];

/**
 * Lookup ćwiczenia po semantic id.
 * @param {string} id
 * @returns {import('./_types').Exercise | undefined}
 */
function getExerciseById(id) {
  return exercisesCore.find(e => e.id === id);
}

/**
 * Lookup ćwiczenia po name (canonical English).
 * Używane przy mapowaniu UUID z DB → semantic atlas.
 * @param {string} name
 * @returns {import('./_types').Exercise | undefined}
 */
function getExerciseByName(name) {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  return exercisesCore.find(e => e.name.toLowerCase() === lower);
}

/**
 * Wszystkie ćwiczenia z danej rodziny.
 * @param {string} familyId
 * @returns {import('./_types').Exercise[]}
 */
function getExercisesByFamily(familyId) {
  return exercisesCore.filter(e => e.exercise_family === familyId);
}

/**
 * Wszystkie ćwiczenia z danej partii.
 * @param {string} muscleGroup
 * @returns {import('./_types').Exercise[]}
 */
function getExercisesByMuscleGroup(muscleGroup) {
  return exercisesCore.filter(e => e.muscle_group === muscleGroup);
}

module.exports = {
  exercisesCore,
  getExerciseById,
  getExerciseByName,
  getExercisesByFamily,
  getExercisesByMuscleGroup,
};
