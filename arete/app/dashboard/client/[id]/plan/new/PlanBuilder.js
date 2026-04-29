'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { generatePlan } from '@/lib/planAlgorithm'

const MUSCLE_PL = {
  chest: 'Klatka piersiowa', back: 'Plecy', shoulders_lat: 'Barki boczne',
  shoulders_rear: 'Barki tylne', biceps: 'Biceps', triceps: 'Triceps',
  quads: 'Czwórgłowe', hamstrings: 'Dwugłowe', glutes: 'Pośladki',
  calves: 'Łydki', abs: 'Brzuch',
}

function Badge({ children, color = '#b8a677' }) {
  return (
    <span style={{
      fontSize: 10, padding: '2px 8px', borderRadius: 99,
      background: `${color}18`, border: `1px solid ${color}40`,
      color, letterSpacing: '0.06em', fontWeight: 500,
    }}>{children}</span>
  )
}

function ExerciseRow({ ex, sessionKey, exIdx, onUpdate, onRemove, allExercises }) {
  const [editing, setEditing] = useState(false)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(184,166,119,0.1)',
      borderRadius: 8, padding: '12px 14px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      {/* Muscle color bar */}
      <div style={{
        width: 3, borderRadius: 99, alignSelf: 'stretch', flexShrink: 0,
        background: ex.stretch_priority ? '#52B788' : 'rgba(184,166,119,0.4)',
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#e8e8e8' }}>
            {ex.name_pl || ex.name}
          </span>
          <Badge>{MUSCLE_PL[ex.muscle_group] || ex.muscle_group}</Badge>
          {ex.stretch_priority && <Badge color="#52B788">↔ stretch</Badge>}
          {ex.note && ex.note.includes('★') && <Badge color="#D4AF37">★ priorytet</Badge>}
          {ex.note && ex.note.includes('⚠') && <Badge color="#E57373">⚠ cardio</Badge>}
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'rgba(184,166,119,0.7)' }}>
          <span>{ex.sets} serie</span>
          <span>{ex.rep_range} powt.</span>
          <span>RIR {ex.rir_target}</span>
          <span style={{ color: 'rgba(160,160,160,0.5)' }}>{ex.progression}</span>
        </div>

        {editing && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Serie', key: 'sets', type: 'number' },
              { label: 'Zakres powt.', key: 'rep_range', type: 'text' },
              { label: 'RIR', key: 'rir_target', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 9, color: '#555', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{f.label}</div>
                <input
                  type={f.type}
                  value={ex[f.key]}
                  onChange={e => onUpdate(sessionKey, exIdx, f.key, f.type === 'number' ? parseInt(e.target.value) : e.target.value)}
                  style={{
                    width: f.key === 'rep_range' ? 80 : 48,
                    padding: '4px 8px', borderRadius: 4,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(184,166,119,0.2)',
                    color: '#e8e8e8', fontSize: 13,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button onClick={() => setEditing(e => !e)} style={{
          padding: '4px 8px', borderRadius: 4, fontSize: 11,
          background: editing ? 'rgba(184,166,119,0.15)' : 'transparent',
          border: '1px solid rgba(184,166,119,0.2)',
          color: '#b8a677', cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif",
        }}>
          {editing ? 'OK' : 'Edytuj'}
        </button>
        <button onClick={() => onRemove(sessionKey, exIdx)} style={{
          padding: '4px 8px', borderRadius: 4, fontSize: 11,
          background: 'transparent',
          border: '1px solid rgba(229,115,115,0.2)',
          color: '#E57373', cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif",
        }}>✕</button>
      </div>
    </div>
  )
}

function SessionCard({ sessionKey, session, onUpdate, onRemove, allExercises }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
      border: '1px solid rgba(184,166,119,0.15)',
      borderRadius: 12, padding: '20px 18px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,196,148,0.3), transparent)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'rgba(184,166,119,0.1)',
          border: '1px solid rgba(184,166,119,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 700, color: '#d4c494',
        }}>{sessionKey}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#e8e8e8' }}>
            Sesja {sessionKey}
            {session.isDeload && <span style={{ marginLeft: 8, fontSize: 11, color: '#64B5F6' }}>🔄 Deload</span>}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(184,166,119,0.5)' }}>
            {session.exercises.length} ćwiczeń · {session.exercises.reduce((s, e) => s + (e.sets || 0), 0)} serii
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {session.exercises.map((ex, i) => (
          <ExerciseRow
            key={i} ex={ex} sessionKey={sessionKey} exIdx={i}
            onUpdate={onUpdate} onRemove={onRemove}
            allExercises={allExercises}
          />
        ))}
      </div>
    </div>
  )
}

