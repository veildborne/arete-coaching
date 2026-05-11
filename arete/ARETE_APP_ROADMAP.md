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

## AKTUALNY STAN — maj 2026 (aktualizacja 11.05.2026)

### ✅ Zrobione w tej sesji (maj 11):

**ALGORYTM v5.0**
- ✅ Unilateral preference — korekcja asymetrii (dysproporcja_obszar z ankiety)
- ✅ Training style: simple (1 ex/muscle) | balanced | varied (2+ gdy dużo setów)
- ✅ Gradual volume ramp — tydzień 1-2 baseline, 3-4 +1 set, 5 +2 sety (MRV approach), 6 deload
- ✅ Plan validator — sprawdza puste sesje, brak coverage mięśni, za mało setów
- ✅ Priority muscles bypass density reduction (pełne rawSets bez obniżki)
- ✅ Priority-aware exercise cap (priorytetowe mięśnie nie są ucięte przy max exercises limit)
- ✅ Session density respects duration (czas_sesji z ankiety → 60/75/90 min → density factor)
- ✅ Enhanced pain exclusions — movement_pattern matching (push/hinge/squat/row/isolation)
- ✅ Wrist pain exclusion support
- ✅ Forearms jako oddzielna partia z MEV/MAV/MRV landmarks
- ✅ Compound-first sorting w sesjach
- ✅ Exercise count cap per session based on duration (5/6/8 max)

**COACH FLOW**
- ✅ Email questionnaire invitation system (Resend) — coach wysyła zaproszenie, klient dostaje link
- ✅ Questionnaire access gating — questionnaire_requested flag (bidirectional)
- ✅ Client management controls — tier/status changes, delete client w dropdown
- ✅ Dashboard redesign — sidebar (logo, nav items z badges, add client, profile)
- ✅ Dashboard 2-column layout — left (clients grid, attention), right (quick actions, activity, pending check-ins)
- ✅ Pending check-ins widget — kto czeka na feedback
- ✅ 5 stats cards including "Check-iny" metric

**CLIENT FLOW**
- ✅ Post-workout feedback — pump/fatigue/performance ratings po sesji
- ✅ ClientPortal UI improvements — ZeusWidget bez ramki, ACHIEVEMENTS po polsku, LitRPG stats
- ✅ Questionnaire badge — 3 stany: pending (📋 Czeka na wypełnienie + link), filled (✓ Wypełniona), empty (null)
- ✅ Self-serve questionnaire access removed — coach-only flow
- ✅ Asymmetry/disproportion block w ankiecie — dysproporcja_obszar[] + opis

**PLAN SYSTEM**
- ✅ PlanViewer fixes — .eq('is_active', true), sessions parsing (object + array format), weekData fallback
- ✅ WorkoutLogger weekly progression support — auto-load z weeks[] array based on current_week
- ✅ Plan structure compatibility — flat fields (sets/rep_range/rir_target) + weeks[] array

**LOADING SCREENS**
- ✅ Animated loading screens — /dashboard, /client, /client/workout, /client/checkin, /dashboard/client/[id]
- ✅ Random Greek phrases (4 options) — spinning gold ring, animated dots

**EXERCISES**
- ✅ All exercises tagged with unilateral: true/false field
- ✅ Unilateral scoring bonus +20 when dysproporcja detected

### Zrobione wcześniej (poprzednie sesje):
- ✅ Algorytm v3/v4 — Decision Engine (buildDecisionParams, chooseSplit, scoreExercise)
- ✅ Ankieta v2 — structured data (priority_muscles[], equipment[], pain_areas[], stress_level, sleep_quality, knows_rir)
- ✅ Exercise seed v2 — tier S/A/B/C, compound, movement_pattern, lower_back_fatigue, joint_risk, beginner_friendly
- ✅ Progression Engine — lib/progressionEngine.js (Helms, Israetel, Zourdos, Schoenfeld, Nuckols, Trexler)
- ✅ Historia planów — status aktywny/archiwalny, rationale, przycisk Aktywuj
- ✅ Historia ankiet — wersje z datami, nowa ankieta vs aktualizacja
- ✅ Daily weight log — tabela weight_logs, 7-dniowa średnia
- ✅ Activity feed — dashboard trenera
- ✅ next/font — szybsze ładowanie fontów
- ✅ Plan summary — coach szczegółowy + client podstawowy
- ✅ Compliance fix — poprawne liczenie serii
- ✅ Plan name na kartach klientów

### Do zrobienia (następne sesje):
- ⏳ Maskotka pixel art — implementacja (sprite sheet fix)
- ⏳ UI/UX polish — szczegóły animacji, transitions
- ⏳ Indirect volume per movement_pattern (Israetel overlap concept)
- ⏳ Email notifications — nowy plan, check-in reminder
- ⏳ Mobile responsive improvements
- ⏳ Faza 9 — Nutrition System (macro calculator, TDEE)
- ⏳ Faza 10 — Advanced Periodization (DUP, block periodization)

### Znane bugi / Tech debt:
- Zeus maskotka — miga, wymaga poprawki sprite sheet
- Mobile responsiveness — niektóre widoki wymagają optymalizacji
- Error handling — brak comprehensive error boundaries

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
- [x] Email notifications (questionnaire invitation via Resend)
- [x] Post-workout feedback (pump/fatigue/performance)
- [ ] Client alerts (dashboard widget ready, logic to expand)

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
