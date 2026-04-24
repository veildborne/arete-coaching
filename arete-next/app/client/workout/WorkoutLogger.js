'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

// ===== EPLEY 1RM =====
const epley = (weight, reps) => {
  if (!weight || !reps || reps === 0) return null
  return Math.round(weight * (1 + reps / 30) * 10) / 10
}

// ===== MUSCLE GROUP LABELS =====
const muscleLabels = {
  chest: 'Klatka', back: 'Plecy',
  shoulders_lateral: 'Barki boczne', shoulders_rear: 'Barki tylne',
  quads: 'Quady', hamstrings: 'Hamstringi', glutes: 'Pośladki',
  biceps: 'Biceps', triceps: 'Triceps', calves: 'Łydki', abs: 'Brzuch',
}

const rirColors = {
  0: '#ef4444', 1: '#f97316', 2: '#4caf50', 3: '#4a9eff', 4: '#a0a0a0', 5: '#666666',
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

  // Group by muscle
  const grouped = filtered.reduce((acc, ex) => {
    const g = ex.muscle_group
    if (!acc[g]) acc[g] = []
    acc[g].push(ex)
    return acc
  }, {})

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(6,9,18,0.95)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
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
            marginBottom: '0.6rem',
          }}
        />
        {/* Muscle filter pills */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {muscles.map(m => (
            <button key={m} onClick={() => setMuscleFilter(m)} style={{
              padding: '0.3rem 0.75rem', borderRadius: '99px', whiteSpace: 'nowrap',
              background: muscleFilter === m ? 'rgba(184,166,119,0.2)' : 'transparent',
              border: `1px solid ${muscleFilter === m ? '#b8a677' : 'rgba(184,166,119,0.2)'}`,
              color: muscleFilter === m ? '#d4c494' : 'rgba(160,160,160,0.7)',
              fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              letterSpacing: '0.05em',
            }}>
              {m === 'all' ? 'Wszystkie' : muscleLabels[m] || m}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise list */}
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
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,166,119,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
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
function SetRow({ setNum, data, onChange, onRemove }) {
  const e1rm = epley(parseFloat(data.weight), parseInt(data.reps))

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '28px 1fr 1fr auto auto',
      gap: '0.5rem', alignItems: 'center',
      padding: '0.6rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Set number */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'rgba(184,166,119,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.72rem', color: 'rgba(184,166,119,0.8)',
        fontWeight: 600, fontFamily: 'Outfit, sans-serif',
      }}>{setNum}</div>

      {/* Weight */}
      <div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(160,160,160,0.5)', marginBottom: '0.2rem', letterSpacing: '0.1em' }}>KG</div>
        <input
          type="number" value={data.weight} onChange={e => onChange({ ...data, weight: e.target.value })}
          placeholder="0"
          style={{
            width: '100%', padding: '0.55rem 0.5rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(184,166,119,0.2)',
            borderRadius: '6px', outline: 'none',
            color: '#e8e8e8', fontFamily: 'Outfit, sans-serif',
            fontSize: '1rem', fontWeight: 500, textAlign: 'center',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
        />
      </div>

      {/* Reps */}
      <div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(160,160,160,0.5)', marginBottom: '0.2rem', letterSpacing: '0.1em' }}>POWT.</div>
        <input
          type="number" value={data.reps} onChange={e => onChange({ ...data, reps: e.target.value })}
          placeholder="0"
          style={{
            width: '100%', padding: '0.55rem 0.5rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(184,166,119,0.2)',
            borderRadius: '6px', outline: 'none',
            color: '#e8e8e8', fontFamily: 'Outfit, sans-serif',
            fontSize: '1rem', fontWeight: 500, textAlign: 'center',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
        />
      </div>

      {/* RIR selector */}
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

      {/* Remove */}
      <button onClick={onRemove} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(239,68,68,0.4)', fontSize: '1rem', padding: '0.25rem',
        transition: 'color 0.15s',
      }}
        onMouseEnter={e => e.target.style.color = '#ef4444'}
        onMouseLeave={e => e.target.style.color = 'rgba(239,68,68,0.4)'}
      >✕</button>

      {/* E1RM below */}
      {e1rm && (
        <div style={{
          gridColumn: '2 / 5', fontSize: '0.68rem',
          color: 'rgba(184,166,119,0.6)', letterSpacing: '0.05em',
          marginTop: '-0.2rem',
        }}>
          Est. 1RM: <span style={{ color: '#d4c494', fontWeight: 500 }}>{e1rm} kg</span>
        </div>
      )}
    </div>
  )
}

// ===== EXERCISE BLOCK =====
function ExerciseBlock({ exercise, sets, onUpdateSet, onAddSet, onRemoveSet, onRemoveExercise }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
      border: '1px solid rgba(184,166,119,0.12)',
      borderRadius: '12px', padding: '1.25rem',
      marginBottom: '0.75rem',
    }}>
      {/* Exercise header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{
            fontSize: '0.65rem', color: 'rgba(184,166,119,0.5)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: 'Outfit, sans-serif', marginBottom: '0.2rem',
          }}>
            {muscleLabels[exercise.muscle_group] || exercise.muscle_group}
            {exercise.stretch_position && <span style={{ marginLeft: '0.5rem', color: 'rgba(184,166,119,0.6)' }}>· stretch ⊕</span>}
          </div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem',
            fontWeight: 600, color: '#e8e8e8',
          }}>
            {exercise.name_pl || exercise.name}
          </div>
        </div>
        <button onClick={onRemoveExercise} style={{
          background: 'none', border: '1px solid rgba(239,68,68,0.3)',
          color: 'rgba(239,68,68,0.6)', borderRadius: '6px',
          padding: '0.3rem 0.6rem', cursor: 'pointer',
          fontSize: '0.7rem', fontFamily: 'Outfit, sans-serif',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444' }}
          onMouseLeave={e => { e.target.style.borderColor = 'rgba(239,68,68,0.3)'; e.target.style.color = 'rgba(239,68,68,0.6)' }}
        >Usuń</button>
      </div>

      {/* Column headers */}
      {sets.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '28px 1fr 1fr auto auto',
          gap: '0.5rem', padding: '0 0 0.4rem',
          fontSize: '0.6rem', color: 'rgba(160,160,160,0.4)',
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
        />
      ))}

      {/* Add set button */}
      <button onClick={onAddSet} style={{
        width: '100%', marginTop: '0.75rem',
        padding: '0.6rem',
        background: 'rgba(184,166,119,0.06)',
        border: '1px dashed rgba(184,166,119,0.25)',
        borderRadius: '8px', cursor: 'pointer',
        color: 'rgba(184,166,119,0.7)',
        fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem',
        letterSpacing: '0.1em', transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.target.style.background = 'rgba(184,166,119,0.1)'; e.target.style.borderColor = 'rgba(184,166,119,0.5)' }}
        onMouseLeave={e => { e.target.style.background = 'rgba(184,166,119,0.06)'; e.target.style.borderColor = 'rgba(184,166,119,0.25)' }}
      >
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
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0')
  const s = (elapsed % 60).toString().padStart(2, '0')
  return <span>{m}:{s}</span>
}

