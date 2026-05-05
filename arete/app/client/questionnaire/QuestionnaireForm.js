'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

// ─── STAŁE ────────────────────────────────────────────────────────────────────

const MUSCLE_OPTIONS = [
  { value: 'glutes',         label: 'Pośladki' },
  { value: 'hamstrings',     label: 'Uda tylne (hamstringi)' },
  { value: 'quads',          label: 'Uda przednie (czwórgłowe)' },
  { value: 'back',           label: 'Plecy' },
  { value: 'shoulders_lat',  label: 'Barki boczne' },
  { value: 'shoulders_rear', label: 'Barki tylne' },
  { value: 'chest',          label: 'Klatka piersiowa' },
  { value: 'biceps',         label: 'Biceps' },
  { value: 'triceps',        label: 'Triceps' },
  { value: 'calves',         label: 'Łydki' },
  { value: 'abs',            label: 'Brzuch' },
]

const EQUIPMENT_OPTIONS = [
  { value: 'barbell',           label: 'Sztanga olimpijska' },
  { value: 'dumbbell',          label: 'Hantle' },
  { value: 'cable',             label: 'Wyciąg / kablowy' },
  { value: 'machine',           label: 'Maszyny ogólnie' },
  { value: 'squat_rack',        label: 'Klatka / stojaki' },
  { value: 'smith_machine',     label: 'Smith machine' },
  { value: 'hack_squat',        label: 'Hack squat' },
  { value: 'leg_press',         label: 'Suwnica / leg press' },
  { value: 'leg_extension',     label: 'Prostowanie nóg (maszyna)' },
  { value: 'leg_curl',          label: 'Uginanie nóg (maszyna)' },
  { value: 'hip_thrust_machine',label: 'Maszyna do hip thrust' },
  { value: 'lat_pulldown',      label: 'Wyciąg górny (drążek)' },
  { value: 'seated_row',        label: 'Wiosłowanie na wyciągu' },
  { value: 'pec_deck',          label: 'Pec deck / rozpiętki maszyna' },
  { value: 'abductor',          label: 'Odwodziciel / przywodziciel' },
  { value: 'pull_up_bar',       label: 'Drążek do podciągania' },
  { value: 'kettlebell',        label: 'Kettlebell' },
  { value: 'resistance_band',   label: 'Taśmy oporowe' },
  { value: 'bodyweight',        label: 'Ćwiczenia z ciężarem ciała' },
]

const PAIN_AREAS = [
  { value: 'shoulder', label: 'Bark' },
  { value: 'elbow',    label: 'Łokieć' },
  { value: 'wrist',    label: 'Nadgarstek' },
  { value: 'lower_back', label: 'Lędźwie / dolny kręgosłup' },
  { value: 'hip',      label: 'Biodro' },
  { value: 'knee',     label: 'Kolano' },
  { value: 'ankle',    label: 'Kostka' },
  { value: 'neck',     label: 'Szyja' },
]

// ─── KOMPONENTY UI ────────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(184,166,119,0.2)',
  color: '#e8e8e8', fontFamily: "'Outfit', sans-serif", fontSize: 14,
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}

function Label({ children, required }) {
  return (
    <label style={{
      display: 'block', fontSize: 11, fontWeight: 500,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: 'rgba(184,166,119,0.7)', marginBottom: 6,
    }}>
      {children}
      {required && <span style={{ color: '#C05000', marginLeft: 4 }}>*</span>}
    </label>
  )
}

function Hint({ children }) {
  return (
    <p style={{ fontSize: 11, color: 'rgba(184,166,119,0.4)', marginTop: 4, lineHeight: 1.5 }}>
      {children}
    </p>
  )
}