export default function PlanBuilder({ client, questionnaire, exercises = [], clientId }) {
  const router = useRouter()
  const [plan, setPlan] = useState(null)
  const [planName, setPlanName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDeload, setShowDeload] = useState(false)

  useEffect(() => {
    if (questionnaire) {
      const generated = generatePlan(questionnaire, exercises)
      setPlan(generated)
      const firstName = client.full_name?.split(' ')[0] || 'Klient'
      setPlanName(`${firstName} — ${generated.split_name} — Mezocykl 1`)
    }
  }, [])

  function updateExercise(sessionKey, exIdx, field, value) {
    setPlan(prev => {
      const sessions = { ...prev.sessions }
      const exs = [...sessions[sessionKey].exercises]
      exs[exIdx] = { ...exs[exIdx], [field]: value }
      sessions[sessionKey] = { ...sessions[sessionKey], exercises: exs }
      return { ...prev, sessions }
    })
  }

  function removeExercise(sessionKey, exIdx) {
    setPlan(prev => {
      const sessions = { ...prev.sessions }
      const exs = sessions[sessionKey].exercises.filter((_, i) => i !== exIdx)
      sessions[sessionKey] = { ...sessions[sessionKey], exercises: exs }
      return { ...prev, sessions }
    })
  }

  async function handleSave() {
    if (!planName.trim()) { alert('Podaj nazwę planu'); return }
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase.from('training_plans').insert({
      client_id: clientId,
      name: planName,
      goal: plan.goal,
      split: plan.split_name,
      plan_data: plan,
    })

    setSaving(false)
    if (!error) setSaved(true)
    else alert('Błąd zapisu: ' + error.message)
  }

  if (saved) return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, color: '#b8a677', marginBottom: 16 }}>✓</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#e8e8e8', margin: '0 0 8px' }}>
          Plan zapisany!
        </h2>
        <p style={{ color: 'rgba(184,166,119,0.6)', fontSize: 14, marginBottom: 32 }}>
          {planName}
        </p>
        <button onClick={() => router.push(`/dashboard/client/${clientId}`)} style={{
          padding: '10px 28px', borderRadius: 99,
          background: 'transparent', border: '1px solid rgba(184,166,119,0.3)',
          color: '#b8a677', fontSize: 13, cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em',
        }}>
          Wróć do klienta
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
        background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(184,166,119,0.15)',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <button onClick={() => router.push(`/dashboard/client/${clientId}`)} style={{
          fontSize: 13, color: 'rgba(184,166,119,0.7)', background: 'none',
          border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: 0,
        }}>← {client.full_name || 'Klient'}</button>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 600, color: '#d4c494', letterSpacing: '0.35em',
        }}>ARETÉ</span>
      </nav>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32, borderBottom: '1px solid rgba(184,166,119,0.15)', paddingBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(184,166,119,0.6)', textTransform: 'uppercase', margin: '0 0 6px' }}>
            Program Builder
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: '#e8e8e8', margin: '0 0 16px' }}>
            Nowy plan — {client.full_name}
          </h1>

          {/* Nazwa planu */}
          <input
            value={planName}
            onChange={e => setPlanName(e.target.value)}
            placeholder="Nazwa planu..."
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(184,166,119,0.2)',
              color: '#e8e8e8', fontSize: 15,
              fontFamily: "'Outfit', sans-serif",
              boxSizing: 'border-box', outline: 'none',
            }}
          />
        </div>

        {!questionnaire && (
          <div style={{
            border: '1px solid rgba(229,115,115,0.3)',
            borderRadius: 10, padding: '20px 24px', marginBottom: 24,
            background: 'rgba(229,115,115,0.05)',
          }}>
            <div style={{ fontSize: 14, color: '#E57373', marginBottom: 4 }}>Brak ankiety</div>
            <div style={{ fontSize: 13, color: 'rgba(229,115,115,0.7)' }}>
              Klient nie wypełnił jeszcze ankiety onboardingowej. Plan zostanie wygenerowany z domyślnymi parametrami.
            </div>
          </div>
        )}

        {plan && (
          <>
            {/* Plan summary */}
            <div style={{
              display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24,
            }}>
              {[
                { label: 'Split', value: plan.split_name },
                { label: 'Cel', value: plan.goal },
                { label: 'Staż', value: plan.staz },
                { label: 'Tygodnie', value: `${plan.mesocycle_weeks} (+ deload)` },
                { label: 'Sprzęt', value: plan.equipment_used?.join(', ') },
                plan.cardio_factor < 1 && { label: 'Cardio interference', value: `−${Math.round((1 - plan.cardio_factor) * 100)}% nogi` },
              ].filter(Boolean).map(item => (
                <div key={item.label} style={{
                  background: 'rgba(184,166,119,0.05)',
                  border: '1px solid rgba(184,166,119,0.15)',
                  borderRadius: 8, padding: '8px 14px',
                }}>
                  <div style={{ fontSize: 9, color: 'rgba(184,166,119,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#e8e8e8' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Progresja RIR */}
            <div style={{
              background: 'rgba(184,166,119,0.04)',
              border: '1px solid rgba(184,166,119,0.12)',
              borderRadius: 10, padding: '14px 18px', marginBottom: 24,
            }}>
              <div style={{ fontSize: 11, color: 'rgba(184,166,119,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                Progresja mezocyklu (RIR)
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {plan.weekly_progression?.map(w => (
                  <div key={w.week} style={{
                    flex: 1, textAlign: 'center', padding: '6px 4px',
                    borderRadius: 6,
                    background: w.isDeload ? 'rgba(100,181,246,0.1)' : 'rgba(184,166,119,0.08)',
                    border: `1px solid ${w.isDeload ? 'rgba(100,181,246,0.2)' : 'rgba(184,166,119,0.15)'}`,
                  }}>
                    <div style={{ fontSize: 9, color: w.isDeload ? '#64B5F6' : 'rgba(184,166,119,0.5)', marginBottom: 2 }}>
                      {w.isDeload ? 'Deload' : `Tyg ${w.week}`}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: w.isDeload ? '#64B5F6' : '#d4c494' }}>
                      {w.isDeload ? '—' : `RIR ${w.rir}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle deload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <button onClick={() => setShowDeload(s => !s)} style={{
                padding: '6px 14px', borderRadius: 99, fontSize: 12,
                background: showDeload ? 'rgba(100,181,246,0.15)' : 'transparent',
                border: `1px solid ${showDeload ? 'rgba(100,181,246,0.3)' : 'rgba(184,166,119,0.2)'}`,
                color: showDeload ? '#64B5F6' : 'rgba(184,166,119,0.6)',
                cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              }}>
                {showDeload ? '▼ Ukryj deload' : '▶ Pokaż tydzień deload'}
              </button>
            </div>

            {/* Sesje */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(showDeload ? plan.deload_sessions : plan.sessions).map(([key, session]) => (
                <SessionCard
                  key={key} sessionKey={key} session={session}
                  onUpdate={updateExercise} onRemove={removeExercise}
                  allExercises={exercises}
                />
              ))}
            </div>

            {/* Wykluczone */}
            {plan.excluded_exercises?.length > 0 && (
              <div style={{
                marginTop: 20, padding: '12px 16px', borderRadius: 8,
                background: 'rgba(229,115,115,0.05)',
                border: '1px solid rgba(229,115,115,0.15)',
              }}>
                <div style={{ fontSize: 11, color: '#E57373', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Wykluczone automatycznie
                </div>
                <div style={{ fontSize: 12, color: 'rgba(229,115,115,0.7)' }}>
                  {plan.excluded_exercises.join(' · ')}
                </div>
              </div>
            )}

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%', padding: '16px', borderRadius: 99, marginTop: 32,
                background: saving
                  ? 'rgba(184,166,119,0.15)'
                  : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
                border: 'none',
                color: saving ? 'rgba(184,166,119,0.5)' : '#0f1a2e',
                fontSize: 14, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}
            >
              {saving ? 'Zapisywanie...' : 'Zapisz plan'}
            </button>
          </>
        )}

        {!plan && !questionnaire && (
          <button onClick={() => {
            const generated = generatePlan(null, exercises)
            setPlan(generated)
          }} style={{
            padding: '12px 28px', borderRadius: 99,
            background: 'transparent', border: '1px solid rgba(184,166,119,0.3)',
            color: '#b8a677', fontSize: 13, cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif",
          }}>
            Generuj z domyślnymi parametrami
          </button>
        )}
      </main>
    </div>
  )
}
