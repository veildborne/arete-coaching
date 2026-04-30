'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const tiers = {
  paideia: { name: 'Paideia', tone: 'text-text-muted border-white/10 bg-white/[0.03]' },
  askesis: { name: 'Askesis', tone: 'text-gold border-gold/25 bg-gold/10' },
  arete: { name: 'Areté', tone: 'text-gold border-gold/35 bg-gold/15' },
  inperson: { name: 'Stacjonarny', tone: 'text-text border-white/10 bg-white/[0.04]' },
}

const stages = ['Fundament', 'Akumulacja', 'Wzrost', 'Intensyfikacja', 'Próba', 'Regeneracja']

// MOCK — do podpięcia z Supabase
const characterStats = [
  { label: 'Strength', value: 60 },
  { label: 'Consistency', value: 80 },
  { label: 'Recovery', value: 45 },
  { label: 'Nutrition', value: 70 },
  { label: 'Technique', value: 55 },
]

// MOCK — do podpięcia z Supabase
const xpHistory = ['+80 XP Trening ukończony', '+40 XP Check-in']

function getInitials(name, email) {
  const source = name || email || 'Areté'
  const parts = source.trim().split(/\s+/)
  if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

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

function ProgressRing({ current, max }) {
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0
  const circumference = 2 * Math.PI * 38
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="-rotate-90" width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
        <circle cx="56" cy="56" r="38" fill="none" stroke="rgba(212,181,112,0.12)" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r="38"
          fill="none"
          stroke="#D4B570"
          strokeLinecap="round"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-semibold text-gold">{pct}%</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-text-muted">mezocykl</span>
      </div>
    </div>
  )
}

function Panel({ children, className = '' }) {
  return (
    <section className={`rounded-lg border border-border bg-surface/85 shadow-2xl shadow-black/20 ${className}`}>
      {children}
    </section>
  )
}

