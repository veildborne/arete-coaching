// ─── BAZA PRODUKTÓW (~150 pozycji) ───────────────────────────────────────────
// Makro per 100g: { kcal, protein, fat, carbs }
// swap_group: carb_grain | protein_meat | protein_fish | protein_dairy | fat_source | vegetable | fruit

export const FOODS = [
  // BIAŁKO — MIĘSO
  { id: 'chicken_breast',   name: 'Pierś z kurczaka',      kcal: 165, protein: 31, fat: 3.6, carbs: 0,   swap_group: 'protein_meat' },
  { id: 'chicken_thigh',    name: 'Udo z kurczaka',         kcal: 209, protein: 26, fat: 11,  carbs: 0,   swap_group: 'protein_meat' },
  { id: 'turkey_breast',    name: 'Pierś z indyka',         kcal: 135, protein: 30, fat: 1,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'beef_lean',        name: 'Wołowina chuda',         kcal: 198, protein: 26, fat: 10,  carbs: 0,   swap_group: 'protein_meat' },
  { id: 'beef_mince',       name: 'Mielone wołowe (10%)',   kcal: 175, protein: 24, fat: 9,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'pork_loin',        name: 'Schab wieprzowy',        kcal: 182, protein: 29, fat: 7,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'ham_lean',         name: 'Szynka gotowana chuda',  kcal: 107, protein: 18, fat: 3,   carbs: 2,   swap_group: 'protein_meat' },

  // BIAŁKO — RYBY
  { id: 'salmon',           name: 'Łosoś',                  kcal: 208, protein: 20, fat: 13,  carbs: 0,   swap_group: 'protein_fish' },
  { id: 'tuna_can',         name: 'Tuńczyk w wodzie',       kcal: 116, protein: 26, fat: 1,   carbs: 0,   swap_group: 'protein_fish' },
  { id: 'cod',              name: 'Dorsz',                  kcal: 82,  protein: 18, fat: 0.7, carbs: 0,   swap_group: 'protein_fish' },
  { id: 'tilapia',          name: 'Tilapia',                kcal: 96,  protein: 20, fat: 2,   carbs: 0,   swap_group: 'protein_fish' },
  { id: 'mackerel',         name: 'Makrela',                kcal: 205, protein: 19, fat: 14,  carbs: 0,   swap_group: 'protein_fish' },
  { id: 'shrimp',           name: 'Krewetki',               kcal: 85,  protein: 18, fat: 1,   carbs: 0,   swap_group: 'protein_fish' },
  { id: 'sardines',         name: 'Sardynki w sosie wł.',   kcal: 135, protein: 17, fat: 7,   carbs: 0,   swap_group: 'protein_fish' },

  // BIAŁKO — NABIAŁ / JAJA
  { id: 'eggs_whole',       name: 'Jajko całe',             kcal: 155, protein: 13, fat: 11,  carbs: 1,   swap_group: 'protein_dairy' },
  { id: 'egg_whites',       name: 'Białka jaj',             kcal: 52,  protein: 11, fat: 0.2, carbs: 0.7, swap_group: 'protein_dairy' },
  { id: 'cottage_cheese',   name: 'Twaróg chudy',           kcal: 98,  protein: 12, fat: 4,   carbs: 3,   swap_group: 'protein_dairy' },
  { id: 'greek_yogurt',     name: 'Jogurt grecki 0%',       kcal: 59,  protein: 10, fat: 0.4, carbs: 3.6, swap_group: 'protein_dairy' },
  { id: 'whey_protein',     name: 'Odżywka białkowa WPC',   kcal: 380, protein: 74, fat: 7,   carbs: 8,   swap_group: 'protein_dairy' },
  { id: 'milk_2pct',        name: 'Mleko 2%',               kcal: 50,  protein: 3.4,fat: 2,   carbs: 4.8, swap_group: 'protein_dairy' },
  { id: 'skyr',             name: 'Skyr naturalny',         kcal: 63,  protein: 11, fat: 0.2, carbs: 4,   swap_group: 'protein_dairy' },
  { id: 'mozzarella',       name: 'Mozzarella light',       kcal: 149, protein: 22, fat: 6,   carbs: 1,   swap_group: 'protein_dairy' },

  // WĘGLOWODANY — ZBOŻA
  { id: 'oats',             name: 'Płatki owsiane',         kcal: 367, protein: 13, fat: 7,   carbs: 62,  swap_group: 'carb_grain' },
  { id: 'rice_white',       name: 'Ryż biały (suchy)',      kcal: 360, protein: 7,  fat: 0.7, carbs: 79,  swap_group: 'carb_grain' },
  { id: 'rice_brown',       name: 'Ryż brązowy (suchy)',    kcal: 362, protein: 8,  fat: 2.7, carbs: 74,  swap_group: 'carb_grain' },
  { id: 'pasta_whole',      name: 'Makaron pełnoziarnisty', kcal: 348, protein: 13, fat: 2,   carbs: 68,  swap_group: 'carb_grain' },
  { id: 'pasta_white',      name: 'Makaron biały',          kcal: 352, protein: 12, fat: 1.5, carbs: 72,  swap_group: 'carb_grain' },
  { id: 'bread_whole',      name: 'Chleb żytni razowy',     kcal: 241, protein: 9,  fat: 1.7, carbs: 47,  swap_group: 'carb_grain' },
  { id: 'bread_white',      name: 'Chleb pszenny',          kcal: 265, protein: 9,  fat: 3,   carbs: 51,  swap_group: 'carb_grain' },
  { id: 'potato',           name: 'Ziemniaki',              kcal: 77,  protein: 2,  fat: 0.1, carbs: 17,  swap_group: 'carb_grain' },
  { id: 'sweet_potato',     name: 'Batat',                  kcal: 86,  protein: 1.6,fat: 0.1, carbs: 20,  swap_group: 'carb_grain' },
  { id: 'quinoa',           name: 'Quinoa',                 kcal: 368, protein: 14, fat: 6,   carbs: 64,  swap_group: 'carb_grain' },
  { id: 'buckwheat',        name: 'Kasza gryczana',         kcal: 343, protein: 13, fat: 3.4, carbs: 65,  swap_group: 'carb_grain' },
  { id: 'millet',           name: 'Kasza jaglana',          kcal: 378, protein: 11, fat: 4,   carbs: 73,  swap_group: 'carb_grain' },
  { id: 'couscous',         name: 'Kuskus',                 kcal: 356, protein: 12, fat: 0.6, carbs: 73,  swap_group: 'carb_grain' },
  { id: 'corn_tortilla',    name: 'Tortilla kukurydziana',  kcal: 218, protein: 5,  fat: 3,   carbs: 44,  swap_group: 'carb_grain' },
  { id: 'rice_cakes',       name: 'Wafle ryżowe',           kcal: 387, protein: 8,  fat: 3,   carbs: 81,  swap_group: 'carb_grain' },

  // TŁUSZCZE
  { id: 'olive_oil',        name: 'Oliwa z oliwek',         kcal: 884, protein: 0,  fat: 100, carbs: 0,   swap_group: 'fat_source' },
  { id: 'coconut_oil',      name: 'Olej kokosowy',          kcal: 892, protein: 0,  fat: 100, carbs: 0,   swap_group: 'fat_source' },
  { id: 'avocado',          name: 'Awokado',                kcal: 160, protein: 2,  fat: 15,  carbs: 9,   swap_group: 'fat_source' },
  { id: 'almonds',          name: 'Migdały',                kcal: 579, protein: 21, fat: 50,  carbs: 22,  swap_group: 'fat_source' },
  { id: 'walnuts',          name: 'Orzechy włoskie',        kcal: 654, protein: 15, fat: 65,  carbs: 14,  swap_group: 'fat_source' },
  { id: 'peanut_butter',    name: 'Masło orzechowe',        kcal: 588, protein: 25, fat: 50,  carbs: 20,  swap_group: 'fat_source' },
  { id: 'butter',           name: 'Masło',                  kcal: 717, protein: 0.9,fat: 81,  carbs: 0.1, swap_group: 'fat_source' },
  { id: 'cashews',          name: 'Nerkowce',               kcal: 553, protein: 18, fat: 44,  carbs: 30,  swap_group: 'fat_source' },
  { id: 'flaxseed',         name: 'Siemię lniane',          kcal: 534, protein: 18, fat: 42,  carbs: 29,  swap_group: 'fat_source' },
  { id: 'chia_seeds',       name: 'Nasiona chia',           kcal: 486, protein: 17, fat: 31,  carbs: 42,  swap_group: 'fat_source' },

  // WARZYWA
  { id: 'broccoli',         name: 'Brokuł',                 kcal: 34,  protein: 2.8,fat: 0.4, carbs: 7,   swap_group: 'vegetable' },
  { id: 'spinach',          name: 'Szpinak',                kcal: 23,  protein: 2.9,fat: 0.4, carbs: 3.6, swap_group: 'vegetable' },
  { id: 'cucumber',         name: 'Ogórek',                 kcal: 15,  protein: 0.7,fat: 0.1, carbs: 3.6, swap_group: 'vegetable' },
  { id: 'tomato',           name: 'Pomidor',                kcal: 18,  protein: 0.9,fat: 0.2, carbs: 3.9, swap_group: 'vegetable' },
  { id: 'pepper_red',       name: 'Papryka czerwona',       kcal: 31,  protein: 1,  fat: 0.3, carbs: 6,   swap_group: 'vegetable' },
  { id: 'zucchini',         name: 'Cukinia',                kcal: 17,  protein: 1.2,fat: 0.3, carbs: 3.1, swap_group: 'vegetable' },
  { id: 'lettuce',          name: 'Sałata',                 kcal: 15,  protein: 1.4,fat: 0.2, carbs: 2.9, swap_group: 'vegetable' },
  { id: 'onion',            name: 'Cebula',                 kcal: 40,  protein: 1.1,fat: 0.1, carbs: 9,   swap_group: 'vegetable' },
  { id: 'garlic',           name: 'Czosnek',                kcal: 149, protein: 6.4,fat: 0.5, carbs: 33,  swap_group: 'vegetable' },
  { id: 'carrot',           name: 'Marchew',                kcal: 41,  protein: 0.9,fat: 0.2, carbs: 10,  swap_group: 'vegetable' },
  { id: 'cabbage',          name: 'Kapusta',                kcal: 25,  protein: 1.3,fat: 0.1, carbs: 6,   swap_group: 'vegetable' },
  { id: 'mushrooms',        name: 'Pieczarki',              kcal: 22,  protein: 3.1,fat: 0.3, carbs: 3.3, swap_group: 'vegetable' },
  { id: 'asparagus',        name: 'Szparagi',               kcal: 20,  protein: 2.2,fat: 0.1, carbs: 3.9, swap_group: 'vegetable' },
  { id: 'green_beans',      name: 'Fasolka szparagowa',     kcal: 31,  protein: 1.8,fat: 0.1, carbs: 7,   swap_group: 'vegetable' },

  // OWOCE
  { id: 'banana',           name: 'Banan',                  kcal: 89,  protein: 1.1,fat: 0.3, carbs: 23,  swap_group: 'fruit' },
  { id: 'apple',            name: 'Jabłko',                 kcal: 52,  protein: 0.3,fat: 0.2, carbs: 14,  swap_group: 'fruit' },
  { id: 'blueberries',      name: 'Jagody',                 kcal: 57,  protein: 0.7,fat: 0.3, carbs: 14,  swap_group: 'fruit' },
  { id: 'strawberries',     name: 'Truskawki',              kcal: 32,  protein: 0.7,fat: 0.3, carbs: 8,   swap_group: 'fruit' },
  { id: 'orange',           name: 'Pomarańcza',             kcal: 47,  protein: 0.9,fat: 0.1, carbs: 12,  swap_group: 'fruit' },
  { id: 'mango',            name: 'Mango',                  kcal: 60,  protein: 0.8,fat: 0.4, carbs: 15,  swap_group: 'fruit' },

  // INNE
  { id: 'lentils',          name: 'Soczewica',              kcal: 352, protein: 25, fat: 1,   carbs: 63,  swap_group: 'carb_grain' },
  { id: 'chickpeas',        name: 'Ciecierzyca',            kcal: 364, protein: 19, fat: 6,   carbs: 61,  swap_group: 'carb_grain' },
  { id: 'black_beans',      name: 'Fasola czarna',          kcal: 341, protein: 22, fat: 1.4, carbs: 62,  swap_group: 'carb_grain' },
  { id: 'tofu',             name: 'Tofu twarde',            kcal: 76,  protein: 8,  fat: 4.8, carbs: 1.9, swap_group: 'protein_meat' },
]

