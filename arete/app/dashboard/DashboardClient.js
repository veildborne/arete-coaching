'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function getInitials(name, email) {
  const source = name || email || 'AR'
  const parts = source.trim().split(/\s+/)
  if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

function daysSince(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  return (Date.now() - date.getTime()) / 86400000
}

function calculateCompliance(logs, plans) {
  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  const recentLogs = (logs || []).filter(log => new Date(log.session_date) >= fourWeeksAgo)
  const activePlan = (plans || []).find(p => p.is_active)
  if (!activePlan) return null
  const planData = activePlan.plan_data || {}
  const sessions = planData.sessions || {}
  const sessionsPerWeek = Object.keys(sessions).length
  const expectedSessions = sessionsPerWeek * 4
  if (expectedSessions === 0) return null
  const completedSessions = recentLogs.filter(log => log.completed !== false).length
  return Math.round((completedSessions / expectedSessions) * 100)
}

const TIER_LABELS = { paideia: 'Paideia', askesis: 'Askesis', arete: 'Areté', stacjonarny: 'Stacj.' }
const TIER_COLORS = {
  paideia:     { color: '#a07850', border: 'rgba(160,120,80,0.4)' },
  askesis:     { color: '#8a9db5', border: 'rgba(138,157,181,0.4)' },
  arete:       { color: '#D4B570', border: 'rgba(212,181,112,0.5)' },
  stacjonarny: { color: '#6b7280', border: 'rgba(107,114,128,0.4)' },
}

