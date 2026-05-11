'use client'
import { useMemo, useState } from 'react'
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
  const sessionsPerWeek = typeof sessions === 'object' && !Array.isArray(sessions)
    ? Object.keys(sessions).length : 0
  if (!sessionsPerWeek) return null
  const expectedSessions = sessionsPerWeek * 4
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

function ClientCard({ client, onProfile, onNewPlan }) {
  const initials = getInitials(client.full_name, client.email)
  const noTrainingDays = daysSince(client.logs?.[0]?.session_date)
  const noCheckinDays = daysSince(client.checkins?.[0]?.created_at)
  const needsAttention = (noTrainingDays !== null && noTrainingDays > 5) || (noCheckinDays !== null && noCheckinDays > 7)
  const hasPlan = (client.plans || []).some(p => p.is_active)
  const compliance = calculateCompliance(client.logs, client.plans)
  const tier = client.package_tier || client.tier
  const tierStyle = TIER_COLORS[tier] || TIER_COLORS.askesis
  const activePlanName = (client.plans || []).find(p => p.is_active)?.plan_data?.split_name
  const statusColor = needsAttention ? '#EF6B73' : !hasPlan ? '#E8A020' : '#47D18C'

  return (
    <div onClick={onProfile}
      className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-5 hover:border-[rgba(212,181,112,0.35)] transition cursor-pointer group">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-base shrink-0"
          style={{ background: 'rgba(212,181,112,0.1)', border: `1.5px solid rgba(212,181,112,0.3)`, color: '#D4B570' }}>
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
          <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium tracking-wide"
            style={{ color: tierStyle.color, border: `1px solid ${tierStyle.border}`, background: `${tierStyle.color}10` }}>
            {TIER_LABELS[tier] || tier}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Treningi', value: client.logs?.length ?? 0 },
          { label: 'Ost. trening', value: noTrainingDays === null ? '—' : noTrainingDays < 1 ? 'dziś' : `${Math.floor(noTrainingDays)}d` },
          { label: 'Realizacja planu', value: compliance === null ? '—' : `${compliance}%`, color: compliance === null ? '#8F9AAF' : compliance >= 80 ? '#47D18C' : compliance >= 60 ? '#E8A020' : '#EF6B73' },
        ].map(m => (
          <div key={m.label} className="bg-bg-deep rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted mb-0.5">{m.label}</p>
            <p className="text-sm font-semibold" style={{ color: m.color || '#f2eee8' }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="min-h-[18px] mb-3">
        {!hasPlan && <p className="text-[11px] text-[#E8A020]">⚠ Brak aktywnego planu</p>}
        {hasPlan && activePlanName && <p className="text-[11px] text-[#47D18C]">✓ {activePlanName}</p>}
        {needsAttention && hasPlan && (
          <p className="text-[11px] text-danger">
            {noTrainingDays !== null && noTrainingDays > 5
              ? `⚠ Brak treningu ${Math.floor(noTrainingDays)} dni`
              : `⚠ Brak check-inu ${Math.floor(noCheckinDays)} dni`}
          </p>
        )}
      </div>

      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
        <button onClick={onProfile}
          className="flex-1 text-xs border border-[rgba(212,181,112,0.25)] text-gold py-2 rounded-lg hover:bg-gold hover:text-bg-deep transition">
          Profil
        </button>
        <button onClick={onNewPlan}
          className="flex-1 text-xs border border-[rgba(212,181,112,0.25)] text-gold py-2 rounded-lg hover:bg-gold hover:text-bg-deep transition">
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
      const res = await fetch('/api/invite-client', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, full_name: fullName }) })
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
          <h3 className="font-display text-xl text-gold">Zaproś klienta</h3>
          <button onClick={handleClose} className="text-muted hover:text-warm text-2xl leading-none">×</button>
        </div>
        {successMsg ? (
          <div className="space-y-4">
            <div className="bg-[#0F2A1A] border border-[rgba(71,209,140,0.3)] text-success text-sm rounded-lg p-4 text-center">✓ {successMsg}</div>
            <button onClick={handleClose} className="w-full bg-gold text-bg-deep py-2.5 rounded-lg font-medium hover:opacity-90">Zamknij</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-widest mb-1.5">Imię i nazwisko</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required disabled={submitting}
                className="w-full bg-bg-deep border border-[rgba(212,181,112,0.18)] rounded-lg px-3 py-2.5 text-warm focus:outline-none focus:border-gold text-sm" placeholder="Jan Kowalski" />
            </div>
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-widest mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={submitting}
                className="w-full bg-bg-deep border border-[rgba(212,181,112,0.18)] rounded-lg px-3 py-2.5 text-warm focus:outline-none focus:border-gold text-sm" placeholder="klient@example.com" />
            </div>
            {error && <div className="bg-[#2A1414] border border-[rgba(239,107,115,0.3)] text-danger text-sm rounded-lg p-3">{error}</div>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={handleClose} className="flex-1 border border-[rgba(212,181,112,0.3)] text-gold py-2.5 rounded-lg text-sm hover:bg-gold/10">Anuluj</button>
              <button type="submit" disabled={submitting} className="flex-1 bg-gold text-bg-deep py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Wysyłanie…' : 'Wyślij zaproszenie'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function DashboardClient({ profile, clients }) {
  const router = useRouter()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('overview')
  const safeClients = clients || []

  const stats = useMemo(() => {
    const active = safeClients.length
    const needsAttention = safeClients.filter(c => {
      const noTraining = daysSince(c.logs?.[0]?.session_date)
      const noCheckin = daysSince(c.checkins?.[0]?.created_at)
      return (noTraining !== null && noTraining > 5) || (noCheckin !== null && noCheckin > 7)
    }).length
    const withoutPlan = safeClients.filter(c => !(c.plans || []).some(p => p.is_active)).length
    const totalLogs = safeClients.reduce((sum, c) => sum + (c.logs?.length || 0), 0)
    const pendingCheckins = safeClients.reduce((sum, c) => sum + (c.checkins || []).filter(ci => !ci.coach_feedback).length, 0)
    return { active, needsAttention, withoutPlan, totalLogs, pendingCheckins }
  }, [safeClients])

  const attentionClients = safeClients.filter(c => {
    const noTraining = daysSince(c.logs?.[0]?.session_date)
    const noCheckin = daysSince(c.checkins?.[0]?.created_at)
    return (noTraining !== null && noTraining > 5) || (noCheckin !== null && noCheckin > 7)
  })

  const recentEvents = useMemo(() => {
    const events = []
    safeClients.forEach(client => {
      const name = client.full_name?.split(' ')?.[0] || 'Klient'
      if (client.logs?.[0]) events.push({ id: `log-${client.id}`, icon: '⚡', color: '#47D18C', text: `${name} ukończył trening`, date: client.logs[0].session_date || client.logs[0].created_at, clientId: client.id })
      if (client.checkins?.[0]) {
        const pending = !client.checkins[0].coach_feedback
        events.push({ id: `ci-${client.id}`, icon: '◈', color: pending ? '#EF6B73' : '#D4B570', text: `${name} wysłał check-in${pending ? ' — czeka na odpowiedź' : ''}`, date: client.checkins[0].submitted_at || client.checkins[0].created_at, clientId: client.id, urgent: pending })
      }
    })
    return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)
  }, [safeClients])

  const firstName = profile?.full_name?.split(' ')?.[0] || 'Trenerze'

  const NAV_ITEMS = [
    { id: 'overview', icon: '⌂', label: 'Przegląd' },
    { id: 'clients', icon: '◎', label: 'Klienci' },
    { id: 'attention', icon: '⚠', label: 'Uwaga', badge: stats.needsAttention },
    { id: 'checkins', icon: '◈', label: 'Check-iny', badge: stats.pendingCheckins },
  ]

  return (
    <div className="min-h-screen bg-transparent text-warm font-body flex">

      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[rgba(212,181,112,0.12)] bg-black/20 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-6 border-b border-[rgba(212,181,112,0.1)]">
          <div>
            <span className="font-display text-2xl text-gold tracking-widest">ARETÉ</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-gold/20 text-gold/40 tracking-widest ml-2">α 0.1</span>
          </div>
          <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Panel Trenera</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${activeNav === item.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted hover:text-warm hover:bg-white/5'}`}>
              <span className="text-base">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge > 0 && (
                <span className="text-[10px] bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[rgba(212,181,112,0.1)] space-y-2">
          <button onClick={() => setInviteOpen(true)}
            className="w-full bg-gold text-bg-deep py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition">
            + Dodaj klienta
          </button>
          <div className="flex items-center gap-2 px-1 pt-1">
            <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-display text-gold text-xs font-bold">
              {getInitials(profile?.full_name, profile?.email)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-warm truncate">{profile?.full_name || profile?.email}</p>
            </div>
            <button onClick={async () => { const s = createClient(); await s.auth.signOut(); window.location.href = '/' }}
              className="text-[10px] text-muted hover:text-danger transition">↩</button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP NAV */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-[rgba(212,181,112,0.15)] px-4 py-3 flex items-center justify-between">
        <div>
          <span className="font-display text-xl text-gold tracking-widest">ARETÉ</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-gold/20 text-gold/40 tracking-widest ml-2">α 0.1</span>
        </div>
        <button onClick={() => setInviteOpen(true)} className="bg-gold text-bg-deep px-3 py-1.5 rounded-lg text-xs font-semibold">+ Dodaj</button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 lg:p-8 p-4 pt-20 lg:pt-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-muted mb-1">{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="font-display text-3xl text-gold">Witaj, {firstName}</h1>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Klienci', value: stats.active, icon: '◎', color: '#D4B570' },
            { label: 'Wymagają uwagi', value: stats.needsAttention, icon: '⚠', color: stats.needsAttention > 0 ? '#EF6B73' : '#47D18C' },
            { label: 'Bez planu', value: stats.withoutPlan, icon: '▭', color: stats.withoutPlan > 0 ? '#E8A020' : '#47D18C' },
            { label: 'Treningi', value: stats.totalLogs, icon: '⚡', color: '#D4B570' },
            { label: 'Check-iny', value: stats.pendingCheckins, icon: '◈', color: stats.pendingCheckins > 0 ? '#EF6B73' : '#47D18C' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-muted uppercase tracking-widest">{label}</p>
                <span style={{ color }}>{icon}</span>
              </div>
              <p className="text-2xl font-display" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* 2-COL LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          {/* LEFT */}
          <div className="space-y-6">

            {/* NEEDS ATTENTION */}
            {attentionClients.length > 0 && (
              <div className="bg-surface border border-[rgba(239,107,115,0.25)] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-danger text-lg">⚠</span>
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
                      <div key={client.id} onClick={() => router.push(`/dashboard/client/${client.id}`)}
                        className="flex items-center gap-3 bg-bg-deep border border-[rgba(239,107,115,0.12)] rounded-xl p-3 cursor-pointer hover:border-danger/40 transition">
                        <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center font-display text-danger font-bold text-xs shrink-0">
                          {getInitials(client.full_name, client.email)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-warm">{client.full_name || 'Bez nazwy'}</p>
                          <p className="text-xs text-danger">{flags.join(' • ')}</p>
                        </div>
                        <span className="text-muted">→</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CLIENTS GRID */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl text-gold">Klienci</h2>
                <span className="text-xs text-muted">{safeClients.length} {safeClients.length === 1 ? 'osoba' : safeClients.length < 5 ? 'osoby' : 'osób'}</span>
              </div>
              {safeClients.length === 0 ? (
                <div className="bg-surface border border-dashed border-[rgba(212,181,112,0.2)] rounded-2xl p-12 text-center">
                  <p className="text-4xl mb-4 opacity-20">◎</p>
                  <p className="text-warm font-medium mb-2">Brak klientów</p>
                  <p className="text-muted text-sm mb-6">Dodaj pierwszego klienta aby zacząć.</p>
                  <button onClick={() => setInviteOpen(true)} className="bg-gold text-bg-deep px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90">+ Dodaj klienta</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                  {safeClients.map(client => (
                    <ClientCard key={client.id} client={client}
                      onProfile={() => router.push(`/dashboard/client/${client.id}`)}
                      onNewPlan={() => router.push(`/dashboard/client/${client.id}/plan/new`)} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">

            {/* QUICK ACTIONS */}
            <div className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-5">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Szybkie akcje</p>
              <div className="space-y-2">
                {[
                  { label: '+ Dodaj klienta', action: () => setInviteOpen(true), color: 'gold' },
                  { label: '→ Wszyscy klienci', action: () => setActiveNav('clients'), color: 'muted' },
                  { label: '⚠ Wymagający uwagi', action: () => setActiveNav('attention'), color: stats.needsAttention > 0 ? 'danger' : 'muted' },
                ].map(({ label, action, color }) => (
                  <button key={label} onClick={action}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition ${color === 'gold' ? 'border-gold/30 text-gold hover:bg-gold/10' : color === 'danger' ? 'border-danger/30 text-danger hover:bg-danger/10' : 'border-white/8 text-muted hover:text-warm hover:bg-white/5'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVITY FEED */}
            {recentEvents.length > 0 && (
              <div className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-5">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Ostatnia aktywność</p>
                <div className="space-y-2">
                  {recentEvents.map(event => (
                    <div key={event.id} onClick={() => router.push(`/dashboard/client/${event.clientId}`)}
                      className="flex items-center gap-3 py-2 border-b border-[rgba(212,181,112,0.06)] last:border-0 cursor-pointer hover:opacity-80 transition">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                        style={{ background: `${event.color}15`, border: `1px solid ${event.color}30`, color: event.color }}>
                        {event.icon}
                      </div>
                      <p className="flex-1 text-xs text-warm leading-snug">{event.text}</p>
                      {event.urgent && <span className="text-[10px] text-danger border border-danger/30 px-1.5 py-0.5 rounded-full shrink-0">!</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PENDING CHECKINS */}
            {stats.pendingCheckins > 0 && (
              <div className="bg-surface border border-[rgba(239,107,115,0.15)] rounded-2xl p-5">
                <p className="text-[10px] text-danger uppercase tracking-widest mb-3">Oczekujące check-iny ({stats.pendingCheckins})</p>
                <div className="space-y-2">
                  {safeClients.filter(c => (c.checkins || []).some(ci => !ci.coach_feedback)).map(client => (
                    <div key={client.id} onClick={() => router.push(`/dashboard/client/${client.id}`)}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
                      <div className="w-6 h-6 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger text-[10px] font-bold shrink-0">
                        {getInitials(client.full_name, client.email)}
                      </div>
                      <p className="text-xs text-warm">{client.full_name || 'Bez nazwy'}</p>
                      <span className="ml-auto text-[10px] text-danger">odpowiedz →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPLIANCE SUMMARY */}
            {safeClients.length > 0 && (() => {
              const withCompliance = safeClients
                .map(c => ({ c, pct: calculateCompliance(c.logs, c.plans) }))
                .filter(({ pct }) => pct !== null)
                .sort((a, b) => a.pct - b.pct)
              if (withCompliance.length === 0) return null
              const avgCompliance = Math.round(withCompliance.reduce((s, { pct }) => s + pct, 0) / withCompliance.length)
              return (
                <div className="bg-surface border border-[rgba(212,181,112,0.12)] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] text-muted uppercase tracking-widest">Realizacja — 4 tygodnie</p>
                    <span className="text-sm font-semibold" style={{ color: avgCompliance >= 80 ? '#47D18C' : avgCompliance >= 60 ? '#E8A020' : '#EF6B73' }}>
                      śr. {avgCompliance}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    {withCompliance.map(({ c, pct }) => (
                      <div key={c.id} onClick={() => router.push(`/dashboard/client/${c.id}`)}
                        className="cursor-pointer hover:opacity-80 transition">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-warm">{c.full_name?.split(' ')[0] || 'Klient'}</span>
                          <span style={{ color: pct >= 80 ? '#47D18C' : pct >= 60 ? '#E8A020' : '#EF6B73' }}>{pct}%</span>
                        </div>
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: pct >= 80 ? '#47D18C' : pct >= 60 ? '#E8A020' : '#EF6B73' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-xl border-t border-[rgba(212,181,112,0.15)] px-4 py-3 flex justify-around z-50">
        {NAV_ITEMS.map(({ id, icon, label, badge }) => (
          <button key={id} onClick={() => setActiveNav(id)}
            className={`flex flex-col items-center gap-1 relative ${activeNav === id ? 'text-gold' : 'text-muted'}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-[10px]">{label}</span>
            {badge > 0 && <span className="absolute -top-1 -right-1 text-[9px] bg-danger text-white rounded-full w-4 h-4 flex items-center justify-center">{badge}</span>}
          </button>
        ))}
      </nav>

      <InviteClientModal open={inviteOpen} onClose={() => setInviteOpen(false)} onSuccess={() => router.refresh()} />
    </div>
  )
}