// ─── SWAP ENGINE ──────────────────────────────────────────────────────────────
export function findSwaps(foodId, targetGrams) {
  const original = FOODS.find(f => f.id === foodId)
  if (!original) return []

  const origMacro = {
    kcal:    (original.kcal    * targetGrams) / 100,
    protein: (original.protein * targetGrams) / 100,
    fat:     (original.fat     * targetGrams) / 100,
    carbs:   (original.carbs   * targetGrams) / 100,
  }

  return FOODS
    .filter(f => f.id !== foodId && f.swap_group === original.swap_group)
    .map(f => {
      // Ile gramów potrzeba żeby dopasować kcal
      const gramsNeeded = f.kcal > 0
        ? Math.round((origMacro.kcal / f.kcal) * 100)
        : targetGrams

      const swapMacro = {
        kcal:    Math.round((f.kcal    * gramsNeeded) / 100),
        protein: Math.round((f.protein * gramsNeeded) / 100 * 10) / 10,
        fat:     Math.round((f.fat     * gramsNeeded) / 100 * 10) / 10,
        carbs:   Math.round((f.carbs   * gramsNeeded) / 100 * 10) / 10,
      }

      const delta = {
        kcal:    swapMacro.kcal    - Math.round(origMacro.kcal),
        protein: Math.round((swapMacro.protein - origMacro.protein) * 10) / 10,
        fat:     Math.round((swapMacro.fat     - origMacro.fat)     * 10) / 10,
        carbs:   Math.round((swapMacro.carbs   - origMacro.carbs)   * 10) / 10,
      }

      return { food: f, grams: gramsNeeded, macro: swapMacro, delta }
    })
    .sort((a, b) => Math.abs(a.delta.protein) - Math.abs(b.delta.protein))
    .slice(0, 5)
}

