'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CAMPAIGN_STAGES = ['Fundament', 'Akumulacja', 'Wzrost', 'Próba', 'Deload', 'Review']

const ARCHETYPES = [
  { min: 0,    label: 'Nowicjusz',  greek: 'Μαθητής',    color: '#8F9AAF' },
  { min: 200,  label: 'Adept',      greek: 'Ἀσκητής',    color: '#D4B570' },
  { min: 500,  label: 'Wojownik',   greek: 'Πολεμιστής', color: '#C09A50' },
  { min: 1000, label: 'Mistrz',     greek: 'Διδάσκαλος', color: '#E8C84A' },
  { min: 2000, label: 'Areté',      greek: 'Ἀρετή',      color: '#FFD700' },
]

const ACHIEVEMENTS = [
  { id: 'protos',    label: 'Protos',   greek: 'Πρῶτος',  desc: 'Pierwszy trening',       icon: '⚡', xp: 50  },
  { id: 'askesis',   label: 'Askesis',  greek: 'Ἄσκησις', desc: '4 tygodnie bez przerwy', icon: '🔥', xp: 200 },
  { id: 'kleos',     label: 'Kleos',    greek: 'Κλέος',   desc: 'Nowy rekord osobisty',   icon: '🏆', xp: 150 },
  { id: 'arete_fin', label: 'Areté',    greek: 'Ἀρετή',   desc: 'Ukończony mezocykl',     icon: '⚜️', xp: 300 },
]

const STATS = [
  { key: 'strength',     label: 'Siła',        mock: 62 },
  { key: 'technique',    label: 'Technika',     mock: 74 },
  { key: 'consistency',  label: 'Regularność',  mock: 58 },
  { key: 'recovery',     label: 'Regeneracja',  mock: 70 },
  { key: 'hypertrophy',  label: 'Hipertrofia',  mock: 55 },
  { key: 'conditioning', label: 'Kondycja',     mock: 40 },
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

// ─── CHARACTER CARD ───────────────────────────────────────────────────────────

function CharacterCard({ profile, recentLogs }) {
  const xp        = 340 // mock — replace when xp_events table exists
  const nextXP    = 500
  const pct       = Math.min(100, Math.round((xp / nextXP) * 100))
  const archetype = getArchetype(xp)
  const initials  = (profile?.full_name ?? profile?.email ?? 'AR')
    .split(' ').map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 relative overflow-hidden">
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
            border: `2px solid ${archetype.color}`,
            boxShadow: `0 0 20px ${archetype.color}20`,
            color: archetype.color,
          }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Twoja postać</p>
          <p className="text-lg font-semibold text-warm leading-tight">{archetype.label}</p>
          <p className="text-sm font-medium" style={{ color: archetype.color }}>{archetype.greek}</p>
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
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${archetype.color}88, ${archetype.color})`,
          }}
        />
      </div>
    </div>
  )
}

// ─── STAT GRID ────────────────────────────────────────────────────────────────

function StatGrid() {
  return (
    <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Statystyki postaci</p>
      <div className="space-y-3">
        {STATS.map(({ key, label, mock }) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">{label}</span>
              <span className="text-gold font-medium">{mock}</span>
            </div>
            <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                style={{ width: `${mock}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted/40 mt-3 text-center">
        Dane rosną z treningami i check-inami
      </p>
    </div>
  )
}

// ─── CAMPAIGN PROGRESS ────────────────────────────────────────────────────────