function SelectField({ name, value, onChange, options, placeholder }) {
  return (
    <select value={value || ''} onChange={e => onChange(name, e.target.value)}
      style={{ ...inputStyle, cursor: 'pointer' }}>
      <option value="">{placeholder || '— wybierz —'}</option>
      {options.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  )
}

function MultiCheckbox({ name, value = [], onChange, options, max }) {
  const toggle = (val) => {
    const current = value || []
    if (current.includes(val)) {
      onChange(name, current.filter(v => v !== val))
    } else {
      if (max && current.length >= max) return
      onChange(name, [...current, val])
    }
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const checked = (value || []).includes(val)
        return (
          <button key={val} type="button" onClick={() => toggle(val)}
            style={{
              padding: '6px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
              background: checked ? 'rgba(184,166,119,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${checked ? '#b8a677' : 'rgba(184,166,119,0.2)'}`,
              color: checked ? '#d4c494' : 'rgba(184,166,119,0.5)',
            }}>
            {label}
          </button>
        )
      })}
    </div>
  )
}

function RangeField({ name, value, onChange, min = 1, max = 10, lowLabel, highLabel }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'rgba(184,166,119,0.4)' }}>{lowLabel}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#b8a677' }}>{value ?? min}</span>
        <span style={{ fontSize: 11, color: 'rgba(184,166,119,0.4)' }}>{highLabel}</span>
      </div>
      <input type="range" min={min} max={max} value={value ?? min}
        onChange={e => onChange(name, parseInt(e.target.value))}
        style={{ width: '100%', accentColor: '#b8a677', cursor: 'pointer' }} />
    </div>
  )
}

