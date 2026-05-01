'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

// ===== EPLEY 1RM =====
const epley = (weight, reps) => {
  if (!weight || !reps || reps === 0) return null
  return Math.round(weight * (1 + reps / 30) * 10) / 10
}

// ===== HELPERS =====
const muscleLabels = {
  chest: 'Klatka', back: 'Plecy',
  shoulders_lateral: 'Barki boczne', shoulders_rear: 'Barki tylne',
  quads: 'Quady', hamstrings: 'Hamstringi', glutes: 'Pośladki',
  biceps: 'Biceps', triceps: 'Triceps', calves: 'Łydki', abs: 'Brzuch',
}

const rirColors = {
  0: '#ef4444', 1: '#f97316', 2: '#4caf50', 3: '#4a9eff', 4: '#a0a0a0', 5: '#666666',
}

const fmt = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ===== REST TIMER (floating) =====
function RestTimer({ onDismiss }) {
  const [seconds, setSeconds] = useState(0)
  const [target, setTarget] = useState(120) // default 2 min
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const pct = Math.min(100, (seconds / target) * 100)
  const done = seconds >= target

  return (
    <div style={{
      position: 'fixed', bottom: '5.5rem', right: '1rem', zIndex: 100,
      background: 'rgba(10,14,26,0.97)',
      border: `1px solid ${done ? '#47D18C' : 'rgba(184,166,119,0.3)'}`,
      borderRadius: '14px', padding: '0.9rem 1rem',
      minWidth: '160px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Label */}
      <div style={{
        fontSize: '0.6rem', color: 'rgba(160,160,160,0.6)',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        fontFamily: 'Outfit, sans-serif', marginBottom: '0.4rem',
      }}>Przerwa</div>

      {/* Time */}
      <div style={{
        fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem',
        fontWeight: 700, color: done ? '#47D18C' : '#e8e8e8',
        letterSpacing: '-0.02em', marginBottom: '0.5rem',
      }}>{fmt(seconds)}</div>

      {/* Progress bar */}
      <div style={{
        height: '3px', background: 'rgba(255,255,255,0.08)',
        borderRadius: '99px', marginBottom: '0.6rem', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          width: `${pct}%`,
          background: done ? '#47D18C' : 'rgba(184,166,119,0.7)',
          transition: 'width 1s linear, background 0.3s',
        }} />
      </div>

      {/* Target selector */}
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.5rem' }}>
        {[60, 90, 120, 180].map(t => (
          <button key={t} onClick={() => { setTarget(t); setSeconds(0) }} style={{
            flex: 1, padding: '0.2rem 0',
            fontSize: '0.62rem', fontFamily: 'Outfit, sans-serif',
            background: target === t ? 'rgba(184,166,119,0.15)' : 'transparent',
            border: `1px solid ${target === t ? 'rgba(184,166,119,0.5)' : 'rgba(184,166,119,0.15)'}`,
            borderRadius: '4px', cursor: 'pointer',
            color: target === t ? '#d4c494' : 'rgba(160,160,160,0.5)',
          }}>{t / 60 >= 1 ? `${t / 60}'` : `${t}"`}</button>
        ))}
      </div>

      {/* Dismiss */}
      <button onClick={onDismiss} style={{
        width: '100%', padding: '0.4rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px', cursor: 'pointer',
        color: 'rgba(160,160,160,0.6)',
        fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem',
      }}>Zamknij</button>
    </div>
  )
}

// ===== EXERCISE PICKER MODAL =====
function ExercisePicker({ exercises, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('all')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const muscles = ['all', ...Object.keys(muscleLabels)]
  const filtered = exercises.filter(ex => {
    const matchSearch = !search ||
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      (ex.name_pl && ex.name_pl.toLowerCase().includes(search.toLowerCase()))
    const matchMuscle = muscleFilter === 'all' || ex.muscle_group === muscleFilter
    return matchSearch && matchMuscle
  })

  const grouped = filtered.reduce((acc, ex) => {
    const g = ex.muscle_group
    if (!acc[g]) acc[g] = []
    acc[g].push(ex)
    return acc
  }, {})

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(6,9,18,0.97)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '1rem 1.25rem 0.75rem',
        background: 'rgba(10,14,26,0.9)',
        borderBottom: '1px solid rgba(184,166,119,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(184,166,119,0.7)', fontSize: '1.3rem', padding: 0, lineHeight: 1,
          }}>←</button>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem',
            fontWeight: 600, color: '#d4c494', margin: 0,
          }}>Wybierz ćwiczenie</h2>
        </div>
        <input
          ref={inputRef}
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj ćwiczenia..."
          style={{
            width: '100%', padding: '0.7rem 1rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(184,166,119,0.25)',
            borderRadius: '8px', outline: 'none',
            color: '#e8e8e8', fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem',
            marginBottom: '0.6rem', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {muscles.map(m => (
            <button key={m} onClick={() => setMuscleFilter(m)} style={{
              padding: '0.3rem 0.75rem', borderRadius: '99px', whiteSpace: 'nowrap',
              background: muscleFilter === m ? 'rgba(184,166,119,0.2)' : 'transparent',
              border: `1px solid ${muscleFilter === m ? '#b8a677' : 'rgba(184,166,119,0.2)'}`,
              color: muscleFilter === m ? '#d4c494' : 'rgba(160,160,160,0.7)',
              fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            }}>
              {m === 'all' ? 'Wszystkie' : muscleLabels[m] || m}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
        {Object.entries(grouped).map(([muscle, exList]) => (
          <div key={muscle}>
            <div style={{
              padding: '0.6rem 1.25rem 0.3rem',
              fontSize: '0.65rem', color: 'rgba(184,166,119,0.5)',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: 'Outfit, sans-serif',
            }}>
              {muscleLabels[muscle] || muscle}
            </div>
            {exList.map(ex => (
              <button key={ex.id} onClick={() => onSelect(ex)} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                background: 'none', border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#e8e8e8', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>
                    {ex.name_pl || ex.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(160,160,160,0.6)', marginTop: '0.15rem' }}>
                    {ex.name} · {ex.equipment?.join(', ')}
                    {ex.stretch_position && <span style={{ color: 'rgba(184,166,119,0.6)', marginLeft: '0.4rem' }}>⊕ stretch</span>}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.7rem', color: 'rgba(184,166,119,0.6)',
                  padding: '0.2rem 0.5rem', borderRadius: '4px',
                  background: 'rgba(184,166,119,0.08)',
                }}>
                  SFR {ex.sfr_rating}
                </div>
              </button>
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(160,160,160,0.5)', fontFamily: 'Outfit, sans-serif' }}>
            Brak wyników dla "{search}"
          </div>
        )}
      </div>
    </div>
  )
}

// ===== SET ROW =====
function SetRow({ setNum, data, onChange, onRemove, onLogged, prevBest, targetRir }) {
  const e1rm = epley(parseFloat(data.weight), parseInt(data.reps))
  const isLogged = data.logged

  return (
    <div style={{
      background: isLogged ? 'rgba(71,209,140,0.05)' : 'transparent',
      borderRadius: '8px',
      padding: '0.5rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      transition: 'background 0.3s',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '28px 1fr 1fr auto auto',
        gap: '0.5rem', alignItems: 'center',
      }}>
        {/* Set number */}
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: isLogged ? 'rgba(71,209,140,0.2)' : 'rgba(184,166,119,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.72rem',
          color: isLogged ? '#47D18C' : 'rgba(184,166,119,0.8)',
          fontWeight: 600, fontFamily: 'Outfit, sans-serif',
        }}>{isLogged ? '✓' : setNum}</div>

        {/* Weight */}
        <div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(160,160,160,0.5)', marginBottom: '0.2rem', letterSpacing: '0.1em' }}>KG</div>
          <input
            type="number" inputMode="decimal" value={data.weight}
            onChange={e => onChange({ ...data, weight: e.target.value })}
            placeholder={prevBest?.weight ?? '0'}
            style={{
              width: '100%', padding: '0.55rem 0.5rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(184,166,119,0.2)',
              borderRadius: '6px', outline: 'none',
              color: '#e8e8e8', fontFamily: 'Outfit, sans-serif',
              fontSize: '1rem', fontWeight: 500, textAlign: 'center', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
          />
        </div>

        {/* Reps */}
        <div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(160,160,160,0.5)', marginBottom: '0.2rem', letterSpacing: '0.1em' }}>POWT.</div>
          <input
            type="number" inputMode="numeric" value={data.reps}
            onChange={e => onChange({ ...data, reps: e.target.value })}
            placeholder={prevBest?.reps ?? '0'}
            style={{
              width: '100%', padding: '0.55rem 0.5rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(184,166,119,0.2)',
              borderRadius: '6px', outline: 'none',
              color: '#e8e8e8', fontFamily: 'Outfit, sans-serif',
              fontSize: '1rem', fontWeight: 500, textAlign: 'center', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
          />
        </div>

        {/* RIR */}
        <div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(160,160,160,0.5)', marginBottom: '0.2rem', letterSpacing: '0.1em' }}>RIR</div>
          <select
            value={data.rir}
            onChange={e => onChange({ ...data, rir: e.target.value })}
            style={{
              padding: '0.55rem 0.4rem',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${rirColors[parseInt(data.rir)] || 'rgba(184,166,119,0.2)'}`,
              borderRadius: '6px', outline: 'none',
              color: rirColors[parseInt(data.rir)] || '#e8e8e8',
              fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Log / Remove */}
        <button
          onClick={() => isLogged ? onChange({ ...data, logged: false }) : onLogged()}
          style={{
            width: '32px', height: '32px', borderRadius: '6px',
            background: isLogged ? 'rgba(71,209,140,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isLogged ? 'rgba(71,209,140,0.4)' : 'rgba(255,255,255,0.12)'}`,
            cursor: 'pointer', color: isLogged ? '#47D18C' : 'rgba(160,160,160,0.5)',
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0,
          }}
        >{isLogged ? '✓' : '○'}</button>
      </div>

      {/* e1RM + target RIR hint */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingLeft: '36px', marginTop: '0.25rem',
      }}>
        {e1rm ? (
          <div style={{ fontSize: '0.65rem', color: 'rgba(184,166,119,0.55)' }}>
            Est. 1RM: <span style={{ color: '#d4c494' }}>{e1rm} kg</span>
          </div>
        ) : <div />}
        {targetRir !== undefined && (
          <div style={{ fontSize: '0.62rem', color: 'rgba(160,160,160,0.45)' }}>
            cel: RIR <span style={{ color: rirColors[targetRir] }}>{targetRir}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ===== EXERCISE BLOCK =====
function ExerciseBlock({ exercise, sets, prevPerf, targetRir, onUpdateSet, onAddSet, onRemoveSet, onRemoveExercise, onSetLogged }) {
  const prevBestSet = prevPerf?.sets?.reduce((best, s) =>
    (s.weight_kg > (best?.weight_kg ?? 0) ? s : best), null)

  return (
    <div style={{
      background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
      border: '1px solid rgba(184,166,119,0.12)',
      borderRadius: '12px', padding: '1.25rem',
      marginBottom: '0.75rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
        <div>
          <div style={{
            fontSize: '0.62rem', color: 'rgba(184,166,119,0.5)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: 'Outfit, sans-serif', marginBottom: '0.2rem',
          }}>
            {muscleLabels[exercise.muscle_group] || exercise.muscle_group}
            {exercise.stretch_position && <span style={{ marginLeft: '0.4rem', color: 'rgba(184,166,119,0.6)' }}>· stretch ⊕</span>}
          </div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem',
            fontWeight: 600, color: '#e8e8e8',
          }}>
            {exercise.name_pl || exercise.name}
          </div>
        </div>
        <button onClick={onRemoveExercise} style={{
          background: 'none', border: '1px solid rgba(239,68,68,0.25)',
          color: 'rgba(239,68,68,0.5)', borderRadius: '6px',
          padding: '0.3rem 0.6rem', cursor: 'pointer',
          fontSize: '0.7rem', fontFamily: 'Outfit, sans-serif',
        }}>Usuń</button>
      </div>

      {/* Previous best */}
      {prevBestSet && (
        <div style={{
          fontSize: '0.7rem', color: 'rgba(160,160,160,0.55)',
          marginBottom: '0.75rem',
          padding: '0.4rem 0.7rem',
          background: 'rgba(184,166,119,0.05)',
          borderRadius: '6px', borderLeft: '2px solid rgba(184,166,119,0.25)',
        }}>
          Ostatnio: <span style={{ color: '#d4c494', fontWeight: 600 }}>
            {prevBestSet.weight_kg} kg × {prevBestSet.reps}
          </span>
          {prevBestSet.rir_actual !== undefined && (
            <span style={{ color: 'rgba(160,160,160,0.4)', marginLeft: '0.3rem' }}>
              @ RIR {prevBestSet.rir_actual}
            </span>
          )}
        </div>
      )}

      {/* Column headers */}
      {sets.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '28px 1fr 1fr auto auto',
          gap: '0.5rem', padding: '0 0 0.35rem',
          fontSize: '0.58rem', color: 'rgba(160,160,160,0.4)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          fontFamily: 'Outfit, sans-serif',
        }}>
          <div>#</div><div>Ciężar</div><div>Powt.</div><div>RIR</div><div />
        </div>
      )}

      {/* Sets */}
      {sets.map((set, i) => (
        <SetRow
          key={i}
          setNum={i + 1}
          data={set}
          onChange={(updated) => onUpdateSet(i, updated)}
          onRemove={() => onRemoveSet(i)}
          onLogged={() => onSetLogged(i)}
          prevBest={prevBestSet ? { weight: prevBestSet.weight_kg, reps: prevBestSet.reps } : null}
          targetRir={targetRir}
        />
      ))}

      {/* Add set */}
      <button onClick={onAddSet} style={{
        width: '100%', marginTop: '0.75rem',
        padding: '0.6rem',
        background: 'rgba(184,166,119,0.05)',
        border: '1px dashed rgba(184,166,119,0.2)',
        borderRadius: '8px', cursor: 'pointer',
        color: 'rgba(184,166,119,0.6)',
        fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem',
        letterSpacing: '0.08em',
      }}>
        + Dodaj serię
      </button>
    </div>
  )
}

// ===== TIMER =====
function Timer({ startTime }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(id)
  }, [startTime])
  return <span>{fmt(elapsed)}</span>
}

// ===== SESSION SUMMARY =====
function SessionSummary({ stats, onContinue }) {
  const xp = Math.min(200, 60 + stats.totalSets * 8 + stats.exercises * 10)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Outfit, sans-serif', padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '340px', width: '100%' }}>
        {/* Icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'rgba(71,209,140,0.15)',
          border: '2px solid rgba(71,209,140,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2rem',
        }}>⚡</div>

        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '2rem', color: '#d4c494', fontWeight: 600,
          marginBottom: '0.25rem',
        }}>Trening ukończony</div>
        <div style={{ color: 'rgba(160,160,160,0.6)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Ἄσκησις — dyscyplina przynosi rezultaty
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem', marginBottom: '1.5rem',
        }}>
          {[
            { label: 'Czas', value: fmt(stats.duration), accent: false },
            { label: 'Serie', value: stats.totalSets, accent: false },
            { label: 'Objętość', value: `${stats.volume.toLocaleString('pl')} kg`, accent: false },
            { label: 'XP zdobyte', value: `+${xp} XP`, accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{
              background: accent ? 'rgba(212,181,112,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${accent ? 'rgba(212,181,112,0.2)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: '10px', padding: '1rem',
            }}>
              <div style={{ fontSize: '0.62rem', color: 'rgba(160,160,160,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                {label}
              </div>
              <div style={{
                fontSize: '1.3rem', fontWeight: 700,
                color: accent ? '#D4B570' : '#e8e8e8',
              }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Top set */}
        {stats.topSet && (
          <div style={{
            background: 'rgba(184,166,119,0.06)',
            border: '1px solid rgba(184,166,119,0.15)',
            borderRadius: '10px', padding: '0.85rem',
            marginBottom: '1.5rem', textAlign: 'left',
          }}>
            <div style={{ fontSize: '0.62rem', color: 'rgba(160,160,160,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Najlepsza seria
            </div>
            <div style={{ color: '#e8e8e8', fontSize: '0.9rem' }}>
              <span style={{ color: '#d4c494', fontWeight: 600 }}>{stats.topSet.name}</span>
              {' — '}
              {stats.topSet.weight} kg × {stats.topSet.reps} powt.
              {stats.topSet.e1rm && (
                <span style={{ color: 'rgba(160,160,160,0.5)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>
                  (1RM ~{stats.topSet.e1rm} kg)
                </span>
              )}
            </div>
          </div>
        )}

        <button onClick={onContinue} style={{
          width: '100%', padding: '0.95rem',
          background: 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
          border: 'none', borderRadius: '10px', cursor: 'pointer',
          color: '#0f1a2e', fontFamily: 'Outfit, sans-serif',
          fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.08em',
        }}>
          Wróć do panelu
        </button>
      </div>
    </div>
  )
}

// ===== MAIN =====
export default function WorkoutLogger({ profile, exercises = [], activePlan, clientId }) {
  const router = useRouter()
  const [showPicker, setShowPicker] = useState(false)
  const [sessionExercises, setSessionExercises] = useState([])
  const [startTime] = useState(Date.now())
  const [saving, setSaving] = useState(false)
  const [sessionStats, setSessionStats] = useState(null) // set on save → shows summary
  const [dayLabel, setDayLabel] = useState('A')
  const [notes, setNotes] = useState('')
  const [prevPerformance, setPrevPerformance] = useState({}) // { exercise_id: lastLogEntry }
  const [showRestTimer, setShowRestTimer] = useState(false)

  // ── Auto-load session from active plan ──
  useEffect(() => {
    if (!activePlan?.plan_data?.sessions) return
    const sessions = activePlan.plan_data.sessions
    const todaySession = sessions.find(s => s.label === dayLabel) ?? sessions[0]
    if (!todaySession?.exercises?.length || !exercises.length) return

    const loaded = todaySession.exercises
      .map(ex => {
        const found = exercises.find(e => e.id === ex.exercise_id || e.name === ex.name)
        if (!found) return null
        const setsCount = ex.sets ?? 3
        return {
          exercise: found,
          sets: Array.from({ length: setsCount }, () => ({
            weight: '', reps: ex.rep_range ?? '', rir: String(activePlan.plan_data.rir_start ?? 2), logged: false,
          })),
        }
      })
      .filter(Boolean)

    if (loaded.length > 0) setSessionExercises(loaded)
    if (todaySession.label) setDayLabel(todaySession.label)
  }, [activePlan, exercises])

  // ── Fetch previous performance ──
  useEffect(() => {
    if (!clientId) return
    const supabase = createClient()
    supabase
      .from('training_logs')
      .select('exercises, session_date')
      .eq('client_id', clientId)
      .order('session_date', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (!data) return
        const perf = {}
        // For each exercise in recent logs, keep the most recent entry
        data.forEach(log => {
          (log.exercises ?? []).forEach(ex => {
            if (!perf[ex.exercise_id] && ex.sets?.length) {
              perf[ex.exercise_id] = ex
            }
          })
        })
        setPrevPerformance(perf)
      })
  }, [clientId])

  // ── State mutations ──
  const addExercise = (exercise) => {
    setSessionExercises(prev => [...prev, {
      exercise,
      sets: [{ weight: '', reps: '', rir: '2', logged: false }],
    }])
    setShowPicker(false)
  }

  const addSet = (exIdx) => {
    setSessionExercises(prev => prev.map((item, i) => {
      if (i !== exIdx) return item
      const last = item.sets[item.sets.length - 1]
      return { ...item, sets: [...item.sets, { ...last, logged: false }] }
    }))
  }

  const updateSet = (exIdx, setIdx, updated) => {
    setSessionExercises(prev => prev.map((item, i) => {
      if (i !== exIdx) return item
      const newSets = [...item.sets]
      newSets[setIdx] = updated
      return { ...item, sets: newSets }
    }))
  }

  const removeSet = (exIdx, setIdx) => {
    setSessionExercises(prev => prev.map((item, i) => {
      if (i !== exIdx) return item
      return { ...item, sets: item.sets.filter((_, si) => si !== setIdx) }
    }))
  }

  const removeExercise = (exIdx) => {
    setSessionExercises(prev => prev.filter((_, i) => i !== exIdx))
  }

  // Mark set as logged + show rest timer
  const handleSetLogged = (exIdx, setIdx) => {
    updateSet(exIdx, setIdx, { ...sessionExercises[exIdx].sets[setIdx], logged: true })
    setShowRestTimer(true)
  }

  const totalSets = sessionExercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  const targetRir = activePlan?.plan_data?.rir_start

  // ── Save ──
  const saveWorkout = async () => {
    if (sessionExercises.length === 0) return
    setSaving(true)

    const duration = Math.floor((Date.now() - startTime) / 1000)
    let totalVolume = 0
    let topSet = null

    const exercisesData = sessionExercises.map(({ exercise, sets }) => {
      sets.forEach(s => {
        const w = parseFloat(s.weight) || 0
        const r = parseInt(s.reps) || 0
        totalVolume += w * r
        const e1rm = epley(w, r)
        if (e1rm && (!topSet || e1rm > topSet.e1rm)) {
          topSet = { name: exercise.name_pl || exercise.name, weight: w, reps: r, e1rm }
        }
      })
      return {
        exercise_id: exercise.id,
        name: exercise.name_pl || exercise.name,
        muscle_group: exercise.muscle_group,
        sets: sets.map(s => ({
          weight_kg: parseFloat(s.weight) || 0,
          reps: parseInt(s.reps) || 0,
          rir_actual: parseInt(s.rir),
          estimated_1rm: epley(parseFloat(s.weight), parseInt(s.reps)),
          volume_load: (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0),
        })),
      }
    })

    const supabase = createClient()
    await supabase.from('training_logs').insert({
      client_id: clientId,
      plan_id: activePlan?.id || null,
      session_date: new Date().toISOString().split('T')[0],
      day_label: dayLabel,
      exercises: exercisesData,
      duration_minutes: Math.floor(duration / 60),
      notes: notes || null,
      completed: true,
    })

    setSaving(false)
    setSessionStats({
      duration,
      totalSets,
      exercises: sessionExercises.length,
      volume: Math.round(totalVolume),
      topSet,
    })
  }

  // ── Summary screen ──
  if (sessionStats) {
    return <SessionSummary stats={sessionStats} onContinue={() => router.push('/client')} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      color: '#e8e8e8', fontFamily: 'Outfit, sans-serif',
    }}>
      {/* Exercise picker */}
      {showPicker && (
        <ExercisePicker
          exercises={exercises}
          onSelect={addExercise}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Rest timer */}
      {showRestTimer && <RestTimer onDismiss={() => setShowRestTimer(false)} />}

      {/* TOP BAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,14,26,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(184,166,119,0.15)',
        padding: '0.85rem 1.25rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => router.push('/client')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(184,166,119,0.6)', fontSize: '1.2rem', padding: 0,
          }}>←</button>
          <div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem',
              color: '#d4c494', fontWeight: 600, letterSpacing: '0.05em',
            }}>Sesja {dayLabel}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(160,160,160,0.5)' }}>
              <Timer startTime={startTime} /> · {totalSets} serii
            </div>
          </div>
        </div>

        {/* Day selector */}
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          {['A', 'B', 'C', 'D', 'E', 'F'].map(d => (
            <button key={d} onClick={() => setDayLabel(d)} style={{
              width: '30px', height: '30px', borderRadius: '6px',
              background: dayLabel === d ? 'rgba(184,166,119,0.2)' : 'transparent',
              border: `1px solid ${dayLabel === d ? '#b8a677' : 'rgba(184,166,119,0.18)'}`,
              color: dayLabel === d ? '#d4c494' : 'rgba(160,160,160,0.45)',
              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
              fontFamily: 'Outfit, sans-serif',
            }}>{d}</button>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 8rem' }}>

        {/* RIR target hint */}
        {targetRir !== undefined && sessionExercises.length > 0 && (
          <div style={{
            fontSize: '0.72rem', color: 'rgba(160,160,160,0.5)',
            marginBottom: '1rem', padding: '0.5rem 0.75rem',
            background: 'rgba(184,166,119,0.05)',
            borderRadius: '8px', borderLeft: `3px solid ${rirColors[targetRir]}`,
          }}>
            Plan: celuj w <span style={{ color: rirColors[targetRir], fontWeight: 600 }}>RIR {targetRir}</span> w tej sesji
          </div>
        )}

        {/* Empty state */}
        {sessionExercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(160,160,160,0.5)' }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '4rem', color: 'rgba(184,166,119,0.2)',
              lineHeight: 1, marginBottom: '1rem',
            }}>⚡</div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.3rem', color: 'rgba(184,166,119,0.5)',
              marginBottom: '0.5rem',
            }}>Zacznij logować trening</div>
            <div style={{ fontSize: '0.85rem' }}>
              Dodaj pierwsze ćwiczenie żeby rozpocząć sesję
            </div>
          </div>
        )}

        {/* Exercise blocks */}
        {sessionExercises.map((item, exIdx) => (
          <ExerciseBlock
            key={exIdx}
            exercise={item.exercise}
            sets={item.sets}
            prevPerf={prevPerformance[item.exercise?.id]}
            targetRir={targetRir}
            onAddSet={() => addSet(exIdx)}
            onUpdateSet={(setIdx, updated) => updateSet(exIdx, setIdx, updated)}
            onRemoveSet={(setIdx) => removeSet(exIdx, setIdx)}
            onRemoveExercise={() => removeExercise(exIdx)}
            onSetLogged={(setIdx) => handleSetLogged(exIdx, setIdx)}
          />
        ))}

        {/* Notes */}
        {sessionExercises.length > 0 && (
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Notatki do sesji (opcjonalne)..."
            rows={3}
            style={{
              width: '100%', padding: '0.8rem 1rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(184,166,119,0.15)',
              borderRadius: '10px', outline: 'none',
              color: '#e8e8e8', fontFamily: 'Outfit, sans-serif',
              fontSize: '0.85rem', resize: 'none', boxSizing: 'border-box',
            }}
          />
        )}
      </main>

      {/* BOTTOM BAR */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(10,14,26,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(184,166,119,0.15)',
        padding: '0.85rem 1.25rem',
        display: 'flex', gap: '0.75rem',
      }}>
        <button onClick={() => setShowPicker(true)} style={{
          flex: 1, padding: '0.85rem',
          background: 'rgba(184,166,119,0.08)',
          border: '1px solid rgba(184,166,119,0.3)',
          borderRadius: '10px', cursor: 'pointer',
          color: '#b8a677', fontFamily: 'Outfit, sans-serif',
          fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em',
        }}>
          + Ćwiczenie
        </button>

        {sessionExercises.length > 0 && (
          <button onClick={saveWorkout} disabled={saving} style={{
            flex: 1, padding: '0.85rem',
            background: saving ? 'rgba(184,166,119,0.3)' : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
            border: 'none', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer',
            color: saving ? 'rgba(184,166,119,0.6)' : '#0f1a2e',
            fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem',
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {saving ? 'Zapisuję…' : `Zakończ (${totalSets})`}
          </button>
        )}
      </div>
    </div>
  )
}