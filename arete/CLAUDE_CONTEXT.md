## KONTEKST PROJEKTU ARETÉ — maj 2026

### KIM JESTEM
Alexander Panorios | manager JustGYM Częstochowa + trener personalny online
Marka "Areté" (ἀρετή) | Half-Greek, half-Polish | evidence-based | filozoficzny
Buduję coach-led hypertrophy coaching webapp z mobile app.

### WIZJA PRODUKTU
Areté = Coach-Led Hypertrophy Operating System
Problem: większość aplikacji tylko loguje trening, ale nie prowadzi procesu.
Pętla: Measure → Analyze → Decide → Adjust
Hasło: "Areté zamienia chaos klienta w decyzje trenera."

### TECH STACK
- Next.js 14 App Router (NIE 15 — cookies() jest SYNCHRONICZNE, nigdy async/await w createClient())
- Supabase: jjbpnrwjljzivwzhzldl.supabase.co (Frankfurt), RLS na wszystkich tabelach
- Vercel Pro + GitHub: veildorne/arete-coaching → folder arete/
- Domena: arete-system.pl
- Tailwind v3, TypeScript
- Email: Resend (noreply@arete-system.pl)

### SCHEMAT PRACY
Claude.ai Chat = architektura, review, komendy
Claude Code Desktop = wykonanie w terminalu Mac
GitHub → Vercel auto-deploy

Komendy zawsze w formacie gotowym do wklejenia do Claude Code.
Nigdy nie wklejam surowego kodu — daję instrukcje co zmienić.

### BRAND — Deep Amber Palette
- BG: #140900, Surface: #1E0F00
- Accent: #C05000, Gold: #D4AF37
- Progress green: #52B788, Alert: #8B1A1A/#E57373
- Warm white: #F2EEE8, Warm grey: #A07848
- Fonty: Cormorant Garamond (nagłówki), Outfit (body)
- Styl: grecki, premium, ciemny, minimalistyczny

### TIERY USŁUG
- PAIDEIA (παιδεία) — 199 PLN jednorazowo
- ASKESIS (ἄσκησις) — 279 PLN/mies
- ARETÉ (ἀρετή) — 449 PLN/mies

### DB SCHEMA (7 tabel potwierdzone)
profiles · exercises · check_ins · messages · questionnaires · training_logs · training_plans

NIE ISTNIEJĄ (nie zakładaj!):
workout_sessions · logged_sets · programs · coach_notes · volume_targets

Dodatkowe tabele używane:
- weight_logs (waga dzienna klienta)
- nutrition_targets (cele makro klienta)
- meal_plans (aktywny plan żywienia)

### STRUKTURA PLIKÓW (komponenty obok page.js)
app/client/ClientPortal.js
app/client/workout/WorkoutLogger.js
app/dashboard/DashboardClient.js
app/dashboard/client/[id]/ClientDetail.js
app/dashboard/client/[id]/NutritionPanel.js
app/dashboard/client/[id]/MealPlanBuilder.js
app/dashboard/client/[id]/plan/new/PlanBuilder.js
app/dashboard/knowledge/page.js
lib/planAlgorithm.js (v5+)
lib/mealData.js (200+ produktów)
lib/dailyTips.js (126 tipów)

NIGDY nie ruszać: app/page.js (landing page)

### CO JEST GOTOWE (maj 2026)
✅ Auth: email/password, role coach/client, invite flow (Resend)
✅ Coach Dashboard: lista klientów, stats, Needs Attention, Activity Feed
✅ ClientDetail: zakładki plans/logs/checkins/questionnaire/nutrition
✅ Client Portal: CharacterCard, StatGrid (mock), CampaignProgress, Achievements
✅ WorkoutLogger v2: prev performance, rest timer, session summary, exercise picker
✅ Plan Builder + planAlgorithm.js v5: MEV/MRV, RIR progression, deload week 6
✅ Check-in loop: coach feedback inline, statusy, alerty
✅ Ankieta: klient wypełnia, coach widzi i EDYTUJE przez /api/questionnaire/update
✅ PWA manifest + SW
✅ Exercise seed: 75+ ćwiczeń z tier S/A/B/C, SFR, stretch_position, unilateral
✅ Nutrition System: NutritionPanel, MealPlanBuilder, CheatMealTracker
✅ Daily Tips: 126 tipów evidence-based w lib/dailyTips.js, DailyTipCard.js
✅ Knowledge Base: /dashboard/knowledge z tabelami MEV/MRV, kalkulatorami, protokołami
✅ Ocean background + loading screens
✅ ZeusWidget mascot (sprite sheet)

