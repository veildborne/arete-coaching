Tak. **To jest właściwa misja teraz.** Nie "dodajmy jeszcze ładniejszy przycisk", tylko:

> **zbudować inteligentny onboarding + plan generator, który podejmuje trenerskie decyzje na podstawie danych, a nie losuje ćwiczenia jak NPC w siłownianym kasynie.**

I tak: **ćwiczenia też trzeba ulepszyć**, bo bez dobrej bazy ćwiczeń generator będzie głupi, nawet jeśli ankieta będzie piękna. Garbage in, garbage out, jak mawiały starożytne wyrocznie IT. 🏛️

---

# 🧠 Główna misja dla Areté

Areté ma mieć **3-warstwowy algorytm**:

```txt
1. Ankieta → zbiera kontekst
2. Decision Engine → zamienia odpowiedzi w parametry planu
3. Plan Generator → tworzy plan + uzasadnienie + progresję
```

Nie robimy:

```txt
kobieta + pośladki + 3 dni = losowy plan glute
```

Robimy:

```txt
cel + doświadczenie + regeneracja + sprzęt + ograniczenia + preferencje + priorytety sylwetkowe
= struktura tygodnia + objętość + ćwiczenia + RIR + progresja + alternatywy + alerty
```

To jest różnica między zabawką a systemem coachingowym.

---

# 1. Ankieta musi być intuicyjna, ale mądra

Nie może wyglądać jak formularz medyczny z NFZ, bo klient ucieknie. Ale nie może być też głupia.

## Zasada:

> **Pytamy tylko o rzeczy, które wpływają na decyzję planu.**

Każde pytanie musi mieć funkcję.

---

# 2. Struktura ankiety

## Etap A — Quick Start

To są pytania szybkie, żeby klient nie zdechł psychicznie na starcie.

### Dane bazowe

* imię
* płeć
* wiek
* wzrost
* masa ciała
* główny cel:

  * redukcja
  * masa mięśniowa
  * rekompozycja
  * siła
  * zdrowie / powrót do formy
* doświadczenie:

  * początkujący
  * średniozaawansowany
  * zaawansowany

Ale poziom doświadczenia musi mieć opis, np.:

```txt
Początkujący: trenuję regularnie mniej niż 6 miesięcy
Średni: trenuję 6–24 miesiące i znam podstawowe ćwiczenia
Zaawansowany: trenuję 2+ lata i umiem kontrolować technikę oraz RIR
```

Bo inaczej każdy facet po dwóch treningach napisze "zaawansowany", bo zrobił kiedyś klatę z kolegą. Cywilizacja upadła, ale chociaż możemy dodać helper text.

---

## Etap B — Priorytety sylwetkowe

Tu robimy przewagę Areté.

Nie pytamy tylko "jaki cel?". Pytamy:

### Główna partia do poprawy

* pośladki
* nogi
* plecy
* barki
* klatka
* ramiona
* brzuch / talia
* całe ciało

### Drugi priorytet

To samo.

### Partie do utrzymania

Opcjonalnie.

### Partie, których nie chcesz mocno rozwijać

Bardzo ważne dla kobiet.

Przykłady:

* nie chcę mocno rozbudowywać czwórek
* nie chcę dużych ramion
* nie chcę mocno kapturów
* chcę bardziej estetykę niż masę

To potem wpływa na dobór ćwiczeń i objętości.

---

## Etap C — Dostępność i styl życia

### Pytania

* ile dni w tygodniu możesz trenować?
* ile minut masz na trening?
* czy możesz trenować dzień po dniu?
* czy są dni zakazane?
* ile średnio śpisz?
* jakość snu 1–5
* stres 1–5
* praca:

  * siedząca
  * mieszana
  * fizyczna
* średnia liczba kroków
* czy masz obecnie duże zmęczenie?

To nie jest ozdobnik. To ma ustawić **startową objętość**.

Przykład:

