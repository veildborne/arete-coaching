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
          fontSize: 18, fontWeight: 700, color: '#d4c494',
          fontFamily: "'Cormorant Garamond', serif", minWidth: 28, textAlign: 'right'
        }}>
          {value ?? '—'}
        </span>
      </div>
      <input
        type="range" min={min} max={max} value={value ?? min}
        onChange={e => onChange(name, parseInt(e.target.value))}
        style={{ width: '100%', accentColor: '#b8a677', cursor: 'pointer' }}
      />
      {(lowLabel || highLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: 'rgba(184,166,119,0.5)' }}>{lowLabel}</span>
          <span style={{ fontSize: 10, color: 'rgba(184,166,119,0.5)' }}>{highLabel}</span>
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
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 64, color: '#b8a677', marginBottom: 16, lineHeight: 1,
        }}>✓</div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28, color: '#e8e8e8', marginBottom: 8, margin: '0 0 8px',
        }}>Check-in wysłany!</h2>
        <p style={{ color: 'rgba(184,166,119,0.6)', fontSize: 14, marginBottom: 32 }}>
          Tydzień {weekNumber} — trener zobaczy Twój raport
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
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(184,166,119,0.15)',
        padding: '0 2rem', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => router.push('/client')} style={{
          fontSize: 13, color: 'rgba(184,166,119,0.7)', background: 'none',
          border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: 0,
          letterSpacing: '0.05em',
        }}>← Powrót</button>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 600, color: '#d4c494', letterSpacing: '0.35em',
        }}>ARETÉ</span>
      </nav>

      <main style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{
          marginBottom: 32,
          borderBottom: '1px solid rgba(184,166,119,0.15)',
          paddingBottom: 24,
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.3em', color: 'rgba(184,166,119,0.6)',
            textTransform: 'uppercase', margin: '0 0 6px',
          }}>
            Raport tygodniowy
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32, fontWeight: 600, color: '#e8e8e8', margin: '0 0 6px',
          }}>
            Tydzień {weekNumber}
          </h1>
          {activePlan && (
            <p style={{ fontSize: 13, color: 'rgba(184,166,119,0.6)', margin: 0 }}>
              Plan: {activePlan.name}
            </p>
          )}
          {lastCheckin && (
            <p style={{ fontSize: 12, color: 'rgba(184,166,119,0.4)', margin: '4px 0 0' }}>
              Ostatni check-in: tydzień {lastCheckin.week_number}
            </p>
          )}
        </div>

        {/* Karta formularza */}
        <div style={{
          background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
          border: '1px solid rgba(184,166,119,0.15)',
          borderRadius: 16, padding: '28px 24px',
          position: 'relative', overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* gold top line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(212,196,148,0.4), transparent)',
          }} />

          {/* Waga */}
          <div style={{ marginBottom: 28 }}>
            <label style={{
              fontSize: 13, color: '#e8e8e8', display: 'block', marginBottom: 8,
              fontFamily: "'Outfit', sans-serif",
            }}>
              Masa ciała (kg)
            </label>
            <input
              type="number" step="0.1" placeholder="np. 82.5"
              value={form.body_weight}
              onChange={e => set('body_weight', e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(184,166,119,0.2)',
                color: '#e8e8e8', fontSize: 15, fontFamily: "'Outfit', sans-serif",
                boxSizing: 'border-box', outline: 'none',
              }}
            />
          </div>

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
          <div style={{ marginBottom: 0 }}>
            <label style={{
              fontSize: 13, color: '#e8e8e8', display: 'block', marginBottom: 8,
              fontFamily: "'Outfit', sans-serif",
            }}>
              Notatki dla trenera{' '}
              <span style={{ color: 'rgba(184,166,119,0.5)' }}>(opcjonalne)</span>
            </label>
            <textarea
              placeholder="Jak minął tydzień? Co sprawiało trudność? Uwagi..."
              value={form.client_notes}
              onChange={e => set('client_notes', e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(184,166,119,0.2)',
                color: '#e8e8e8', fontSize: 14, fontFamily: "'Outfit', sans-serif",
                boxSizing: 'border-box', outline: 'none', resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', padding: '14px', borderRadius: 99,
            background: saving
              ? 'rgba(184,166,119,0.15)'
              : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
            border: 'none',
            color: saving ? 'rgba(184,166,119,0.5)' : '#0f1a2e',
            fontSize: 14, fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
        >
          {saving ? 'Wysyłanie...' : `Wyślij check-in — Tydzień ${weekNumber}`}
        </button>
      </main>
    </div>
  )
}