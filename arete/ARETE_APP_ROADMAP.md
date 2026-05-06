# ARETÉ APP ROADMAP

Evidence-based coaching platform for hypertrophy and strength training.

---

## FAZY ROZWOJU

### FAZA 1 — FUNDAMENT ✅ DONE
- Autentykacja (Supabase)
- Role routing (coach/client)
- Podstawowe tabele (profiles, questionnaires, training_plans, training_logs, check_ins)
- Landing page + auth flow

### FAZA 2 — WORKOUT LOGGER ✅ DONE
- WorkoutLogger.js — logowanie serii (reps, weight, RIR)
- Sesje z obiektu plan.sessions
- Zapis do training_logs
- Progresja w logu

### FAZA 3 — DASHBOARD LAYOUT ✅ DONE
- Dashboard trenera — lista klientów
- ClientDetail — szczegóły klienta, plany, ankiety
- ClientPortal — panel klienta z XP i questami

### FAZA 4 — PLAN BUILDER ✅ DONE
- PlanBuilder.js — generowanie planu z ankiety
- planAlgorithm.js — MEV, split selection, exercise scoring
- Zapis planu, aktywacja
- Plan summary (coach + client view)

### FAZA 5 — CHECK-IN LOOP ✅ DONE
- Formularz check-in — energia, sen, adherencja, notatki
- Coach feedback w check-inach
- Historia check-inów w portalu klienta

### FAZA 6 — BASIC HYPERTROPHY ENGINE ✅ DONE (częściowo)
- MEV/MAV/MRV per muscle (Israetel)
- Priority muscles (+4 sets)
- Equipment filter
- Beginner gates
- Injury exclusions
- Stretch-position bonus (Milo Wolf)
- Cardio interference (Hickson)

### FAZA 7 — RPG LAYER ⏳ IN PROGRESS (UI gotowy, XP z logów, achievements)
- CharacterCard — archetypy (Novice → Areté)
- XP system — 120 XP per trening
- Achievements (Protos, Askesis, Kleos, Areté)
- StatGrid — radar chart z 6 wymiarów
- Campaign Progress — mezocykl jako quest
- Zeus maskotka (pixel art sprite)

### FAZA 8 — NOTIFICATIONS (planned)
- Email po submit check-in
- Email po nowym planie
- Push notifications (opcjonalne)

### FAZA 9 — NUTRITION SYSTEM (planned)
- Macro calculator
- TDEE estimation (Mifflin-St Jeor)
- Diet breaks (Trexler)
- Refeed days

### FAZA 10 — ADVANCED PERIODIZATION (planned)
- DUP (Daily Undulating Periodization)
- Block periodization
- Peaking phase
- Deload strategies

---

## AKTUALNY STAN — maj 2026 (aktualizacja)

### Zrobione od ostatniej aktualizacji:
- ✅ Algorytm v3 — Decision Engine (buildDecisionParams, chooseSplit, scoreExercise)
- ✅ Ankieta v2 — structured data (priority_muscles[], equipment[], pain_areas[], stress_level, sleep_quality, knows_rir)
- ✅ Exercise seed v2 — tier S/A/B/C, compound, movement_pattern, lower_back_fatigue, joint_risk, beginner_friendly
- ✅ Progression Engine — lib/progressionEngine.js (Helms, Israetel, Zourdos, Schoenfeld, Nuckols, Trexler)
- ✅ Historia planów — status aktywny/archiwalny, rationale, przycisk Aktywuj
- ✅ Historia ankiet — wersje z datami, nowa ankieta vs aktualizacja
- ✅ Daily weight log — tabela weight_logs, 7-dniowa średnia
- ✅ Activity feed — dashboard trenera
- ✅ Loading screens — per route
- ✅ next/font — szybsze ładowanie fontów
- ✅ Plan summary — coach szczegółowy + client podstawowy
- ✅ Compliance fix — poprawne liczenie serii
- ✅ Plan name na kartach klientów

### Do zrobienia (następne sesje):
- ⏳ Email "wyślij ankietę do klienta" — Resend
- ⏳ Post-workout feedback (pompa/soreness) — po sesji
- ⏳ getClientAlerts podłączony do dashboardu
- ⏳ Dashboard HQ redesign — sidebar, centrum dowodzenia
- ⏳ Maskotka pixel art — implementacja
- ⏳ UI/UX redesign — tła, kolory Deep Amber
- ⏳ Indirect volume per movement_pattern
- ⏳ Faza 8 — Notifications
- ⏳ Faza 9 — Nutrition System

### Znane bugi:
- Compliance 0% dla klientów bez logów (poprawne ale wizualnie mylące)
- Ankieta stara vs nowa — fallback działa ale plan mniej precyzyjny
- Zeus maskotka — miga, wymaga poprawki sprite sheet

---

## FILTR FUNKCJI

### Must-have (MVP):
- [x] Auth + role routing
- [x] Questionnaire
- [x] Plan generation
- [x] Workout logger
- [x] Check-in loop
- [x] Coach dashboard

### Should-have (Q2 2026):
- [x] Progression engine
- [x] Weight tracking
- [ ] Email notifications
- [ ] Post-workout feedback
- [ ] Client alerts

### Nice-to-have (Q3+ 2026):
- [ ] Nutrition system
- [ ] Advanced periodization
- [ ] Mobile app (React Native)
- [ ] Public profile/progress sharing

---

##STACK

- **Framework**: Next.js 14 (App Router)
- **Auth**: Supabase Auth
- **DB**: Supabase PostgreSQL
- **Hosting**: Vercel
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts
- **Fonts**: next/font (Cormorant Garamond + Outfit)

---

## EVIDENCE BASE

Algorytm oparty na publikacjach:
- **Israetel et al.** — MEV/MAV/MRV volume landmarks
- **Helms, Zourdos** — RIR-based autoregulation, double progression
- **Schoenfeld 2023** — stretch-mediated hypertrophy
- **Nuckols** — load-volume continuum
- **Henselmans** — frequency optimization
- **Trexler 2014** — metabolic adaptation, diet breaks
- **Hickson** — concurrent training (cardio interference)
- **Milo Wolf 2023** — stretch position bonus