```txt
Sen <6 h + stres 4/5 + praca fizyczna
= niższa objętość startowa, mniej serii do upadku, ostrożniejsza progresja
```

---

## Etap D — Sprzęt

Tu musi być konkretnie.

Nie "siłownia full", tylko checkboxy:

### Dolne ciało

* squat rack
* smith machine
* hack squat
* leg press
* pendulum squat
* leg extension
* seated leg curl
* lying leg curl
* hip thrust machine
* cable station
* abductor machine
* glute kickback machine
* dumbbells
* barbells
* kettlebells

### Góra

* lat pulldown
* seated row
* chest supported row
* cable station
* pec deck
* shoulder press machine
* lateral raise machine
* assisted pull-up
* preacher curl
* triceps cable

Generator ma potem wybierać najlepsze ćwiczenia dostępne w sprzęcie klienta.

---

## Etap E — Kontuzje, ból i ograniczenia

To musi być proste, nie medyczna encyklopedia.

### Pytania

Czy masz aktualny ból lub ograniczenie?

* bark
* łokieć
* nadgarstek
* lędźwie
* biodro
* kolano
* kostka
* szyja
* inne

Potem:

```txt
Czy ból pojawia się przy:
- przysiadach
- martwych ciągach
- wyciskaniu
- ruchach nad głowę
- wykrokach
- bieganiu/skakaniu
```

I skala:

```txt
0–10
```

Reguła:

```txt
ból 0–2 = monitor
ból 3–5 = ostrożnie / alternatywy
ból 6+ = alert dla trenera, plan nie powinien agresywnie programować tej struktury
```

---

## Etap F — Preferencje ćwiczeń

Bardzo niedoceniane.

### Pytania

* ćwiczenia, które lubisz
* ćwiczenia, których nie lubisz
* ćwiczenia, których nie możesz robić
* maszyny czy wolne ciężary?
* wolisz mniej ćwiczeń i ciężej czy więcej ćwiczeń i lżej?
* czy umiesz oceniać RIR?
* czy chcesz mocno techniczny plan czy prostszy?

To zwiększa adherence. A plan bez adherence jest tylko PDF-em z ambicjami.

---

# 3. Decision Engine — serce algorytmu

Ankieta nie może tylko zapisywać odpowiedzi. Ona ma je zamieniać w parametry planu.

## Główne parametry generowane po ankiecie

```txt
training_level
goal_type
priority_muscles
maintenance_muscles
avoid_growth_muscles
weekly_frequency
session_duration
recovery_capacity
equipment_profile
injury_constraints
exercise_preferences
volume_start_level
intensity_style
progression_model
split_type
```

---

# 4. Algorytm wyboru splitu

## Reguły podstawowe

### 2 dni / tydzień

```txt
Full Body A/B
```

Dla:

* początkujących
* zapracowanych
* powrotu po przerwie
* niskiej regeneracji

---

### 3 dni / tydzień

Najczęściej:

```txt
Full Body A/B/C
```

albo:

```txt
Lower / Upper / Full Body
```

Dla kobiet z priorytetem pośladki:

```txt
Lower Glute Focus / Upper / Lower Glute + Hamstrings
```

---

### 4 dni / tydzień

Najlepsze opcje:

```txt
Upper / Lower / Upper / Lower
```

albo dla priorytetu pośladki:

```txt
Lower Glute / Upper / Lower Quad+Glute / Upper+Glute Accessories
```

---

### 5 dni / tydzień

Tylko jeśli regeneracja jest dobra:

```txt
Lower / Upper / Glute / Upper / Lower
```

albo:

```txt
Push / Pull / Legs / Upper / Lower
```

---

## Reguła antygłupoty

Jeśli:

```txt
sen < 6 h
stres >= 4
praca fizyczna
początkujący
```

to nie dajemy 5 dni, nawet jeśli klient kliknie, że chce. Człowiek kliknie wszystko, a potem będzie płakał w check-inie. System ma mieć kręgosłup.

