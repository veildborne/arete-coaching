'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function SliderField({ label, name, value, onChange, min = 1, max = 10, lowLabel, highLabel }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={{ fontSize: 13, color: '#e8e8e8', fontFamily: "'Outfit', sans-serif" }}>
          {label}
        </label>
        <span style={{
          fontSize: 18, fontWeight: 700, color: '#D4AF37',
          fontFamily: "'Cormorant Garamond', serif", minWidth: 28, textAlign: 'right'
        }}>
          {value ?? '—'}
        </span>
      </div>
      <input
        type="range" min={min} max={max} value={value ?? min}
        onChange={e => onChange(name, parseInt(e.target.value))}
        style={{ width: '100%', accentColor: '#C05000', cursor: 'pointer' }}
      />
      {(lowLabel || highLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: '#A07848' }}>{lowLabel}</span>
          <span style={{ fontSize: 10, color: '#A07848' }}>{highLabel}</span>
        </div>
      )}
    </div>
  )
}

export default function CheckinForm({ clientId, weekNumber, activePlan, lastCheckin }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    body_weight: '',
    energy_level: 5,
    sleep_quality: 5,
    soreness_level: 5,
    adherence_pct: 80,
    client_notes: '',
  })

  function set(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit() {
    setSaving(true)
    const supabase = createClient()

    const payload = {
      client_id: clientId,
      week_number: weekNumber,
      plan_id: activePlan?.id || null,
      body_weight: form.body_weight ? parseFloat(form.body_weight) : null,
      energy_level: form.energy_level,
      sleep_quality: form.sleep_quality,
      soreness_level: form.soreness_level,
      adherence_pct: form.adherence_pct,
      client_notes: form.client_notes || null,
    }

    const { error } = await supabase.from('check_ins').insert(payload)

    setSaving(false)
    if (!error) setDone(true)
    else alert('Błąd zapisu: ' + error.message)
  }

  if (done) return (
    <div style={{
      minHeight: '100vh', background: '#140900',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28, color: '#F2EEE8', marginBottom: 8
        }}>Check-in wysłany!</h2>
        <p style={{ color: '#A07848', fontSize: 14, marginBottom: 32 }}>
          Tydzień {weekNumber} — trener zobaczy Twój raport
        </p>
        <button
          onClick={() => router.push('/client')}
          style={{
            padding: '10px 28px', borderRadius: 99,
            background: 'transparent',
            border: '1px solid rgba(192,80,0,0.4)',
            color: '#C05000', fontSize: 13, cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Wróć do panelu
        </button>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#140900',
      color: '#F2EEE8', fontFamily: "'Outfit', sans-serif",
    }}>
      {/* Topbar */}
      <header style={{
        borderBottom: '1px solid rgba(192,80,0,0.2)',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', gap: 16,
        position: 'sticky', top: 0,
        background: 'rgba(20,9,0,0.96)',
        backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <button
          onClick={() => router.push('/client')}
          style={{
            fontSize: 13, color: '#A07848', background: 'none',
            border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: 0,
          }}
        >← Powrót</button>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em',
        }}>ARETÉ</span>
      </header>

      <main style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, borderBottom: '1px solid rgba(192,80,0,0.2)', paddingBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: '#C05000', textTransform: 'uppercase', margin: '0 0 6px' }}>
            Raport tygodniowy
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32, fontWeight: 600, color: '#F2EEE8', margin: '0 0 6px'
          }}>
            Tydzień {weekNumber}
          </h1>
          {activePlan && (
            <p style={{ fontSize: 13, color: '#A07848', margin: 0 }}>
              Plan: {activePlan.name}
            </p>
          )}
          {lastCheckin && (
            <p style={{ fontSize: 12, color: '#A07848', opacity: 0.6, margin: '4px 0 0' }}>
              Ostatni check-in: tydzień {lastCheckin.week_number}
            </p>
          )}
        </div>

        {/* Waga */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: '#e8e8e8', display: 'block', marginBottom: 8 }}>
            Masa ciała (kg)
          </label>
          <input
            type="number" step="0.1" placeholder="np. 82.5"
            value={form.body_weight}
            onChange={e => set('body_weight', e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              background: '#1E0F00', border: '1px solid rgba(192,80,0,0.3)',
              color: '#F2EEE8', fontSize: 15, fontFamily: "'Outfit', sans-serif",
              boxSizing: 'border-box', outline: 'none',
            }}
          />
        </div>

        {/* Suwaki */}
        <SliderField
          label="Poziom energii" name="energy_level"
          value={form.energy_level} onChange={set}
          lowLabel="Kompletne wyczerpanie" highLabel="Pełen energii"
        />
        <SliderField
          label="Jakość snu" name="sleep_quality"
          value={form.sleep_quality} onChange={set}
          lowLabel="Bardzo zły sen" highLabel="Doskonały sen"
        />
        <SliderField
          label="Zakwasy / bolesność mięśni" name="soreness_level"
          value={form.soreness_level} onChange={set}
          lowLabel="Brak zakwasów" highLabel="Silny ból"
        />
        <SliderField
          label="Przestrzeganie diety / planu" name="adherence_pct"
          value={form.adherence_pct} onChange={set}
          min={0} max={100}
          lowLabel="0%" highLabel="100%"
        />

        {/* Notatki */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ fontSize: 13, color: '#e8e8e8', display: 'block', marginBottom: 8 }}>
            Notatki dla trenera <span style={{ color: '#A07848' }}>(opcjonalne)</span>
          </label>
          <textarea
            placeholder="Jak minął tydzień? Co sprawiało trudność? Uwagi..."
            value={form.client_notes}
            onChange={e => set('client_notes', e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              background: '#1E0F00', border: '1px solid rgba(192,80,0,0.3)',
              color: '#F2EEE8', fontSize: 14, fontFamily: "'Outfit', sans-serif",
              boxSizing: 'border-box', outline: 'none', resize: 'vertical',
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', padding: '14px', borderRadius: 99,
            background: saving ? 'rgba(192,80,0,0.3)' : '#C05000',
            border: 'none', color: '#F2EEE8',
            fontSize: 15, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em',
            transition: 'background 0.2s',
          }}
        >
          {saving ? 'Wysyłanie...' : `Wyślij check-in — Tydzień ${weekNumber}`}
        </button>
      </main>
    </div>
  )
}