### ALGORYTM PLANU — KLUCZOWE ZASADY (planAlgorithm.js v5)
- Priority muscles → zawsze MAV/MRV (recovery modifier NIE dotyka priority)
- Recovery modifier → tylko neutral/avoid muscles (Israetel)
- chooseSplit respektuje czas sesji: ≤60min → FBW, >75min → split
- Staz mapping: '2-3 lata' → 'advanced' (nie intermediate)
- Session time = wskazówka dla klienta, NIE hard limit objętości
- Cap serii: beginner 3×muscles, intermediate 4×, advanced 5× per sesja
- Deload tydzień 6, ramp tygodniowy (tyg 3-4: +1, tyg 5: +2)
- FBW glute injection dla kobiet z glute priority

### FRAMEWORK TRENINGOWY
- Periodyzacja: Israetel (MEV/MAV/MRV, 6-tyg. mezocykl, tyg.6=deload)
- Intensywność: RIR/RPE (Helms + Zourdos)
- 1RM: Epley weight*(1+reps/30)
- TDEE: Mifflin-St Jeor × mnożnik aktywności
- Białko: redukcja 2.0-2.4g/kg, masa 1.8-2.2g/kg
- Tłuszcz minimum: 0.7-0.8g/kg

### WAŻNE TECHNICZNE
- training_plans.is_active=true — klient portal tego wymaga
- Admin client (lib/supabase-admin.js) — omija RLS, tylko server-side
- Coach edycja ankiety przez /api/questionnaire/update/route.js (admin client)
- select option dark fix: globals.css → select option { background: #1a1a1a; color: #e8e8e8; }
- lucide-react w arete/package.json
- Case sensitivity na Linux/Vercel — używaj git mv do rename

### AKTUALNY PROBLEM (do sprawdzenia)
- Zapis ankiety przez /api/questionnaire/update — czy działa po ostatnim commicie
- Accordion historii ankiet — widoczny tylko gdy klient ma >1 ankietę w DB

### CO DALEJ — KOLEJNOŚĆ
1. Weryfikacja zapisu ankiety + test generowania planu po zmianie danych
2. Faza 6: Hypertrophy Engine — volume tracking, compliance, performance trends
3. Faza 7: RPG Layer — xp_events, achievements tabele, prawdziwy XP
4. Faza 8: Notifications — email templates, in-app
5. Faza 9: Nutrition check-in tygodniowy
6. Faza 11: PWA mobile improvements
7. Faza 12: AI Layer (claude-sonnet-4-6 przez Anthropic API)

### MODEL GUIDE
Sonnet = codzienne kodowanie, bugfixing, pojedynczy feature
Opus = złożona architektura, AI layer, gdy Sonnet się gubi

### ZASADY KTÓRYCH NIE ŁAMIEMY
- cookies() w Next.js 14 = SYNCHRONICZNE
- Weryfikuj schemat DB przed nowym feature
- Komponenty obok page.js, NIE w /components/
- app/page.js (landing) — NIE RUSZAĆ
- Jeden feature na raz
- Logika osobno od kosmetyki (nie miksuj feature + UI redesign)
- is_active=true na training_plans — klient portal tego wymaga
- Admin client tylko server-side, nigdy w komponentach klienta

### NAUKA Z BŁĘDÓW
- RLS recursive policies → infinite recursion (był fix: using (true))
- Case sensitivity Linux → git mv do rename plików
- cookis() async → Vercel build failure
- priority muscles obcinane przez session cap → FIXED (priority zawsze wchodzi)
- chooseSplit ignorował czas sesji → FIXED (≤60min = FBW)
- Recovery modifier uderzał w priority → FIXED (tylko neutral/avoid)

### KOMUNIKACJA
- Odpowiadam po polsku
- Komendy daję gotowe do Claude Code — jasne, atomowe
- Przed każdą zmianą w DB: weryfikuj Table Editor lub migracje
- Screenshot → diagnoza → fix → test