---

# 5. Algorytm objętości

To jest klucz.

Plan musi bazować na objętości per mięsień, a nie tylko "ćwiczenia na dzień".

Areté powinno liczyć:

```txt
weekly_hard_sets_per_muscle
```

## Startowe zakresy objętości

### Początkujący

| Mięsień            | Serie / tydz. |
| ------------------ | ------------: |
| Duże partie        |          6–10 |
| Małe partie        |           4–8 |
| Priorytet          |          +2–4 |
| Partie maintenance |           3–6 |

### Średniozaawansowany

| Mięsień     | Serie / tydz. |
| ----------- | ------------: |
| Duże partie |          8–14 |
| Małe partie |          6–10 |
| Priorytet   |          +4–6 |
| Maintenance |           4–8 |

### Zaawansowany

| Mięsień     | Serie / tydz. |
| ----------- | ------------: |
| Duże partie |         10–18 |
| Małe partie |          8–14 |
| Priorytet   |          +4–8 |
| Maintenance |           4–8 |

Nie robimy od razu MRV. Startujemy konserwatywnie i adaptujemy.

---

## Recovery modifier

```txt
wysoka regeneracja = +10–20% objętości
średnia = bazowo
niska = -20–30% objętości
```

### Niska regeneracja, jeśli:

* sen <6 h
* stres 4–5
* praca fizyczna
* dużo bólu
* bardzo niska energia
* początkujący po przerwie

---

# 6. Algorytm doboru ćwiczeń

Tutaj trzeba ulepszyć bazę ćwiczeń.

Masz już fundament bazy ćwiczeń, ale obecna wersja jest bardziej MVP niż premium. Wcześniej ustaliliśmy, że warto dodać pola typu `tier`, `role`, `primary_muscles`, `secondary_muscles`, `stimulus_rating`, `fatigue_rating`, `tier_reason` itd. 

## Każde ćwiczenie powinno mieć metadata

```txt
id
name
name_pl
primary_muscles
secondary_muscles
movement_pattern
equipment
tier
role
stimulus_rating
fatigue_rating
skill_requirement
stability
range_of_motion
stretch_position
joint_risk
lower_back_fatigue
setup_complexity
beginner_friendly
goal_tags
contraindications
alternatives
technical_cues
common_mistakes
```

Bez tego generator nie wybiera ćwiczeń inteligentnie.

---

## Scoring ćwiczeń

Każde ćwiczenie dostaje wynik:

```txt
exercise_score =
stimulus_rating
- fatigue_penalty
- pain_penalty
- skill_penalty
+ priority_bonus
+ equipment_match
+ preference_bonus
+ stability_bonus
```

Przykład:

Dla klientki z priorytetem pośladki, bólem lędźwi i dostępem do maszyn:

```txt
Hip Thrust Machine > Barbell Hip Thrust > Romanian Deadlift > Conventional Deadlift
```

Bo mniej skill, mniej lower back fatigue, wysoki stimulus dla glute.

---

# 7. Tier ćwiczeń

## S-tier

Ćwiczenia bardzo dobre dla większości, wysoki stimulus, dobra stabilność, dobra progresja.

Przykłady:

* hack squat
* leg press
* seated leg curl
* cable lateral raise
* chest supported row
* machine chest press
* lat pulldown
* hip thrust machine
* cable fly
* leg extension

## A-tier

Bardzo dobre, ale bardziej zależne od osoby/techniki.

* barbell squat
* Romanian deadlift
* Bulgarian split squat
* dumbbell bench press
* pull-up
* barbell row
* incline dumbbell press

## B-tier

Przydatne, ale bardziej sytuacyjne.

* goblet squat
* dumbbell fly
* walking lunges
* push-ups
* cable kickback
* face pull
* back extension

## C-tier

Nie zakazane, ale nie jako fundament premium planu.

