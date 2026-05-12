'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { IconPlan, IconReport, IconAttention, IconKnowledge, IconTraining, IconClients } from '@/lib/GreekIcons'
import NutritionPanel from './NutritionPanel'
import MealPlanBuilder from './MealPlanBuilder'
import dynamic from 'next/dynamic'
const ClientReport = dynamic(() => import('./ClientReport'), { ssr: false })

const TIER_COLORS = {
  paideia: { color: '#a07850', bg: 'rgba(160,120,80,0.12)', border: 'rgba(160,120,80,0.3)' },
  askesis: { color: '#8a9db5', bg: 'rgba(138,157,181,0.12)', border: 'rgba(138,157,181,0.3)' },
  arete:   { color: '#b8a677', bg: 'rgba(184,166,119,0.12)', border: 'rgba(184,166,119,0.35)' },
}
const STATUS_COLORS = {
  active:    { color: '#4caf50', label: 'Aktywny' },
  paused:    { color: '#e8a020', label: 'Wstrzymany' },
  completed: { color: '#8a9db5', label: 'Zakończony' },
  lead:      { color: '#64b5f6', label: 'Lead' },
}

function getInitials(name, email) {
  if (name) {
    const p = name.trim().split(' ')
    return p.length >= 2 ? (p[0][0] + p[p.length-1][0]).toUpperCase() : name.slice(0,2).toUpperCase()
  }
  return (email || '??').slice(0,2).toUpperCase()
}

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── FAZA 6: Hypertrophy Engine helpers ──────────────────────────────────────

function calculateVolumeByMuscle(logs) {
  const byMuscle = {}

  logs.forEach(log => {
    const exercises = log.exercises || []
    exercises.forEach(ex => {
      const muscle = ex.muscle_group || 'Inne'
      if (!byMuscle[muscle]) {
        byMuscle[muscle] = { sets: 0, volume_kg: 0, totalRIR: 0, count: 0 }
      }
      const sets = ex.sets || []
      sets.forEach(s => {
        byMuscle[muscle].sets += 1
        byMuscle[muscle].volume_kg += (s.weight_kg || 0) * (s.reps || 0)
        if (s.rir_actual != null) {
          byMuscle[muscle].totalRIR += s.rir_actual
          byMuscle[muscle].count += 1
        }
      })
    })
  })

  return Object.entries(byMuscle)
    .map(([muscle, data]) => ({
      muscle,
      sets: data.sets,
      volume_kg: Math.round(data.volume_kg),
      avgRIR: data.count > 0 ? (data.totalRIR / data.count).toFixed(1) : '—',
    }))
    .sort((a, b) => b.volume_kg - a.volume_kg)
}

function calculateCompliance(logs, plans) {
  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

  const recentLogs = logs.filter(log => {
    const date = new Date(log.session_date)
    return date >= fourWeeksAgo
  })

  const activePlan = plans.find(p => p.is_active)
  if (!activePlan) return null

  const planData = activePlan.plan_data || activePlan.plan_json || {}
  const sessions = planData.sessions || {}
  const sessionsPerWeek = typeof sessions === 'object' && !Array.isArray(sessions)
    ? Object.keys(sessions).length
    : (Array.isArray(sessions) ? sessions.length : 0)
  if (!sessionsPerWeek) return null

  const expectedSessions = sessionsPerWeek * 4

  const completedSessions = recentLogs.filter(log => log.completed !== false).length
  const compliance = Math.round((completedSessions / expectedSessions) * 100)

  return { compliance, completed: completedSessions, expected: expectedSessions }
}

function calculatePerformanceTrends(logs) {
  const byExercise = {}

  logs.forEach(log => {
    const exercises = log.exercises || []
    exercises.forEach(ex => {
      const id = ex.exercise_id || ex.name
      if (!byExercise[id]) {
        byExercise[id] = { name: ex.name, e1rms: [] }
      }
      const sets = ex.sets || []
      sets.forEach(s => {
        if (s.estimated_1rm) {
          byExercise[id].e1rms.push({ date: log.session_date, value: s.estimated_1rm })
        }
      })
    })
  })

  const trends = Object.entries(byExercise).map(([id, data]) => {
    const sorted = data.e1rms.sort((a, b) => new Date(b.date) - new Date(a.date))
    const latest = sorted[0]?.value || 0
    const previous = sorted[1]?.value || latest

    let trend = '→'
    if (latest > previous) trend = '↑'
    if (latest < previous) trend = '↓'

    return {
      exercise: data.name,
      e1rm: latest,
      trend,
      change: latest - previous,
    }
  })

  return trends.sort((a, b) => b.e1rm - a.e1rm).slice(0, 5)
}

function calculateRirAdherence(logs) {
  let total = 0, withinRange = 0
  logs.forEach(log => {
    (log.exercises || []).forEach(ex => {
      (ex.sets || []).forEach(s => {
        if (s.rir_actual != null && s.rir_target != null) {
          total++
          if (Math.abs(s.rir_actual - s.rir_target) <= 1) withinRange++
        }
      })
    })
  })
  if (total === 0) return null
  return { pct: Math.round((withinRange / total) * 100), total }
}

function analyzeWeightTrend(weightLogs) {
  if (!weightLogs || weightLogs.length < 3) return null
  const sorted = [...weightLogs].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))
  const last7 = sorted.slice(0, 7)
  const prev7 = sorted.slice(7, 14)
  const avg7 = last7.reduce((s, l) => s + parseFloat(l.weight_kg), 0) / last7.length
  const avg14 = prev7.length >= 3 ? prev7.reduce((s, l) => s + parseFloat(l.weight_kg), 0) / prev7.length : null
  const delta = avg14 ? parseFloat((avg7 - avg14).toFixed(2)) : null
  const deltaPct = avg14 ? parseFloat(((delta / avg14) * 100).toFixed(2)) : null
  let suggestion = null, suggestionColor = '#8F9AAF'
  if (deltaPct !== null) {
    if (deltaPct < -1.0) { suggestion = '↓ Spada za szybko — rozważ +100–200 kcal'; suggestionColor = '#E8A020' }
    else if (deltaPct >= -1.0 && deltaPct <= -0.3) { suggestion = '✓ Optymalny spadek — zostaw kalorie'; suggestionColor = '#47D18C' }
    else if (deltaPct > -0.3 && deltaPct < 0.3) { suggestion = '→ Waga stoi — sprawdź adherencję, rozważ -100–200 kcal'; suggestionColor = '#E8A020' }
    else if (deltaPct >= 0.3) { suggestion = '↑ Waga rośnie — jeśli redukcja: -100–200 kcal'; suggestionColor = '#EF6B73' }
  }
  return { avg7: avg7.toFixed(1), avg14: avg14?.toFixed(1), delta, deltaPct, suggestion, suggestionColor, dataPoints: last7.length }
}

