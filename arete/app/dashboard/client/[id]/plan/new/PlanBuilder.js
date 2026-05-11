'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { generatePlan } from '@/lib/planAlgorithm'

const MUSCLE_PL = {
  chest: 'Klatka piersiowa', back: 'Plecy', shoulders_lat: 'Barki boczne',
  shoulders_rear: 'Barki tylne', shoulders_lateral: 'Barki boczne',
  biceps: 'Biceps', triceps: 'Triceps',
  quads: 'Czwórgłowe', hamstrings: 'Dwugłowe', glutes: 'Pośladki',
  calves: 'Łydki', abs: 'Brzuch',
}

function Badge({ children, color = '#b8a677' }) {
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wider"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      {children}
    </span>
  )
}

// ─── Exercise Swap Picker ─────────────────────────────────────────────────────

function SwapPicker({ currentExercise, allExercises, onSelect, onClose }) {
  const [search, setSearch] = useState('')

  const sameGroup = allExercises.filter(e =>
    e.muscle_group === currentExercise.muscle_group &&
    e.name !== currentExercise.name &&
    e.id !== currentExercise.id
  )

  const filtered = (search
    ? allExercises.filter(e =>
        (e.name_pl || e.name).toLowerCase().includes(search.toLowerCase()) &&
        e.name !== currentExercise.name
      )
    : sameGroup
  )

  return (
    <div className="fixed inset-0 z-[200] bg-[rgba(6,9,18,0.96)] flex flex-col">
      <div className="pt-4 px-5 pb-3 bg-[rgba(10,14,26,0.95)] border-b border-gold/15">
        <div className="flex items-center gap-3 mb-2.5">
          <button onClick={onClose} className="bg-none border-none cursor-pointer text-gold/70 text-[1.3rem] p-0">
            ←
          </button>
          <div>
            <div className="text-[11px] text-gold/50 uppercase tracking-widest">
              Zamień ćwiczenie
            </div>
            <div className="text-sm text-[#e8e8e8] font-medium">
              {currentExercise.name_pl || currentExercise.name}
            </div>
          </div>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj zastępnika..."
          autoFocus
          className="w-full py-2.5 px-4 bg-white/[0.05] border border-gold/20 rounded-lg outline-none text-[#e8e8e8] font-body text-sm box-border"
        />
        {!search && (
          <div className="text-[11px] text-gold/40 mt-1.5">
            Pokazuję ćwiczenia tej samej partii · wpisz żeby szukać globalnie
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="p-12 text-center text-[#555] text-[13px]">
            Brak wyników
          </div>
        )}
        {filtered.map(ex => (
          <button
            key={ex.id}
            onClick={() => onSelect(ex)}
            className="w-full flex items-center justify-between py-3.5 px-5 bg-none border-none border-b border-white/[0.04] cursor-pointer text-left hover:bg-gold/[0.05] transition"
          >
            <div>
              <div className="text-sm text-[#e8e8e8] font-medium mb-0.5">
                {ex.name_pl || ex.name}
              </div>
              <div className="text-[11px] text-[#555]">
                {MUSCLE_PL[ex.muscle_group] || ex.muscle_group}
                {ex.stretch_position && <span className="text-[rgba(82,183,136,0.7)] ml-1.5">· stretch</span>}
              </div>
            </div>
            <div className="text-[11px] text-gold/60 px-2 py-0.5 rounded bg-gold/[0.08]">
              SFR {ex.sfr_rating}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Exercise Row ─────────────────────────────────────────────────────────────

function ExerciseRow({ ex, sessionKey, exIdx, onUpdate, onRemove, onSwap }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="bg-white/[0.02] border border-gold/10 rounded-lg p-3 flex items-start gap-3">
      <div
        className="w-0.5 rounded-full self-stretch shrink-0"
        style={{ background: ex.stretch_priority ? '#52B788' : 'rgba(184,166,119,0.4)' }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-sm font-medium text-[#e8e8e8]">
            {ex.name_pl || ex.name}
          </span>
          <Badge>{MUSCLE_PL[ex.muscle_group] || ex.muscle_group}</Badge>
          {ex.stretch_priority && <Badge color="#52B788">↔ stretch</Badge>}
          {ex.note && ex.note.includes('★') && <Badge color="#D4AF37">★ priorytet</Badge>}
        </div>

        <div className="flex gap-4 flex-wrap text-xs text-gold/70">
          <span>{ex.sets} serie</span>
          <span>{ex.rep_range} powt.</span>
          <span>RIR {ex.rir_target}</span>
          {ex.progression && <span className="text-[rgba(160,160,160,0.4)]">{ex.progression}</span>}
        </div>

        {editing && (
          <div className="mt-2.5 flex gap-2 flex-wrap">
            {[
              { label: 'Serie',       key: 'sets',      type: 'number', w: 'w-12' },
              { label: 'Zakres powt.', key: 'rep_range', type: 'text',   w: 'w-20' },
              { label: 'RIR',         key: 'rir_target', type: 'number', w: 'w-12' },
            ].map(f => (
              <div key={f.key}>
                <div className="text-[9px] text-[#555] mb-0.5 uppercase tracking-widest">{f.label}</div>
                <input
                  type={f.type}
                  value={ex[f.key]}
                  onChange={e => onUpdate(sessionKey, exIdx, f.key, f.type === 'number' ? parseInt(e.target.value) : e.target.value)}
                  className={`${f.w} py-1 px-2 rounded bg-white/[0.05] border border-gold/20 text-[#e8e8e8] text-[13px] font-body`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => onSwap(sessionKey, exIdx, ex)}
          className="py-1 px-2 rounded text-[11px] bg-transparent border border-[rgba(100,181,246,0.25)] text-[#64B5F6] cursor-pointer font-body"
        >
          ⇄
        </button>
        <button
          onClick={() => setEditing(e => !e)}
          className={`py-1 px-2 rounded text-[11px] border border-gold/20 text-gold cursor-pointer font-body ${
            editing ? 'bg-gold/15' : 'bg-transparent'
          }`}
        >
          {editing ? 'OK' : 'Edytuj'}
        </button>
        <button
          onClick={() => onRemove(sessionKey, exIdx)}
          className="py-1 px-2 rounded text-[11px] bg-transparent border border-[rgba(229,115,115,0.2)] text-[#E57373] cursor-pointer font-body"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── Add Picker ───────────────────────────────────────────────────────────────

function AddPicker({ sessionKey, allExercises, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('')

  const muscles = [...new Set(allExercises.map(e => e.muscle_group))].sort()

  const filtered = allExercises.filter(e => {
    const matchSearch = !search || (e.name_pl || e.name).toLowerCase().includes(search.toLowerCase())
    const matchMuscle = !muscleFilter || e.muscle_group === muscleFilter
    return matchSearch && matchMuscle
  })

  return (
    <div className="fixed inset-0 z-[200] bg-[rgba(6,9,18,0.96)] flex flex-col">
      <div className="pt-4 px-5 pb-3 bg-[rgba(10,14,26,0.95)] border-b border-gold/15">
        <div className="flex items-center gap-3 mb-2.5">
          <button onClick={onClose} className="bg-none border-none cursor-pointer text-gold/70 text-[1.3rem] p-0">←</button>
          <div>
            <div className="text-[11px] text-gold/50 uppercase tracking-widest">Dodaj ćwiczenie</div>
            <div className="text-sm text-[#e8e8e8] font-medium">Sesja {sessionKey}</div>
          </div>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj ćwiczenia..."
          autoFocus
          className="w-full py-2.5 px-4 bg-white/[0.05] border border-gold/20 rounded-lg outline-none text-[#e8e8e8] font-body text-sm box-border mb-2"
        />
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setMuscleFilter('')}
            className="text-[10px] px-2.5 py-1 rounded-full border transition"
            style={{ borderColor: !muscleFilter ? 'rgba(212,181,112,0.5)' : 'rgba(212,181,112,0.15)', color: !muscleFilter ? '#D4B570' : '#666', background: !muscleFilter ? 'rgba(212,181,112,0.08)' : 'transparent' }}
          >
            Wszystkie
          </button>
          {muscles.map(m => (
            <button
              key={m}
              onClick={() => setMuscleFilter(m === muscleFilter ? '' : m)}
              className="text-[10px] px-2.5 py-1 rounded-full border transition"
              style={{ borderColor: muscleFilter === m ? 'rgba(212,181,112,0.5)' : 'rgba(212,181,112,0.15)', color: muscleFilter === m ? '#D4B570' : '#666', background: muscleFilter === m ? 'rgba(212,181,112,0.08)' : 'transparent' }}
            >
              {MUSCLE_PL[m] || m}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="p-12 text-center text-[#555] text-[13px]">Brak wyników</div>
        )}
        {filtered.map(ex => (
          <button
            key={ex.id}
            onClick={() => { onSelect(sessionKey, ex); onClose() }}
            className="w-full flex items-center justify-between py-3.5 px-5 bg-none border-none border-b border-white/[0.04] cursor-pointer text-left hover:bg-gold/[0.05] transition"
          >
            <div>
              <div className="text-sm text-[#e8e8e8] font-medium mb-0.5">{ex.name_pl || ex.name}</div>
              <div className="text-[11px] text-[#555]">
                {MUSCLE_PL[ex.muscle_group] || ex.muscle_group}
                {ex.stretch_position && <span className="text-[rgba(82,183,136,0.7)] ml-1.5">· stretch</span>}
                {ex.unilateral && <span className="text-[rgba(100,181,246,0.7)] ml-1.5">· unilateral</span>}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-[11px] text-gold/60 px-2 py-0.5 rounded bg-gold/[0.08]">SFR {ex.sfr_rating}</div>
              <div className="text-gold text-lg">+</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ sessionKey, session, onUpdate, onRemove, onSwap, onAdd, allExercises }) {
  return (
    <div className="bg-gradient-to-br from-[#131f36] to-[#0f1a2e] border border-gold/15 rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,196,148,0.3)] to-transparent" />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center font-display text-lg font-bold text-[#d4c494]">
          {sessionKey}
        </div>
        <div>
          <div className="text-sm font-medium text-[#e8e8e8]">
            Sesja {sessionKey}
            {session.isDeload && <span className="ml-2 text-[11px] text-[#64B5F6]">🔄 Deload</span>}
          </div>
          <div className="text-[11px] text-gold/50">
            {session.exercises.length} ćwiczeń · {session.exercises.reduce((s, e) => s + (e.sets || 0), 0)} serii
          </div>
          {(() => {
            const totalSets = session.exercises.reduce((s, e) => s + (e.sets || 0), 0)
            const estMin = Math.round(totalSets * 3.5 + (session.exercises?.length || 0) * 5)
            if (estMin > 90) return (
              <div className="text-[11px] text-[#E8A020] mt-1">
                ⚠ Sesja może być zbyt długa (~{estMin} min)
              </div>
            )
            return null
          })()}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {session.exercises.map((ex, i) => (
          <ExerciseRow
            key={i}
            ex={ex}
            sessionKey={sessionKey}
            exIdx={i}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onSwap={onSwap}
            allExercises={allExercises}
          />
        ))}
        <button
          onClick={() => onAdd(sessionKey)}
          className="mt-2 w-full py-2 rounded-lg bg-transparent border border-dashed border-gold/20 text-gold/50 text-xs cursor-pointer font-body hover:border-gold/40 hover:text-gold/70 transition"
        >
          + Dodaj ćwiczenie
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PlanBuilder({ client, questionnaire, exercises = [], clientId, existingPlan = null }) {
  const router = useRouter()
  const [plan, setPlan]           = useState(null)
  const [planName, setPlanName]   = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [showDeload, setShowDeload] = useState(false)
  const [swapTarget, setSwapTarget] = useState(null)
  const [addTarget, setAddTarget] = useState(null)

  useEffect(() => {
    if (existingPlan) {
      setPlan(existingPlan.plan_data)
      setPlanName(existingPlan.name)
    } else if (questionnaire) {
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

  function addExercise(sessionKey, exercise) {
    setPlan(prev => {
      const sessions = { ...prev.sessions }
      const exs = [...sessions[sessionKey].exercises]
      exs.push({
        exercise_id:      exercise.id,
        name:             exercise.name,
        name_pl:          exercise.name_pl || exercise.name,
        muscle_group:     exercise.muscle_group,
        compound:         exercise.compound ?? false,
        stretch_position: exercise.stretch_position ?? false,
        sfr_rating:       exercise.sfr_rating,
        unilateral:       exercise.unilateral ?? false,
        sets:             3,
        rep_range:        '8-12',
        rir_target:       prev?.weekly_progression?.[0]?.rir ?? 2,
        note:             '+ dodane ręcznie',
      })
      sessions[sessionKey] = { ...sessions[sessionKey], exercises: exs }
      return { ...prev, sessions }
    })
  }

  function openSwap(sessionKey, exIdx, exercise) {
    setSwapTarget({ sessionKey, exIdx, exercise })
  }

  function confirmSwap(newExercise) {
    const { sessionKey, exIdx, exercise: oldEx } = swapTarget
    setPlan(prev => {
      const sessions = { ...prev.sessions }
      const exs = [...sessions[sessionKey].exercises]
      exs[exIdx] = {
        ...newExercise,
        sets:       oldEx.sets,
        rep_range:  oldEx.rep_range,
        rir_target: oldEx.rir_target,
        progression: oldEx.progression,
        name_pl:    newExercise.name_pl || newExercise.name,
      }
      sessions[sessionKey] = { ...sessions[sessionKey], exercises: exs }
      return { ...prev, sessions }
    })
    setSwapTarget(null)
  }

  async function handleSave() {
    if (!planName.trim()) { alert('Podaj nazwę planu'); return }
    setSaving(true)
    const supabase = createClient()

    await supabase
      .from('training_plans')
      .update({ is_active: false })
      .eq('client_id', clientId)
      .eq('is_active', true)

    const { error } = await supabase.from('training_plans').insert({
      client_id:  clientId,
      name:       planName,
      goal:       plan.goal,
      split:      plan.split_name,
      plan_data:  plan,
      is_active:  true,
      current_week: 1,
    })

    setSaving(false)
    if (!error) {
      setSaved(true)
      try {
        await fetch('/api/email/plan-ready', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId }),
        })
      } catch (e) { console.error('Email error:', e) }
      setTimeout(() => router.push(`/dashboard/client/${clientId}`), 1500)
    } else {
      alert('Błąd zapisu: ' + error.message)
    }
  }

  if (saved) return (
    <div className="min-h-screen flex items-center justify-center font-body">
      <div className="text-center">
        <div className="font-display text-6xl text-gold mb-4">✓</div>
        <h2 className="font-display text-[28px] text-[#e8e8e8] m-0 mb-2">
          Plan zapisany!
        </h2>
        <p className="text-gold/60 text-sm mb-2">{planName}</p>
        <p className="text-[#555] text-[13px]">Wracam do klienta…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen text-[#e8e8e8] font-body">
      {swapTarget && (
        <SwapPicker
          currentExercise={swapTarget.exercise}
          allExercises={exercises}
          onSelect={confirmSwap}
          onClose={() => setSwapTarget(null)}
        />
      )}

      {addTarget && (
        <AddPicker
          sessionKey={addTarget}
          allExercises={exercises}
          onSelect={addExercise}
          onClose={() => setAddTarget(null)}
        />
      )}

      {/* Topbar */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-gold/15 px-6 h-14 flex items-center gap-4">
        <button
          onClick={() => router.push(`/dashboard/client/${clientId}`)}
          className="text-[13px] text-gold/70 bg-none border-none cursor-pointer font-body p-0 hover:text-gold transition"
        >
          ← {client.full_name || 'Klient'}
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold text-[#d4c494] tracking-[0.35em]">
            ARETÉ
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-gold/20 text-gold/40 tracking-widest">α 0.1</span>
        </div>
      </nav>

      <main className="max-w-[860px] mx-auto px-6 py-8 pb-20">

        {/* Header */}
        <div className="mb-8 border-b border-gold/15 pb-6">
          <p className="text-[10px] tracking-[0.3em] text-gold/60 uppercase m-0 mb-1.5">
            Program Builder
          </p>
          <h1 className="font-display text-[32px] font-semibold text-[#e8e8e8] m-0 mb-4">
            Nowy plan — {client.full_name}
          </h1>
          <input
            value={planName}
            onChange={e => setPlanName(e.target.value)}
            placeholder="Nazwa planu..."
            className="w-full py-2.5 px-3.5 rounded-lg bg-white/[0.04] border border-gold/20 text-[#e8e8e8] text-[15px] font-body box-border outline-none focus:border-gold/40"
          />
        </div>

        {!questionnaire && (
          <div className="border border-[rgba(229,115,115,0.3)] rounded-[10px] p-5 mb-6 bg-[rgba(229,115,115,0.05)]">
            <div className="text-sm text-[#E57373] mb-1">Brak ankiety</div>
            <div className="text-[13px] text-[rgba(229,115,115,0.7)]">
              Klient nie wypełnił jeszcze ankiety. Plan zostanie wygenerowany z domyślnymi parametrami.
            </div>
          </div>
        )}

        {plan && (
          <>
            {/* COACH SUMMARY — szczegółowe */}
            <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-6 mb-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Analiza planu — widok trenera</p>

              {/* Rationale */}
              {plan.rationale && (
                <div className="border-l-2 border-gold/30 pl-4 mb-5">
                  <p className="text-sm text-warm/80 leading-relaxed">{plan.rationale}</p>
                </div>
              )}

              {/* Volume per muscle */}
              <div className="mb-5">
                <p className="text-[11px] text-muted uppercase tracking-widest mb-3">Objętość tygodniowa per partia</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(() => {
                    const muscleLabels = {
                      chest: 'Klatka', back: 'Plecy', shoulders_lat: 'Barki boczne',
                      shoulders_rear: 'Barki tylne', biceps: 'Biceps', triceps: 'Triceps',
                      quads: 'Czwórgłowe', hamstrings: 'Dwugłowe', glutes: 'Pośladki',
                      calves: 'Łydki', abs: 'Brzuch',
                    }
                    const weeklyVolume = {}
                    Object.values(plan.sessions || {}).forEach(session => {
                      (session.exercises || []).forEach(ex => {
                        const m = ex.muscle_group
                        weeklyVolume[m] = (weeklyVolume[m] || 0) + (ex.sets || 0)
                      })
                    })
                    const MEV = {
                      chest:8, back:8, quads:8, hamstrings:6, glutes:8,
                      shoulders_lat:6, shoulders_rear:6, biceps:6, triceps:6,
                      abs:6, calves:4, forearms:4,
                    }
                    return Object.entries(weeklyVolume).sort((a,b) => b[1]-a[1]).map(([muscle, sets]) => {
                      const isPriority = plan.priority_muscles?.includes(muscle)
                      const mev = MEV[muscle] || 0
                      const belowMev = sets < mev
                      return (
                        <div key={muscle} className="bg-bg-deep rounded-lg p-2.5 flex justify-between items-center"
                          style={{ border: belowMev ? '1px solid rgba(239,107,115,0.3)' : 'transparent' }}>
                          <span className="text-xs text-muted">
                            {muscleLabels[muscle] || muscle}
                            {isPriority && <span className="text-gold ml-1">★</span>}
                            {belowMev && <span className="text-danger ml-1">⚠ MEV</span>}
                          </span>
                          <span className="text-sm font-semibold" style={{ color: belowMev ? '#EF6B73' : '#e8e8e8' }}>
                            {sets} serii
                          </span>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>

              {/* Recovery modifier info */}
              {plan.recovery_modifier && plan.recovery_modifier !== 1 && (
                <div className="text-xs text-muted border border-[rgba(212,181,112,0.1)] rounded-lg p-3 mb-4">
                  {plan.recovery_modifier < 1
                    ? `⚠ Objętość zredukowana o ${Math.round((1 - plan.recovery_modifier) * 100)}% — niska regeneracja klienta`
                    : `✓ Objętość zwiększona o ${Math.round((plan.recovery_modifier - 1) * 100)}% — dobra regeneracja`
                  }
                </div>
              )}

              {/* Session summary */}
              <div>
                <p className="text-[11px] text-muted uppercase tracking-widest mb-3">Podsumowanie sesji</p>
                <div className="space-y-2">
                  {Object.entries(plan.sessions || {}).map(([key, session]) => {
                    const totalSets = (session.exercises || []).reduce((sum, ex) => sum + (ex.sets || 0), 0)
                    const estTime = Math.round(totalSets * 3.5 + (session.exercises?.length || 0) * 5)
                    return (
                      <div key={key} className="flex items-center justify-between text-xs py-1.5 border-b border-[rgba(212,181,112,0.06)] last:border-0">
                        <span className="text-warm font-medium">Sesja {key} — {session.name}</span>
                        <div className="flex gap-4 text-muted">
                          <span>{session.exercises?.length || 0} ćwiczeń</span>
                          <span>{totalSets} serii</span>
                          <span>~{estTime} min</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* CLIENT SUMMARY — podstawowe, do pokazania klientowi */}
            <div className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-5 mb-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Info dla klienta</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {Object.entries(plan.sessions || {}).map(([key, session]) => {
                  const totalSets = (session.exercises || []).reduce((sum, ex) => sum + (ex.sets || 0), 0)
                  return (
                    <div key={key} className="bg-bg-deep rounded-xl p-3 text-center">
                      <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Sesja {key}</p>
                      <p className="text-sm font-medium text-warm mb-0.5">{session.name}</p>
                      <p className="text-xs text-muted">{session.exercises?.length} ćwiczeń · {totalSets} serii</p>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted text-center">
                Łącznie: {Object.values(plan.sessions || {}).reduce((sum, s) => sum + (s.exercises || []).reduce((s2, ex) => s2 + (ex.sets || 0), 0), 0)} serii / tydzień
              </p>
            </div>

            {/* RIR progression */}
            <div className="bg-gold/[0.04] border border-gold/[0.12] rounded-[10px] p-4 mb-6">
              <div className="text-[11px] text-gold/60 uppercase tracking-widest mb-2.5">
                Progresja mezocyklu (RIR)
              </div>
              <div className="flex gap-1.5">
                {plan.weekly_progression?.map(w => (
                  <div
                    key={w.week}
                    className={`flex-1 text-center py-1.5 px-1 rounded-md ${
                      w.isDeload
                        ? 'bg-[rgba(100,181,246,0.1)] border border-[rgba(100,181,246,0.2)]'
                        : 'bg-gold/[0.08] border border-gold/15'
                    }`}
                  >
                    <div className={`text-[9px] mb-0.5 ${w.isDeload ? 'text-[#64B5F6]' : 'text-gold/50'}`}>
                      {w.isDeload ? 'Deload' : `Tyg ${w.week}`}
                    </div>
                    <div className={`text-sm font-semibold ${w.isDeload ? 'text-[#64B5F6]' : 'text-[#d4c494]'}`}>
                      {w.isDeload ? '—' : `RIR ${w.rir}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="text-[11px] text-[#555] mb-4">
              <span className="text-[#64B5F6] mr-2">⇄</span> Zamień ćwiczenie
              <span className="ml-4 mr-2">Edytuj</span> Serie / powt. / RIR
            </div>

            {/* Toggle deload */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setShowDeload(s => !s)}
                className={`py-1.5 px-3.5 rounded-full text-xs cursor-pointer font-body ${
                  showDeload
                    ? 'bg-[rgba(100,181,246,0.15)] border border-[rgba(100,181,246,0.3)] text-[#64B5F6]'
                    : 'bg-transparent border border-gold/20 text-gold/60'
                }`}
              >
                {showDeload ? '▼ Ukryj deload' : '▶ Pokaż tydzień deload'}
              </button>
            </div>

            {/* Sessions */}
            <div className="flex flex-col gap-4">
              {Object.entries(showDeload ? plan.deload_sessions : plan.sessions).map(([key, session]) => (
                <SessionCard
                  key={key}
                  sessionKey={key}
                  session={session}
                  onUpdate={updateExercise}
                  onRemove={removeExercise}
                  onSwap={openSwap}
                  onAdd={key => setAddTarget(key)}
                  allExercises={exercises}
                />
              ))}
            </div>

            {/* Excluded */}
            {plan.excluded_exercises?.length > 0 && (
              <div className="mt-5 py-3 px-4 rounded-lg bg-[rgba(229,115,115,0.05)] border border-[rgba(229,115,115,0.15)]">
                <div className="text-[11px] text-[#E57373] mb-1.5 uppercase tracking-wider">
                  Wykluczone automatycznie
                </div>
                <div className="text-xs text-[rgba(229,115,115,0.7)]">
                  {plan.excluded_exercises.join(' · ')}
                </div>
              </div>
            )}

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-4 rounded-full mt-8 border-none text-sm font-bold font-body tracking-[0.12em] uppercase ${
                saving
                  ? 'bg-gold/15 text-gold/50 cursor-not-allowed'
                  : 'bg-gradient-to-br from-[#b8a677] to-[#d4c494] text-[#0f1a2e] cursor-pointer'
              }`}
            >
              {saving ? 'Zapisywanie...' : 'Zapisz plan i aktywuj'}
            </button>
          </>
        )}

        {!plan && !questionnaire && (
          <button
            onClick={() => {
              const generated = generatePlan(null, exercises)
              setPlan(generated)
            }}
            className="py-3 px-7 rounded-full bg-transparent border border-gold/30 text-gold text-[13px] cursor-pointer font-body hover:bg-gold/[0.05] transition"
          >
            Generuj z domyślnymi parametrami
          </button>
        )}
      </main>
    </div>
  )
}