function Block({ title, subtitle, children }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
      border: '1px solid rgba(184,166,119,0.12)',
      borderRadius: 12, padding: '24px 22px', marginBottom: 16,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,196,148,0.3), transparent)',
      }} />
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 20, fontWeight: 600, color: '#d4c494',
        margin: '0 0 4px',
      }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 12, color: 'rgba(184,166,119,0.4)', margin: '0 0 20px' }}>{subtitle}</p>}
      {!subtitle && <div style={{ marginBottom: 20 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {children}
      </div>
    </div>
  )
}

// ─── GŁÓWNY KOMPONENT ─────────────────────────────────────────────────────────

export default function QuestionnaireForm({ clientId, existing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    sleep_quality: 3,
    stress_level: 3,
    pain_level: 0,
    knows_rir: false,
    equipment: [],
    priority_muscles: [],
    avoid_growth_muscles: [],
    pain_areas: [],
  })

  function set(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit() {
    const required = ['imie', 'wiek', 'plec', 'wzrost_cm', 'waga_kg', 'cel', 'staz', 'dni_tydzien']
    const missing = required.filter(n => !form[n])
    if (missing.length > 0) {
      alert('Uzupełnij wymagane pola.')
      return
    }
    if (!form.equipment || form.equipment.length === 0) {
      alert('Zaznacz przynajmniej jeden sprzęt.')
      return
    }

    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('questionnaires').insert({
      client_id: clientId,
      data: form,
    })
    setSaving(false)
    if (!error) setDone(true)
    else alert('Błąd zapisu: ' + error.message)
  }

  if (done) return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, color: '#b8a677', marginBottom: 16 }}>✓</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#e8e8e8', margin: '0 0 8px' }}>Ankieta wysłana!</h2>
        <p style={{ color: 'rgba(184,166,119,0.6)', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Trener przygotuje Twój plan w ciągu 48 godzin.
        </p>
        <button onClick={() => router.push('/client')} style={{
          padding: '10px 28px', borderRadius: 99, background: 'transparent',
          border: '1px solid rgba(184,166,119,0.3)', color: '#b8a677',
          fontSize: 13, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
        }}>Wróć do panelu</button>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      color: '#e8e8e8', fontFamily: "'Outfit', sans-serif",
    }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(184,166,119,0.15)',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => router.push('/client')} style={{
          fontSize: 13, color: 'rgba(184,166,119,0.7)', background: 'none',
          border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: 0,
        }}>← Powrót</button>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 600, color: '#d4c494', letterSpacing: '0.35em',
        }}>ARETÉ</span>
      </nav>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(184,166,119,0.6)', textTransform: 'uppercase', margin: '0 0 10px' }}>Onboarding</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: '#e8e8e8', margin: '0 0 10px' }}>Ankieta onboardingowa</h1>
          <p style={{ color: 'rgba(184,166,119,0.5)', fontSize: 14, lineHeight: 1.6 }}>
            Wypełnij dokładnie — każda odpowiedź wpływa na Twój plan treningowy.
          </p>
        </div>

        {/* BLOK 1 — Dane podstawowe */}
        <Block title="Dane podstawowe">
          <div>
            <Label required>Imię i nazwisko</Label>
            <input type="text" value={form.imie || ''} onChange={e => set('imie', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <Label required>Wiek</Label>
              <input type="number" min={14} max={80} value={form.wiek || ''} onChange={e => set('wiek', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <Label required>Wzrost (cm)</Label>
              <input type="number" min={140} max={220} value={form.wzrost_cm || ''} onChange={e => set('wzrost_cm', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <Label required>Waga (kg)</Label>
              <input type="number" min={40} max={200} step={0.1} value={form.waga_kg || ''} onChange={e => set('waga_kg', e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <Label required>Płeć</Label>
            <SelectField name="plec" value={form.plec} onChange={set} options={['Mężczyzna', 'Kobieta', 'Inna']} />
          </div>
        </Block>

        {/* BLOK 2 — Cel */}
        <Block title="Cel treningowy" subtitle="Co jest dla Ciebie najważniejsze?">
          <div>
            <Label required>Główny cel</Label>
            <SelectField name="cel" value={form.cel} onChange={set} options={[
              'Budowa masy mięśniowej',
              'Redukcja tkanki tłuszczowej',
              'Rekompozycja (masa + redukcja)',
              'Wzrost siły',
              'Zdrowie i sprawność ogólna',
            ]} />
          </div>
          <div>
            <Label>Cel wagowy (opcjonalnie)</Label>
            <input type="text" placeholder="np. schudnąć do 65 kg, przytyć do 80 kg" value={form.cel_wagowy || ''} onChange={e => set('cel_wagowy', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <Label>Deadline (opcjonalnie)</Label>
            <input type="text" placeholder="np. wakacje za 3 miesiące" value={form.deadline || ''} onChange={e => set('deadline', e.target.value)} style={inputStyle} />
          </div>
        </Block>

        {/* BLOK 3 — Priorytety sylwetkowe */}
        <Block title="Priorytety sylwetkowe" subtitle="To wpływa bezpośrednio na dobór ćwiczeń i objętość.">
          <div>
            <Label>Partie które chcesz rozwinąć najbardziej (max 3)</Label>
            <MultiCheckbox name="priority_muscles" value={form.priority_muscles} onChange={set} options={MUSCLE_OPTIONS} max={3} />
            <Hint>Zaznaczone partie dostaną więcej serii i lepsze ćwiczenia.</Hint>
          </div>
          <div>
            <Label>Partie których NIE chcesz mocno rozbudowywać</Label>
            <MultiCheckbox name="avoid_growth_muscles" value={form.avoid_growth_muscles} onChange={set} options={MUSCLE_OPTIONS} />
            <Hint>Ważne np. gdy nie chcesz dużych czwórek, dużych ramion czy szerokich kapturów.</Hint>
          </div>
        </Block>

        {/* BLOK 4 — Doświadczenie */}
        <Block title="Doświadczenie treningowe">
          <div>
            <Label required>Staż treningowy</Label>
            <SelectField name="staz" value={form.staz} onChange={set} options={[
              { value: '0-6 miesięcy', label: '0–6 miesięcy — dopiero zaczynam lub wróciłem po długiej przerwie' },
              { value: '6-12 miesięcy', label: '6–12 miesięcy — trenuję regularnie, znam podstawy' },
              { value: '1-2 lata', label: '1–2 lata — znam ćwiczenia i progresję' },
              { value: '2-3 lata', label: '2–3 lata — trenuję systematycznie, liczę serie' },
              { value: '3-5 lat', label: '3–5 lat — zaawansowany, rozumiem periodyzację' },
              { value: '5+ lat', label: '5+ lat — bardzo zaawansowany' },
            ]} />
            <Hint>Wybierz uczciwie — to wpływa na objętość i intensywność planu.</Hint>
          </div>
          <div>
            <Label>Czy umiesz oceniać RIR (Reps In Reserve)?</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { value: true, label: 'Tak, znam RIR' },
                { value: false, label: 'Nie, dopiero uczę się' },
              ].map(opt => (
                <button key={String(opt.value)} type="button"
                  onClick={() => set('knows_rir', opt.value)}
                  style={{
                    padding: '8px 16px', borderRadius: 99, fontSize: 13, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
                    background: form.knows_rir === opt.value ? 'rgba(184,166,119,0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${form.knows_rir === opt.value ? '#b8a677' : 'rgba(184,166,119,0.2)'}`,
                    color: form.knows_rir === opt.value ? '#d4c494' : 'rgba(184,166,119,0.5)',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
            <Hint>RIR = ile powtórzeń zostało do upadku mięśniowego. Jeśli nie znasz — plan będzie prostszy.</Hint>
          </div>
          <div>
            <Label>Aktualny split (jeśli trenujesz)</Label>
            <SelectField name="aktualny_split" value={form.aktualny_split} onChange={set} options={[
              'Full Body (FBW)', 'Upper / Lower', 'Push / Pull / Legs', 'Bro split', 'Nie trenuję regularnie', 'Inne',
            ]} />
          </div>
          <div>
            <Label>Rekordy osobiste (opcjonalnie)</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { name: 'pr_squat', placeholder: 'Przysiad np. 100x5' },
                { name: 'pr_bench', placeholder: 'Wyciskanie np. 80x6' },
                { name: 'pr_deadlift', placeholder: 'Martwy ciąg np. 140x3' },
                { name: 'pr_ohp', placeholder: 'OHP np. 50x8' },
              ].map(pr => (
                <input key={pr.name} type="text" placeholder={pr.placeholder}
                  value={form[pr.name] || ''} onChange={e => set(pr.name, e.target.value)}
                  style={inputStyle} />
              ))}
            </div>
          </div>
        </Block>

        {/* BLOK 5 — Dostępność */}
        <Block title="Dostępność i harmonogram">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label required>Dni treningowe / tydzień</Label>
              <SelectField name="dni_tydzien" value={form.dni_tydzien} onChange={set} options={[
                { value: '2', label: '2 dni — minimum skuteczne' },
                { value: '3', label: '3 dni — optymalny start' },
                { value: '4', label: '4 dni — dobry rozwój' },
                { value: '5', label: '5 dni — tylko przy dobrej regeneracji' },
                { value: '6', label: '6 dni — zaawansowani' },
              ]} />
            </div>
            <div>
              <Label>Czas na sesję</Label>
              <SelectField name="czas_sesji" value={form.czas_sesji} onChange={set} options={[
                '45 min', '60 min', '75 min', '90 min', '120+ min',
              ]} />
            </div>
          </div>
          <div>
            <Label>Czy możesz trenować dzień po dniu?</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Tak', 'Nie', 'Czasami'].map(opt => (
                <button key={opt} type="button" onClick={() => set('consecutive_days', opt)}
                  style={{
                    padding: '8px 16px', borderRadius: 99, fontSize: 13, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
                    background: form.consecutive_days === opt ? 'rgba(184,166,119,0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${form.consecutive_days === opt ? '#b8a677' : 'rgba(184,166,119,0.2)'}`,
                    color: form.consecutive_days === opt ? '#d4c494' : 'rgba(184,166,119,0.5)',
                  }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </Block>

        {/* BLOK 6 — Sprzęt */}
        <Block title="Dostępny sprzęt" subtitle="Zaznacz wszystko co masz dostęp. To decyduje jakie ćwiczenia trafią do planu.">
          <MultiCheckbox name="equipment" value={form.equipment} onChange={set} options={EQUIPMENT_OPTIONS} />
          {(!form.equipment || form.equipment.length === 0) && (
            <p style={{ color: '#EF6B73', fontSize: 12 }}>⚠ Zaznacz przynajmniej jeden sprzęt</p>
          )}
        </Block>

        {/* BLOK 7 — Preferencje ćwiczeń */}
        <Block title="Preferencje treningowe">
          <div>
            <Label>Wolisz maszyny czy wolne ciężary?</Label>
            <SelectField name="preference_machines" value={form.preference_machines} onChange={set} options={[
              { value: 'machines', label: 'Maszyny — bezpieczniej, prostsze ustawienie' },
              { value: 'free_weights', label: 'Wolne ciężary — sztanga, hantle' },
              { value: 'mixed', label: 'Mieszane — nie mam preferencji' },
            ]} />
          </div>
          <div>
            <Label>Styl treningu</Label>
            <SelectField name="training_style" value={form.training_style} onChange={set} options={[
              { value: 'simple', label: 'Prosty — mniej ćwiczeń, skupiam się na progresji' },
              { value: 'balanced', label: 'Zbalansowany — standardowy plan' },
              { value: 'varied', label: 'Urozmaicony — lubię więcej ćwiczeń' },
            ]} />
          </div>
          <div>
            <Label>Ćwiczenia których NIE chcesz w planie</Label>
            <textarea value={form.cwiczenia_unikane || ''} onChange={e => set('cwiczenia_unikane', e.target.value)}
              placeholder="np. martwy ciąg, dipsy, wykroki — lub: brak"
              rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
        </Block>

        {/* BLOK 8 — Ból i kontuzje */}
        <Block title="Ból i kontuzje" subtitle="Szczerość tutaj chroni Cię przed kontuzją i złym doborem ćwiczeń.">
          <div>
            <Label>Czy masz aktualny ból lub ograniczenie?</Label>
            <MultiCheckbox name="pain_areas" value={form.pain_areas} onChange={set} options={PAIN_AREAS} />
          </div>
          {form.pain_areas && form.pain_areas.length > 0 && (
            <div>
              <Label>Poziom bólu (średnio)</Label>
              <RangeField name="pain_level" value={form.pain_level} onChange={set}
                min={1} max={10} lowLabel="1 — lekki dyskomfort" highLabel="10 — silny ból" />
              <Hint>Ból 6+ = plan automatycznie wyklucza ryzykowne ćwiczenia dla tych struktur.</Hint>
            </div>
          )}
          <div>
            <Label>Przeszłe kontuzje (opcjonalnie)</Label>
            <textarea value={form.kontuzje_przeszle || ''} onChange={e => set('kontuzje_przeszle', e.target.value)}
              placeholder="np. zerwane ACL 2022, operacja barku 2020"
              rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          <div>
            <Label>Problemy z mobilnością (opcjonalnie)</Label>
            <input type="text" placeholder="np. słaba mobilność barku przy wyciskaniu nad głowę"
              value={form.mobilnosc || ''} onChange={e => set('mobilnosc', e.target.value)} style={inputStyle} />
          </div>
        </Block>

        {/* BLOK 9 — Regeneracja */}
        <Block title="Regeneracja i styl życia" subtitle="To bezpośrednio wpływa na objętość startową Twojego planu.">
          <div>
            <Label>Ile śpisz średnio na dobę?</Label>
            <SelectField name="sen" value={form.sen} onChange={set} options={[
              { value: 'less_6', label: 'Mniej niż 6 godzin' },
              { value: '6_7', label: '6–7 godzin' },
              { value: '7_8', label: '7–8 godzin — optymalne' },
              { value: 'more_8', label: '8+ godzin' },
            ]} />
          </div>
          <div>
            <Label>Jakość snu</Label>
            <RangeField name="sleep_quality" value={form.sleep_quality} onChange={set}
              min={1} max={5} lowLabel="1 — bardzo zły" highLabel="5 — doskonały" />
          </div>
          <div>
            <Label>Poziom stresu w życiu codziennym</Label>
            <RangeField name="stress_level" value={form.stress_level} onChange={set}
              min={1} max={5} lowLabel="1 — spokojnie" highLabel="5 — ekstremalny" />
            <Hint>Wysoki stres = niższa objętość startowa. To nie jest słabość, to jest nauka.</Hint>
          </div>
          <div>
            <Label>Typ pracy</Label>
            <SelectField name="praca" value={form.praca} onChange={set} options={[
              { value: 'sedentary', label: 'Siedząca (biuro, komputer)' },
              { value: 'mixed', label: 'Mieszana' },
              { value: 'physical', label: 'Fizyczna (stanie, chodzenie, dźwiganie)' },
            ]} />
          </div>
          <div>
            <Label>Cardio (opcjonalnie)</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <SelectField name="cardio_typ" value={form.cardio_typ} onChange={set} options={[
                'Nie robię cardio', 'Bieganie', 'Rower', 'Pływanie', 'Spacery / LISS', 'Inne',
              ]} />
              <input type="text" placeholder="Ile razy / tydzień? np. 2x30min"
                value={form.cardio_ile || ''} onChange={e => set('cardio_ile', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </Block>

        {/* BLOK 10 — Żywienie */}
        <Block title="Żywienie (podstawowe)">
          <div>
            <Label>Jak się teraz odżywiasz?</Label>
            <SelectField name="dieta_aktualna" value={form.dieta_aktualna} onChange={set} options={[
              'Świadomie — śledzę kalorie/makro',
              'Intuicyjnie — jem w miarę zdrowo',
              'Nieregularnie — jem co popadnie',
              'Dieta specjalna (keto/wege/inne)',
            ]} />
          </div>
          <div>
            <Label>Alergie / nietolerancje pokarmowe</Label>
            <input type="text" placeholder="np. laktoza, gluten — lub: brak"
              value={form.alergie || ''} onChange={e => set('alergie', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <Label>Suplementy które stosujesz</Label>
            <input type="text" placeholder="np. kreatyna, witamina D, omega-3 — lub: brak"
              value={form.suplementy || ''} onChange={e => set('suplementy', e.target.value)} style={inputStyle} />
          </div>
        </Block>

        {/* BLOK 11 — Dodatkowe */}
        <Block title="Coś jeszcze?">
          <div>
            <Label>Dodatkowe informacje dla trenera</Label>
            <textarea value={form.dodatkowe_info || ''} onChange={e => set('dodatkowe_info', e.target.value)}
              placeholder="Motywacja, obawy, pytania, specyficzne preferencje, cokolwiek co powinienem wiedzieć..."
              rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
        </Block>

        <button onClick={handleSubmit} disabled={saving} style={{
          width: '100%', padding: '16px', borderRadius: 99,
          background: saving ? 'rgba(184,166,119,0.15)' : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
          border: 'none',
          color: saving ? 'rgba(184,166,119,0.5)' : '#0f1a2e',
          fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          fontFamily: "'Outfit', sans-serif", letterSpacing: '0.12em',
          textTransform: 'uppercase', transition: 'all 0.2s', marginTop: 8,
        }}>
          {saving ? 'Wysyłanie...' : 'Wyślij ankietę'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'rgba(184,166,119,0.3)' }}>
          Twoje dane są poufne i widoczne tylko dla trenera.
        </p>
      </main>
    </div>
  )
}