function calculateWeeklyVolume(logs) {
  const byMuscle = {}
  logs.forEach(log => {
    (log.exercises || []).forEach(ex => {
      const m = ex.muscle_group || 'inne'
      if (!byMuscle[m]) byMuscle[m] = 0
      byMuscle[m] += (ex.sets || []).length
    })
  })
  return Object.entries(byMuscle)
    .map(([muscle, sets]) => ({ muscle, sets }))
    .sort((a, b) => b.sets - a.sets)
    .slice(0, 8)
}

function Pill({ children, color, bg, border }) {
  return (
    <span
      className="text-[11px] px-2.5 py-0.5 rounded-full font-medium tracking-wide"
      style={{
        background: bg || 'rgba(255,255,255,0.05)',
        border: `1px solid ${border || 'rgba(255,255,255,0.12)'}`,
        color: color || '#a0a0a0',
      }}
    >
      {children}
    </span>
  )
}

function Section({ title, children, action }) {
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="font-display text-lg font-semibold text-[#e8e8e8] m-0">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div className="py-8 px-5 text-center border border-dashed border-white/[0.08] rounded-[10px] text-[#444] text-[13px]">
      <div className="text-2xl mb-2 opacity-30">∅</div>
      {text}
    </div>
  )
}

// ─── Ankieta viewer ───────────────────────────────────────────────────────────

const BLOCK_LABELS = {
  // Dane podstawowe
  imie:                  'Imię i nazwisko',
  wiek:                  'Wiek',
  plec:                  'Płeć',
  wzrost_cm:             'Wzrost (cm)',
  waga_kg:               'Waga (kg)',
  // Cel
  cel:                   'Główny cel',
  cel_wagowy:            'Cel wagowy',
  deadline:              'Deadline',
  // Priorytety
  priority_muscles:      'Priorytety sylwetkowe',
  avoid_growth_muscles:  'Partie do nierozbudowywania',
  // Doświadczenie
  staz:                  'Staż treningowy',
  knows_rir:             'Znajomość RIR',
  aktualny_split:        'Aktualny split',
  pr_squat:              'PR Przysiad',
  pr_bench:              'PR Wyciskanie',
  pr_deadlift:           'PR Martwy ciąg',
  pr_ohp:                'PR OHP',
  pr_row:                'PR Wiosłowanie',
  // Dostępność
  dni_tydzien:           'Dni / tydzień',
  czas_sesji:            'Czas sesji',
  consecutive_days:      'Dni z rzędu',
  // Sprzęt
  equipment:             'Dostępny sprzęt',
  preference_machines:   'Preferencja sprzętu',
  training_style:        'Styl treningu',
  cwiczenia_unikane:     'Ćwiczenia unikane',
  // Ból
  pain_areas:            'Obszary bólu',
  pain_level:            'Poziom bólu',
  kontuzje_przeszle:     'Przeszłe kontuzje',
  mobilnosc:             'Mobilność',
  // Regeneracja
  sen:                   'Sen',
  sleep_quality:         'Jakość snu',
  stress_level:          'Poziom stresu',
  praca:                 'Typ pracy',
  cardio_typ:            'Cardio',
  cardio_ile:            'Cardio ile razy',
  // Żywienie
  dieta_aktualna:        'Dieta aktualna',
  alergie:               'Alergie',
  suplementy:            'Suplementy',
  // Inne
  dodatkowe_info:        'Dodatkowe info',
  dysproporcja_obszar:   'Asymetria / dysproporcje',
  dysproporcja_opis:     'Opis asymetrii',
}

const BLOCKS_ORDER = [
  {
    title: 'Dane podstawowe',
    keys: ['imie', 'wiek', 'plec', 'wzrost_cm', 'waga_kg'],
  },
  {
    title: 'Cel treningowy',
    keys: ['cel', 'cel_wagowy', 'deadline'],
  },
  {
    title: 'Priorytety sylwetkowe',
    keys: ['priority_muscles', 'avoid_growth_muscles'],
  },
  {
    title: 'Doświadczenie',
    keys: ['staz', 'knows_rir', 'aktualny_split', 'pr_squat', 'pr_bench', 'pr_deadlift', 'pr_ohp', 'pr_row'],
  },
  {
    title: 'Dostępność',
    keys: ['dni_tydzien', 'czas_sesji', 'consecutive_days'],
  },
  {
    title: 'Sprzęt i preferencje',
    keys: ['equipment', 'preference_machines', 'training_style', 'cwiczenia_unikane'],
  },
  {
    title: 'Ból i kontuzje',
    keys: ['pain_areas', 'pain_level', 'kontuzje_przeszle', 'mobilnosc'],
  },
  {
    title: 'Regeneracja i styl życia',
    keys: ['sen', 'sleep_quality', 'stress_level', 'praca', 'cardio_typ', 'cardio_ile'],
  },
  {
    title: 'Żywienie',
    keys: ['dieta_aktualna', 'alergie', 'suplementy'],
  },
  {
    title: 'Asymetria i dysproporcje',
    keys: ['dysproporcja_obszar', 'dysproporcja_opis'],
  },
  {
    title: 'Dodatkowe',
    keys: ['dodatkowe_info'],
  },
]

