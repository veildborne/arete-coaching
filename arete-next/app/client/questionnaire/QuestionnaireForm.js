'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const BLOCKS = [
  {
    id: 'podstawowe',
    title: 'Dane podstawowe',
    fields: [
      { name: 'imie', label: 'Imię i nazwisko', type: 'text', required: true },
      { name: 'wiek', label: 'Wiek', type: 'number', min: 14, max: 80, required: true },
      { name: 'plec', label: 'Płeć', type: 'select', options: ['Mężczyzna', 'Kobieta'], required: true },
      { name: 'wzrost_cm', label: 'Wzrost (cm)', type: 'number', min: 140, max: 220, required: true },
      { name: 'waga_kg', label: 'Waga (kg)', type: 'number', min: 40, max: 200, step: 0.1, required: true },
    ]
  },
  {
    id: 'cel',
    title: 'Cel treningowy',
    fields: [
      { name: 'cel', label: 'Główny cel', type: 'select', required: true, options: ['Budowa masy mięśniowej', 'Redukcja tkanki tłuszczowej', 'Wzrost siły', 'Rekompozycja', 'Zdrowie i sprawność'] },
      { name: 'cel_wagowy', label: 'Cel wagowy (jeśli jest)', type: 'text', placeholder: 'np. schudnąć do 80 kg' },
      { name: 'deadline', label: 'Deadline (jeśli jest)', type: 'text', placeholder: 'np. wakacje za 4 miesiące' },
      { name: 'priorytetowe_partie', label: 'Priorytetowe partie mięśniowe', type: 'textarea', placeholder: 'np. pośladki, barki boczne — lub: równomiernie' },
    ]
  },
  {
    id: 'historia',
    title: 'Historia treningowa',
    fields: [
      { name: 'staz', label: 'Staż treningowy', type: 'select', required: true, options: ['0-6 miesięcy', '6-12 miesięcy', '1-2 lata', '2-3 lata', '3-5 lat', '5+ lat'] },
      { name: 'aktualny_split', label: 'Aktualny split', type: 'select', options: ['Full Body (FBW)', 'Upper / Lower', 'Push / Pull / Legs', 'Bro split', 'Nie trenuję regularnie', 'Inne'] },
      { name: 'pr_squat', label: 'PR Przysiad', type: 'text', placeholder: 'np. 120x5' },
      { name: 'pr_bench', label: 'PR Wyciskanie', type: 'text', placeholder: 'np. 80x6' },
      { name: 'pr_deadlift', label: 'PR Martwy ciąg', type: 'text', placeholder: 'np. 140x3' },
      { name: 'pr_ohp', label: 'PR OHP', type: 'text', placeholder: 'np. 50x8' },
      { name: 'pr_row', label: 'PR Wiosłowanie', type: 'text', placeholder: 'np. 70x8' },
      { name: 'programy_wczesniej', label: 'Programy które próbowałeś', type: 'textarea', placeholder: 'np. Starting Strength, PPL z Reddit...' },
    ]
  },
  {
    id: 'ograniczenia',
    title: 'Ograniczenia i kontuzje',
    fields: [
      { name: 'kontuzje_aktualne', label: 'Aktualne kontuzje lub ból', type: 'textarea', placeholder: 'np. ból lewego barku przy wyciskaniu...' },
      { name: 'kontuzje_przeszle', label: 'Przeszłe kontuzje', type: 'textarea', placeholder: 'np. zerwane ACL 2020...' },
      { name: 'cwiczenia_unikane', label: 'Ćwiczenia których unikasz', type: 'textarea', placeholder: 'np. dipsy bolą barki...' },
      { name: 'mobilnosc', label: 'Problemy z mobilnością', type: 'text', placeholder: 'np. słaba mobilność barku' },
    ]
  },
  {
    id: 'dostepnosc',
    title: 'Dostępność i sprzęt',
    fields: [
      { name: 'dni_tydzien', label: 'Dni treningowe / tydzień', type: 'select', required: true, options: ['2', '3', '4', '5', '6'] },
      { name: 'czas_sesji', label: 'Czas na sesję', type: 'select', options: ['45 min', '60 min', '75 min', '90 min', '120+ min'] },
      { name: 'miejsce_treningu', label: 'Gdzie trenujesz?', type: 'select', options: ['Siłownia pełna (wolne ciężary + maszyny)', 'Siłownia podstawowa (ławka + stojaki)', 'Dom — pełne wyposażenie', 'Dom — hantle + ławka', 'Dom — minimum'] },
      { name: 'brak_sprzetu', label: 'Sprzęt którego brakuje', type: 'text', placeholder: 'np. brak hack squat' },
      { name: 'cardio_typ', label: 'Cardio', type: 'select', options: ['Nie robię cardio', 'Bieganie', 'Rower', 'Pływanie', 'Spacery / LISS', 'Inne'] },
      { name: 'cardio_ile', label: 'Ile razy / tydzień cardio?', type: 'text', placeholder: 'np. 2x bieganie po 30 min' },
    ]
  },
  {
    id: 'zywienie',
    title: 'Żywienie',
    fields: [
      { name: 'dieta_aktualna', label: 'Jak się teraz odżywiasz?', type: 'select', options: ['Świadomie — śledzę kalorie/makro', 'Intuicyjnie — jem w miarę zdrowo', 'Nieregularnie — jem co popadnie', 'Dieta specjalna (keto/wege/inne)'] },
      { name: 'posilki_dziennie', label: 'Ile posiłków dziennie?', type: 'select', options: ['2', '3', '4', '5+'] },
      { name: 'dieta_doswiadczenie', label: 'Doświadczenie z dietami', type: 'select', options: ['Nigdy nie liczyłem makro', 'Liczyłem kalorie kiedyś', 'Regularnie śledzę makro'] },
      { name: 'alergie', label: 'Alergie / nietolerancje', type: 'text', placeholder: 'np. laktoza, gluten — lub: brak' },
      { name: 'suplementy', label: 'Suplementy', type: 'text', placeholder: 'np. kreatyna, witamina D — lub: brak' },
    ]
  },
  {
    id: 'lifestyle',
    title: 'Styl życia',
    fields: [
      { name: 'praca', label: 'Typ pracy', type: 'select', options: ['Siedząca (biuro)', 'Mieszana', 'Fizyczna'] },
      { name: 'sen', label: 'Sen (godz/noc)', type: 'select', options: ['Mniej niż 6h', '6-7h', '7-8h', '8+ h'] },
      { name: 'stres', label: 'Poziom stresu', type: 'select', options: ['Niski', 'Średni', 'Wysoki', 'Ekstremalny'] },
      { name: 'dodatkowe_info', label: 'Dodatkowe informacje', type: 'textarea', placeholder: 'Motywacja, obawy, preferencje, pytania...' },
    ]
  },
]