// ─── MEAL PLAN TEMPLATES (20 szablonów) ──────────────────────────────────────
// Każdy posiłek: { name, items: [{ food_id, grams }] }
// Szablony dobierane wg: goal × calories × meal_count

export const MEAL_TEMPLATES = [
  // ── REDUKCJA ──────────────────────────────────────────────────────────────
  {
    id: 'cut_2000_4',
    name: 'Redukcja — 2000 kcal / 4 posiłki',
    goal: 'Redukcja tkanki tłuszczowej',
    calories: 2000,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'oats', grams: 80 }, { food_id: 'greek_yogurt', grams: 150 }, { food_id: 'blueberries', grams: 100 }] },
      { name: 'Obiad',     items: [{ food_id: 'chicken_breast', grams: 180 }, { food_id: 'rice_brown', grams: 80 }, { food_id: 'broccoli', grams: 200 }] },
      { name: 'Przekąska', items: [{ food_id: 'cottage_cheese', grams: 200 }, { food_id: 'apple', grams: 150 }] },
      { name: 'Kolacja',   items: [{ food_id: 'salmon', grams: 150 }, { food_id: 'sweet_potato', grams: 150 }, { food_id: 'spinach', grams: 100 }] },
    ],
  },
  {
    id: 'cut_1800_4',
    name: 'Redukcja — 1800 kcal / 4 posiłki',
    goal: 'Redukcja tkanki tłuszczowej',
    calories: 1800,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'egg_whites', grams: 200 }, { food_id: 'eggs_whole', grams: 100 }, { food_id: 'pepper_red', grams: 100 }, { food_id: 'bread_whole', grams: 50 }] },
      { name: 'Obiad',     items: [{ food_id: 'turkey_breast', grams: 160 }, { food_id: 'rice_white', grams: 70 }, { food_id: 'zucchini', grams: 150 }] },
      { name: 'Przekąska', items: [{ food_id: 'skyr', grams: 200 }, { food_id: 'strawberries', grams: 100 }] },
      { name: 'Kolacja',   items: [{ food_id: 'cod', grams: 200 }, { food_id: 'sweet_potato', grams: 120 }, { food_id: 'broccoli', grams: 150 }] },
    ],
  },
  {
    id: 'cut_2200_5',
    name: 'Redukcja — 2200 kcal / 5 posiłków',
    goal: 'Redukcja tkanki tłuszczowej',
    calories: 2200,
    meal_count: 5,
    meals: [
      { name: 'Śniadanie',   items: [{ food_id: 'oats', grams: 80 }, { food_id: 'milk_2pct', grams: 200 }, { food_id: 'banana', grams: 100 }] },
      { name: 'II Śniadanie',items: [{ food_id: 'greek_yogurt', grams: 200 }, { food_id: 'almonds', grams: 20 }] },
      { name: 'Obiad',       items: [{ food_id: 'chicken_breast', grams: 200 }, { food_id: 'rice_brown', grams: 80 }, { food_id: 'broccoli', grams: 200 }, { food_id: 'olive_oil', grams: 10 }] },
      { name: 'Przekąska',   items: [{ food_id: 'cottage_cheese', grams: 200 }, { food_id: 'rice_cakes', grams: 30 }] },
      { name: 'Kolacja',     items: [{ food_id: 'tuna_can', grams: 150 }, { food_id: 'pasta_whole', grams: 70 }, { food_id: 'tomato', grams: 150 }] },
    ],
  },
  {
    id: 'cut_1600_3',
    name: 'Redukcja — 1600 kcal / 3 posiłki',
    goal: 'Redukcja tkanki tłuszczowej',
    calories: 1600,
    meal_count: 3,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'eggs_whole', grams: 150 }, { food_id: 'spinach', grams: 100 }, { food_id: 'bread_whole', grams: 60 }] },
      { name: 'Obiad',     items: [{ food_id: 'chicken_breast', grams: 180 }, { food_id: 'sweet_potato', grams: 150 }, { food_id: 'green_beans', grams: 150 }] },
      { name: 'Kolacja',   items: [{ food_id: 'cottage_cheese', grams: 250 }, { food_id: 'cucumber', grams: 150 }, { food_id: 'rice_cakes', grams: 40 }] },
    ],
  },

  // ── MASA ──────────────────────────────────────────────────────────────────
  {
    id: 'bulk_3000_4',
    name: 'Masa — 3000 kcal / 4 posiłki',
    goal: 'Budowa masy mięśniowej',
    calories: 3000,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'oats', grams: 120 }, { food_id: 'milk_2pct', grams: 300 }, { food_id: 'banana', grams: 150 }, { food_id: 'peanut_butter', grams: 30 }] },
      { name: 'Obiad',     items: [{ food_id: 'beef_lean', grams: 200 }, { food_id: 'rice_white', grams: 120 }, { food_id: 'broccoli', grams: 200 }, { food_id: 'olive_oil', grams: 15 }] },
      { name: 'Przekąska', items: [{ food_id: 'greek_yogurt', grams: 300 }, { food_id: 'oats', grams: 50 }, { food_id: 'almonds', grams: 30 }] },
      { name: 'Kolacja',   items: [{ food_id: 'salmon', grams: 200 }, { food_id: 'pasta_white', grams: 100 }, { food_id: 'zucchini', grams: 150 }] },
    ],
  },
  {
    id: 'bulk_3500_5',
    name: 'Masa — 3500 kcal / 5 posiłków',
    goal: 'Budowa masy mięśniowej',
    calories: 3500,
    meal_count: 5,
    meals: [
      { name: 'Śniadanie',   items: [{ food_id: 'oats', grams: 120 }, { food_id: 'milk_2pct', grams: 300 }, { food_id: 'banana', grams: 150 }, { food_id: 'peanut_butter', grams: 40 }] },
      { name: 'II Śniadanie',items: [{ food_id: 'whey_protein', grams: 40 }, { food_id: 'rice_cakes', grams: 60 }, { food_id: 'almonds', grams: 30 }] },
      { name: 'Obiad',       items: [{ food_id: 'chicken_breast', grams: 250 }, { food_id: 'rice_white', grams: 150 }, { food_id: 'broccoli', grams: 200 }, { food_id: 'olive_oil', grams: 20 }] },
      { name: 'Przekąska',   items: [{ food_id: 'cottage_cheese', grams: 300 }, { food_id: 'mango', grams: 150 }] },
      { name: 'Kolacja',     items: [{ food_id: 'beef_mince', grams: 200 }, { food_id: 'pasta_whole', grams: 120 }, { food_id: 'tomato', grams: 150 }, { food_id: 'olive_oil', grams: 10 }] },
    ],
  },
  {
    id: 'bulk_2700_4',
    name: 'Masa — 2700 kcal / 4 posiłki',
    goal: 'Budowa masy mięśniowej',
    calories: 2700,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'eggs_whole', grams: 200 }, { food_id: 'oats', grams: 80 }, { food_id: 'banana', grams: 120 }] },
      { name: 'Obiad',     items: [{ food_id: 'turkey_breast', grams: 220 }, { food_id: 'sweet_potato', grams: 200 }, { food_id: 'spinach', grams: 100 }, { food_id: 'olive_oil', grams: 15 }] },
      { name: 'Przekąska', items: [{ food_id: 'skyr', grams: 250 }, { food_id: 'cashews', grams: 30 }, { food_id: 'apple', grams: 150 }] },
      { name: 'Kolacja',   items: [{ food_id: 'salmon', grams: 180 }, { food_id: 'rice_brown', grams: 100 }, { food_id: 'asparagus', grams: 150 }] },
    ],
  },
  {
    id: 'bulk_4000_6',
    name: 'Masa — 4000 kcal / 6 posiłków',
    goal: 'Budowa masy mięśniowej',
    calories: 4000,
    meal_count: 6,
    meals: [
      { name: 'Śniadanie',    items: [{ food_id: 'oats', grams: 150 }, { food_id: 'milk_2pct', grams: 400 }, { food_id: 'banana', grams: 150 }, { food_id: 'peanut_butter', grams: 50 }] },
      { name: 'II Śniadanie', items: [{ food_id: 'whey_protein', grams: 40 }, { food_id: 'rice_cakes', grams: 60 }, { food_id: 'almonds', grams: 40 }] },
      { name: 'Obiad',        items: [{ food_id: 'beef_lean', grams: 250 }, { food_id: 'rice_white', grams: 180 }, { food_id: 'broccoli', grams: 200 }, { food_id: 'olive_oil', grams: 20 }] },
      { name: 'Przekąska',    items: [{ food_id: 'cottage_cheese', grams: 300 }, { food_id: 'mango', grams: 150 }, { food_id: 'walnuts', grams: 30 }] },
      { name: 'Kolacja',      items: [{ food_id: 'chicken_breast', grams: 250 }, { food_id: 'pasta_white', grams: 150 }, { food_id: 'tomato', grams: 150 }, { food_id: 'olive_oil', grams: 15 }] },
      { name: 'Przed snem',   items: [{ food_id: 'cottage_cheese', grams: 200 }, { food_id: 'flaxseed', grams: 15 }] },
    ],
  },

  // ── REKOMP ────────────────────────────────────────────────────────────────
  {
    id: 'recomp_2400_4',
    name: 'Rekomp — 2400 kcal / 4 posiłki',
    goal: 'Rekompozycja',
    calories: 2400,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'eggs_whole', grams: 150 }, { food_id: 'oats', grams: 60 }, { food_id: 'blueberries', grams: 100 }] },
      { name: 'Obiad',     items: [{ food_id: 'chicken_breast', grams: 200 }, { food_id: 'rice_brown', grams: 90 }, { food_id: 'broccoli', grams: 200 }, { food_id: 'olive_oil', grams: 10 }] },
      { name: 'Przekąska', items: [{ food_id: 'greek_yogurt', grams: 200 }, { food_id: 'almonds', grams: 25 }, { food_id: 'strawberries', grams: 100 }] },
      { name: 'Kolacja',   items: [{ food_id: 'salmon', grams: 160 }, { food_id: 'quinoa', grams: 80 }, { food_id: 'spinach', grams: 150 }] },
    ],
  },
  {
    id: 'recomp_2200_5',
    name: 'Rekomp — 2200 kcal / 5 posiłków',
    goal: 'Rekompozycja',
    calories: 2200,
    meal_count: 5,
    meals: [
      { name: 'Śniadanie',   items: [{ food_id: 'oats', grams: 70 }, { food_id: 'skyr', grams: 150 }, { food_id: 'banana', grams: 100 }] },
      { name: 'II Śniadanie',items: [{ food_id: 'cottage_cheese', grams: 150 }, { food_id: 'rice_cakes', grams: 30 }] },
      { name: 'Obiad',       items: [{ food_id: 'turkey_breast', grams: 180 }, { food_id: 'sweet_potato', grams: 150 }, { food_id: 'green_beans', grams: 150 }, { food_id: 'olive_oil', grams: 10 }] },
      { name: 'Przekąska',   items: [{ food_id: 'greek_yogurt', grams: 150 }, { food_id: 'almonds', grams: 20 }] },
      { name: 'Kolacja',     items: [{ food_id: 'tuna_can', grams: 150 }, { food_id: 'buckwheat', grams: 70 }, { food_id: 'cucumber', grams: 150 }] },
    ],
  },

  // ── WEGETARIAŃSKIE ────────────────────────────────────────────────────────
  {
    id: 'veg_cut_1800_4',
    name: 'Wegetariańska redukcja — 1800 kcal / 4 posiłki',
    goal: 'Redukcja tkanki tłuszczowej',
    calories: 1800,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'oats', grams: 80 }, { food_id: 'milk_2pct', grams: 200 }, { food_id: 'blueberries', grams: 100 }] },
      { name: 'Obiad',     items: [{ food_id: 'tofu', grams: 200 }, { food_id: 'rice_brown', grams: 80 }, { food_id: 'broccoli', grams: 200 }, { food_id: 'olive_oil', grams: 10 }] },
      { name: 'Przekąska', items: [{ food_id: 'greek_yogurt', grams: 200 }, { food_id: 'almonds', grams: 20 }] },
      { name: 'Kolacja',   items: [{ food_id: 'lentils', grams: 100 }, { food_id: 'spinach', grams: 150 }, { food_id: 'eggs_whole', grams: 100 }] },
    ],
  },
  {
    id: 'veg_bulk_2800_4',
    name: 'Wegetariańska masa — 2800 kcal / 4 posiłki',
    goal: 'Budowa masy mięśniowej',
    calories: 2800,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'oats', grams: 120 }, { food_id: 'milk_2pct', grams: 300 }, { food_id: 'banana', grams: 150 }, { food_id: 'peanut_butter', grams: 30 }] },
      { name: 'Obiad',     items: [{ food_id: 'chickpeas', grams: 150 }, { food_id: 'rice_white', grams: 100 }, { food_id: 'pepper_red', grams: 150 }, { food_id: 'olive_oil', grams: 15 }] },
      { name: 'Przekąska', items: [{ food_id: 'cottage_cheese', grams: 300 }, { food_id: 'mango', grams: 150 }, { food_id: 'walnuts', grams: 25 }] },
      { name: 'Kolacja',   items: [{ food_id: 'tofu', grams: 250 }, { food_id: 'pasta_whole', grams: 100 }, { food_id: 'zucchini', grams: 150 }, { food_id: 'olive_oil', grams: 10 }] },
    ],
  },

  // ── WYSOKOBIAŁKOWE ────────────────────────────────────────────────────────
  {
    id: 'highprot_2000_4',
    name: 'Wysokobiałkowa — 2000 kcal / 4 posiłki',
    goal: 'Redukcja tkanki tłuszczowej',
    calories: 2000,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'egg_whites', grams: 250 }, { food_id: 'eggs_whole', grams: 100 }, { food_id: 'oats', grams: 50 }] },
      { name: 'Obiad',     items: [{ food_id: 'chicken_breast', grams: 250 }, { food_id: 'sweet_potato', grams: 150 }, { food_id: 'broccoli', grams: 200 }] },
      { name: 'Przekąska', items: [{ food_id: 'cottage_cheese', grams: 300 }, { food_id: 'rice_cakes', grams: 30 }] },
      { name: 'Kolacja',   items: [{ food_id: 'turkey_breast', grams: 220 }, { food_id: 'quinoa', grams: 70 }, { food_id: 'spinach', grams: 150 }] },
    ],
  },

  // ── SIŁOWE ────────────────────────────────────────────────────────────────
  {
    id: 'strength_3200_4',
    name: 'Siłowa — 3200 kcal / 4 posiłki',
    goal: 'Wzrost siły',
    calories: 3200,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'oats', grams: 120 }, { food_id: 'milk_2pct', grams: 300 }, { food_id: 'banana', grams: 150 }, { food_id: 'eggs_whole', grams: 100 }] },
      { name: 'Obiad',     items: [{ food_id: 'beef_lean', grams: 250 }, { food_id: 'rice_white', grams: 150 }, { food_id: 'broccoli', grams: 200 }, { food_id: 'butter', grams: 10 }] },
      { name: 'Przekąska', items: [{ food_id: 'greek_yogurt', grams: 300 }, { food_id: 'almonds', grams: 40 }, { food_id: 'apple', grams: 150 }] },
      { name: 'Kolacja',   items: [{ food_id: 'salmon', grams: 220 }, { food_id: 'pasta_white', grams: 120 }, { food_id: 'asparagus', grams: 150 }] },
    ],
  },

  // ── KOBIETY ───────────────────────────────────────────────────────────────
  {
    id: 'women_cut_1500_4',
    name: 'Kobieca redukcja — 1500 kcal / 4 posiłki',
    goal: 'Redukcja tkanki tłuszczowej',
    calories: 1500,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'oats', grams: 50 }, { food_id: 'greek_yogurt', grams: 150 }, { food_id: 'strawberries', grams: 100 }] },
      { name: 'Obiad',     items: [{ food_id: 'chicken_breast', grams: 140 }, { food_id: 'sweet_potato', grams: 120 }, { food_id: 'spinach', grams: 150 }, { food_id: 'olive_oil', grams: 8 }] },
      { name: 'Przekąska', items: [{ food_id: 'cottage_cheese', grams: 150 }, { food_id: 'blueberries', grams: 80 }] },
      { name: 'Kolacja',   items: [{ food_id: 'cod', grams: 160 }, { food_id: 'broccoli', grams: 200 }, { food_id: 'rice_brown', grams: 50 }] },
    ],
  },
  {
    id: 'women_bulk_2000_4',
    name: 'Kobieca masa — 2000 kcal / 4 posiłki',
    goal: 'Budowa masy mięśniowej',
    calories: 2000,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'oats', grams: 80 }, { food_id: 'milk_2pct', grams: 200 }, { food_id: 'banana', grams: 100 }, { food_id: 'almonds', grams: 20 }] },
      { name: 'Obiad',     items: [{ food_id: 'turkey_breast', grams: 160 }, { food_id: 'rice_white', grams: 90 }, { food_id: 'broccoli', grams: 150 }, { food_id: 'olive_oil', grams: 10 }] },
      { name: 'Przekąska', items: [{ food_id: 'skyr', grams: 200 }, { food_id: 'apple', grams: 120 }] },
      { name: 'Kolacja',   items: [{ food_id: 'salmon', grams: 150 }, { food_id: 'quinoa', grams: 70 }, { food_id: 'zucchini', grams: 150 }] },
    ],
  },
  {
    id: 'women_recomp_1800_5',
    name: 'Kobieca rekomp — 1800 kcal / 5 posiłków',
    goal: 'Rekompozycja',
    calories: 1800,
    meal_count: 5,
    meals: [
      { name: 'Śniadanie',   items: [{ food_id: 'eggs_whole', grams: 120 }, { food_id: 'bread_whole', grams: 60 }, { food_id: 'tomato', grams: 100 }] },
      { name: 'II Śniadanie',items: [{ food_id: 'greek_yogurt', grams: 150 }, { food_id: 'blueberries', grams: 80 }] },
      { name: 'Obiad',       items: [{ food_id: 'chicken_breast', grams: 160 }, { food_id: 'rice_brown', grams: 70 }, { food_id: 'green_beans', grams: 150 }, { food_id: 'olive_oil', grams: 8 }] },
      { name: 'Przekąska',   items: [{ food_id: 'cottage_cheese', grams: 150 }, { food_id: 'rice_cakes', grams: 20 }] },
      { name: 'Kolacja',     items: [{ food_id: 'tuna_can', grams: 130 }, { food_id: 'buckwheat', grams: 60 }, { food_id: 'cucumber', grams: 150 }] },
    ],
  },

  // ── ŚRÓDZIEMNOMORSKIE ─────────────────────────────────────────────────────
  {
    id: 'med_2200_4',
    name: 'Śródziemnomorska — 2200 kcal / 4 posiłki',
    goal: 'Rekompozycja',
    calories: 2200,
    meal_count: 4,
    meals: [
      { name: 'Śniadanie', items: [{ food_id: 'eggs_whole', grams: 150 }, { food_id: 'bread_whole', grams: 80 }, { food_id: 'avocado', grams: 80 }, { food_id: 'tomato', grams: 100 }] },
      { name: 'Obiad',     items: [{ food_id: 'salmon', grams: 180 }, { food_id: 'quinoa', grams: 90 }, { food_id: 'spinach', grams: 150 }, { food_id: 'olive_oil', grams: 12 }] },
      { name: 'Przekąska', items: [{ food_id: 'greek_yogurt', grams: 200 }, { food_id: 'walnuts', grams: 25 }, { food_id: 'orange', grams: 150 }] },
      { name: 'Kolacja',   items: [{ food_id: 'sardines', grams: 150 }, { food_id: 'chickpeas', grams: 100 }, { food_id: 'cucumber', grams: 150 }, { food_id: 'olive_oil', grams: 10 }] },
    ],
  },
  {
    id: 'med_bulk_2800_5',
    name: 'Śródziemnomorska masa — 2800 kcal / 5 posiłków',
    goal: 'Budowa masy mięśniowej',
    calories: 2800,
    meal_count: 5,
    meals: [
      { name: 'Śniadanie',   items: [{ food_id: 'oats', grams: 100 }, { food_id: 'milk_2pct', grams: 250 }, { food_id: 'banana', grams: 120 }, { food_id: 'almonds', grams: 25 }] },
      { name: 'II Śniadanie',items: [{ food_id: 'mozzarella', grams: 100 }, { food_id: 'tomato', grams: 150 }, { food_id: 'bread_whole', grams: 60 }] },
      { name: 'Obiad',       items: [{ food_id: 'mackerel', grams: 200 }, { food_id: 'sweet_potato', grams: 180 }, { food_id: 'asparagus', grams: 150 }, { food_id: 'olive_oil', grams: 15 }] },
      { name: 'Przekąska',   items: [{ food_id: 'greek_yogurt', grams: 250 }, { food_id: 'walnuts', grams: 30 }, { food_id: 'mango', grams: 100 }] },
      { name: 'Kolacja',     items: [{ food_id: 'chicken_breast', grams: 200 }, { food_id: 'couscous', grams: 90 }, { food_id: 'zucchini', grams: 150 }, { food_id: 'olive_oil', grams: 10 }] },
    ],
  },
]