* bosu circus
* random functional chaos
* dziwne warianty bez progresji
* ćwiczenia, które istnieją głównie po to, żeby influencer miał nowy filmik

---

# 8. Role ćwiczeń

To jest nawet ważniejsze niż tier.

```txt
main
secondary
accessory
pump
prehab
skill
```

Przykład:

| Ćwiczenie         | Tier | Role                      |
| ----------------- | ---: | ------------------------- |
| Hack Squat        |    S | main                      |
| Leg Extension     |    S | accessory/pump            |
| Hip Thrust        |  S/A | main                      |
| Cable Kickback    |  B/A | accessory                 |
| Romanian Deadlift |    A | main/secondary            |
| Seated Leg Curl   |    S | accessory/main hamstrings |
| Lateral Raise     |    S | accessory/main delts      |

Bo leg extension nie jest "gorsze" od squata. Ono ma inną rolę. I właśnie tu ludzie robią z treningu religię zamiast narzędzia.

---

# 9. Generator planu — jak powinien działać

## Krok 1: Ustal split

Na podstawie:

```txt
dni treningowe + czas + poziom + regeneracja + priorytet
```

## Krok 2: Ustal objętość tygodniową

Na podstawie:

```txt
poziom + cel + priorytety + regeneracja
```

## Krok 3: Rozdziel objętość na dni

Przykład 3 dni, pośladki priorytet:

```txt
Dzień 1: Lower Glute/Quad
Dzień 2: Upper
Dzień 3: Lower Glute/Hamstring
```

## Krok 4: Wybierz movement patterns

Dla pośladków:

```txt
hip extension
squat/lunge pattern
hip abduction
hinge
glute isolation
```

Dla pleców:

```txt
vertical pull
horizontal row
upper back row
lat-biased pull
rear delt
```

## Krok 5: Wybierz ćwiczenia scoringiem

Nie losowo.

```txt
najwyższy score + dostępny sprzęt + brak konfliktu z bólem + zgodny z celem
```

## Krok 6: Ustaw serie, powtórzenia, RIR, przerwy

Przykład:

| Typ ćwiczenia      |        Reps |       RIR | Przerwa |
| ------------------ | ----------: | --------: | ------: |
| Main compound      | 5–10 / 6–12 | 2–3 start | 2–4 min |
| Secondary compound |        8–12 |       1–3 | 2–3 min |
| Isolation          |       10–20 |       0–2 | 1–2 min |
| Pump/accessory     |       15–30 |       0–2 | 45–90 s |

## Krok 7: Dodaj progresję

Każde ćwiczenie musi dostać model:

```txt
double progression
load progression
rep progression
volume progression
technique hold
```

## Krok 8: Dodaj alternatywy

Każde ćwiczenie powinno mieć 2–3 alternatywy.

Przykład:

```txt
Hack Squat
Alternatywy:
- Leg Press
- Smith Squat
- Goblet Squat
```

## Krok 9: Dodaj wyjaśnienie

Plan powinien generować opis:

```txt
Dlaczego ten split?
Dlaczego te ćwiczenia?
Jaki jest priorytet mezocyklu?
Jak progresować?
Kiedy zgłosić problem?
```

To robi premium feeling.

---

# 10. Progresja — core logika

## Double progression

Dla większości ćwiczeń:

```txt
3x8–12 @ RIR 1–2
```

Reguły:

```txt
Jeśli wszystkie serie osiągnęły górny zakres i RIR zgodny → dodaj ciężar
Jeśli część serii w zakresie → utrzymaj ciężar, dodaj reps
Jeśli poniżej zakresu i RIR 0 → zmniejsz ciężar
Jeśli ból >3/10 → nie progresuj, alert
Jeśli technika słaba → utrzymaj lub zmniejsz
```

---

# 11. Reguły deloadu

Na MVP możesz mieć prosty system.

