'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { IconHome, IconTraining, IconPlan, IconReport, IconLogout } from '@/lib/GreekIcons'
import NutritionCard from './NutritionCard'
import MealPlanCard from './MealPlanCard'
import CheatMealTracker from './CheatMealTracker'
import DailyTipCard from './DailyTipCard'
import OceanLoader from './OceanLoader'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CAMPAIGN_STAGES = ['Fundament', 'Akumulacja', 'Wzrost', 'Próba', 'Regeneracja', 'Podsumowanie']

const ARCHETYPES = [
  { min: 0,    label: 'Nowicjusz',  greek: 'Μαθητής',    color: '#8F9AAF' },
  { min: 200,  label: 'Adept',      greek: 'Ἀσκητής',    color: '#D4B570' },
  { min: 500,  label: 'Wojownik',   greek: 'Πολεμιστής', color: '#C09A50' },
  { min: 1000, label: 'Mistrz',     greek: 'Διδάσκαλος', color: '#E8C84A' },
  { min: 2000, label: 'Areté',      greek: 'Ἀρετή',      color: '#FFD700' },
]

const ACHIEVEMENTS = [
  { id: 'protos',    label: 'Pierwszy krok',   desc: 'Ukończ pierwszy trening',    icon: '⚡', xp: 50  },
  { id: 'askesis',   label: 'Żelazna wola',    desc: '4 tygodnie bez przerwy',     icon: '🔥', xp: 200 },
  { id: 'kleos',     label: 'Nowy rekord',     desc: 'Pobij własny rekord siłowy', icon: '🏆', xp: 150 },
  { id: 'arete_fin', label: 'Doskonałość',     desc: 'Ukończony mezocykl',         icon: '⚜️', xp: 300 },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getPlanPayload(activePlan) {
  return activePlan?.plan_data || activePlan?.plan_json || activePlan?.generated_plan || activePlan?.plan || activePlan || {}
}

function getTodaySession(activePlan) {
  const payload = getPlanPayload(activePlan)
  const sessions = payload.sessions || activePlan?.sessions || {}
  const entries = Array.isArray(sessions) ? sessions : Object.entries(sessions)
  if (!entries.length) return null
  const dayIndex = new Date().getDay()
  const sessionIndex = Math.max(0, (dayIndex + 5) % 7)
  const selected = entries[sessionIndex % entries.length]
  const key = Array.isArray(selected) ? selected[0] : selected?.key
  const session = Array.isArray(selected) ? selected[1] : selected
  if (!session) return null
  return {
    key,
    name: session.name || session.label || activePlan?.day_label || `Upper ${String(key || 'A').toUpperCase()}`,
    exercises: Array.isArray(session.exercises) ? session.exercises : [],
  }
}

function getTargetRir(activePlan, currentWeek) {
  const payload = getPlanPayload(activePlan)
  const progression = payload.weekly_progression || activePlan?.weekly_progression
  const weekData = Array.isArray(progression)
    ? progression.find(item => Number(item.week) === Number(currentWeek))
    : null
  return weekData?.rir ?? activePlan?.target_rir ?? activePlan?.rir_target ?? 2
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
}

function getArchetype(xp) {
  return [...ARCHETYPES].reverse().find(a => xp >= a.min) ?? ARCHETYPES[0]
}

// ─── GENDER ACCENT ────────────────────────────────────────────────────────────

function getGenderAccent(questionnaire) {
  const plec = questionnaire?.data?.plec || ''
  if (plec === 'Kobieta') return { primary: '#E8829A', secondary: '#F4A0B5', glow: '#E8829A20' }
  if (plec === 'Mężczyzna') return { primary: '#5B8DB8', secondary: '#7EB2D9', glow: '#5B8DB820' }
  return { primary: '#D4B570', secondary: '#E8C84A', glow: '#D4B57020' }
}

// ─── CHARACTER CARD ───────────────────────────────────────────────────────────

function CharacterCard({ profile, recentLogs, questionnaire, totalXP = 0 }) {
  const xp = totalXP || (recentLogs?.length ?? 0) * 120
  const archetypeIndex = ARCHETYPES.findIndex(a => xp < a.min)
  const nextXP = archetypeIndex > 0 ? ARCHETYPES[archetypeIndex].min : (xp >= 2000 ? 2000 : 200)
  const pct       = Math.min(100, Math.round((xp / nextXP) * 100))
  const archetype = getArchetype(xp)
  const accent    = getGenderAccent(questionnaire)
  const initials  = (profile?.full_name ?? profile?.email ?? 'AR')
    .split(' ').map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5 relative overflow-hidden">
      {/* Meander watermark */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.05] pointer-events-none" aria-hidden>
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 8h8v8H8V8zM8 0h8v8H8V0zM16 8h8v8H16V8zM16 16h8v8H16V16zM24 8h8v8H24V8zM32 0h8v8H32V0zM40 8h8v8H40V8zM40 16h8v8H40V16zM48 8h8v8H48V8z" fill="#D4B570"/>
        </svg>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* Medallion — dynamic color requires inline style */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0 font-display"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #1E2D45, #0A1020)',
            border: `2px solid ${accent.primary}`,
            boxShadow: `0 0 20px ${accent.primary}20`,
            color: archetype.color,
          }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Twoja postać</p>
          <p className="text-lg font-semibold text-warm leading-tight">{archetype.label}</p>
          <p className="text-sm font-medium" style={{ color: accent.primary }}>{archetype.greek}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[10px] text-muted mb-0.5">Treningi</p>
          <p className="text-xl font-semibold text-warm">{recentLogs?.length ?? 0}</p>
        </div>
      </div>

      {/* XP bar */}
      <div className="flex justify-between text-xs text-muted mb-1.5">
        <span>{xp} XP</span>
        <span>{nextXP - xp} XP do następnego</span>
      </div>
      <div className="h-2 bg-[rgba(15,20,35,0.85)] backdrop-blur-sm-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent.primary}88, ${accent.primary})`,
          }}
        />
      </div>
    </div>
  )
}

