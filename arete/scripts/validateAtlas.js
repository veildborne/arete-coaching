/**
 * Areté Exercise Atlas — Validation runner
 * 
 * Standalone walidacja całego atlasu BEZ łączenia się z DB.
 * 
 * Uruchom:
 *   cd arete
 *   node scripts/validateAtlas.js
 * 
 * Use case: po każdej sesji dodania partii (np. po dodaniu chest.js),
 * uruchom validateAtlas żeby sprawdzić czy:
 *   - nie ma duplikatów
 *   - alternatives[] wskazują na istniejące ID
 *   - wszystkie wymagane pola są wypełnione
 *   - zakresy wartości (SFR, tier, etc.) są poprawne
 * 
 * Exit code:
 *   0 = wszystko OK
 *   1 = są errory (seed zostanie zablokowany)
 */

const { exercisesCore } = require('../data/exercises');
const { validateAtlas, printReport } = require('../lib/exercises/validate');

const result = validateAtlas(exercisesCore);
printReport(result);

process.exit(result.ok ? 0 : 1);