Deload sugerowany, jeśli przez 2–3 treningi:

```txt
spada performance
RIR niższy niż target
energia niska
sen słaby
ból rośnie
soreness wysoka
brak progresu mimo dobrego adherence
```

Deload:

```txt
-30–50% serii
RIR 3–5
bez serii blisko upadku
utrzymać ruch, zmniejszyć presję
```

---

# 12. Feedback po treningu

Po każdej sesji klient odpowiada szybko:

```txt
1. Jak ciężki był trening? 1–5
2. Pompa w partii priorytetowej? 1–5
3. Soreness po poprzednim treningu? 1–5
4. Ból stawowy? 0–10
5. Energia? 1–5
```

Potem system może regulować:

```txt
pompa niska + soreness niska + performance dobry = można dodać serię
soreness wysoka + performance spada = nie dodawać, możliwe odjęcie
ból >3 = alert i alternatywa
```

To jest kierunek RP/Mesostrength, ale z Twoim własnym filtrem. Nie robimy ślepego kultu pumpa, bo to nie religia, tylko wskaźnik.

---

# 13. Ankieta powinna być "nakierowująca"

Czyli nie tylko pytania. Pomocnicze opisy.

Przykład:

### Ile dni chcesz trenować?

```txt
2 dni — minimum skuteczne
3 dni — najlepszy start dla większości
4 dni — optymalnie dla rozwoju sylwetki
5 dni — tylko jeśli dobrze się regenerujesz
```

### Jaki masz poziom?

```txt
Nie wybieraj "zaawansowany", jeśli nie umiesz ocenić RIR i nie logujesz ciężarów. To nie konkurs ego.
```

Może delikatniej w UI, ale w duchu dokładnie tak. 😄

---

# 14. Minimalny model danych do generatora

Dla Claude możesz dać takie założenie:

```ts
type QuestionnaireResult = {
  goal: "fat_loss" | "muscle_gain" | "recomp" | "strength" | "health";
  sex: "male" | "female" | "other";
  age: number;
  height_cm: number;
  bodyweight_kg: number;

  experience_level: "beginner" | "intermediate" | "advanced";
  training_history_months: number;
  knows_rir: boolean;

  days_per_week: 2 | 3 | 4 | 5 | 6;
  session_duration_min: 30 | 45 | 60 | 75 | 90;
  can_train_consecutive_days: boolean;

  priority_muscles: string[];
  maintenance_muscles: string[];
  avoid_growth_muscles: string[];

  sleep_hours: number;
  sleep_quality: 1 | 2 | 3 | 4 | 5;
  stress_level: 1 | 2 | 3 | 4 | 5;
  job_activity: "sedentary" | "mixed" | "physical";
  average_steps: number;

  equipment: string[];

  pain_areas: {
    area: string;
    pain_level: number;
    painful_movements: string[];
  }[];

  liked_exercises: string[];
  disliked_exercises: string[];
  forbidden_exercises: string[];

  preference: {
    machines_vs_free_weights: "machines" | "free_weights" | "mixed";
    training_style: "simple" | "balanced" | "advanced";
    intensity_preference: "moderate" | "hard" | "very_hard";
  };
};
```

---

# 15. Prompt dla Claude do przebudowy generatora

Skopiuj mu to:

```txt
CEL:
Przebuduj ankietę onboardingową i algorytm generowania planu treningowego w Areté tak, aby system nie losował ćwiczeń, tylko podejmował decyzje na podstawie danych klienta.

KONTEKST:
Areté to evidence-based coaching platform dla trenera personalnego. Plan generator ma działać jak inteligentny system coachingowy: ankieta → decision engine → plan generator. Nie chcemy randomowych planów. Chcemy planów opartych o hipertrofię, RIR, objętość per muscle, priorytety sylwetkowe, ograniczenia, sprzęt, regenerację i progresję.

ZAŁOŻENIA:
1. Ankieta ma być intuicyjna, krótka wizualnie, ale mądra decyzyjnie.
2. Każde pytanie musi wpływać na jakąś decyzję algorytmu.
3. Generator planu ma wybrać:
   - split
   - tygodniową objętość per muscle
   - ćwiczenia
   - serie
   - zakresy powtórzeń
   - RIR
   - przerwy
   - progresję
   - alternatywy ćwiczeń
   - krótkie uzasadnienie planu
4. Generator musi uwzględniać:
   - cel klienta
   - płeć
   - doświadczenie
   - dni treningowe
   - czas na trening
   - priorytety sylwetkowe
   - partie do utrzymania
   - partie, których klient nie chce mocno rozwijać
   - sen
   - stres
   - pracę
   - kroki
   - sprzęt
   - ból/kontuzje
   - preferencje ćwiczeń
   - znajomość RIR
5. Baza ćwiczeń musi zostać rozszerzona o pola:
   - tier
   - role
   - primary_muscles
   - secondary_muscles
   - movement_pattern
   - equipment
   - stimulus_rating
   - fatigue_rating
   - skill_requirement
   - stability
   - stretch_position
   - joint_risk
   - lower_back_fatigue
   - beginner_friendly
   - contraindications
   - alternatives
   - technical_cues
   - common_mistakes
6. Ćwiczenia mają być wybierane scoringiem, nie losowo:
   exercise_score =
   stimulus_rating
   - fatigue_penalty
   - pain_penalty
   - skill_penalty
   + priority_bonus
   + equipment_match
   + preference_bonus
   + stability_bonus

OUTPUT:
1. Zaproponuj strukturę ankiety w krokach.
2. Zaproponuj TypeScript types dla odpowiedzi ankiety.
3. Zaproponuj algorytm decision engine.
4. Zaproponuj algorytm wyboru splitu.
5. Zaproponuj algorytm objętości per muscle.
6. Zaproponuj scoring ćwiczeń.
7. Zaproponuj strukturę wygenerowanego planu.
8. Zaproponuj minimalną implementację MVP w obecnym kodzie.
9. Nie rób dużego refactoru całej aplikacji, jeśli da się to wdrożyć modułowo.
10. Najpierw pokaż plan zmian, potem kod.
```

---

# 16. Najważniejsza decyzja produktowa

Nie próbuj jeszcze robić pełnego AI planera.

Na teraz zrób:

> **rule-based expert system**

Czyli zestaw reguł trenerskich.

AI później może:

* wyjaśniać plan,
* pisać feedback,
* analizować check-in,
* sugerować korekty.

Ale fundament to reguły, nie magia.

Bo AI bez reguł będzie pisać piękne bzdury. A piękne bzdury to niestety specjalność internetu.

---

# 17. Kolejność prac

## Teraz:

1. Rozbudować bazę ćwiczeń.
2. Dodać metadata ćwiczeń.
3. Przebudować ankietę.
4. Stworzyć decision engine.
5. Stworzyć generator planu.
6. Dodać progresję.
7. Dodać uzasadnienie planu.
8. Dodać feedback po treningu.
9. Dopiero potem analytics.

---

# 18. Finalna moja rekomendacja

Tak, **ćwiczenia trzeba ulepszyć**.

Tak, **ankietę trzeba rozbudować**.

Tak, **generator musi być oparty o top wiedzę**, czyli:

* RIR,
* objętość per muscle,
* priorytety,
* fatigue management,
* SFR,
* długość mięśnia / stretch bias,
* stabilność,
* progresję,
* regenerację,
* tolerancję bólu,
* preferencje klienta,
* adherence.

I najważniejsze:

> **Plan nie ma być "ładną rozpiską". Plan ma być decyzją trenerską zapisaną w formie programu.**

To jest poziom, w który warto iść.
Nie "Hevy po grecku".
Tylko **Areté jako coaching decision engine**. 🏛️