function AnkietaViewer({ questionnaire }) {
  if (!questionnaire) return (
    <div className="py-8 px-5 text-center border border-dashed border-white/[0.08] rounded-[10px]">
      <div className="text-2xl mb-2 opacity-30">∅</div>
      <div className="text-[#444] text-[13px]">Klient nie wypełnił jeszcze ankiety.</div>
    </div>
  )

  const data = questionnaire.data || {}

  const formatValue = (val) => {
    if (Array.isArray(val)) return val.join(', ')
    if (typeof val === 'boolean') return val ? 'Tak' : 'Nie'
    return val
  }

  return (
    <div>
      <span className="text-xs text-muted">
        Wypełniono: {questionnaire?.submitted_at || questionnaire?.created_at
          ? new Date(questionnaire?.submitted_at || questionnaire?.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
          : 'Brak daty'}
      </span>
      {BLOCKS_ORDER.map(block => {
        const entries = block.keys
          .map(k => ({ label: BLOCK_LABELS[k] || k, value: data[k] }))
          .filter(e => e.value !== undefined && e.value !== '' && !(Array.isArray(e.value) && e.value.length === 0))
        if (entries.length === 0) return null
        return (
          <div key={block.title} className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-4 mb-2.5">
            <div className="font-display text-sm text-gold font-semibold mb-3 pb-2 border-b border-white/[0.05]">
              {block.title}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
              {entries.map(({ label, value }) => (
                <div key={label} className="bg-white/[0.03] rounded-md p-2">
                  <div className="text-[10px] text-[#555] mb-1 uppercase tracking-widest">{label}</div>
                  <div className="text-[13px] text-[#e8e8e8] leading-snug">{formatValue(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Check-in card with feedback ─────────────────────────────────────────────

function CheckinCard({ ci, onFeedbackSaved }) {
  const [open, setOpen]     = useState(false)
  const [text, setText]     = useState(ci.coach_feedback || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const hasFeedback = !!ci.coach_feedback

  async function saveFeedback() {
    if (!text.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('check_ins')
      .update({ coach_feedback: text.trim() })
      .eq('id', ci.id)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setOpen(false)
      onFeedbackSaved?.(ci.id, text.trim())
      try {
        await fetch('/api/email/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: ci.client_id,
            feedbackText: text.trim(),
            weekNumber: ci.week_number,
          }),
        })
      } catch (e) { console.error('Email error:', e) }
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div
      className="bg-[#1a1a1a] rounded-[10px] p-4"
      style={{ border: `1px solid ${hasFeedback ? 'rgba(184,166,119,0.15)' : 'rgba(239,107,115,0.2)'}` }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2.5">
          <span className="font-display text-base text-gold font-semibold">Tydzień {ci.week_number}</span>
          {hasFeedback ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 border border-success/25 text-success tracking-wider">
              Odpowiedziano
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger/10 border border-danger/25 text-danger tracking-wider">
              Oczekuje
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#555]">{formatDate(ci.submitted_at || ci.created_at)}</span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: 'Masa ciała',  value: ci.body_weight ? `${ci.body_weight} kg` : '—' },
          { label: 'Energia',     value: ci.energy_level ? `${ci.energy_level}/10` : '—' },
          { label: 'Sen',         value: ci.sleep_quality ? `${ci.sleep_quality}/10` : '—' },
          { label: 'Zakwasy',     value: ci.soreness_level ? `${ci.soreness_level}/10` : '—' },
          { label: 'Adherencja',  value: ci.adherence_pct != null ? `${ci.adherence_pct}%` : '—' },
        ].map(m => (
          <div key={m.label} className="bg-white/[0.03] rounded-md p-2">
            <div className="text-[10px] text-[#555] mb-0.5">{m.label}</div>
            <div className="text-sm text-[#e8e8e8] font-medium">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Client notes */}
      {ci.client_notes && (
        <div className="bg-white/[0.02] rounded-md p-2.5 mb-2.5 border-l-2 border-gold/30">
          <div className="text-[10px] text-[#555] mb-1">Notatki klienta</div>
          <div className="text-[13px] text-[#a0a0a0] leading-relaxed">{ci.client_notes}</div>
        </div>
      )}

      {/* Existing feedback */}
      {hasFeedback && !open && (
        <div className="bg-gold/[0.05] rounded-md p-2.5 mb-2.5 border-l-2 border-gold/40">
          <div className="text-[10px] text-gold mb-1">Twój feedback</div>
          <div className="text-[13px] text-[#a0a0a0] leading-relaxed">{ci.coach_feedback}</div>
        </div>
      )}

      {/* Feedback form */}
      {open && (
        <div className="mb-2.5">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Napisz feedback dla klienta — korekty planu, wskazówki, motywacja..."
            rows={4}
            className="w-full p-2.5 rounded-lg bg-white/[0.04] border border-gold/25 text-[#e8e8e8] text-[13px] font-body box-border outline-none resize-y leading-relaxed mb-2 focus:border-gold/50"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={saveFeedback}
              disabled={saving || !text.trim()}
              className={`flex-1 py-2 rounded-lg border-none text-[13px] font-bold font-body tracking-widest ${
                saving
                  ? 'bg-gold/30 cursor-not-allowed text-gold/60'
                  : 'bg-gradient-to-br from-[#b8a677] to-[#d4c494] cursor-pointer text-[#0f1a2e]'
              }`}
            >
              {saving ? 'Zapisuję...' : 'Wyślij feedback'}
            </button>
            <button
              onClick={() => { setOpen(false); setText(ci.coach_feedback || '') }}
              className="py-2 px-4 rounded-lg bg-transparent border border-white/10 text-[#666] text-[13px] cursor-pointer font-body"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Action button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-2 rounded-lg bg-transparent text-xs cursor-pointer font-body tracking-widest transition-all hover:bg-gold/[0.06]"
          style={{
            border: `1px solid ${hasFeedback ? 'rgba(184,166,119,0.2)' : 'rgba(239,107,115,0.3)'}`,
            color: hasFeedback ? 'rgba(184,166,119,0.6)' : '#EF6B73',
          }}
        >
          {hasFeedback ? '✎ Edytuj feedback' : '+ Dodaj feedback'}
        </button>
      )}

      {/* Saved confirmation */}
      {saved && (
        <div className="mt-2 text-center text-xs text-success font-body">
          ✓ Feedback wysłany
        </div>
      )}
    </div>
  )
}

// ─── Questionnaire Tab Component ──────────────────────────────────────────────

function QuestionnaireTab({ questionnaire, questionnaires, clientId }) {
  const [expandedIdx, setExpandedIdx] = useState(0)
  const [editingIdx, setEditingIdx] = useState(null)
  const [requesting, setRequesting] = useState(false)
  const [requested, setRequested] = useState(false)
  const [editForm, setEditForm] = useState({})

  const allQ = questionnaires && questionnaires.length > 0 ? questionnaires : questionnaire ? [questionnaire] : []

  async function requestNewQuestionnaire() {
    setRequesting(true)
    const supabase = createClient()
    await supabase
      .from('profiles')
      .update({ questionnaire_requested: true })
      .eq('id', clientId)
    setRequesting(false)
    setRequested(true)
    setTimeout(() => setRequested(false), 3000)
  }

  function startEditing(idx, q) {
    setEditingIdx(idx)
    setEditForm(q.data || {})
  }

  async function saveEdits(qId) {
    const supabase = createClient()
    await supabase
      .from('questionnaires')
      .update({ data: editForm })
      .eq('id', qId)
    setEditingIdx(null)
    window.location.reload()
  }

  function getQuickStats(data) {
    return [
      { label: 'Cel', value: data.cel || '—' },
      { label: 'Staż', value: data.staz || '—' },
      { label: 'Dni/tydzień', value: data.dni_tydzien || '—' },
      { label: 'Czas sesji', value: data.czas_sesji ? `${data.czas_sesji} min` : '—' },
    ]
  }

  return (
    <Section title="Ankieta onboardingowa">
      {/* Akcja: Poproś o nową */}
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="flex-1" />
        <button
          onClick={requestNewQuestionnaire}
          disabled={requesting || requested}
          className="text-xs border px-3 py-1.5 rounded-full transition shrink-0"
          style={{
            borderColor: requested ? 'rgba(71,209,140,0.4)' : 'rgba(212,181,112,0.3)',
            color: requested ? '#47D18C' : '#D4B570',
          }}
        >
          {requested ? '✓ Wysłano prośbę' : requesting ? '...' : '📋 Poproś o nową ankietę'}
        </button>
      </div>

      {/* Historia ankiet — accordion */}
      {allQ.length === 0 ? (
        <div className="py-8 px-5 text-center border border-dashed border-white/[0.08] rounded-[10px]">
          <div className="text-2xl mb-2 opacity-30">∅</div>
          <div className="text-[#444] text-[13px]">Brak ankiety</div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {allQ.map((q, i) => {
            const isExpanded = expandedIdx === i
            const isEditing = editingIdx === i
            const isCurrent = i === 0
            const data = q.data || {}
            const quickStats = getQuickStats(data)

            return (
              <div
                key={q.id}
                className="bg-[#1a1a1a] rounded-[10px] border-2 transition-all overflow-hidden"
                style={{
                  borderColor: isCurrent ? 'rgba(212,181,112,0.4)' : 'rgba(212,181,112,0.15)',
                }}
              >
                {/* Header — zawsze widoczny */}
                <div
                  className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-3"
                  onClick={() => setExpandedIdx(isExpanded ? null : i)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold tracking-wider shrink-0">
                        ★ Aktualna
                      </span>
                    )}
                    {!isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-[#555] tracking-wider shrink-0">
                        Wersja {allQ.length - i}
                      </span>
                    )}
                    <span className="text-[11px] text-[#666]">
                      {new Date(q.submitted_at || q.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] text-muted">·</span>
                    <span className="text-[11px] text-warm">{data.cel || 'Brak celu'}</span>
                    <span className="text-[11px] text-muted">·</span>
                    <span className="text-[11px] text-warm">{data.staz || 'Brak stażu'}</span>
                  </div>
                  <div className="text-[#555] text-sm shrink-0">
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/[0.05]">
                    {/* Quick stats grid */}
                    <div className="grid grid-cols-4 gap-2 mb-4 mt-4">
                      {quickStats.map(stat => (
                        <div key={stat.label} className="bg-white/[0.03] rounded-md p-2">
                          <div className="text-[10px] text-[#555] mb-1 uppercase tracking-widest">{stat.label}</div>
                          <div className="text-[13px] text-[#e8e8e8]">{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Viewer lub editor */}
                    {isEditing ? (
                      <div className="space-y-3">
                        {/* Dane podstawowe */}
                        <div className="bg-white/[0.03] rounded-lg p-3">
                          <div className="text-[10px] text-gold uppercase tracking-widest mb-2">Dane podstawowe</div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Imię"
                              value={editForm.imie || ''}
                              onChange={e => setEditForm({ ...editForm, imie: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                            <input
                              type="number"
                              placeholder="Wiek"
                              value={editForm.wiek || ''}
                              onChange={e => setEditForm({ ...editForm, wiek: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                            <input
                              type="number"
                              placeholder="Wzrost (cm)"
                              value={editForm.wzrost_cm || ''}
                              onChange={e => setEditForm({ ...editForm, wzrost_cm: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                            <input
                              type="number"
                              placeholder="Waga (kg)"
                              value={editForm.waga_kg || ''}
                              onChange={e => setEditForm({ ...editForm, waga_kg: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                          </div>
                        </div>

                        {/* Cel i doświadczenie */}
                        <div className="bg-white/[0.03] rounded-lg p-3">
                          <div className="text-[10px] text-gold uppercase tracking-widest mb-2">Cel i doświadczenie</div>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={editForm.cel || ''}
                              onChange={e => setEditForm({ ...editForm, cel: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            >
                              <option value="">Cel...</option>
                              <option value="Redukcja tkanki tłuszczowej">Redukcja tkanki tłuszczowej</option>
                              <option value="Budowa masy mięśniowej">Budowa masy mięśniowej</option>
                              <option value="Rekompozycja">Rekompozycja</option>
                              <option value="Wzrost siły">Wzrost siły</option>
                              <option value="Zdrowie i kondycja">Zdrowie i kondycja</option>
                            </select>
                            <select
                              value={editForm.staz || ''}
                              onChange={e => setEditForm({ ...editForm, staz: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            >
                              <option value="">Staż...</option>
                              <option value="0-6 miesięcy">0-6 miesięcy</option>
                              <option value="6-12 miesięcy">6-12 miesięcy</option>
                              <option value="1-2 lata">1-2 lata</option>
                              <option value="2-3 lata">2-3 lata</option>
                              <option value="3-5 lat">3-5 lat</option>
                              <option value="5+ lat">5+ lat</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Dni/tydzień"
                              value={editForm.dni_tydzien || ''}
                              onChange={e => setEditForm({ ...editForm, dni_tydzien: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                            <input
                              type="number"
                              placeholder="Czas sesji (min)"
                              value={editForm.czas_sesji || ''}
                              onChange={e => setEditForm({ ...editForm, czas_sesji: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                          </div>
                        </div>

                        {/* Regeneracja */}
                        <div className="bg-white/[0.03] rounded-lg p-3">
                          <div className="text-[10px] text-gold uppercase tracking-widest mb-2">Regeneracja</div>
                          <div className="grid grid-cols-3 gap-2">
                            <select
                              value={editForm.sen || ''}
                              onChange={e => setEditForm({ ...editForm, sen: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            >
                              <option value="">Sen...</option>
                              <option value="less_6">Mniej niż 6h</option>
                              <option value="6_7">6-7h</option>
                              <option value="7_8">7-8h</option>
                              <option value="more_8">Ponad 8h</option>
                            </select>
                            <select
                              value={editForm.stress_level || ''}
                              onChange={e => setEditForm({ ...editForm, stress_level: parseInt(e.target.value) })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            >
                              <option value="">Stres...</option>
                              <option value="1">1 — Bardzo niski</option>
                              <option value="2">2 — Niski</option>
                              <option value="3">3 — Umiarkowany</option>
                              <option value="4">4 — Wysoki</option>
                              <option value="5">5 — Bardzo wysoki</option>
                            </select>
                            <select
                              value={editForm.praca || ''}
                              onChange={e => setEditForm({ ...editForm, praca: e.target.value })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            >
                              <option value="">Typ pracy...</option>
                              <option value="sedentary">Siedząca</option>
                              <option value="light">Lekka aktywna</option>
                              <option value="physical">Fizyczna</option>
                            </select>
                          </div>
                        </div>

                        {/* Priorytety */}
                        <div className="bg-white/[0.03] rounded-lg p-3">
                          <div className="text-[10px] text-gold uppercase tracking-widest mb-2">Priorytety</div>
                          <textarea
                            placeholder="Priorytetowe partie (oddziel przecinkami)"
                            value={Array.isArray(editForm.priority_muscles) ? editForm.priority_muscles.join(', ') : editForm.priority_muscles || ''}
                            onChange={e => setEditForm({ ...editForm, priority_muscles: e.target.value.split(',').map(s => s.trim()) })}
                            rows={2}
                            className="w-full py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none resize-none focus:border-gold/40"
                          />
                        </div>

                        {/* Dodatkowe */}
                        <div className="bg-white/[0.03] rounded-lg p-3">
                          <div className="text-[10px] text-gold uppercase tracking-widest mb-2">Dodatkowe</div>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={editForm.knows_rir ? 'true' : 'false'}
                              onChange={e => setEditForm({ ...editForm, knows_rir: e.target.value === 'true' })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            >
                              <option value="false">Nie zna RIR</option>
                              <option value="true">Zna RIR</option>
                            </select>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              placeholder="Ból (0-10)"
                              value={editForm.pain_level || 0}
                              onChange={e => setEditForm({ ...editForm, pain_level: parseInt(e.target.value) })}
                              className="py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                            <input
                              type="text"
                              placeholder="Partie do nie rozbudowywania (np. calves)"
                              value={Array.isArray(editForm.avoid_growth_muscles) ? editForm.avoid_growth_muscles.join(', ') : ''}
                              onChange={e => setEditForm({ ...editForm, avoid_growth_muscles: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })}
                              className="col-span-2 py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                            <input
                              type="text"
                              placeholder="Ćwiczenia unikane"
                              value={editForm.cwiczenia_unikane || ''}
                              onChange={e => setEditForm({ ...editForm, cwiczenia_unikane: e.target.value })}
                              className="col-span-2 py-1.5 px-2 rounded bg-white/[0.05] border border-white/10 text-[#e8e8e8] text-xs outline-none focus:border-gold/40"
                            />
                          </div>
                        </div>

                        {/* Akcje */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdits(q.id)}
                            className="flex-1 py-2 rounded-lg bg-gradient-to-br from-[#b8a677] to-[#d4c494] text-[#0f1a2e] text-xs font-bold font-body tracking-widest"
                          >
                            Zapisz zmiany
                          </button>
                          <button
                            onClick={() => setEditingIdx(null)}
                            className="py-2 px-4 rounded-lg bg-transparent border border-white/10 text-[#666] text-xs cursor-pointer font-body"
                          >
                            Anuluj
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <AnkietaViewer questionnaire={q} />
                        {isCurrent && (
                          <button
                            onClick={() => startEditing(i, q)}
                            className="w-full mt-3 py-2 rounded-lg bg-transparent border border-gold/20 text-gold text-xs cursor-pointer font-body tracking-widest hover:bg-gold/[0.06] transition"
                          >
                            ✎ Edytuj ankietę
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Section>
  )
}

// ─── Coach Profile Note ────────────────────────────────────────────────────────

function CoachProfileNote({ clientId, initialNote }) {
  const [note, setNote] = useState(initialNote || '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ coach_profile_note: note }).eq('id', clientId)
    setSaving(false)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-[#1a1a1a] border border-gold/15 rounded-[10px] p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-gold uppercase tracking-widest">Notatka coacha</span>
        <div className="flex gap-2 items-center">
          {saved && <span className="text-[10px] text-success">✓ Zapisano</span>}
          <button
            onClick={() => setEditing(e => !e)}
            className="text-[10px] px-2 py-1 rounded border border-gold/20 text-gold/60 hover:text-gold transition"
          >
            {editing ? 'Anuluj' : '✎ Edytuj'}
          </button>
          {note && !editing && (
            <button
              onClick={async () => {
                const supabase = createClient()
                await supabase.from('profiles').update({ coach_profile_note: null }).eq('id', clientId)
                setNote('')
              }}
              className="text-[10px] px-2 py-1 rounded border border-danger/20 text-danger/60 hover:text-danger transition"
            >
              Usuń
            </button>
          )}
        </div>
      </div>
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Notatka widoczna dla klienta w jego panelu — na co zwrócić uwagę, wskazówki, motywacja..."
            rows={3}
            className="w-full py-2 px-3 rounded-lg bg-white/[0.04] border border-gold/20 text-[#e8e8e8] text-sm font-body outline-none resize-none focus:border-gold/40"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 rounded-lg text-xs font-bold font-body"
            style={{ background: 'linear-gradient(135deg,#b8a677,#d4c494)', color: '#0f1a2e' }}
          >
            {saving ? 'Zapisuję...' : 'Zapisz notatkę'}
          </button>
        </div>
      ) : note ? (
        <p className="text-sm text-warm/80 leading-relaxed">{note}</p>
      ) : (
        <p className="text-xs text-muted/50">Brak notatki — kliknij Edytuj aby dodać.</p>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ClientDetail({ client, plans, logs, checkins: initialCheckins, questionnaire, coachName, questionnaires, weightLogs = [], nutritionTargets = null, mealPlan = null, coach_profile_note = null }) {
  const router = useRouter()
  const [tab, setTab] = useState('plans')
  const [checkins, setCheckins] = useState(initialCheckins)
  const [managing, setManaging] = useState(false)
  const [saving, setSaving] = useState(false)

  const tier     = TIER_COLORS[client.package_tier?.toLowerCase()] || {}
  const status   = STATUS_COLORS[client.status] || STATUS_COLORS.lead
  const initials = getInitials(client.full_name, client.email)

  const pendingFeedback = checkins.filter(ci => !ci.coach_feedback).length

  // FAZA 6: Compliance score
  const complianceData = calculateCompliance(logs, plans)
  const rirAdherence = calculateRirAdherence(logs)
  const weightTrend = analyzeWeightTrend(weightLogs)
  const weeklyVolume = calculateWeeklyVolume(logs)

  const TABS = [
    { id: 'plans',         label: 'Plany',           count: plans.length },
    { id: 'logs',          label: 'Treningi',         count: logs.length },
    { id: 'checkins',      label: 'Check-iny',        count: pendingFeedback > 0 ? pendingFeedback : checkins.length, urgent: pendingFeedback > 0 },
    { id: 'questionnaire', label: 'Ankieta',          count: questionnaire ? 1 : 0 },
    { id: 'nutrition',     label: 'Żywienie',         count: nutritionTargets ? 1 : 0 },
  ]

  function handleFeedbackSaved(checkinId, feedbackText) {
    setCheckins(prev => prev.map(ci =>
      ci.id === checkinId ? { ...ci, coach_feedback: feedbackText } : ci
    ))
  }

  const updateClient = async (field, value) => {
    setSaving(true)
    const { createClient } = await import('@/lib/supabase-browser')
    const supabase = createClient()
    await supabase.from('profiles').update({ [field]: value }).eq('id', client.id)
    setSaving(false)
    window.location.reload()
  }

  const deleteClient = async () => {
    if (!confirm(`Czy na pewno chcesz usunąć klienta ${client.full_name}? Tej operacji nie można cofnąć.`)) return
    const { createClient } = await import('@/lib/supabase-browser')
    const supabase = createClient()
    await supabase.from('profiles').delete().eq('id', client.id)
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen text-[#e8e8e8] font-body">
      {/* Topbar */}
      <header className="border-b-2 border-b-[rgba(212,181,112,0.35)] px-7 h-14 flex items-center gap-4 sticky top-0 bg-[rgba(15,20,35,0.85)] backdrop-blur-xl z-50">
        <span className="font-display text-xl font-bold text-gold tracking-widest">ARETÉ</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold/30 text-[#8a7d5a] tracking-widest">α 0.1</span>
        <span className="text-white/15 text-base">|</span>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-[13px] text-[#666] bg-none border-none cursor-pointer font-body p-0 hover:text-gold transition"
        >
          ← Klienci
        </button>
        <div className="flex-1" />
        <span className="text-[13px] text-[#555]">{coachName}</span>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-8">

        {/* Client card */}
        <div className="bg-gradient-to-br from-[#131f36] to-[#0f1a2e] border border-gold/15 rounded-[14px] p-6 mb-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="flex items-center gap-5 flex-wrap">
            <div
              className="w-15 h-15 rounded-full flex items-center justify-center font-display text-xl font-bold shrink-0"
              style={{
                background: tier.bg || 'rgba(255,255,255,0.05)',
                border: `1px solid ${tier.border || 'rgba(255,255,255,0.1)'}`,
                color: tier.color || '#888',
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <h1 className="font-display text-[22px] font-semibold text-[#e8e8e8] m-0">
                  {client.full_name || 'Bez nazwy'}
                </h1>
                {client.package_tier && (
                  <Pill color={tier.color} bg={tier.bg} border={tier.border}>
                    {client.package_tier.charAt(0).toUpperCase() + client.package_tier.slice(1)}
                  </Pill>
                )}
                <Pill color={status.color} bg={`${status.color}15`} border={`${status.color}40`}>
                  {status.label}
                </Pill>
                {questionnaire && (
                  <Pill color="#52B788" bg="rgba(82,183,136,0.1)" border="rgba(82,183,136,0.3)">
                    Ankieta ✓
                  </Pill>
                )}
                {pendingFeedback > 0 && (
                  <Pill color="#EF6B73" bg="rgba(239,107,115,0.1)" border="rgba(239,107,115,0.3)">
                    {pendingFeedback} check-in bez odpowiedzi
                  </Pill>
                )}
                {complianceData && (
                  <Pill
                    color={complianceData.compliance >= 80 ? '#47D18C' : complianceData.compliance >= 60 ? '#E8A020' : '#EF6B73'}
                    bg={complianceData.compliance >= 80 ? 'rgba(71,209,140,0.1)' : complianceData.compliance >= 60 ? 'rgba(232,160,32,0.1)' : 'rgba(239,107,115,0.1)'}
                    border={complianceData.compliance >= 80 ? 'rgba(71,209,140,0.3)' : complianceData.compliance >= 60 ? 'rgba(232,160,32,0.3)' : 'rgba(239,107,115,0.3)'}
                  >
                    Compliance: {complianceData.compliance}% ({complianceData.completed}/{complianceData.expected})
                  </Pill>
                )}
              </div>
              <div className="text-[13px] text-[#555] flex gap-4 flex-wrap">
                <span>{client.email}</span>
                {client.phone && <span>{client.phone}</span>}
                <span>Dołączył: {formatDate(client.created_at)}</span>
              </div>
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/send-questionnaire', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ client_id: client.id }),
                })
                const json = await res.json()
                if (json.ok) alert('Ankieta wysłana!')
                else alert('Błąd: ' + json.error)
              }}
              className="text-xs border border-[rgba(212,181,112,0.3)] text-gold px-3 py-1 rounded-full hover:bg-gold/10 transition"
            >
              📋 Wyślij ankietę
            </button>
            <div className="relative">
              <button
                onClick={() => setManaging(m => !m)}
                className="text-xs border border-[rgba(212,181,112,0.2)] text-muted px-3 py-1 rounded-full hover:text-warm transition"
              >
                ⚙ Zarządzaj
              </button>
              {managing && (
                <div className="absolute right-0 top-8 z-50 bg-surface border border-[rgba(212,181,112,0.25)] rounded-xl p-3 w-56 shadow-xl space-y-2">
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Pakiet</p>
                  {['paideia','askesis','arete','stacjonarny'].map(tier => (
                    <button key={tier} onClick={() => { updateClient('package_tier', tier); setManaging(false) }}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg transition ${client.package_tier === tier ? 'bg-gold/15 text-gold' : 'text-muted hover:text-warm hover:bg-white/5'}`}>
                      {tier === 'paideia' ? 'Paideia' : tier === 'askesis' ? 'Askesis' : tier === 'arete' ? 'Areté' : 'Stacjonarny'}
                      {client.package_tier === tier && ' ✓'}
                    </button>
                  ))}
                  <div className="border-t border-[rgba(212,181,112,0.1)] pt-2 mt-2">
                    <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Status</p>
                    {['active','paused','lead'].map(status => (
                      <button key={status} onClick={() => { updateClient('status', status); setManaging(false) }}
                        className={`w-full text-left text-xs px-3 py-2 rounded-lg transition ${client.status === status ? 'bg-gold/15 text-gold' : 'text-muted hover:text-warm hover:bg-white/5'}`}>
                        {status === 'active' ? '🟢 Aktywny' : status === 'paused' ? '🟡 Pauza' : '🔵 Lead'}
                        {client.status === status && ' ✓'}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[rgba(239,107,115,0.2)] pt-2 mt-2">
                    <button onClick={() => { setManaging(false); deleteClient() }}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg text-danger hover:bg-danger/10 transition">
                      🗑 Usuń klienta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coach Profile Note */}
        <CoachProfileNote clientId={client.id} initialNote={coach_profile_note} />

        {/* Tabs */}
        <div className="flex gap-0.5 border-b-2 border-b-[rgba(212,181,112,0.35)] mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-[13px] px-4 py-2 bg-none border-none cursor-pointer font-body transition-colors -mb-px flex items-center gap-2 ${
                tab === t.id ? 'text-gold border-b-2 border-gold' : 'text-[#555] border-b-2 border-transparent'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0 rounded-full"
                  style={{
                    background: t.urgent
                      ? 'rgba(239,107,115,0.15)'
                      : tab === t.id ? 'rgba(184,166,119,0.15)' : 'rgba(255,255,255,0.05)',
                    color: t.urgent ? '#EF6B73' : tab === t.id ? '#b8a677' : '#444',
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* PLANS TAB */}
        {tab === 'plans' && (
          <Section
            title="Plany treningowe"
            action={
              <button
                onClick={() => router.push(`/dashboard/client/${client.id}/plan/new`)}
                className="text-xs px-4 py-2 rounded-full border border-gold/30 bg-transparent text-gold cursor-pointer font-body hover:bg-gold/[0.08] transition"
              >
                + Nowy plan
              </button>
            }
          >
            {plans.length === 0 ? (
              <EmptyState text="Brak planów. Kliknij '+ Nowy plan' żeby dodać pierwszy." />
            ) : (
              <div className="flex flex-col gap-2">
                {plans.map(plan => {
                  const isActive = plan.is_active
                  const planData = plan.plan_data || {}
                  const createdAt = plan.created_at
                    ? new Date(plan.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'
                  const sessions = planData.sessions ? Object.keys(planData.sessions).length : 0
                  const splitName = planData.split_name || plan.name || 'Plan'
                  const rationale = planData.rationale || null

                  return (
                    <div key={plan.id} className="bg-[#1a1a1a] border rounded-[10px] p-4 transition"
                      style={{ borderColor: isActive ? 'rgba(184,166,119,0.4)' : 'rgba(255,255,255,0.07)' }}>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#e8e8e8]">{splitName}</span>
                            {isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(71,209,140,0.12)] border border-[rgba(71,209,140,0.3)] text-[#47D18C]">
                                ✓ Aktywny
                              </span>
                            )}
                            {!isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#555]">
                                Archiwalny
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#555]">Utworzono: {createdAt}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-[#555]">{sessions} sesji · 6 tygodni</div>
                          {planData.experience && (
                            <div className="text-xs text-[#444] mt-0.5">{planData.experience}</div>
                          )}
                        </div>
                      </div>

                      {/* Pills */}
                      <div className="flex gap-2 flex-wrap mb-3">
                        {planData.goal && <Pill>{planData.goal}</Pill>}
                        {planData.split_type && <Pill>{planData.split_type}</Pill>}
                        {planData.priority_muscles?.map(m => <Pill key={m}>★ {m}</Pill>)}
                        {planData.recovery_modifier && planData.recovery_modifier < 0.9 && (
                          <Pill>⚠ niska regeneracja</Pill>
                        )}
                      </div>

                      {/* Rationale */}
                      {rationale && (
                        <div className="border-l-2 border-[rgba(184,166,119,0.2)] pl-3 mb-3">
                          <p className="text-[11px] text-[#666] leading-relaxed">{rationale}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!isActive && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              const { createClient } = await import('@/lib/supabase-browser')
                              const supabase = createClient()
                              await supabase.from('training_plans').update({ is_active: false }).eq('client_id', client.id)
                              await supabase.from('training_plans').update({ is_active: true }).eq('id', plan.id)
                              window.location.reload()
                            }}
                            className="text-[11px] px-3 py-1.5 rounded-lg border border-gold/20 text-gold hover:bg-gold/10 transition cursor-pointer bg-transparent font-body"
                          >
                            Aktywuj
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/dashboard/client/${client.id}/plan/${plan.id}/edit`)}
                          className="text-xs border border-[rgba(212,181,112,0.25)] text-gold px-3 py-1.5 rounded-lg hover:bg-gold/10 transition"
                        >
                          ✎ Edytuj
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/client/${client.id}/plan/new`)}
                          className="text-[11px] px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#555] hover:text-[#888] transition cursor-pointer bg-transparent font-body"
                        >
                          + Nowy plan
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Section>
        )}

        {/* LOGS TAB */}
        {tab === 'logs' && (
          <>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {rirAdherence && (
                <div className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-4">
                  <div className="text-[10px] text-muted uppercase tracking-widest mb-2">RIR Adherence</div>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-2xl font-semibold" style={{ color: rirAdherence.pct >= 75 ? '#47D18C' : rirAdherence.pct >= 50 ? '#E8A020' : '#EF6B73' }}>
                      {rirAdherence.pct}%
                    </span>
                    <span className="text-xs text-muted mb-1">serii w targecie ±1 RIR ({rirAdherence.total} serii total)</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${rirAdherence.pct}%`, background: rirAdherence.pct >= 75 ? '#47D18C' : rirAdherence.pct >= 50 ? '#E8A020' : '#EF6B73' }} />
                  </div>
                </div>
              )}
              {weightTrend && (
                <div className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-4">
                  <div className="text-[10px] text-muted uppercase tracking-widest mb-2">Trend wagi (7 dni)</div>
                  <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <div>
                      <span className="text-xl font-semibold text-warm">{weightTrend.avg7} kg</span>
                      <span className="text-xs text-muted ml-2">śr. 7 dni</span>
                    </div>
                    {weightTrend.avg14 && (
                      <div>
                        <span className="text-sm text-muted">{weightTrend.avg14} kg</span>
                        <span className="text-xs text-muted ml-1">poprzednie 7 dni</span>
                      </div>
                    )}
                    {weightTrend.delta !== null && (
                      <span className="text-sm font-medium" style={{ color: weightTrend.delta < 0 ? '#47D18C' : '#EF6B73' }}>
                        {weightTrend.delta > 0 ? '+' : ''}{weightTrend.delta} kg ({weightTrend.deltaPct > 0 ? '+' : ''}{weightTrend.deltaPct}%)
                      </span>
                    )}
                  </div>
                  {weightTrend.suggestion && (
                    <div className="text-xs px-3 py-2 rounded-lg border" style={{ borderColor: `${weightTrend.suggestionColor}40`, color: weightTrend.suggestionColor, background: `${weightTrend.suggestionColor}10` }}>
                      {weightTrend.suggestion}
                    </div>
                  )}
                </div>
              )}
              {weeklyVolume.length > 0 && (
                <div className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-4">
                  <div className="text-[10px] text-muted uppercase tracking-widest mb-3">Objętość per partia (ostatnie 20 sesji)</div>
                  <div className="space-y-2">
                    {weeklyVolume.map(({ muscle, sets }) => (
                      <div key={muscle} className="flex items-center gap-3">
                        <div className="text-[11px] text-muted w-28 shrink-0 capitalize">{muscle.replace('_', ' ')}</div>
                        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gold/60" style={{ width: `${Math.min(100, (sets / weeklyVolume[0].sets) * 100)}%` }} />
                        </div>
                        <div className="text-[11px] text-muted w-12 text-right">{sets} serii</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Volume Tracking */}
            <Section title="Volume per partia (wszystkie logi)">
              {logs.length === 0 ? (
                <EmptyState text="Brak danych." />
              ) : (() => {
                const volumeData = calculateVolumeByMuscle(logs)
                return volumeData.length === 0 ? (
                  <EmptyState text="Brak danych o volume w logach." />
                ) : (
                  <div className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gold/[0.05] border-b-2 border-b-[rgba(212,181,112,0.35)]">
                          <th className="px-4 py-2.5 text-left text-[11px] text-[#888] font-semibold tracking-wider">PARTIA</th>
                          <th className="px-4 py-2.5 text-right text-[11px] text-[#888] font-semibold tracking-wider">SERIE</th>
                          <th className="px-4 py-2.5 text-right text-[11px] text-[#888] font-semibold tracking-wider">VOLUME (kg)</th>
                          <th className="px-4 py-2.5 text-right text-[11px] text-[#888] font-semibold tracking-wider">AVG RIR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volumeData.map(row => (
                          <tr key={row.muscle} className="border-b border-white/[0.04]">
                            <td className="px-4 py-2.5 text-[13px] text-[#e8e8e8]">{row.muscle}</td>
                            <td className="px-4 py-2.5 text-right text-[13px] text-gold font-semibold">{row.sets}</td>
                            <td className="px-4 py-2.5 text-right text-[13px] text-gold font-semibold">{row.volume_kg.toLocaleString()}</td>
                            <td className="px-4 py-2.5 text-right text-[13px] text-[#aaa]">{row.avgRIR}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })()}
            </Section>

            {/* Performance Trends */}
            <Section title="Top 5 ćwiczeń (estimated 1RM)">
              {logs.length === 0 ? (
                <EmptyState text="Brak danych." />
              ) : (() => {
                const trends = calculatePerformanceTrends(logs)
                return trends.length === 0 ? (
                  <EmptyState text="Brak danych o e1RM w logach." />
                ) : (
                  <div className="flex flex-col gap-2">
                    {trends.map((t, i) => (
                      <div key={i} className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold/[0.08] border border-gold/15 flex items-center justify-center text-base text-gold shrink-0">
                          {t.trend}
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] text-[#e8e8e8] font-medium">{t.exercise}</div>
                          <div className="text-[11px] text-[#555] mt-0.5">
                            e1RM: <span className="text-gold font-semibold">{t.e1rm} kg</span>
                            {t.change !== 0 && (
                              <span className={`ml-2 ${t.change > 0 ? 'text-success' : 'text-danger'}`}>
                                ({t.change > 0 ? '+' : ''}{t.change.toFixed(1)} kg)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </Section>

            {/* Historia treningów */}
            <Section title="Historia treningów">
              {logs.length === 0 ? (
                <EmptyState text="Brak zalogowanych treningów." />
              ) : (
                <div className="flex flex-col gap-1.5">
                  {logs.map(log => (
                    <div key={log.id} className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-3 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-gold/[0.08] border border-gold/15 flex items-center justify-center text-[13px] font-semibold text-gold shrink-0">
                        {log.day_label || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] text-[#e8e8e8]">Dzień {log.day_label || '—'}</div>
                        <div className="text-[11px] text-[#555] mt-0.5">{formatDate(log.session_date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <div className="mt-4">
              <ClientReport clientId={client.id} />
            </div>
          </>
        )}

        {/* CHECKINS TAB */}
        {tab === 'checkins' && (
          <Section title="Check-iny">
            {checkins.length === 0 ? (
              <EmptyState text="Brak check-inów. Klient jeszcze nie wysłał żadnego." />
            ) : (
              <div className="flex flex-col gap-2.5">
                {pendingFeedback > 0 && (
                  <div className="p-2.5 rounded-lg bg-danger/[0.08] border border-danger/20 text-[13px] text-danger mb-1">
                    ⚠ {pendingFeedback} {pendingFeedback === 1 ? 'check-in czeka' : 'check-iny czekają'} na Twój feedback
                  </div>
                )}
                {checkins.map(ci => (
                  <CheckinCard
                    key={ci.id}
                    ci={ci}
                    onFeedbackSaved={handleFeedbackSaved}
                  />
                ))}
              </div>
            )}
          </Section>
        )}

        {/* ANKIETA TAB */}
        {tab === 'questionnaire' && (
          <QuestionnaireTab
            questionnaire={questionnaire}
            questionnaires={questionnaires}
            clientId={client.id}
          />
        )}

        {tab === 'nutrition' && (
          <Section title="Cele żywieniowe">
            <NutritionPanel clientId={client.id} initialTargets={nutritionTargets} questionnaire={questionnaire} />
            <div className="mt-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Plan żywieniowy</p>
              <MealPlanBuilder
                clientId={client.id}
                questionnaire={questionnaire}
                nutritionTargets={nutritionTargets}
                initialPlan={mealPlan}
              />
            </div>
          </Section>
        )}

      </main>
    </div>
  )
}
