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
    <div className="fixed bottom-[5.5rem] right-4 z-[100] bg-[rgba(10,14,26,0.97)] rounded-[14px] p-[0.9rem_1rem] min-w-[160px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl" style={{
      border: `1px solid ${done ? '#47D18C' : 'rgba(184,166,119,0.3)'}`,
    }}>
      {/* Label */}
      <div className="text-[0.6rem] text-[rgba(160,160,160,0.6)] tracking-[0.15em] uppercase font-body mb-[0.4rem]">
        Przerwa
      </div>

      {/* Time */}
      <div className="font-body text-[1.6rem] font-bold tracking-[-0.02em] mb-[0.5rem]" style={{
        color: done ? '#47D18C' : '#e8e8e8',
      }}>
        {fmt(seconds)}
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-[rgba(255,255,255,0.08)] rounded-full mb-[0.6rem] overflow-hidden">
        <div className="h-full rounded-full transition-[width_1s_linear,background_0.3s]" style={{
          width: `${pct}%`,
          background: done ? '#47D18C' : 'rgba(184,166,119,0.7)',
        }} />
      </div>

      {/* Target selector */}
      <div className="flex gap-[0.3rem] mb-[0.5rem]">
        {[60, 90, 120, 180].map(t => (
          <button
            key={t}
            onClick={() => { setTarget(t); setSeconds(0) }}
            className="flex-1 py-[0.2rem] text-[0.62rem] font-body rounded cursor-pointer"
            style={{
              background: target === t ? 'rgba(184,166,119,0.15)' : 'transparent',
              border: `1px solid ${target === t ? 'rgba(184,166,119,0.5)' : 'rgba(184,166,119,0.15)'}`,
              color: target === t ? '#d4c494' : 'rgba(160,160,160,0.5)',
            }}
          >
            {t / 60 >= 1 ? `${t / 60}'` : `${t}"`}
          </button>
        ))}
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="w-full py-[0.4rem] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-md cursor-pointer text-[rgba(160,160,160,0.6)] font-body text-[0.72rem]"
      >
        Zamknij
      </button>
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
    <div className="fixed inset-0 z-[999] bg-[rgba(6,9,18,0.97)] flex flex-col">
      <div className="pt-4 px-5 pb-3 bg-[rgba(10,14,26,0.9)] border-b border-[rgba(184,166,119,0.15)]">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onClose}
            className="bg-transparent border-0 cursor-pointer text-[rgba(184,166,119,0.7)] text-[1.3rem] p-0 leading-none"
          >
            ←
          </button>
          <h2 className="font-display text-xl font-semibold text-gold m-0">
            Wybierz ćwiczenie
          </h2>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj ćwiczenia..."
          className="w-full py-[0.7rem] px-4 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,166,119,0.25)] rounded-lg outline-none text-warm font-body text-[0.95rem] mb-[0.6rem] box-border"
        />
        <div className="flex gap-[0.4rem] overflow-x-auto pb-1">
          {muscles.map(m => (
            <button
              key={m}
              onClick={() => setMuscleFilter(m)}
              className="py-[0.3rem] px-3 rounded-full whitespace-nowrap text-[0.72rem] cursor-pointer font-body"
              style={{
                background: muscleFilter === m ? 'rgba(184,166,119,0.2)' : 'transparent',
                border: `1px solid ${muscleFilter === m ? '#b8a677' : 'rgba(184,166,119,0.2)'}`,
                color: muscleFilter === m ? '#d4c494' : 'rgba(160,160,160,0.7)',
              }}
            >
              {m === 'all' ? 'Wszystkie' : muscleLabels[m] || m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {Object.entries(grouped).map(([muscle, exList]) => (
          <div key={muscle}>
            <div className="py-[0.6rem_1.25rem_0.3rem] px-5 text-[0.65rem] text-[rgba(184,166,119,0.5)] tracking-[0.2em] uppercase font-body">
              {muscleLabels[muscle] || muscle}
            </div>
            {exList.map(ex => (
              <button
                key={ex.id}
                onClick={() => onSelect(ex)}
                className="w-full flex items-center justify-between py-[0.85rem] px-5 bg-transparent border-0 border-b border-[rgba(255,255,255,0.04)] cursor-pointer text-left"
              >
                <div>
                  <div className="text-[0.9rem] text-warm font-body font-medium">
                    {ex.name_pl || ex.name}
                  </div>
                  <div className="text-[0.72rem] text-[rgba(160,160,160,0.6)] mt-[0.15rem]">
                    {ex.name} · {ex.equipment?.join(', ')}
                    {ex.stretch_position && (
                      <span className="text-[rgba(184,166,119,0.6)] ml-[0.4rem]">⊕ stretch</span>
                    )}
                  </div>
                </div>
                <div className="text-[0.7rem] text-[rgba(184,166,119,0.6)] py-[0.2rem] px-2 rounded bg-[rgba(184,166,119,0.08)]">
                  SFR {ex.sfr_rating}
                </div>
              </button>
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-[rgba(160,160,160,0.5)] font-body">
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
    <div className="rounded-lg py-2 border-b border-[rgba(255,255,255,0.05)] transition-[background_0.3s]" style={{
      background: isLogged ? 'rgba(71,209,140,0.05)' : 'transparent',
    }}>
      <div className="grid grid-cols-[28px_1fr_1fr_auto_auto] gap-2 items-center">
        {/* Set number */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-semibold font-body" style={{
          background: isLogged ? 'rgba(71,209,140,0.2)' : 'rgba(184,166,119,0.15)',
          color: isLogged ? '#47D18C' : 'rgba(184,166,119,0.8)',
        }}>
          {isLogged ? '✓' : setNum}
        </div>

        {/* Weight */}
        <div>
          <div className="text-[0.6rem] text-[rgba(160,160,160,0.5)] mb-[0.2rem] tracking-[0.1em]">KG</div>
          <input
            type="number"
            inputMode="decimal"
            value={data.weight}
            onChange={e => onChange({ ...data, weight: e.target.value })}
            placeholder={prevBest?.weight ?? '0'}
            className="w-full py-[0.55rem] px-2 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,166,119,0.2)] rounded-md outline-none text-warm font-body text-base font-medium text-center box-border focus:border-[rgba(184,166,119,0.6)]"
          />
        </div>

        {/* Reps */}
        <div>
          <div className="text-[0.6rem] text-[rgba(160,160,160,0.5)] mb-[0.2rem] tracking-[0.1em]">POWT.</div>
          <input
            type="number"
            inputMode="numeric"
            value={data.reps}
            onChange={e => onChange({ ...data, reps: e.target.value })}
            placeholder={prevBest?.reps ?? '0'}
            className="w-full py-[0.55rem] px-2 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,166,119,0.2)] rounded-md outline-none text-warm font-body text-base font-medium text-center box-border focus:border-[rgba(184,166,119,0.6)]"
          />
        </div>

        {/* RIR */}
        <div>
          <div className="text-[0.6rem] text-[rgba(160,160,160,0.5)] mb-[0.2rem] tracking-[0.1em]">RIR</div>
          <select
            value={data.rir}
            onChange={e => onChange({ ...data, rir: e.target.value })}
            className="py-[0.55rem] px-[0.4rem] bg-[rgba(255,255,255,0.06)] rounded-md outline-none font-body text-[0.9rem] font-semibold cursor-pointer"
            style={{
              border: `1px solid ${rirColors[parseInt(data.rir)] || 'rgba(184,166,119,0.2)'}`,
              color: rirColors[parseInt(data.rir)] || '#e8e8e8',
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
          className="w-8 h-8 rounded-md cursor-pointer text-[0.9rem] flex items-center justify-center transition-all flex-shrink-0"
          style={{
            background: isLogged ? 'rgba(71,209,140,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isLogged ? 'rgba(71,209,140,0.4)' : 'rgba(255,255,255,0.12)'}`,
            color: isLogged ? '#47D18C' : 'rgba(160,160,160,0.5)',
          }}
        >
          {isLogged ? '✓' : '○'}
        </button>
      </div>

      {/* e1RM + target RIR hint */}
      <div className="flex justify-between items-center pl-9 mt-1">
        {e1rm ? (
          <div className="text-[0.65rem] text-[rgba(184,166,119,0.55)]">
            Est. 1RM: <span className="text-gold">{e1rm} kg</span>
          </div>
        ) : <div />}
        {targetRir !== undefined && (
          <div className="text-[0.62rem] text-[rgba(160,160,160,0.45)]">
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
    <div className="bg-gradient-to-br from-[#131f36] to-[#0f1a2e] border border-[rgba(184,166,119,0.12)] rounded-xl p-5 mb-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-[0.6rem]">
        <div>
          <div className="text-[0.62rem] text-[rgba(184,166,119,0.5)] tracking-[0.15em] uppercase font-body mb-[0.2rem]">
            {muscleLabels[exercise.muscle_group] || exercise.muscle_group}
            {exercise.stretch_position && (
              <span className="ml-[0.4rem] text-[rgba(184,166,119,0.6)]">· stretch ⊕</span>
            )}
          </div>
          <div className="font-display text-[1.15rem] font-semibold text-warm">
            {exercise.name_pl || exercise.name}
          </div>
        </div>
        <button
          onClick={onRemoveExercise}
          className="bg-transparent border border-[rgba(239,68,68,0.25)] text-[rgba(239,68,68,0.5)] rounded-md py-[0.3rem] px-[0.6rem] cursor-pointer text-[0.7rem] font-body"
        >
          Usuń
        </button>
      </div>

      {/* Previous best */}
      {prevBestSet && (
        <div className="text-[0.7rem] text-[rgba(160,160,160,0.55)] mb-3 py-[0.4rem] px-[0.7rem] bg-[rgba(184,166,119,0.05)] rounded-md border-l-2 border-[rgba(184,166,119,0.25)]">
          Ostatnio: <span className="text-gold font-semibold">
            {prevBestSet.weight_kg} kg × {prevBestSet.reps}
          </span>
          {prevBestSet.rir_actual !== undefined && (
            <span className="text-[rgba(160,160,160,0.4)] ml-[0.3rem]">
              @ RIR {prevBestSet.rir_actual}
            </span>
          )}
        </div>
      )}

      {/* Column headers */}
      {sets.length > 0 && (
        <div className="grid grid-cols-[28px_1fr_1fr_auto_auto] gap-2 pb-[0.35rem] text-[0.58rem] text-[rgba(160,160,160,0.4)] tracking-[0.15em] uppercase font-body">
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
      <button
        onClick={onAddSet}
        className="w-full mt-3 py-[0.6rem] bg-[rgba(184,166,119,0.05)] border border-dashed border-[rgba(184,166,119,0.2)] rounded-lg cursor-pointer text-[rgba(184,166,119,0.6)] font-body text-[0.8rem] tracking-[0.08em]"
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
  return <span>{fmt(elapsed)}</span>
}

// ===== SESSION SUMMARY =====
function SessionSummary({ stats, onContinue }) {
  const xp = Math.min(200, 60 + stats.totalSets * 8 + stats.exercises * 10)

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#131f36_0%,#0a0f1a_60%,#060912_100%)] flex items-center justify-center font-body p-8">
      <div className="text-center max-w-[340px] w-full">
        {/* Icon */}
        <div className="w-[72px] h-[72px] rounded-full bg-[rgba(71,209,140,0.15)] border-2 border-[rgba(71,209,140,0.35)] flex items-center justify-center mx-auto mb-6 text-[2rem]">
          ⚡
        </div>

        <div className="font-display text-[2rem] text-gold font-semibold mb-1">
          Trening ukończony
        </div>
        <div className="text-[rgba(160,160,160,0.6)] text-[0.85rem] mb-8">
          Ἄσκησις — dyscyplina przynosi rezultaty
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Czas', value: fmt(stats.duration), accent: false },
            { label: 'Serie', value: stats.totalSets, accent: false },
            { label: 'Objętość', value: `${stats.volume.toLocaleString('pl')} kg`, accent: false },
            { label: 'XP zdobyte', value: `+${xp} XP`, accent: true },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className={`${accent ? 'bg-[rgba(212,181,112,0.08)] border-[rgba(212,181,112,0.2)]' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)]'} border rounded-[10px] p-4`}
            >
              <div className="text-[0.62rem] text-[rgba(160,160,160,0.5)] tracking-[0.1em] uppercase mb-[0.3rem]">
                {label}
              </div>
              <div className={`text-[1.3rem] font-bold ${accent ? 'text-gold' : 'text-warm'}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Top set */}
        {stats.topSet && (
          <div className="bg-[rgba(184,166,119,0.06)] border border-[rgba(184,166,119,0.15)] rounded-[10px] p-[0.85rem] mb-6 text-left">
            <div className="text-[0.62rem] text-[rgba(160,160,160,0.5)] tracking-[0.1em] uppercase mb-[0.3rem]">
              Najlepsza seria
            </div>
            <div className="text-warm text-[0.9rem]">
              <span className="text-gold font-semibold">{stats.topSet.name}</span>
              {' — '}
              {stats.topSet.weight} kg × {stats.topSet.reps} powt.
              {stats.topSet.e1rm && (
                <span className="text-[rgba(160,160,160,0.5)] text-[0.8rem] ml-[0.4rem]">
                  (1RM ~{stats.topSet.e1rm} kg)
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full py-[0.95rem] bg-gradient-to-br from-[#b8a677] to-gold border-0 rounded-[10px] cursor-pointer text-[#0f1a2e] font-body text-[0.9rem] font-bold tracking-[0.08em]"
        >
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#131f36_0%,#0a0f1a_60%,#060912_100%)] text-warm font-body">
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
      <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.92)] backdrop-blur-xl border-b border-[rgba(184,166,119,0.15)] py-[0.85rem] px-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/client')}
            className="bg-transparent border-0 cursor-pointer text-[rgba(184,166,119,0.6)] text-[1.2rem] p-0"
          >
            ←
          </button>
          <div>
            <div className="font-display text-[1.1rem] text-gold font-semibold tracking-[0.05em]">
              Sesja {dayLabel}
            </div>
            <div className="text-[0.7rem] text-[rgba(160,160,160,0.5)]">
              <Timer startTime={startTime} /> · {totalSets} serii
            </div>
          </div>
        </div>

        {/* Day selector */}
        <div className="flex gap-[0.3rem] items-center">
          {['A', 'B', 'C', 'D', 'E', 'F'].map(d => (
            <button
              key={d}
              onClick={() => setDayLabel(d)}
              className="w-[30px] h-[30px] rounded-md cursor-pointer text-[0.75rem] font-semibold font-body"
              style={{
                background: dayLabel === d ? 'rgba(184,166,119,0.2)' : 'transparent',
                border: `1px solid ${dayLabel === d ? '#b8a677' : 'rgba(184,166,119,0.18)'}`,
                color: dayLabel === d ? '#d4c494' : 'rgba(160,160,160,0.45)',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-[680px] mx-auto py-6 px-4 pb-32">
        {/* RIR target hint */}
        {targetRir !== undefined && sessionExercises.length > 0 && (
          <div className="text-[0.72rem] text-[rgba(160,160,160,0.5)] mb-4 py-2 px-3 bg-[rgba(184,166,119,0.05)] rounded-lg" style={{
            borderLeft: `3px solid ${rirColors[targetRir]}`,
          }}>
            Plan: celuj w <span style={{ color: rirColors[targetRir] }} className="font-semibold">RIR {targetRir}</span> w tej sesji
          </div>
        )}

        {/* Empty state */}
        {sessionExercises.length === 0 && (
          <div className="text-center py-16 px-8 text-[rgba(160,160,160,0.5)]">
            <div className="font-display text-[4rem] text-[rgba(184,166,119,0.2)] leading-none mb-4">
              ⚡
            </div>
            <div className="font-display text-[1.3rem] text-[rgba(184,166,119,0.5)] mb-2">
              Zacznij logować trening
            </div>
            <div className="text-[0.85rem]">
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
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notatki do sesji (opcjonalne)..."
            rows={3}
            className="w-full py-[0.8rem] px-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(184,166,119,0.15)] rounded-[10px] outline-none text-warm font-body text-[0.85rem] resize-none box-border"
          />
        )}
      </main>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[rgba(10,14,26,0.95)] backdrop-blur-xl border-t border-[rgba(184,166,119,0.15)] py-[0.85rem] px-5 flex gap-3">
        <button
          onClick={() => setShowPicker(true)}
          className="flex-1 py-[0.85rem] bg-[rgba(184,166,119,0.08)] border border-[rgba(184,166,119,0.3)] rounded-[10px] cursor-pointer text-[#b8a677] font-body text-[0.85rem] font-medium tracking-[0.05em]"
        >
          + Ćwiczenie
        </button>

        {sessionExercises.length > 0 && (
          <button
            onClick={saveWorkout}
            disabled={saving}
            className="flex-1 py-[0.85rem] border-0 rounded-[10px] font-body text-[0.85rem] font-bold tracking-[0.1em] uppercase"
            style={{
              background: saving ? 'rgba(184,166,119,0.3)' : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
              cursor: saving ? 'not-allowed' : 'pointer',
              color: saving ? 'rgba(184,166,119,0.6)' : '#0f1a2e',
            }}
          >
            {saving ? 'Zapisuję…' : `Zakończ (${totalSets})`}
          </button>
        )}
      </div>
    </div>
  )
}