function ClientCard({ client }) {
  const router = useRouter()
  const initials = getInitials(client.full_name, client.email)
  const noTrainingDays = daysSince(client.logs?.[0]?.session_date)
  const noCheckinDays = daysSince(client.checkins?.[0]?.created_at)
  const needsAttention = (noTrainingDays !== null && noTrainingDays > 5) || (noCheckinDays !== null && noCheckinDays > 7)
  const hasPlan = (client.plans || []).some(p => p.is_active)
  const compliance = calculateCompliance(client.logs, client.plans)
  const tier = client.package_tier || client.tier
  const tierStyle = TIER_COLORS[tier] || TIER_COLORS.askesis

  const statusColor = needsAttention ? '#EF6B73' : !hasPlan ? '#E8A020' : '#47D18C'

  return (
    <div
      onClick={() => router.push(`/dashboard/client/${client.id}`)}
      className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-5 hover:border-[rgba(212,181,112,0.4)] transition cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-base shrink-0"
          style={{ background: 'rgba(212,181,112,0.1)', border: `1.5px solid rgba(212,181,112,0.3)`, color: '#D4B570' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-medium text-warm text-sm truncate">{client.full_name || 'Bez nazwy'}</p>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColor }} />
          </div>
          <p className="text-xs text-muted truncate">{client.email}</p>
        </div>
        {tier && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium tracking-wide"
            style={{ color: tierStyle.color, border: `1px solid ${tierStyle.border}`, background: `${tierStyle.color}10` }}
          >
            {TIER_LABELS[tier] || tier}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-bg-deep rounded-lg p-2 text-center">
          <p className="text-[10px] text-muted mb-0.5">Treningi</p>
          <p className="text-sm font-semibold text-warm">{client.logs?.length ?? 0}</p>
        </div>
        <div className="bg-bg-deep rounded-lg p-2 text-center">
          <p className="text-[10px] text-muted mb-0.5">Ost. trening</p>
          <p className="text-sm font-semibold text-warm">
            {noTrainingDays === null ? '—' : noTrainingDays < 1 ? 'dziś' : `${Math.floor(noTrainingDays)}d`}
          </p>
        </div>
        <div className="bg-bg-deep rounded-lg p-2 text-center">
          <p className="text-[10px] text-muted mb-0.5">Compliance</p>
          <p className="text-sm font-semibold" style={{
            color: compliance === null ? '#8F9AAF' : compliance >= 80 ? '#47D18C' : compliance >= 60 ? '#E8A020' : '#EF6B73'
          }}>
            {compliance === null ? '—' : `${compliance}%`}
          </p>
        </div>
      </div>

      {/* Flags */}
      <div className="min-h-[18px] mb-3">
        {!hasPlan && <p className="text-[11px] text-[#E8A020]">⚠ Brak aktywnego planu</p>}
        {hasPlan && (
          <p className="text-[11px] text-[#47D18C]">
            ✓ {(client.plans || []).find(p => p.is_active)?.plan_data?.split_name || 'Plan aktywny'}
          </p>
        )}
        {needsAttention && hasPlan && (
          <p className="text-[11px] text-danger">
            {noTrainingDays !== null && noTrainingDays > 5 ? `⚠ Brak treningu ${Math.floor(noTrainingDays)} dni` : `⚠ Brak check-inu ${Math.floor(noCheckinDays)} dni`}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => router.push(`/dashboard/client/${client.id}`)}
          className="flex-1 text-xs border border-[rgba(212,181,112,0.25)] text-gold py-2 rounded-lg hover:bg-gold hover:text-bg-deep transition"
        >
          Profil
        </button>
        <button
          onClick={() => router.push(`/dashboard/client/${client.id}/plan/new`)}
          className="flex-1 text-xs border border-[rgba(212,181,112,0.25)] text-gold py-2 rounded-lg hover:bg-gold hover:text-bg-deep transition"
        >
          Nowy plan
        </button>
      </div>
    </div>
  )
}

function InviteClientModal({ open, onClose, onSuccess }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!open) return null

  const reset = () => { setFullName(''); setEmail(''); setError(''); setSuccessMsg(''); setSubmitting(false) }
  const handleClose = () => { if (submitting) return; reset(); onClose() }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccessMsg(''); setSubmitting(true)
    try {
      const res = await fetch('/api/invite-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: fullName }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) { setError(json.error || 'Nie udało się wysłać zaproszenia.'); setSubmitting(false); return }
      setSuccessMsg(`Zaproszenie wysłane na ${email}`)
      setSubmitting(false)
      onSuccess?.()
    } catch (err) { setError(err?.message || 'Błąd sieci.'); setSubmitting(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="w-full max-w-md bg-surface border border-[rgba(212,181,112,0.3)] rounded-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Nowy klient</p>
            <h3 className="font-display text-xl text-gold">Zaproś klienta</h3>
          </div>
          <button type="button" onClick={handleClose} disabled={submitting} className="text-muted hover:text-warm text-2xl leading-none disabled:opacity-50">×</button>
        </div>

        {successMsg ? (
          <div className="space-y-4">
            <div className="bg-[#0F2A1A] border border-[rgba(71,209,140,0.3)] text-success text-sm rounded-lg p-4 text-center">
              ✓ {successMsg}
            </div>
            <button type="button" onClick={handleClose} className="w-full bg-gold text-bg-deep py-2.5 rounded-lg font-medium hover:opacity-90 transition">Zamknij</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-widest mb-1.5">Imię i nazwisko</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required disabled={submitting}
                className="w-full bg-bg-deep border border-[rgba(212,181,112,0.18)] rounded-lg px-3 py-2.5 text-warm focus:outline-none focus:border-gold disabled:opacity-50 text-sm"
                placeholder="Jan Kowalski" />
            </div>
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-widest mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={submitting}
                className="w-full bg-bg-deep border border-[rgba(212,181,112,0.18)] rounded-lg px-3 py-2.5 text-warm focus:outline-none focus:border-gold disabled:opacity-50 text-sm"
                placeholder="klient@example.com" />
            </div>
            {error && <div className="bg-[#2A1414] border border-[rgba(239,107,115,0.3)] text-danger text-sm rounded-lg p-3">{error}</div>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={handleClose} disabled={submitting}
                className="flex-1 border border-[rgba(212,181,112,0.3)] text-gold py-2.5 rounded-lg text-sm hover:bg-gold/10 transition disabled:opacity-50">
                Anuluj
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 bg-gold text-bg-deep py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50">
                {submitting ? 'Wysyłanie…' : 'Wyślij zaproszenie'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function ActivityFeed({ clients }) {
  const events = []

  clients.forEach(client => {
    const name = client.full_name?.split(' ')?.[0] || 'Klient'

    // Ostatni trening
    if (client.logs?.[0]) {
      events.push({
        id: `log-${client.id}`,
        type: 'workout',
        icon: '⚡',
        color: '#47D18C',
        text: `${name} ukończył trening`,
        date: client.logs[0].session_date || client.logs[0].created_at,
        clientId: client.id,
      })
    }

    // Ostatni check-in
    if (client.checkins?.[0]) {
      const ci = client.checkins[0]
      const isPending = !ci.coach_feedback
      events.push({
        id: `ci-${client.id}`,
        type: 'checkin',
        icon: '◈',
        color: isPending ? '#EF6B73' : '#D4B570',
        text: `${name} wysłał check-in${isPending ? ' — czeka na odpowiedź' : ''}`,
        date: ci.submitted_at || ci.created_at,
        clientId: client.id,
        urgent: isPending,
      })
    }
  })

  // Sortuj po dacie malejąco
  events.sort((a, b) => new Date(b.date) - new Date(a.date))
  const recent = events.slice(0, 8)

  if (recent.length === 0) return null

  return (
    <div className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-6 mb-8">
      <h3 className="font-display text-lg text-gold mb-4">Ostatnia aktywność</h3>
      <div className="space-y-2">
        {recent.map(event => (
          <div
            key={event.id}
            onClick={() => {}}
            className="flex items-center gap-3 py-2 border-b border-[rgba(212,181,112,0.06)] last:border-0"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ background: `${event.color}15`, border: `1px solid ${event.color}30`, color: event.color }}
            >
              {event.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-warm">{event.text}</p>
            </div>
            <span className="text-[10px] text-muted shrink-0">
              {new Date(event.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
            </span>
            {event.urgent && (
              <span className="text-[10px] text-danger border border-danger/30 px-1.5 py-0.5 rounded-full shrink-0">!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardClient({ profile, clients }) {
  const router = useRouter()
  const [inviteOpen, setInviteOpen] = useState(false)
  const safeClients = clients || []

  const stats = useMemo(() => {
    const active = safeClients.filter(c => c.status === 'active').length || safeClients.length
    const needsAttention = safeClients.filter(c => {
      const noTraining = daysSince(c.logs?.[0]?.session_date)
      const noCheckin = daysSince(c.checkins?.[0]?.created_at)
      return (noTraining !== null && noTraining > 5) || (noCheckin !== null && noCheckin > 7)
    }).length
    const withoutPlan = safeClients.filter(c => !(c.plans || []).some(p => p.is_active)).length
    const totalLogs = safeClients.reduce((sum, c) => sum + (c.logs?.length || 0), 0)
    return { active, needsAttention, withoutPlan, totalLogs }
  }, [safeClients])

  const attentionClients = safeClients.filter(c => {
    const noTraining = daysSince(c.logs?.[0]?.session_date)
    const noCheckin = daysSince(c.checkins?.[0]?.created_at)
    return (noTraining !== null && noTraining > 5) || (noCheckin !== null && noCheckin > 7)
  })

  const firstName = profile?.full_name?.split(' ')?.[0] || 'Trenerze'

  return (
    <div className="dashboard-root min-h-screen bg-bg-deep text-warm font-body">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-bg-deep/90 backdrop-blur-md border-b border-[rgba(212,181,112,0.15)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl text-gold tracking-widest">ARETÉ</span>
            <span className="hidden sm:block text-[10px] text-muted uppercase tracking-widest border-l border-[rgba(212,181,112,0.2)] pl-3">Panel Trenera</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInviteOpen(true)}
              className="flex items-center gap-1.5 bg-gold text-bg-deep px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              <span>+</span>
              <span className="hidden sm:block">Dodaj klienta</span>
            </button>
            <span className="text-sm text-muted hidden md:block">{profile?.full_name || profile?.email}</span>
            <button
              onClick={async () => { const s = createClient(); await s.auth.signOut(); window.location.href = '/' }}
              className="border border-gold/30 text-gold px-3 py-1.5 rounded-lg text-xs hover:bg-gold/10 transition"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </nav>

      <InviteClientModal open={inviteOpen} onClose={() => setInviteOpen(false)} onSuccess={() => router.refresh()} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Greeting */}
        <div className="mb-8">
          <p className="text-sm text-muted mb-1">{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="font-display text-3xl text-gold">Witaj, {firstName}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Aktywni klienci', value: stats.active, icon: '◎', color: '#D4B570' },
            { label: 'Wymagają uwagi', value: stats.needsAttention, icon: '⚠', color: stats.needsAttention > 0 ? '#EF6B73' : '#47D18C' },
            { label: 'Bez planu', value: stats.withoutPlan, icon: '▭', color: stats.withoutPlan > 0 ? '#E8A020' : '#47D18C' },
            { label: 'Łączne treningi', value: stats.totalLogs, icon: '⚡', color: '#D4B570' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-muted uppercase tracking-widest">{label}</p>
                <span className="text-base" style={{ color }}>{icon}</span>
              </div>
              <p className="text-3xl font-display" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        <ActivityFeed clients={safeClients} />

        {/* Needs Attention */}
        {attentionClients.length > 0 && (
          <div className="bg-surface border border-[rgba(239,107,115,0.2)] rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-danger">⚠</span>
              <h3 className="font-display text-lg text-danger">Wymagają reakcji</h3>
              <span className="ml-auto text-xs text-danger border border-danger/30 px-2 py-0.5 rounded-full">{attentionClients.length}</span>
            </div>
            <div className="space-y-2">
              {attentionClients.map(client => {
                const noTraining = daysSince(client.logs?.[0]?.session_date)
                const noCheckin = daysSince(client.checkins?.[0]?.created_at)
                const flags = []
                if (noTraining !== null && noTraining > 5) flags.push(`Brak treningu ${Math.floor(noTraining)} dni`)
                if (noCheckin !== null && noCheckin > 7) flags.push(`Brak check-inu ${Math.floor(noCheckin)} dni`)
                return (
                  <div
                    key={client.id}
                    onClick={() => router.push(`/dashboard/client/${client.id}`)}
                    className="flex items-center gap-3 bg-bg-deep border border-[rgba(239,107,115,0.12)] rounded-xl p-3 cursor-pointer hover:border-danger/40 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center font-display text-danger font-bold text-xs shrink-0">
                      {getInitials(client.full_name, client.email)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm">{client.full_name || 'Bez nazwy'}</p>
                      <p className="text-xs text-danger">{flags.join(' • ')}</p>
                    </div>
                    <span className="text-muted text-sm">→</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Clients */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-gold">Klienci</h2>
          <span className="text-xs text-muted">{safeClients.length} {safeClients.length === 1 ? 'osoba' : safeClients.length < 5 ? 'osoby' : 'osób'}</span>
        </div>

        {safeClients.length === 0 ? (
          <div className="bg-surface border border-dashed border-[rgba(212,181,112,0.2)] rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4 opacity-20">◎</p>
            <p className="text-warm font-medium mb-2">Brak klientów</p>
            <p className="text-muted text-sm mb-6">Dodaj pierwszego klienta aby zacząć.</p>
            <button onClick={() => setInviteOpen(true)} className="bg-gold text-bg-deep px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition">
              + Dodaj klienta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeClients.map(client => <ClientCard key={client.id} client={client} />)}
          </div>
        )}
      </main>
    </div>
  )
}