// ===== MAIN WORKOUT LOGGER =====
export default function WorkoutLogger({ profile, exercises, activePlan, clientId }) {
  const router = useRouter()
  const [showPicker, setShowPicker] = useState(false)
  const [sessionExercises, setSessionExercises] = useState([]) // [{exercise, sets:[{weight,reps,rir}]}]
  const [startTime] = useState(Date.now())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dayLabel, setDayLabel] = useState('A')
  const [notes, setNotes] = useState('')

  const firstName = profile?.full_name?.split(' ')[0] || 'Wojowniku'

  const addExercise = (exercise) => {
    setSessionExercises(prev => [...prev, {
      exercise,
      sets: [{ weight: '', reps: '', rir: '2' }]
    }])
    setShowPicker(false)
  }

  const addSet = (exIdx) => {
    setSessionExercises(prev => prev.map((item, i) => {
      if (i !== exIdx) return item
      const lastSet = item.sets[item.sets.length - 1]
      return { ...item, sets: [...item.sets, { ...lastSet }] }
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

  const totalSets = sessionExercises.reduce((sum, ex) => sum + ex.sets.length, 0)

  const saveWorkout = async () => {
    if (sessionExercises.length === 0) return
    setSaving(true)

    const exercisesData = sessionExercises.map(({ exercise, sets }) => ({
      exercise_id: exercise.id,
      name: exercise.name_pl || exercise.name,
      muscle_group: exercise.muscle_group,
      sets: sets.map(s => ({
        weight_kg: parseFloat(s.weight) || 0,
        reps: parseInt(s.reps) || 0,
        rir_actual: parseInt(s.rir),
        estimated_1rm: epley(parseFloat(s.weight), parseInt(s.reps)),
        volume_load: (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0),
      }))
    }))

    const supabase = createClient()
    const { error } = await supabase.from('training_logs').insert({
      client_id: clientId,
      plan_id: activePlan?.id || null,
      session_date: new Date().toISOString().split('T')[0],
      day_label: dayLabel,
      exercises: exercisesData,
      duration_minutes: Math.floor((Date.now() - startTime) / 60000),
      notes: notes || null,
      completed: true,
    })

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => router.push('/client'), 1500)
    }
  }

  if (saved) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      fontFamily: 'Outfit, sans-serif', flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{ fontSize: '3rem' }}>✓</div>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#d4c494' }}>
        Trening zapisany!
      </div>
      <div style={{ color: 'rgba(160,160,160,0.6)', fontSize: '0.9rem' }}>
        Wracam do panelu…
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      color: '#e8e8e8', fontFamily: 'Outfit, sans-serif',
    }}>
      {showPicker && (
        <ExercisePicker
          exercises={exercises}
          onSelect={addExercise}
          onClose={() => setShowPicker(false)}
        />
      )}

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
            }}>Trening {dayLabel}</div>
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
              border: `1px solid ${dayLabel === d ? '#b8a677' : 'rgba(184,166,119,0.2)'}`,
              color: dayLabel === d ? '#d4c494' : 'rgba(160,160,160,0.5)',
              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
              fontFamily: 'Outfit, sans-serif',
            }}>{d}</button>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 8rem' }}>

        {/* Empty state */}
        {sessionExercises.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            color: 'rgba(160,160,160,0.5)',
          }}>
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
            onAddSet={() => addSet(exIdx)}
            onUpdateSet={(setIdx, updated) => updateSet(exIdx, setIdx, updated)}
            onRemoveSet={(setIdx) => removeSet(exIdx, setIdx)}
            onRemoveExercise={() => removeExercise(exIdx)}
          />
        ))}

        {/* Notes */}
        {sessionExercises.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Notatki do treningu (opcjonalne)..."
              rows={3}
              style={{
                width: '100%', padding: '0.8rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(184,166,119,0.15)',
                borderRadius: '10px', outline: 'none',
                color: '#e8e8e8', fontFamily: 'Outfit, sans-serif',
                fontSize: '0.85rem', resize: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.15)'}
            />
          </div>
        )}
      </main>

      {/* BOTTOM ACTION BAR */}
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
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.target.style.background = 'rgba(184,166,119,0.15)'}
          onMouseLeave={e => e.target.style.background = 'rgba(184,166,119,0.08)'}
        >
          + Dodaj ćwiczenie
        </button>

        {sessionExercises.length > 0 && (
          <button onClick={saveWorkout} disabled={saving} style={{
            flex: 1, padding: '0.85rem',
            background: saving ? 'rgba(184,166,119,0.3)' : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
            border: 'none', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer',
            color: saving ? 'rgba(184,166,119,0.6)' : '#0f1a2e',
            fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem',
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}>
            {saving ? 'Zapisuję…' : `Zakończ (${totalSets} serii)`}
          </button>
        )}
      </div>
    </div>
  )
}