// ─── STAT GRID ────────────────────────────────────────────────────────────────

function StatGrid({ recentLogs, questionnaire }) {
  const logs = recentLogs ?? []
  const accent = getGenderAccent(questionnaire)

  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  const recentCount = logs.filter(l => new Date(l.session_date) >= fourWeeksAgo).length
  const consistency = Math.min(100, Math.round((recentCount / 12) * 100))

  const allSets = logs.flatMap(l => l.exercises ?? []).flatMap(e => e.sets ?? [])
  const totalVolume = allSets.reduce((sum, s) => sum + ((s.weight_kg || 0) * (s.reps || 0)), 0)
  const maxLift = allSets.reduce((max, s) => Math.max(max, s.estimated_1rm ?? 0), 0)
  const totalSets = allSets.length
  const avgSleep = questionnaire?.data?.sleep_quality ? parseFloat(questionnaire.data.sleep_quality) * 2 : null

  const withDuration = logs.filter(l => l.duration_minutes > 0)
  const avgDuration = withDuration.length > 0
    ? withDuration.reduce((sum, l) => sum + l.duration_minutes, 0) / withDuration.length
    : 0

  const stats = [
    { label: 'SIŁA',          value: maxLift > 0 ? `${maxLift} kg` : '—',         sub: 'Najlepsze 1RM',         bar: Math.min(maxLift / 200, 1), color: accent.primary },
    { label: 'OBJĘTOŚĆ',      value: totalVolume > 0 ? `${Math.round(totalVolume/1000)}k kg` : '—', sub: 'Łączna objętość', bar: Math.min(totalVolume / 500000, 1), color: accent.primary },
    { label: 'KONSEKWENCJA',  value: totalSets > 0 ? `${totalSets} serii` : '—',  sub: 'Wszystkich serii',      bar: Math.min(totalSets / 500, 1), color: '#47D18C' },
    { label: 'REGENERACJA',   value: avgSleep ? `${avgSleep.toFixed(1)}/10` : '—', sub: 'Jakość snu',           bar: avgSleep ? avgSleep / 10 : 0, color: '#8F9AAF' },
    { label: 'TRENINGI',      value: recentLogs.length,                            sub: 'Łącznie sesji',         bar: Math.min(recentLogs.length / 50, 1), color: accent.secondary },
    { label: 'ŚR. CZAS',      value: avgDuration > 0 ? `${Math.round(avgDuration)} min` : '—', sub: 'Czas sesji', bar: Math.min(avgDuration / 120, 1), color: accent.secondary },
  ]

  const data = stats.map(s => ({ stat: s.label, value: Math.round(s.bar * 100) }))

  return (
    <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Statystyki postaci</p>
      {logs.length === 0 ? (
        <p className="text-[10px] text-muted/40 mt-3 text-center py-8">Dane rosną z treningami i check-inami</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: '#8F9AAF', fontSize: 11, fontFamily: 'Outfit' }} />
            <Radar
              name="stats"
              dataKey="value"
              stroke={accent.primary}
              fill={accent.primary}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ─── CAMPAIGN PROGRESS ────────────────────────────────────────────────────────

function CampaignProgress({ activePlan, planInfo }) {
  if (!activePlan) return null
  const { currentWeek, maxWeeks, mesocycleName, stageIndex } = planInfo
  const pct = Math.round(((currentWeek - 1) / maxWeeks) * 100)

  return (
    <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Kampania</p>
          <p className="text-base font-semibold text-warm">{mesocycleName}</p>
        </div>
        <span className="text-xs text-muted border-2 border-[rgba(212,181,112,0.35)] px-2 py-1 rounded-lg shrink-0 ml-2">
          Tyg. {currentWeek}/{maxWeeks}
        </span>
      </div>

      {/* Overall bar */}
      <div className="h-1.5 bg-[rgba(15,20,35,0.85)] backdrop-blur-sm-2 rounded-full overflow-hidden mb-1">
        <div
          className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-gold/70 to-gold"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-muted mb-4">{pct}% ukończone</p>

      {/* Stage markers */}
      <div className="flex gap-1">
        {CAMPAIGN_STAGES.map((stage, i) => {
          const isActive = i === stageIndex
          const isDone   = i < stageIndex
          return (
            <div key={stage} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-1 rounded-full"
                style={{
                  background: isDone ? '#D4B570' : isActive ? '#D4B570aa' : 'rgba(255,255,255,0.08)',
                }}
              />
              <span
                className="text-[9px] text-center leading-tight"
                style={{ color: isActive ? '#D4B570' : isDone ? '#D4B570aa' : '#8F9AAF55' }}
              >
                {stage}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ACHIEVEMENT PREVIEW ──────────────────────────────────────────────────────

function AchievementPreview({ recentLogs, clientAchievements = [] }) {
  const unlockedSet = new Set((clientAchievements || []).map(a => a.achievement_id))
  const unlocked = {
    protos:    unlockedSet.has('protos'),
    askesis:   unlockedSet.has('askesis'),
    kleos:     unlockedSet.has('kleos'),
    arete_fin: unlockedSet.has('arete_fin'),
  }

  return (
    <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Odznaczenia</p>
      <div className="grid grid-cols-4 gap-3">
        {ACHIEVEMENTS.map(ach => {
          const done = unlocked[ach.id]
          return (
            <div key={ach.id} className="flex flex-col items-center gap-1.5" title={`${ach.label} — ${ach.desc}`}>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all"
                style={{
                  background: done
                    ? 'radial-gradient(circle, rgba(212,181,112,0.2), rgba(212,181,112,0.05))'
                    : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${done ? 'rgba(212,181,112,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  filter: done ? 'none' : 'grayscale(1) opacity(0.3)',
                }}
              >
                {ach.icon}
              </div>
              <span
                className="text-[9px] text-center leading-tight"
                style={{ color: done ? '#D4B570' : '#8F9AAF55' }}
              >
                {ach.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── COACH MESSAGE CARD ───────────────────────────────────────────────────────

function CoachMessageCard({ coachName }) {
  const [msg, setMsg] = useState(null)
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('check_ins')
      .select('coach_feedback, submitted_at')
      .not('coach_feedback', 'is', null)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => { if (data?.coach_feedback) setMsg(data) })
  }, [])
  if (!msg) return null
  const initials = coachName ? coachName.trim().split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : 'AP'
  const firstName = coachName?.split(' ')[0] || 'Trener'
  return (
    <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Wiadomość od trenera</p>
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-xs shrink-0">{initials}</div>
        <div>
          <p className="text-sm font-medium text-gold mb-1">{firstName}</p>
          <p className="text-sm text-muted leading-relaxed">{msg.coach_feedback}</p>
        </div>
      </div>
    </div>
  )
}

function CoachNoteCard({ note }) {
  if (!note) return null
  return (
    <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border border-gold/20 rounded-2xl p-5">
      <p className="text-[10px] text-gold uppercase tracking-widest mb-3">Notatka od trenera</p>
      <p className="text-sm text-warm/80 leading-relaxed">{note}</p>
    </div>
  )
}

function WeightLog() {
  const [weight, setWeight] = useState('')
  const [logs, setLogs] = useState([])
  const [saving, setSaving] = useState(false)
  const [todayLogged, setTodayLogged] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('weight_logs')
      .select('weight_kg, logged_at, notes')
      .order('logged_at', { ascending: false })
      .limit(14)
      .then(({ data }) => {
        if (data) {
          setLogs(data)
          const today = new Date().toISOString().split('T')[0]
          setTodayLogged(data.some(l => l.logged_at === today))
          if (data[0] && data[0].logged_at === today) {
            setWeight(String(data[0].weight_kg))
          }
        }
      })
  }, [])

  const avg7 = logs.slice(0, 7).length > 0
    ? (logs.slice(0, 7).reduce((sum, l) => sum + parseFloat(l.weight_kg), 0) / logs.slice(0, 7).length).toFixed(1)
    : null

  const handleSave = async () => {
    const w = parseFloat(weight)
    if (!w || w < 30 || w > 300) return
    setSaving(true)
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('weight_logs').upsert({
      weight_kg: w,
      logged_at: today,
    }, { onConflict: 'client_id,logged_at' })
    setSaving(false)
    setTodayLogged(true)
    setLogs(prev => {
      const filtered = prev.filter(l => l.logged_at !== today)
      return [{ weight_kg: w, logged_at: today }, ...filtered].slice(0, 14)
    })
  }

  return (
    <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] text-muted uppercase tracking-widest">Dzienna waga</p>
        {avg7 && (
          <span className="text-xs text-gold border border-gold/20 px-2 py-0.5 rounded-full">
            Śr. 7 dni: {avg7} kg
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          step="0.1"
          min="30"
          max="300"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="np. 74.5"
          className="flex-1 bg-bg-deep border border-[rgba(212,181,112,0.2)] rounded-lg px-3 py-2 text-warm text-sm focus:outline-none focus:border-gold"
        />
        <button
          onClick={handleSave}
          disabled={saving || !weight}
          className="px-4 py-2 bg-gold text-bg-deep text-xs font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-40"
        >
          {saving ? '…' : todayLogged ? 'Zaktualizuj' : 'Zapisz'}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="space-y-1.5">
          {logs.slice(0, 7).map(log => (
            <div key={log.logged_at} className="flex justify-between text-xs">
              <span className="text-muted">
                {new Date(log.logged_at).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <span className="text-warm font-medium">{parseFloat(log.weight_kg).toFixed(1)} kg</span>
            </div>
          ))}
        </div>
      )}

      {logs.length === 0 && (
        <p className="text-xs text-muted/50 text-center py-2">Zacznij logować wagę każdego dnia rano.</p>
      )}
    </div>
  )
}

function ZeusMascot({ state = 'idle' }) {
  const frames = { idle: 0, idle2: 1, happy: 2, sleep: 3, alert: 4, walk1: 5, walk2: 6 }
  const frame = frames[state] ?? 0
  const frameW = 2172 / 7
  const offsetX = -(frame * frameW)

  return (
    <div style={{
      width: '90px',
      height: '90px',
      overflow: 'hidden',
      imageRendering: 'pixelated',
      position: 'relative',
    }}>
      <img
        src="/mascot/zeus-sprite.png"
        alt="Zeus"
        style={{
          position: 'absolute',
          left: `${offsetX * (90 / frameW)}px`,
          top: '-10px',
          width: `${2172 * (90 / frameW)}px`,
          height: 'auto',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}

function ZeusWidget({ recentLogs, checkins }) {
  const [frame, setFrame] = React.useState('idle')
  const [pos, setPos] = React.useState({ x: 0, y: 0 })
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const noLogs = !recentLogs || recentLogs.length === 0
    const pendingCheckin = checkins?.some(c => !c.coach_feedback)
    if (noLogs) setFrame('sleep')
    else if (pendingCheckin) setFrame('alert')
    else setFrame('idle')
  }, [recentLogs, checkins])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => {
        if (f === 'idle') return 'idle2'
        if (f === 'idle2') return 'idle'
        if (f === 'walk1') return 'walk2'
        if (f === 'walk2') return 'walk1'
        return f
      })
    }, 600)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    const moveInterval = setInterval(() => {
      setPos({
        x: Math.random() * 40 - 20,
        y: Math.random() * 20 - 10,
      })
    }, 3000)
    return () => clearInterval(moveInterval)
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: 9999,
        cursor: 'pointer',
        filter: 'drop-shadow(0 4px 8px rgba(212,181,112,0.3))',
      }}
      onClick={() => {
        setFrame('happy')
        setTimeout(() => setFrame('idle'), 1500)
      }}
      title="Zeus"
    >
      <ZeusMascot state={frame} />
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ClientPortal({ profile, activePlan, recentLogs, questionnaire, coachName, checkins, totalXP = 0, clientAchievements = [], nutritionTargets = null, nutritionSummary = null, mealPlan = null, coachNote = null }) {
  const router   = useRouter()
  const [entered, setEntered] = useState(false)
  useEffect(() => { const t = setTimeout(() => setEntered(true), 800); return () => clearTimeout(t) }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const safeLogs  = recentLogs || []
  const safeCheckins = checkins || []
  const firstName = profile?.full_name?.split(' ')?.[0] || 'Kliencie'

  const planInfo = useMemo(() => {
    const payload     = getPlanPayload(activePlan)
    const currentWeek = activePlan?.current_week || payload.current_week || 1
    const maxWeeks    = activePlan?.mesocycle_weeks || payload.mesocycle_weeks || 6
    const session     = getTodaySession(activePlan)
    const rir         = getTargetRir(activePlan, currentWeek)
    const exerciseCount  = session?.exercises?.length || activePlan?.exercise_count || 6
    const estimatedTime  = Math.max(45, Math.min(90, exerciseCount * 10))
    const stageIndex     = Math.min(
      CAMPAIGN_STAGES.length - 1,
      Math.max(0, Math.ceil((currentWeek / maxWeeks) * CAMPAIGN_STAGES.length) - 1)
    )
    return {
      currentWeek, maxWeeks, stageIndex,
      sessionName:   session?.name || activePlan?.session_name || activePlan?.name || 'Upper A',
      rir, exerciseCount, estimatedTime,
      mesocycleName: activePlan?.name || payload.split_name || 'Mezocykl',
      isRestDay:     activePlan && !session && new Date().getDay() === 0,
    }
  }, [activePlan])

  const todayDate = new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen text-warm font-body relative">
      {!entered && <OceanLoader />}
      <div className={`relative z-10 transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>

      <nav style={{position:'sticky',top:0,zIndex:50,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(212,181,112,0.12)',height:'52px',display:'flex',alignItems:'center',padding:'0 10px',gap:'6px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'6px',flexShrink:0}}>
          <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.1rem',color:'#D4B570',letterSpacing:'0.2em'}}>ARETÉ</span>
          <span style={{fontSize:'8px',padding:'2px 6px',borderRadius:'4px',border:'1px solid rgba(212,181,112,0.2)',color:'rgba(212,181,112,0.4)',letterSpacing:'0.1em'}}>α 0.1</span>
        </div>
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'2px'}}>
          {[
            {href:'/client',icon:<IconHome size={16}/>,label:'Przegląd'},
            {href:'/client/workout',icon:<IconTraining size={16}/>,label:'Trening'},
            {href:'/client/plan',icon:<IconPlan size={16}/>,label:'Plan'},
            {href:'/client/checkin',icon:<IconReport size={16}/>,label:'Raport'},
          ].map(({href,icon,label})=>{
            const active=typeof window!=='undefined'&&window.location.pathname===href
            return(
              <button key={href} onClick={()=>router.push(href)} style={{padding:'5px 8px',borderRadius:'8px',fontSize:'11px',border:'none',cursor:'pointer',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap',background:active?'rgba(212,181,112,0.12)':'transparent',color:active?'#D4B570':'#8F9AAF',display:'flex',alignItems:'center',gap:'4px'}}>
                {icon}{label}
              </button>
            )
          })}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'5px',flexShrink:0}}>
          <span style={{fontSize:'11px',color:'#8F9AAF'}}>{firstName}</span>
          <button onClick={handleLogout}
            style={{background:'rgba(239,107,115,0.1)',border:'2px solid rgba(239,107,115,0.3)',borderRadius:'8px',padding:'5px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px',color:'#EF6B73',fontSize:'11px',fontWeight:'600'}}>
            <IconLogout size={14}/>
            <span style={{display:'none'}}>Wyloguj</span>
            <span>↩</span>
          </button>
        </div>
      </nav>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-opacity duration-500 ${entered ? 'opacity-100' : 'opacity-0'}`}>

        {/* DATE */}
        <p className="text-xs text-muted mb-4 capitalize">{todayDate}</p>

        {/* HERO — dzisiejszy trening */}
        <div className="relative bg-gradient-to-br from-[#1a1200] via-[#0f0d00] to-bg-deep border border-gold/20 rounded-2xl p-6 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.03] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] text-gold/60 uppercase tracking-widest mb-2">Dzisiejszy trening</p>
              <h1 className="text-3xl sm:text-4xl font-display text-gold mb-3 leading-tight">
                {planInfo.isRestDay ? 'Dzień regeneracji' : planInfo.sessionName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted mb-4">
                <span>{planInfo.exerciseCount} ćwiczeń</span>
                <span>~{planInfo.estimatedTime} min</span>
                <span>RIR {planInfo.rir}</span>
                <span className="text-success">+120 XP</span>
              </div>
              {activePlan && (
                <div className="max-w-sm">
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>Tydzień {planInfo.currentWeek} z {planInfo.maxWeeks}</span>
                    <span>{Math.round(((planInfo.currentWeek - 1) / planInfo.maxWeeks) * 100)}%</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full transition-all duration-700"
                      style={{ width: `${Math.round(((planInfo.currentWeek - 1) / planInfo.maxWeeks) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="shrink-0">
              <button onClick={() => router.push('/client/workout')} disabled={!activePlan}
                className="bg-gold text-bg-deep font-bold px-8 py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition text-sm tracking-wide disabled:opacity-40 whitespace-nowrap">
                {activePlan ? 'Rozpocznij →' : 'Plan w przygotowaniu'}
              </button>
            </div>
          </div>
        </div>

        {nutritionSummary && nutritionTargets && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 mb-4 rounded-xl border"
            style={{ background: 'rgba(212,181,112,0.04)', borderColor: 'rgba(212,181,112,0.12)' }}>
            <span className="text-[10px] text-muted uppercase tracking-widest shrink-0">Żywienie:</span>
            <span className="text-xs text-warm font-medium">{nutritionTargets.calories} kcal</span>
            <span className="text-[11px]" style={{ color: '#52B788' }}>B: {nutritionTargets.protein_g}g</span>
            <span className="text-[11px]" style={{ color: '#E8A020' }}>T: {nutritionTargets.fat_g}g</span>
            <span className="text-[11px]" style={{ color: '#5B8DB8' }}>W: {nutritionTargets.carbs_g}g</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto"
              style={{ background: `${nutritionSummary.aggressivenessColor}15`, color: nutritionSummary.aggressivenessColor, border: `1px solid ${nutritionSummary.aggressivenessColor}30` }}>
              {nutritionSummary.aggressivenessLabelPl} · {nutritionSummary.deficitPct > 0 ? `-${nutritionSummary.deficitPct}%` : `+${Math.abs(nutritionSummary.deficitPct)}%`}
            </span>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* COL 1 — Postęp i aktywność */}
          <div className="space-y-4">
            <CharacterCard profile={profile} recentLogs={safeLogs} questionnaire={questionnaire} totalXP={totalXP} />
            <AchievementPreview recentLogs={safeLogs} clientAchievements={clientAchievements} />
            <CampaignProgress activePlan={activePlan} planInfo={planInfo} />
          </div>

          {/* COL 2 — Aktywność i raporty */}
          <div className="space-y-4">
            <StatGrid recentLogs={safeLogs} questionnaire={questionnaire} />
            <DailyTipCard userId={profile?.id} />

            {/* Ostatnia aktywność */}
            <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Ostatnia aktywność</p>
              {safeLogs.length === 0 ? (
                <p className="text-muted text-sm text-center py-4">Pierwszy trening otworzy historię.</p>
              ) : (
                <div className="divide-y divide-[rgba(212,181,112,0.06)]">
                  {safeLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-xs text-success shrink-0">⚡</div>
                        <p className="text-sm text-warm">{log.day_label || 'Trening'}</p>
                      </div>
                      <span className="text-xs text-muted shrink-0">{formatDate(log.session_date || log.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Historia raportów */}
            {safeCheckins.length > 0 && (
              <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] text-muted uppercase tracking-widest">Raporty tygodniowe</p>
                  <button onClick={() => router.push('/client/checkin')}
                    className="text-[10px] text-gold/60 hover:text-gold transition">Nowy →</button>
                </div>
                <div className="space-y-3">
                  {safeCheckins.slice(0, 3).map(ci => (
                    <div key={ci.id} className="bg-bg-deep rounded-xl p-3 border border-[rgba(212,181,112,0.06)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gold">Tydzień {ci.week_number}</span>
                        <span className="text-[10px] text-muted">{formatDate(ci.submitted_at)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {[
                          { label: 'Energia', value: ci.energy_level },
                          { label: 'Sen', value: ci.sleep_quality },
                          { label: 'Dieta', value: ci.adherence_pct ? `${ci.adherence_pct}%` : '—' },
                        ].map(m => (
                          <div key={m.label} className="text-center">
                            <p className="text-[9px] text-muted mb-0.5">{m.label}</p>
                            <p className="text-xs font-medium text-warm">{m.value ?? '—'}</p>
                          </div>
                        ))}
                      </div>
                      {ci.coach_feedback ? (
                        <div className="border-l-2 border-gold/30 pl-2 mt-2">
                          <p className="text-[10px] text-gold mb-0.5">Odpowiedź trenera</p>
                          <p className="text-xs text-warm/70 leading-relaxed">{ci.coach_feedback}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted/40 mt-1">Oczekuje na odpowiedź...</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COL 3 — Coach + Żywienie */}
          <div className="space-y-4">
            {/* Coach note */}
            <CoachNoteCard note={coachNote} />

            {/* Coach message */}
            <CoachMessageCard coachName={coachName} />

            {/* Żywienie */}
            <NutritionCard nutritionTargets={nutritionTargets} nutritionSummary={nutritionSummary} />
            <MealPlanCard mealPlan={mealPlan} />
            <CheatMealTracker nutritionTargets={nutritionTargets} />
            <WeightLog />

            {/* Ankieta */}
            {profile?.questionnaire_requested ? (
              <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border border-gold/25 rounded-2xl px-5 py-4">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Ankieta</p>
                <p className="text-sm font-medium text-gold mb-2">📋 Czeka na wypełnienie</p>
                <button onClick={() => router.push('/client/questionnaire')}
                  className="text-xs text-gold/70 underline hover:text-gold transition">
                  Wypełnij teraz →
                </button>
              </div>
            ) : questionnaire ? (
              <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border border-[rgba(212,181,112,0.1)] rounded-2xl px-5 py-4">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Ankieta</p>
                <p className="text-sm font-medium text-success">✓ Wypełniona</p>
              </div>
            ) : null}

            {/* Plan link */}
            {activePlan && (
              <button onClick={() => router.push('/client/plan')}
                className="w-full flex items-center justify-between bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl px-5 py-4 hover:border-gold/40 transition group">
                <div className="text-left">
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Plan treningowy</p>
                  <p className="text-sm font-medium text-warm">{planInfo.mesocycleName}</p>
                </div>
                <span className="text-muted group-hover:text-gold transition text-lg">→</span>
              </button>
            )}
          </div>

        </div>
      </main>

      <ZeusWidget recentLogs={safeLogs} checkins={safeCheckins} />
      </div>
    </div>
  )
}