function Field({ field, value, onChange }) {
  const base = {
    width: '100%', padding: '10px 14px', borderRadius: 4,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(184,166,119,0.2)',
    color: '#e8e8e8', fontFamily: "'Outfit', sans-serif", fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  if (field.type === 'select') return (
    <select
      value={value || ''}
      onChange={e => onChange(field.name, e.target.value)}
      style={{ ...base, cursor: 'pointer' }}
    >
      <option value="">—</option>
      {field.options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )

  if (field.type === 'textarea') return (
    <textarea
      value={value || ''}
      onChange={e => onChange(field.name, e.target.value)}
      placeholder={field.placeholder || ''}
      rows={3}
      style={{ ...base, resize: 'vertical', lineHeight: 1.6 }}
    />
  )

  return (
    <input
      type={field.type}
      value={value || ''}
      onChange={e => onChange(field.name, e.target.value)}
      placeholder={field.placeholder || ''}
      min={field.min}
      max={field.max}
      step={field.step}
      style={base}
    />
  )
}

export default function QuestionnaireForm({ clientId, existing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({})

  function set(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit() {
    // Walidacja wymaganych
    const required = BLOCKS.flatMap(b => b.fields.filter(f => f.required).map(f => f.name))
    const missing = required.filter(n => !form[n])
    if (missing.length > 0) {
      alert('Uzupełnij wymagane pola: ' + missing.join(', '))
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
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 64, color: '#b8a677', marginBottom: 16, lineHeight: 1,
        }}>✓</div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28, color: '#e8e8e8', margin: '0 0 8px',
        }}>Ankieta wysłana!</h2>
        <p style={{ color: 'rgba(184,166,119,0.6)', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Przygotowanie planu zajmie do 48 godzin.<br />Odezwę się gdy będzie gotowy.
        </p>
        <button onClick={() => router.push('/client')} style={{
          padding: '10px 28px', borderRadius: 99,
          background: 'transparent',
          border: '1px solid rgba(184,166,119,0.3)',
          color: '#b8a677', fontSize: 13, cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em',
        }}>
          Wróć do panelu
        </button>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      color: '#e8e8e8', fontFamily: "'Outfit', sans-serif",
    }}>
      {/* Topbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,14,26,0.9)',
        backdropFilter: 'blur(12px)',
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.3em', color: 'rgba(184,166,119,0.6)',
            textTransform: 'uppercase', margin: '0 0 10px',
          }}>Onboarding</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36, fontWeight: 600, color: '#e8e8e8', margin: '0 0 10px',
          }}>Ankieta onboardingowa</h1>
          <p style={{ color: 'rgba(184,166,119,0.5)', fontSize: 14, lineHeight: 1.6 }}>
            Wypełnij dokładnie — na podstawie Twoich odpowiedzi przygotuję spersonalizowany plan.
          </p>
          {existing && (
            <p style={{
              marginTop: 12, fontSize: 12,
              color: 'rgba(184,166,119,0.4)',
            }}>
              Wypełniłeś już ankietę {new Date(existing.submitted_at).toLocaleDateString('pl-PL')} — możesz wysłać zaktualizowaną wersję.
            </p>
          )}
        </div>

        {/* Bloki */}
        {BLOCKS.map(block => (
          <div key={block.id} style={{
            background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
            border: '1px solid rgba(184,166,119,0.12)',
            borderRadius: 12, padding: '24px 22px',
            marginBottom: 16, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(212,196,148,0.3), transparent)',
            }} />
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18, fontWeight: 600, color: '#d4c494',
              margin: '0 0 20px', paddingBottom: 10,
              borderBottom: '1px solid rgba(184,166,119,0.1)',
            }}>{block.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {block.fields.map(field => (
                <div key={field.name}>
                  <label style={{
                    display: 'block', fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(184,166,119,0.6)', marginBottom: 5,
                  }}>
                    {field.label}
                    {field.required && <span style={{ color: '#C05000', marginLeft: 4 }}>*</span>}
                  </label>
                  <Field field={field} value={form[field.name]} onChange={set} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', padding: '16px', borderRadius: 99,
            background: saving
              ? 'rgba(184,166,119,0.15)'
              : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
            border: 'none',
            color: saving ? 'rgba(184,166,119,0.5)' : '#0f1a2e',
            fontSize: 14, fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.12em', textTransform: 'uppercase',
            transition: 'all 0.2s', marginTop: 8,
          }}
        >
          {saving ? 'Wysyłanie...' : 'Wyślij ankietę'}
        </button>
        <p style={{
          textAlign: 'center', marginTop: 12,
          fontSize: 11, color: 'rgba(184,166,119,0.3)',
        }}>
          Twoje dane są poufne i widoczne tylko dla trenera.
        </p>
      </main>
    </div>
  )
}