function CampaignProgress({ activePlan, planInfo }) {
  if (!activePlan) return null
  const { currentWeek, maxWeeks, mesocycleName, stageIndex } = planInfo
  const pct = Math.round(((currentWeek - 1) / maxWeeks) * 100)

  return (
    <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Kampania</p>
          <p className="text-base font-semibold text-warm">{mesocycleName}</p>
        </div>
        <span className="text-xs text-muted border border-[rgba(212,181,112,0.18)] px-2 py-1 rounded-lg shrink-0 ml-2">
          Tyg. {currentWeek}/{maxWeeks}
        </span>
      </div>

      {/* Overall bar */}
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden mb-1">
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

function AchievementPreview({ recentLogs }) {
  const unlocked = {
    protos:    (recentLogs?.length ?? 0) > 0,
    askesis:   (recentLogs?.length ?? 0) >= 12,
    kleos:     false, // TODO: detect PR from logs
    arete_fin: false,
  }

  return (
    <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5">
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
                {ach.greek}
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
    <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5">
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

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ClientPortal({ profile, activePlan, recentLogs, questionnaire, coachName }) {
  const router   = useRouter()
  const [entered, setEntered] = useState(false)
  useEffect(() => setEntered(true), [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const safeLogs  = recentLogs || []
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
    <div className="dashboard-root min-h-screen bg-bg-deep text-warm font-body pb-24">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-bg-deep/80 backdrop-blur-md border-b border-[rgba(212,181,112,0.18)] px-6 py-4 flex items-center justify-between">
        <span className="font-display text-2xl text-gold tracking-widest">ARETÉ</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{firstName}</span>
          <button
            onClick={handleLogout}
            className="text-xs border border-[rgba(212,181,112,0.3)] text-gold px-3 py-1.5 rounded-lg hover:bg-gold hover:text-bg-deep transition"
          >
            Wyloguj
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className={`max-w-6xl mx-auto px-4 py-8 transition-opacity duration-500 ${entered ? 'opacity-100' : 'opacity-0'}`}>

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-muted mb-1">{todayDate}</p>
          <h1 className="text-4xl font-display text-gold">Witaj, {firstName}</h1>
        </div>

        {/* 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">

          {/* ── LEFT ── */}
          <div className="space-y-4">

            {/* Onboarding questionnaire CTA — pokazuj dopóki ankieta nie jest wypełniona */}
            {!questionnaire && (
              <button
                onClick={() => router.push('/client/questionnaire')}
                className="w-full text-left bg-gradient-to-br from-gold/10 to-gold/[0.02] border border-gold/40 rounded-2xl p-6 relative overflow-hidden hover:border-gold transition group"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/[0.06] rounded-full blur-3xl pointer-events-none" />
                <p className="text-[10px] text-gold uppercase tracking-widest mb-3">Krok pierwszy</p>
                <h2 className="text-2xl font-display text-warm mb-2">Wypełnij ankietę onboardingową</h2>
                <p className="text-sm text-muted leading-relaxed mb-5 max-w-prose">
                  Pomoże trenerowi przygotować spersonalizowany plan — cele, staż, sprzęt, kontuzje, priorytetowe partie. Zajmuje ok. 5 minut.
                </p>
                <span className="inline-flex items-center gap-2 bg-gold text-bg-deep font-bold py-3 px-5 rounded-xl text-sm tracking-wide group-hover:opacity-90 transition">
                  Zacznij ankietę →
                </span>
              </button>
            )}

            {/* Today Quest */}
            <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/[0.04] rounded-full blur-3xl pointer-events-none" />
              <p className="text-[10px] text-gold uppercase tracking-widest mb-3">Dzisiejszy quest</p>
              <h2 className="text-2xl font-display text-warm mb-2">
                {planInfo.isRestDay ? 'Regeneracja' : planInfo.sessionName}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-muted mb-5">
                <span>{planInfo.exerciseCount} ćwiczeń</span>
                <span>~{planInfo.estimatedTime} min</span>
                <span>RIR {planInfo.rir}</span>
                <span className="text-success font-medium">+120 XP</span>
              </div>
              {activePlan && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-muted mb-1.5">
                    <span>Tydzień {planInfo.currentWeek}/{planInfo.maxWeeks}</span>
                    <span>{Math.round(((planInfo.currentWeek - 1) / planInfo.maxWeeks) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold/70 to-gold rounded-full"
                      style={{ width: `${Math.round(((planInfo.currentWeek - 1) / planInfo.maxWeeks) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={() => router.push('/client/workout')}
                disabled={!activePlan}
                className="w-full bg-gold text-bg-deep font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition text-sm tracking-wide disabled:opacity-50"
              >
                {activePlan ? 'Rozpocznij trening →' : 'Plan w przygotowaniu'}
              </button>
            </div>

            {/* Campaign Progress */}
            <CampaignProgress activePlan={activePlan} planInfo={planInfo} />

            {/* Activity Feed */}
            <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-6">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Ostatnia aktywność</p>
              {safeLogs.length === 0 ? (
                <p className="text-muted text-sm text-center py-6">
                  Pierwszy trening otworzy historię.
                </p>
              ) : (
                <div className="divide-y divide-[rgba(212,181,112,0.08)]">
                  {safeLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-sm text-success shrink-0">
                          ⚡
                        </div>
                        <div>
                          <p className="text-sm font-medium">{log.day_label || 'Trening ukończony'}</p>
                          <p className="text-xs text-muted">Sesja treningowa</p>
                        </div>
                      </div>
                      <span className="text-muted text-xs shrink-0">{formatDate(log.session_date || log.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => router.push('/client/workout')} className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 text-left hover:border-gold transition">
                <span className="text-2xl block mb-2">⚡</span>
                <p className="text-sm font-medium">Loguj trening</p>
                <p className="text-xs text-muted">Nowa sesja</p>
              </button>
              <button onClick={() => router.push('/client/checkin')} className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 text-left hover:border-gold transition">
                <span className="text-2xl block mb-2">◈</span>
                <p className="text-sm font-medium">Check-in</p>
                <p className="text-xs text-muted">Cotygodniowy</p>
              </button>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="space-y-4">
            <CharacterCard profile={profile} recentLogs={safeLogs} />
            <StatGrid />
            <AchievementPreview recentLogs={safeLogs} />

            {/* Coach Message */}
            <CoachMessageCard coachName={coachName} />

            {/* Plan link */}
            {activePlan && (
              <button
                onClick={() => router.push('/client/plan')}
                className="w-full flex items-center justify-between bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl px-5 py-4 hover:border-gold transition group"
              >
                <div className="text-left">
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Plan treningowy</p>
                  <p className="text-sm font-medium">{planInfo.mesocycleName}</p>
                </div>
                <span className="text-muted group-hover:text-gold transition">→</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-deep/95 backdrop-blur-md border-t border-[rgba(212,181,112,0.18)] px-4 py-3 flex justify-around z-50">
        {[
          { href: '/client',         icon: '⌂', label: 'Home'    },
          { href: '/client/workout', icon: '⚡', label: 'Trening' },
          { href: '/client/plan',    icon: '▦', label: 'Plan'     },
          { href: '/client/checkin', icon: '✓', label: 'Check-in' },
        ].map(({ href, icon, label }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-1 text-muted hover:text-gold transition"
          >
            <span className="text-lg">{icon}</span>
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