export default function ClientPortal({ profile, activePlan, recentLogs }) {
  const router = useRouter()
  const [entered, setEntered] = useState(false)

  useEffect(() => setEntered(true), [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const safeLogs = recentLogs || []
  const tier = tiers[profile?.package_tier] || { name: 'Nie przypisano', tone: 'text-text-muted border-white/10 bg-white/[0.03]' }
  const firstName = profile?.full_name?.split(' ')?.[0] || 'Kliencie'

  const planInfo = useMemo(() => {
    const payload = getPlanPayload(activePlan)
    const currentWeek = activePlan?.current_week || payload.current_week || 1
    const maxWeeks = activePlan?.mesocycle_weeks || payload.mesocycle_weeks || 6
    const session = getTodaySession(activePlan)
    const rir = getTargetRir(activePlan, currentWeek)
    const exerciseCount = session?.exercises?.length || activePlan?.exercise_count || 6
    const estimatedTime = Math.max(45, Math.min(90, exerciseCount * 10))
    const stageIndex = Math.min(stages.length - 1, Math.max(0, Math.ceil((currentWeek / maxWeeks) * stages.length) - 1))

    return {
      currentWeek,
      maxWeeks,
      sessionName: session?.name || activePlan?.session_name || activePlan?.name || 'Upper A',
      rir,
      exerciseCount,
      estimatedTime,
      stageIndex,
      mesocycleName: activePlan?.name || payload.split_name || 'Podstawa',
      isRestDay: activePlan && !session && new Date().getDay() === 0,
    }
  }, [activePlan])

  const heroStatus = activePlan
    ? `Dzisiaj: ${planInfo.sessionName} · Tydzień ${planInfo.currentWeek}/${planInfo.maxWeeks} · Cel: RIR ${planInfo.rir}`
    : 'Plan treningowy w przygotowaniu'

  return (
    <div className="min-h-screen bg-bg font-body text-text">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(212,181,112,0.13),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(71,209,140,0.08),transparent_24%)]" />

      <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <button onClick={() => router.push('/client')} className="font-display text-xl font-bold tracking-[0.28em] text-gold">
            ARETÉ
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-text">{profile?.full_name || firstName}</p>
              <p className="text-xs text-text-muted">{profile?.email}</p>
            </div>
            <span className={`hidden rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] sm:inline-flex ${tier.tone}`}>
              {tier.name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-muted transition hover:border-gold hover:text-gold"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-6 md:pb-12">
        <section className={`fade-in grid gap-4 lg:grid-cols-[1fr_360px] ${entered ? '' : 'opacity-0'}`}>
          <Panel className="overflow-hidden p-5 md:p-8">
            <div className="mb-6 h-px w-full bg-[linear-gradient(90deg,transparent,#D4B570,transparent)] opacity-60" />
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">
                  {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <h1 className="font-display text-4xl font-semibold leading-tight text-text md:text-6xl">
                  Witaj, <span className="text-gold">{firstName}</span>
                </h1>
                <p className="mt-4 max-w-3xl text-base text-text-muted md:text-lg">{heroStatus}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push(activePlan ? '/client/workout' : '/client/plan')}
                    className="pulse-gold rounded-md bg-gold px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-bg transition hover:bg-[#e0c17b]"
                  >
                    {activePlan ? 'Zacznij trening' : 'Zobacz plan'}
                  </button>
                  <button
                    onClick={() => router.push('/client/plan')}
                    className="rounded-md border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-gold transition hover:border-gold"
                  >
                    Plan
                  </button>
                </div>
              </div>
              <ProgressRing current={planInfo.currentWeek} max={planInfo.maxWeeks} />
            </div>
          </Panel>

          <Panel className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">Today Quest</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-text">
                  {planInfo.isRestDay ? 'Regeneracja' : planInfo.sessionName}
                </h2>
              </div>
              <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
                +120 XP
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-text-muted">
              {planInfo.isRestDay
                ? 'Dzień regeneracji · Spacer + stretching'
                : `${planInfo.exerciseCount} ćwiczeń · około ${planInfo.estimatedTime} min · cel RIR ${planInfo.rir}`}
            </p>
            <button
              onClick={() => router.push('/client/workout')}
              disabled={!activePlan}
              className="mt-6 w-full rounded-md bg-gold py-4 text-sm font-black uppercase tracking-[0.22em] text-bg transition hover:bg-[#e0c17b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              START
            </button>
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel className="card-hover p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">Campaign Progress</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-text">Mezocykl: {planInfo.mesocycleName}</h2>
              </div>
              <span className="text-sm text-text-muted">{planInfo.currentWeek}/{planInfo.maxWeeks}</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {stages.map((stage, index) => (
                <div
                  key={stage}
                  className={`rounded-md border px-3 py-3 text-center text-xs font-semibold transition ${
                    index === planInfo.stageIndex
                      ? 'border-gold bg-gold/15 text-gold'
                      : index < planInfo.stageIndex
                        ? 'border-success/25 bg-success/10 text-success'
                        : 'border-white/10 bg-white/[0.03] text-text-muted'
                  }`}
                >
                  {stage}
                </div>
              ))}
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gold transition-all duration-1000"
                style={{ width: `${Math.min(100, (planInfo.currentWeek / planInfo.maxWeeks) * 100)}%` }}
              />
            </div>
          </Panel>

          <Panel className="card-hover p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">Character Stats</p>
            <div className="mt-5 space-y-4">
              {characterStats.map(stat => (
                <div key={stat.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-text">{stat.label}</span>
                    <span className="text-text-muted">{stat.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#9E8650,#D4B570)] transition-all duration-1000"
                      style={{ width: entered ? `${stat.value}%` : 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <Panel className="card-hover p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">Level</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <h2 className="font-display text-4xl font-semibold text-gold">3</h2>
                <p className="text-sm uppercase tracking-[0.18em] text-text-muted">Adept</p>
              </div>
              <p className="text-sm text-text-muted">340/500 XP</p>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-[68%] rounded-full bg-gold" />
            </div>
            <div className="mt-5 space-y-2">
              {xpHistory.map(item => (
                <div key={item} className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-text-muted">
                  {item}
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="card-hover p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-gold/10 font-display text-lg font-bold text-gold">
                AP
              </div>
              <div>
                <p className="font-semibold text-text">Alexander</p>
                <p className="text-xs text-text-muted">Dzisiaj</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-text-muted">
              W tym tygodniu pilnujemy techniki w RDL.
            </p>
          </Panel>

          <Panel className="card-hover p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">Quick Actions</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: 'Loguj trening', href: '/client/workout', disabled: false },
                { label: 'Check-in', href: '/client/checkin', disabled: false },
                { label: 'Statystyki', disabled: true },
                { label: 'Żywienie', disabled: true },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => action.href && router.push(action.href)}
                  disabled={action.disabled}
                  className="rounded-md border border-border bg-surface2/70 px-3 py-4 text-left text-sm font-semibold text-text transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {action.label}
                  {action.disabled && <span className="mt-1 block text-xs font-normal text-text-muted">wkrótce</span>}
                </button>
              ))}
            </div>
          </Panel>
        </section>

        <Panel className="card-hover mt-5 p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">Recent Activity</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-text">Historia pracy</h2>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">{safeLogs.length} wpisów</span>
          </div>

          {safeLogs.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-white/[0.02] p-8 text-center">
              <div className="text-4xl" aria-hidden="true">🦉</div>
              <p className="mt-4 text-sm text-text-muted">
                Jeszcze nie ma aktywności. Pierwszy trening otworzy historię.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-white/10">
              {safeLogs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-gold">✓</div>
                    <div>
                      <p className="font-medium text-text">{log.day_label || log.session_name || 'Trening ukończony'}</p>
                      <p className="text-xs text-text-muted">Sesja treningowa</p>
                    </div>
                  </div>
                  <span className="text-sm text-text-muted">{formatDate(log.session_date || log.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/90 px-2 py-2 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1 text-[11px]">
          {[
            { label: 'Home', icon: '⌂', href: '/client', disabled: false },
            { label: 'Trening', icon: '⚡', href: '/client/workout', disabled: false },
            { label: 'Plan', icon: '▦', href: '/client/plan', disabled: false },
            { label: 'Check-in', icon: '✓', href: '/client/checkin', disabled: false },
            { label: 'Profil', icon: '○', disabled: true },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => item.href && router.push(item.href)}
              disabled={item.disabled}
              className="flex flex-col items-center gap-1 rounded-md px-2 py-2 text-text-muted transition hover:bg-white/5 hover:text-gold disabled:opacity-40"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
