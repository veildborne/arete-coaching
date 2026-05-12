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

  // ── ROZSZERZENIE (150+ produktów) ─────────────────────────────────────────────

  // WĘGLOWODANY — więcej wariantów
  { id: 'rice_basmati',     name: 'Ryż basmati',            kcal: 350, protein: 7.5,fat: 0.6, carbs: 77,  swap_group: 'carb_grain' },
  { id: 'rice_jasmine',     name: 'Ryż jaśminowy',          kcal: 345, protein: 7,  fat: 0.5, carbs: 76,  swap_group: 'carb_grain' },
  { id: 'rice_wild',        name: 'Ryż dziki',              kcal: 357, protein: 15, fat: 1,   carbs: 72,  swap_group: 'carb_grain' },
  { id: 'rice_red',         name: 'Ryż czerwony',           kcal: 362, protein: 7,  fat: 2.5, carbs: 72,  swap_group: 'carb_grain' },
  { id: 'pasta_penne',      name: 'Makaron penne',          kcal: 350, protein: 12, fat: 1.5, carbs: 71,  swap_group: 'carb_grain' },
  { id: 'pasta_spaghetti',  name: 'Spaghetti',              kcal: 352, protein: 13, fat: 1.8, carbs: 70,  swap_group: 'carb_grain' },
  { id: 'pasta_fusilli',    name: 'Makaron fusilli',        kcal: 348, protein: 12, fat: 1.5, carbs: 70,  swap_group: 'carb_grain' },
  { id: 'rice_noodles',     name: 'Makaron ryżowy',         kcal: 364, protein: 3,  fat: 0.6, carbs: 81,  swap_group: 'carb_grain' },
  { id: 'potato_boiled',    name: 'Ziemniaki gotowane',     kcal: 86,  protein: 1.7,fat: 0.1, carbs: 20,  swap_group: 'carb_grain' },
  { id: 'potato_mashed',    name: 'Purée ziemniaczane',     kcal: 116, protein: 2,  fat: 4.2, carbs: 17,  swap_group: 'carb_grain' },
  { id: 'sweet_potato_baked',name:'Batat pieczony',         kcal: 90,  protein: 2,  fat: 0.2, carbs: 21,  swap_group: 'carb_grain' },
  { id: 'bread_rye',        name: 'Chleb żytni',            kcal: 259, protein: 9,  fat: 3.3, carbs: 48,  swap_group: 'carb_grain' },
  { id: 'bread_sourdough',  name: 'Chleb zakwas',           kcal: 265, protein: 9,  fat: 1.5, carbs: 52,  swap_group: 'carb_grain' },
  { id: 'bread_baguette',   name: 'Bagietka',               kcal: 289, protein: 9,  fat: 3.5, carbs: 55,  swap_group: 'carb_grain' },
  { id: 'toast_whole',      name: 'Tost pełnoziarnisty',    kcal: 247, protein: 13, fat: 3.4, carbs: 41,  swap_group: 'carb_grain' },
  { id: 'bagel',            name: 'Bajgiel',                kcal: 257, protein: 10, fat: 1.5, carbs: 50,  swap_group: 'carb_grain' },
  { id: 'pita_whole',       name: 'Pita pełnoziarnista',    kcal: 262, protein: 9,  fat: 1.5, carbs: 54,  swap_group: 'carb_grain' },
  { id: 'cornflakes',       name: 'Płatki kukurydziane',    kcal: 370, protein: 7,  fat: 0.9, carbs: 84,  swap_group: 'carb_grain' },
  { id: 'muesli',           name: 'Musli',                  kcal: 380, protein: 10, fat: 8,   carbs: 66,  swap_group: 'carb_grain' },
  { id: 'granola',          name: 'Granola',                kcal: 471, protein: 11, fat: 20,  carbs: 64,  swap_group: 'carb_grain' },
  { id: 'barley',           name: 'Kasza jęczmienna',       kcal: 354, protein: 12, fat: 2.3, carbs: 73,  swap_group: 'carb_grain' },
  { id: 'bulgur',           name: 'Bulgur',                 kcal: 342, protein: 12, fat: 1.3, carbs: 76,  swap_group: 'carb_grain' },

  // BIAŁKO — więcej opcji
  { id: 'chicken_drumstick',name: 'Podudzie z kurczaka',    kcal: 172, protein: 28, fat: 6,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'chicken_whole',    name: 'Kurczak cały',           kcal: 190, protein: 27, fat: 9,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'turkey_mince',     name: 'Mielone z indyka',       kcal: 149, protein: 29, fat: 3,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'duck_breast',      name: 'Pierś z kaczki',         kcal: 201, protein: 23, fat: 11,  carbs: 0,   swap_group: 'protein_meat' },
  { id: 'beef_steak',       name: 'Stek wołowy',            kcal: 271, protein: 25, fat: 19,  carbs: 0,   swap_group: 'protein_meat' },
  { id: 'beef_sirloin',     name: 'Polędwica wołowa',       kcal: 158, protein: 24, fat: 6,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'pork_tenderloin',  name: 'Polędwiczka wieprzowa',  kcal: 143, protein: 26, fat: 3.5, carbs: 0,   swap_group: 'protein_meat' },
  { id: 'pork_chop',        name: 'Kotlet schabowy',        kcal: 197, protein: 28, fat: 9,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'lamb_leg',         name: 'Udziec jagnięcy',        kcal: 242, protein: 25, fat: 16,  carbs: 0,   swap_group: 'protein_meat' },
  { id: 'ham_turkey',       name: 'Szynka z indyka',        kcal: 104, protein: 18, fat: 3,   carbs: 2,   swap_group: 'protein_meat' },
  { id: 'sausage_chicken',  name: 'Kiełbasa drobiowa',      kcal: 180, protein: 15, fat: 13,  carbs: 2,   swap_group: 'protein_meat' },
  { id: 'bacon',            name: 'Boczek',                 kcal: 541, protein: 37, fat: 42,  carbs: 1,   swap_group: 'protein_meat' },
  { id: 'prosciutto',       name: 'Szynka parmeńska',       kcal: 145, protein: 25, fat: 5,   carbs: 0,   swap_group: 'protein_meat' },
  { id: 'trout',            name: 'Pstrąg',                 kcal: 148, protein: 20, fat: 7,   carbs: 0,   swap_group: 'protein_fish' },
  { id: 'seabass',          name: 'Okoń morski',            kcal: 97,  protein: 18, fat: 2,   carbs: 0,   swap_group: 'protein_fish' },
  { id: 'haddock',          name: 'Łupacz',                 kcal: 87,  protein: 19, fat: 0.6, carbs: 0,   swap_group: 'protein_fish' },
  { id: 'pollock',          name: 'Mintaj',                 kcal: 92,  protein: 19, fat: 1,   carbs: 0,   swap_group: 'protein_fish' },
  { id: 'canned_mackerel',  name: 'Makrela w puszce',       kcal: 191, protein: 19, fat: 12,  carbs: 0,   swap_group: 'protein_fish' },
  { id: 'anchovies',        name: 'Anchois',                kcal: 131, protein: 20, fat: 5,   carbs: 0,   swap_group: 'protein_fish' },
  { id: 'squid',            name: 'Kałamarnica',            kcal: 92,  protein: 16, fat: 1.4, carbs: 3,   swap_group: 'protein_fish' },
  { id: 'octopus',          name: 'Ośmiornica',             kcal: 82,  protein: 15, fat: 1,   carbs: 2,   swap_group: 'protein_fish' },
  { id: 'tempeh',           name: 'Tempeh',                 kcal: 193, protein: 19, fat: 11,  carbs: 9,   swap_group: 'protein_meat' },
  { id: 'seitan',           name: 'Seitan',                 kcal: 370, protein: 75, fat: 2,   carbs: 14,  swap_group: 'protein_meat' },

  // NABIAŁ — więcej wariantów
  { id: 'yogurt_natural',   name: 'Jogurt naturalny',       kcal: 61,  protein: 3.5,fat: 3.3, carbs: 4.7, swap_group: 'protein_dairy' },
  { id: 'yogurt_greek_2pct',name: 'Jogurt grecki 2%',       kcal: 73,  protein: 10, fat: 2,   carbs: 3.6, swap_group: 'protein_dairy' },
  { id: 'kefir',            name: 'Kefir',                  kcal: 41,  protein: 3,  fat: 1,   carbs: 4.5, swap_group: 'protein_dairy' },
  { id: 'buttermilk',       name: 'Maślanka',               kcal: 40,  protein: 3.3,fat: 0.9, carbs: 4.8, swap_group: 'protein_dairy' },
  { id: 'milk_1pct',        name: 'Mleko 1%',               kcal: 42,  protein: 3.4,fat: 1,   carbs: 5,   swap_group: 'protein_dairy' },
  { id: 'milk_0pct',        name: 'Mleko odtłuszczone',     kcal: 34,  protein: 3.4,fat: 0.1, carbs: 5,   swap_group: 'protein_dairy' },
  { id: 'milk_whole',       name: 'Mleko pełne 3.2%',       kcal: 61,  protein: 3.2,fat: 3.5, carbs: 4.8, swap_group: 'protein_dairy' },
  { id: 'almond_milk',      name: 'Mleko migdałowe',        kcal: 17,  protein: 0.4,fat: 1.1, carbs: 1.5, swap_group: 'protein_dairy' },
  { id: 'soy_milk',         name: 'Mleko sojowe',           kcal: 33,  protein: 2.9,fat: 1.6, carbs: 1.2, swap_group: 'protein_dairy' },
  { id: 'oat_milk',         name: 'Mleko owsiane',          kcal: 47,  protein: 1,  fat: 1.5, carbs: 7.5, swap_group: 'protein_dairy' },
  { id: 'cottage_cheese_2pct',name:'Twaróg półtłusty',      kcal: 103, protein: 13, fat: 5,   carbs: 3,   swap_group: 'protein_dairy' },
  { id: 'ricotta',          name: 'Ricotta',                kcal: 174, protein: 11, fat: 13,  carbs: 3,   swap_group: 'protein_dairy' },
  { id: 'feta',             name: 'Ser feta',               kcal: 264, protein: 14, fat: 21,  carbs: 4,   swap_group: 'protein_dairy' },
  { id: 'cheddar',          name: 'Ser cheddar',            kcal: 403, protein: 25, fat: 33,  carbs: 1.3, swap_group: 'protein_dairy' },
  { id: 'gouda',            name: 'Ser gouda',              kcal: 356, protein: 25, fat: 27,  carbs: 2.2, swap_group: 'protein_dairy' },
  { id: 'parmesan',         name: 'Parmezan',               kcal: 431, protein: 38, fat: 29,  carbs: 4,   swap_group: 'protein_dairy' },
  { id: 'cream_cheese',     name: 'Serek śmietankowy',      kcal: 342, protein: 6,  fat: 34,  carbs: 4,   swap_group: 'protein_dairy' },
  { id: 'cream_18pct',      name: 'Śmietana 18%',           kcal: 195, protein: 2.8,fat: 18,  carbs: 3.5, swap_group: 'protein_dairy' },
  { id: 'sour_cream',       name: 'Śmietana kwaśna',        kcal: 193, protein: 2.4,fat: 19,  carbs: 4,   swap_group: 'protein_dairy' },
  { id: 'whey_isolate',     name: 'Odżywka WPI',            kcal: 370, protein: 90, fat: 1,   carbs: 2,   swap_group: 'protein_dairy' },
  { id: 'casein_protein',   name: 'Odżywka kazeinowa',      kcal: 360, protein: 80, fat: 2,   carbs: 6,   swap_group: 'protein_dairy' },
  { id: 'protein_vegan',    name: 'Odżywka wegańska',       kcal: 380, protein: 70, fat: 8,   carbs: 10,  swap_group: 'protein_dairy' },

  // TŁUSZCZE — więcej źródeł
  { id: 'oil_rapeseed',     name: 'Olej rzepakowy',         kcal: 884, protein: 0,  fat: 100, carbs: 0,   swap_group: 'fat_source' },
  { id: 'oil_sunflower',    name: 'Olej słonecznikowy',     kcal: 884, protein: 0,  fat: 100, carbs: 0,   swap_group: 'fat_source' },
  { id: 'oil_linseed',      name: 'Olej lniany',            kcal: 884, protein: 0,  fat: 100, carbs: 0,   swap_group: 'fat_source' },
  { id: 'ghee',             name: 'Masło klarowane',        kcal: 876, protein: 0,  fat: 99,  carbs: 0,   swap_group: 'fat_source' },
  { id: 'butter_spread',    name: 'Masło do smarowania',    kcal: 530, protein: 0.6,fat: 58,  carbs: 0.5, swap_group: 'fat_source' },
  { id: 'hazelnuts',        name: 'Orzechy laskowe',        kcal: 628, protein: 15, fat: 61,  carbs: 17,  swap_group: 'fat_source' },
  { id: 'pistachios',       name: 'Pistacje',               kcal: 560, protein: 20, fat: 45,  carbs: 28,  swap_group: 'fat_source' },
  { id: 'macadamia',        name: 'Orzechy makadamia',      kcal: 718, protein: 8,  fat: 76,  carbs: 14,  swap_group: 'fat_source' },
  { id: 'brazil_nuts',      name: 'Orzechy brazylijskie',   kcal: 656, protein: 14, fat: 66,  carbs: 12,  swap_group: 'fat_source' },
  { id: 'pumpkin_seeds',    name: 'Pestki dyni',            kcal: 559, protein: 30, fat: 49,  carbs: 14,  swap_group: 'fat_source' },
  { id: 'sunflower_seeds',  name: 'Słonecznik łuskany',     kcal: 584, protein: 21, fat: 51,  carbs: 20,  swap_group: 'fat_source' },
  { id: 'sesame_seeds',     name: 'Sezam',                  kcal: 573, protein: 18, fat: 50,  carbs: 23,  swap_group: 'fat_source' },
  { id: 'tahini',           name: 'Tahini',                 kcal: 595, protein: 17, fat: 54,  carbs: 21,  swap_group: 'fat_source' },
  { id: 'almond_butter',    name: 'Masło migdałowe',        kcal: 614, protein: 21, fat: 56,  carbs: 19,  swap_group: 'fat_source' },
  { id: 'coconut_flakes',   name: 'Wiórki kokosowe',        kcal: 660, protein: 7,  fat: 65,  carbs: 24,  swap_group: 'fat_source' },

  // WARZYWA — więcej opcji
  { id: 'kale',             name: 'Jarmuż',                 kcal: 49,  protein: 4.3,fat: 0.9, carbs: 9,   swap_group: 'vegetable' },
  { id: 'arugula',          name: 'Rukola',                 kcal: 25,  protein: 2.6,fat: 0.7, carbs: 3.7, swap_group: 'vegetable' },
  { id: 'chard',            name: 'Boćwina',                kcal: 19,  protein: 1.8,fat: 0.2, carbs: 3.7, swap_group: 'vegetable' },
  { id: 'cauliflower',      name: 'Kalafior',               kcal: 25,  protein: 1.9,fat: 0.3, carbs: 5,   swap_group: 'vegetable' },
  { id: 'brussels_sprouts', name: 'Brukselka',              kcal: 43,  protein: 3.4,fat: 0.3, carbs: 9,   swap_group: 'vegetable' },
  { id: 'beetroot',         name: 'Burak',                  kcal: 43,  protein: 1.6,fat: 0.2, carbs: 10,  swap_group: 'vegetable' },
  { id: 'celery',           name: 'Seler naciowy',          kcal: 16,  protein: 0.7,fat: 0.2, carbs: 3,   swap_group: 'vegetable' },
  { id: 'eggplant',         name: 'Bakłażan',               kcal: 25,  protein: 1,  fat: 0.2, carbs: 6,   swap_group: 'vegetable' },
  { id: 'bell_pepper_yellow',name:'Papryka żółta',          kcal: 27,  protein: 1,  fat: 0.2, carbs: 6,   swap_group: 'vegetable' },
  { id: 'bell_pepper_green',name: 'Papryka zielona',        kcal: 20,  protein: 0.9,fat: 0.2, carbs: 4.6, swap_group: 'vegetable' },
  { id: 'radish',           name: 'Rzodkiewka',             kcal: 16,  protein: 0.7,fat: 0.1, carbs: 3.4, swap_group: 'vegetable' },
  { id: 'pumpkin',          name: 'Dynia',                  kcal: 26,  protein: 1,  fat: 0.1, carbs: 7,   swap_group: 'vegetable' },
  { id: 'leek',             name: 'Por',                    kcal: 61,  protein: 1.5,fat: 0.3, carbs: 14,  swap_group: 'vegetable' },
  { id: 'corn_sweet',       name: 'Kukurydza słodka',       kcal: 86,  protein: 3.3,fat: 1.4, carbs: 19,  swap_group: 'vegetable' },
  { id: 'peas_green',       name: 'Groszek zielony',        kcal: 81,  protein: 5.4,fat: 0.4, carbs: 14,  swap_group: 'vegetable' },
  { id: 'edamame',          name: 'Edamame',                kcal: 122, protein: 11, fat: 5,   carbs: 10,  swap_group: 'vegetable' },
  { id: 'artichoke',        name: 'Karczoch',               kcal: 47,  protein: 3.3,fat: 0.2, carbs: 11,  swap_group: 'vegetable' },
  { id: 'fennel',           name: 'Koper włoski',           kcal: 31,  protein: 1.2,fat: 0.2, carbs: 7,   swap_group: 'vegetable' },
  { id: 'bok_choy',         name: 'Pak choi',               kcal: 13,  protein: 1.5,fat: 0.2, carbs: 2.2, swap_group: 'vegetable' },
  { id: 'watercress',       name: 'Rukiew wodna',           kcal: 11,  protein: 2.3,fat: 0.1, carbs: 1.3, swap_group: 'vegetable' },

  // OWOCE — więcej opcji
  { id: 'pear',             name: 'Gruszka',                kcal: 57,  protein: 0.4,fat: 0.1, carbs: 15,  swap_group: 'fruit' },
  { id: 'peach',            name: 'Brzoskwinia',            kcal: 39,  protein: 0.9,fat: 0.3, carbs: 10,  swap_group: 'fruit' },
  { id: 'plum',             name: 'Śliwka',                 kcal: 46,  protein: 0.7,fat: 0.3, carbs: 11,  swap_group: 'fruit' },
  { id: 'nectarine',        name: 'Nektarynka',             kcal: 44,  protein: 1.1,fat: 0.3, carbs: 11,  swap_group: 'fruit' },
  { id: 'apricot',          name: 'Morela',                 kcal: 48,  protein: 1.4,fat: 0.4, carbs: 11,  swap_group: 'fruit' },
  { id: 'kiwi',             name: 'Kiwi',                   kcal: 61,  protein: 1.1,fat: 0.5, carbs: 15,  swap_group: 'fruit' },
  { id: 'pineapple',        name: 'Ananas',                 kcal: 50,  protein: 0.5,fat: 0.1, carbs: 13,  swap_group: 'fruit' },
  { id: 'watermelon',       name: 'Arbuz',                  kcal: 30,  protein: 0.6,fat: 0.2, carbs: 8,   swap_group: 'fruit' },
  { id: 'melon',            name: 'Melon',                  kcal: 34,  protein: 0.8,fat: 0.2, carbs: 8,   swap_group: 'fruit' },
  { id: 'grapes',           name: 'Winogrona',              kcal: 69,  protein: 0.7,fat: 0.2, carbs: 18,  swap_group: 'fruit' },
  { id: 'cherries',         name: 'Wiśnie',                 kcal: 50,  protein: 1,  fat: 0.3, carbs: 12,  swap_group: 'fruit' },
  { id: 'raspberries',      name: 'Maliny',                 kcal: 52,  protein: 1.2,fat: 0.7, carbs: 12,  swap_group: 'fruit' },
  { id: 'blackberries',     name: 'Jeżyny',                 kcal: 43,  protein: 1.4,fat: 0.5, carbs: 10,  swap_group: 'fruit' },
  { id: 'grapefruit',       name: 'Grejpfrut',              kcal: 42,  protein: 0.8,fat: 0.1, carbs: 11,  swap_group: 'fruit' },
  { id: 'dates',            name: 'Daktyle',                kcal: 282, protein: 2.5,fat: 0.4, carbs: 75,  swap_group: 'fruit' },
  { id: 'figs',             name: 'Figi',                   kcal: 74,  protein: 0.8,fat: 0.3, carbs: 19,  swap_group: 'fruit' },
  { id: 'raisins',          name: 'Rodzynki',               kcal: 299, protein: 3.1,fat: 0.5, carbs: 79,  swap_group: 'fruit' },
  { id: 'prunes',           name: 'Suszone śliwki',         kcal: 240, protein: 2.2,fat: 0.4, carbs: 64,  swap_group: 'fruit' },

  // SOSY i DODATKI
  { id: 'ketchup',          name: 'Ketchup',                kcal: 112, protein: 1.2,fat: 0.1, carbs: 27,  swap_group: 'vegetable' },
  { id: 'mustard',          name: 'Musztarda',              kcal: 66,  protein: 3.7,fat: 3.3, carbs: 5.3, swap_group: 'vegetable' },
  { id: 'mayo',             name: 'Majonez',                kcal: 680, protein: 1,  fat: 75,  carbs: 1,   swap_group: 'fat_source' },
  { id: 'mayo_light',       name: 'Majonez lekki',          kcal: 360, protein: 1.2,fat: 36,  carbs: 7,   swap_group: 'fat_source' },
  { id: 'bbq_sauce',        name: 'Sos BBQ',                kcal: 140, protein: 1,  fat: 0.5, carbs: 33,  swap_group: 'vegetable' },
  { id: 'soy_sauce',        name: 'Sos sojowy',             kcal: 53,  protein: 5.6,fat: 0.1, carbs: 4.9, swap_group: 'vegetable' },
  { id: 'hot_sauce',        name: 'Sos tabasco',            kcal: 12,  protein: 1,  fat: 0.8, carbs: 0.8, swap_group: 'vegetable' },
  { id: 'honey',            name: 'Miód',                   kcal: 304, protein: 0.3,fat: 0,   carbs: 82,  swap_group: 'carb_grain' },
  { id: 'maple_syrup',      name: 'Syrop klonowy',          kcal: 260, protein: 0,  fat: 0.2, carbs: 67,  swap_group: 'carb_grain' },
  { id: 'agave_syrup',      name: 'Syrop agawowy',          kcal: 310, protein: 0,  fat: 0,   carbs: 76,  swap_group: 'carb_grain' },
  { id: 'pesto',            name: 'Pesto',                  kcal: 420, protein: 4,  fat: 40,  carbs: 5,   swap_group: 'fat_source' },
  { id: 'hummus',           name: 'Hummus',                 kcal: 166, protein: 8,  fat: 10,  carbs: 14,  swap_group: 'carb_grain' },
  { id: 'salsa',            name: 'Salsa',                  kcal: 36,  protein: 1.5,fat: 0.2, carbs: 8,   swap_group: 'vegetable' },
  { id: 'guacamole',        name: 'Guacamole',              kcal: 150, protein: 2,  fat: 14,  carbs: 8,   swap_group: 'fat_source' },
  { id: 'sriracha',         name: 'Sos sriracha',           kcal: 93,  protein: 2,  fat: 0.9, carbs: 19,  swap_group: 'vegetable' },
  { id: 'stevia',           name: 'Stewia',                 kcal: 0,   protein: 0,  fat: 0,   carbs: 0,   swap_group: 'vegetable' },

  // NAPOJE
  { id: 'coffee_black',     name: 'Kawa czarna',            kcal: 2,   protein: 0.3,fat: 0,   carbs: 0,   swap_group: 'vegetable' },
  { id: 'coffee_latte',     name: 'Latte',                  kcal: 54,  protein: 2.9,fat: 2,   carbs: 5.5, swap_group: 'protein_dairy' },
  { id: 'coffee_cappuccino',name: 'Cappuccino',             kcal: 38,  protein: 2.1,fat: 1.4, carbs: 3.8, swap_group: 'protein_dairy' },
  { id: 'tea_black',        name: 'Herbata czarna',         kcal: 1,   protein: 0,  fat: 0,   carbs: 0.3, swap_group: 'vegetable' },
  { id: 'tea_green',        name: 'Herbata zielona',        kcal: 1,   protein: 0,  fat: 0,   carbs: 0,   swap_group: 'vegetable' },
  { id: 'energy_drink',     name: 'Napój energetyczny',     kcal: 45,  protein: 0,  fat: 0,   carbs: 11,  swap_group: 'carb_grain' },
  { id: 'cola_zero',        name: 'Cola Zero',              kcal: 0,   protein: 0,  fat: 0,   carbs: 0,   swap_group: 'vegetable' },
  { id: 'isotonic',         name: 'Napój izotoniczny',      kcal: 28,  protein: 0,  fat: 0,   carbs: 7,   swap_group: 'carb_grain' },
  { id: 'coconut_water',    name: 'Woda kokosowa',          kcal: 19,  protein: 0.7,fat: 0.2, carbs: 3.7, swap_group: 'fruit' },
  { id: 'kombucha',         name: 'Kombucha',               kcal: 30,  protein: 0,  fat: 0,   carbs: 7,   swap_group: 'vegetable' },
  { id: 'juice_orange',     name: 'Sok pomarańczowy',       kcal: 45,  protein: 0.7,fat: 0.2, carbs: 10,  swap_group: 'fruit' },
  { id: 'juice_apple',      name: 'Sok jabłkowy',           kcal: 46,  protein: 0.1,fat: 0.1, carbs: 11,  swap_group: 'fruit' },
  { id: 'smoothie_berry',   name: 'Smoothie jagodowe',      kcal: 60,  protein: 1,  fat: 0.5, carbs: 14,  swap_group: 'fruit' },
  { id: 'protein_shake',    name: 'Shake proteinowy',       kcal: 120, protein: 20, fat: 2,   carbs: 5,   swap_group: 'protein_dairy' },
  { id: 'bcaa_drink',       name: 'Napój BCAA',             kcal: 10,  protein: 2,  fat: 0,   carbs: 0,   swap_group: 'protein_dairy' },
  { id: 'sparkling_water',  name: 'Woda gazowana',          kcal: 0,   protein: 0,  fat: 0,   carbs: 0,   swap_group: 'vegetable' },
  { id: 'mineral_water',    name: 'Woda mineralna',         kcal: 0,   protein: 0,  fat: 0,   carbs: 0,   swap_group: 'vegetable' },

  // PRZEKĄSKI
  { id: 'popcorn_plain',    name: 'Popcorn (bez dodatków)',  kcal: 375, protein: 12, fat: 4.5, carbs: 74,  swap_group: 'carb_grain' },
  { id: 'popcorn_butter',   name: 'Popcorn maślany',        kcal: 500, protein: 8,  fat: 28,  carbs: 58,  swap_group: 'carb_grain' },
  { id: 'chips_potato',     name: 'Chipsy ziemniaczane',    kcal: 536, protein: 6,  fat: 35,  carbs: 50,  swap_group: 'carb_grain' },
  { id: 'pretzels',         name: 'Precle',                 kcal: 380, protein: 10, fat: 3,   carbs: 80,  swap_group: 'carb_grain' },
  { id: 'crackers',         name: 'Krakersy',               kcal: 440, protein: 8,  fat: 16,  carbs: 68,  swap_group: 'carb_grain' },
  { id: 'protein_bar',      name: 'Baton proteinowy',       kcal: 370, protein: 30, fat: 12,  carbs: 35,  swap_group: 'protein_dairy' },
  { id: 'granola_bar',      name: 'Baton granola',          kcal: 420, protein: 7,  fat: 16,  carbs: 62,  swap_group: 'carb_grain' },
  { id: 'chocolate_dark',   name: 'Czekolada gorzka 70%',   kcal: 598, protein: 7.8,fat: 43,  carbs: 46,  swap_group: 'fat_source' },
  { id: 'chocolate_milk',   name: 'Czekolada mleczna',      kcal: 535, protein: 8,  fat: 30,  carbs: 59,  swap_group: 'carb_grain' },
  { id: 'gummy_bears',      name: 'Żelki',                  kcal: 343, protein: 7,  fat: 0.2, carbs: 77,  swap_group: 'carb_grain' },
  { id: 'fruit_roll',       name: 'Przekąska owocowa',      kcal: 360, protein: 0.5,fat: 1,   carbs: 85,  swap_group: 'fruit' },
  { id: 'rice_crackers',    name: 'Krakersy ryżowe',        kcal: 380, protein: 8,  fat: 1.5, carbs: 82,  swap_group: 'carb_grain' },
  { id: 'trail_mix',        name: 'Mieszanka studencka',    kcal: 462, protein: 13, fat: 29,  carbs: 45,  swap_group: 'fat_source' },
  { id: 'beef_jerky',       name: 'Suszone mięso (jerky)',  kcal: 410, protein: 33, fat: 25,  carbs: 11,  swap_group: 'protein_meat' },
  { id: 'cheese_strings',   name: 'Serek w paluszkach',     kcal: 280, protein: 23, fat: 20,  carbs: 2,   swap_group: 'protein_dairy' },

  // GOTOWE DANIA (oszacowania)
  { id: 'wrap_chicken',     name: 'Wrap z kurczakiem',      kcal: 320, protein: 18, fat: 12,  carbs: 35,  swap_group: 'protein_meat' },
  { id: 'wrap_vegan',       name: 'Wrap wegański',          kcal: 280, protein: 8,  fat: 10,  carbs: 40,  swap_group: 'carb_grain' },
  { id: 'sandwich_turkey',  name: 'Kanapka z indykiem',     kcal: 350, protein: 22, fat: 10,  carbs: 42,  swap_group: 'protein_meat' },
  { id: 'sandwich_tuna',    name: 'Kanapka z tuńczykiem',   kcal: 330, protein: 20, fat: 12,  carbs: 38,  swap_group: 'protein_fish' },
  { id: 'bagel_cream_cheese',name:'Bajgiel z serkiem',      kcal: 400, protein: 12, fat: 18,  carbs: 48,  swap_group: 'carb_grain' },
  { id: 'oatmeal_cooked',   name: 'Owsianka gotowana',      kcal: 68,  protein: 2.4,fat: 1.4, carbs: 12,  swap_group: 'carb_grain' },
  { id: 'porridge_protein', name: 'Owsianka proteinowa',    kcal: 180, protein: 12, fat: 4,   carbs: 25,  swap_group: 'carb_grain' },
  { id: 'salad_caesar',     name: 'Sałatka Caesar',         kcal: 230, protein: 12, fat: 15,  carbs: 12,  swap_group: 'protein_meat' },
  { id: 'salad_greek',      name: 'Sałatka grecka',         kcal: 160, protein: 6,  fat: 12,  carbs: 9,   swap_group: 'vegetable' },
  { id: 'salad_tuna',       name: 'Sałatka z tuńczykiem',   kcal: 200, protein: 18, fat: 10,  carbs: 8,   swap_group: 'protein_fish' },
  { id: 'pizza_margherita', name: 'Pizza Margherita (100g)',kcal: 266, protein: 11, fat: 10,  carbs: 33,  swap_group: 'carb_grain' },
  { id: 'pizza_pepperoni',  name: 'Pizza Pepperoni (100g)', kcal: 298, protein: 12, fat: 13,  carbs: 34,  swap_group: 'carb_grain' },
  { id: 'burger_beef',      name: 'Burger wołowy (średni)', kcal: 540, protein: 28, fat: 28,  carbs: 42,  swap_group: 'protein_meat' },
  { id: 'burger_chicken',   name: 'Burger drobiowy',        kcal: 480, protein: 26, fat: 20,  carbs: 45,  swap_group: 'protein_meat' },
  { id: 'sushi_roll',       name: 'Sushi maki (100g)',      kcal: 140, protein: 6,  fat: 1,   carbs: 28,  swap_group: 'protein_fish' },
  { id: 'pasta_bolognese',  name: 'Makaron bolognese',      kcal: 170, protein: 9,  fat: 7,   carbs: 18,  swap_group: 'carb_grain' },
  { id: 'pasta_carbonara',  name: 'Makaron carbonara',      kcal: 195, protein: 8,  fat: 10,  carbs: 20,  swap_group: 'carb_grain' },
  { id: 'ramen_bowl',       name: 'Ramen (miska)',          kcal: 450, protein: 18, fat: 15,  carbs: 60,  swap_group: 'carb_grain' },
  { id: 'stir_fry_veg',     name: 'Warzywa smażone',        kcal: 120, protein: 4,  fat: 6,   carbs: 14,  swap_group: 'vegetable' },
  { id: 'stir_fry_chicken', name: 'Kurczak po chińsku',     kcal: 210, protein: 20, fat: 9,   carbs: 12,  swap_group: 'protein_meat' },
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
  const exclusions = Array.isArray(q.food_exclusions) ? q.food_exclusions : []

  // Mapa wykluczeń → food_ids do pominięcia
  const EXCLUDED_FOODS = {
    pork:     ['pork_loin', 'ham_lean'],
    beef:     ['beef_lean', 'beef_mince'],
    fish:     ['salmon', 'tuna_can', 'cod', 'tilapia', 'mackerel', 'shrimp', 'sardines'],
    dairy:    ['milk_2pct', 'greek_yogurt', 'cottage_cheese', 'skyr', 'mozzarella', 'whey_protein', 'butter'],
    eggs:     ['eggs_whole', 'egg_whites'],
    gluten:   ['bread_whole', 'bread_white', 'pasta_whole', 'pasta_white', 'couscous', 'corn_tortilla'],
    nuts:     ['almonds', 'walnuts', 'cashews', 'peanut_butter'],
    legumes:  ['lentils', 'chickpeas', 'black_beans'],
  }

  const excludedFoodIds = new Set(
    exclusions.flatMap(ex => EXCLUDED_FOODS[ex] || [])
  )

  function templateHasExcluded(template) {
    return template.meals.some(meal =>
      meal.items.some(item => excludedFoodIds.has(item.food_id))
    )
  }

  const targetProteinPct = nutritionTargets.protein_g && targetKcal
    ? (nutritionTargets.protein_g * 4) / targetKcal
    : 0.30
  const targetFatPct = nutritionTargets.fat_g && targetKcal
    ? (nutritionTargets.fat_g * 9) / targetKcal
    : 0.25

  return MEAL_TEMPLATES
    .filter(t => !templateHasExcluded(t))
    .map(t => {
      let score = 0
      if (t.goal === goal) score += 40
      score -= Math.abs(t.calories - targetKcal) / 100
      score -= Math.abs(t.meal_count - mealCount) * 5
      if (isVeg && t.id.startsWith('veg')) score += 30
      if (plec === 'Kobieta' && t.id.startsWith('women')) score += 20

      // Macro ratio match — kluczowe żeby szablon miał podobne proporcje B/T/W
      const tMacro = calcTemplateMacros(t)
      if (tMacro.kcal > 0) {
        const tProteinPct = (tMacro.protein * 4) / tMacro.kcal
        const tFatPct = (tMacro.fat * 9) / tMacro.kcal
        score -= Math.abs(tProteinPct - targetProteinPct) * 120
        score -= Math.abs(tFatPct - targetFatPct) * 80
      }

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