// ─── TEMPLATE MATCHER ─────────────────────────────────────────────────────────
export function findBestTemplates(questionnaire, nutritionTargets) {
  if (!nutritionTargets) return []
  const q = questionnaire?.data || {}
  const goal = q.cel || 'Rekompozycja'
  const targetKcal = nutritionTargets.calories
  const mealCount = parseInt(q.ilosc_posilkow) || 4
  const isVeg = (q.dieta_aktualna || '').toLowerCase().includes('wegetarian')
  const plec = q.plec || 'Mężczyzna'

  return MEAL_TEMPLATES
    .map(t => {
      let score = 0
      if (t.goal === goal) score += 40
      score -= Math.abs(t.calories - targetKcal) / 50
      score -= Math.abs(t.meal_count - mealCount) * 5
      if (isVeg && t.id.startsWith('veg')) score += 30
      if (plec === 'Kobieta' && t.id.startsWith('women')) score += 20
      return { ...t, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

// ─── MACRO CALCULATOR per template ───────────────────────────────────────────
export function calcTemplateMacros(template) {
  let kcal = 0, protein = 0, fat = 0, carbs = 0
  template.meals.forEach(meal => {
    meal.items.forEach(item => {
      const food = FOODS.find(f => f.id === item.food_id)
      if (!food) return
      kcal    += (food.kcal    * item.grams) / 100
      protein += (food.protein * item.grams) / 100
      fat     += (food.fat     * item.grams) / 100
      carbs   += (food.carbs   * item.grams) / 100
    })
  })
  return {
    kcal:    Math.round(kcal),
    protein: Math.round(protein),
    fat:     Math.round(fat),
    carbs:   Math.round(carbs),
  }
}
