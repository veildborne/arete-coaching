'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

function getInitials(name, email) {
  const source = name || email || 'AR'
  const parts = source.trim().split(/\s+/)
  if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

function hasPlanField(client) {
  return ['active_plan', 'active_plan_id', 'current_plan_id', 'plan_id', 'has_active_plan'].some(key =>
    Object.prototype.hasOwnProperty.call(client, key)
  )
}

function hasNoAssignedPlan(client) {
  if (!hasPlanField(client)) return false
  return !client.active_plan && !client.active_plan_id && !client.current_plan_id && !client.plan_id && client.has_active_plan !== true
}

// ─── FAZA 6: Hypertrophy Engine helpers ──────────────────────────────────────

function calculateCompliance(logs, plans) {
  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

  const recentLogs = (logs || []).filter(log => {
    const date = new Date(log.session_date)
    return date >= fourWeeksAgo
  })

  const activePlan = (plans || []).find(p => p.is_active)
  if (!activePlan) return null

  const planData = activePlan.plan_data || activePlan.plan_json || {}
  const sessions = planData.sessions || []
  const sessionsPerWeek = sessions.length
  const expectedSessions = sessionsPerWeek * 4

  if (expectedSessions === 0) return null

  const completedSessions = recentLogs.filter(log => log.completed !== false).length
  const compliance = Math.round((completedSessions / expectedSessions) * 100)

  return { compliance, completed: completedSessions, expected: expectedSessions }
}

function daysSince(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  return (Date.now() - date.getTime()) / 86400000
}

function ClientCard({ client }) {
  const router = useRouter()
  const initials = getInitials(client.full_name, client.email)
  const needsPlan = hasNoAssignedPlan(client)

  // FAZA 6: Compliance & auto-flags
  const complianceData = calculateCompliance(client.logs, client.plans)
  const lastTraining = client.logs?.[0]?.session_date
  const lastCheckin = client.checkins?.[0]?.created_at
  const noTrainingDays = daysSince(lastTraining)
  const noCheckinDays = daysSince(lastCheckin)

  const needsAttention = (noTrainingDays !== null && noTrainingDays > 5) || (noCheckinDays !== null && noCheckinDays > 7)

  return (
    <div className="bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 hover:border-[#D4B570] transition cursor-pointer">
      <div className="flex items-center gap-3 mb-4 px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
        <div className="w-10 h-10 rounded-full bg-[#111B2E] border border-[rgba(212,181,112,0.3)] flex items-center justify-center font-serif text-[#D4B570] font-bold p-0 m-0">
          {initials}
        </div>
        <div className="block px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
          <p className="font-medium">{client.full_name || 'Bez nazwy'}</p>
          <p className="text-xs text-[#8F9AAF]">{client.email}</p>
          {needsPlan && <p className="text-xs text-[#EF6B73]">Brak aktywnego planu</p>}
          {complianceData && (
            <p className={`text-xs ${complianceData.compliance >= 80 ? 'text-[#47D18C]' : complianceData.compliance >= 60 ? 'text-[#E8A020]' : 'text-[#EF6B73]'}`}>
              Compliance: {complianceData.compliance}%
            </p>
          )}
        </div>
        <div className={`ml-auto w-2 h-2 rounded-full ${needsAttention ? 'bg-[#EF6B73]' : needsPlan ? 'bg-[#E8A020]' : 'bg-[#47D18C]'} block p-0 text-[#F4EFE3]`}></div>
      </div>
      <div className="flex gap-2 px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
        <button onClick={() => router.push(`/dashboard/client/${client.id}`)} className="flex-1 text-xs border border-[rgba(212,181,112,0.3)] text-[#D4B570] py-2 rounded-lg hover:bg-[#D4B570] hover:text-[#070B14] transition">Zobacz profil</button>
        <button onClick={() => router.push(`/dashboard/client/${client.id}/plan/new`)} className="flex-1 text-xs border border-[rgba(212,181,112,0.3)] text-[#D4B570] py-2 rounded-lg hover:bg-[#D4B570] hover:text-[#070B14] transition">Nowy plan</button>
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

  const reset = () => {
    setFullName('')
    setEmail('')
    setError('')
    setSuccessMsg('')
    setSubmitting(false)
  }

  const handleClose = () => {
    if (submitting) return
    reset()
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/invite-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: fullName }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setError(json.error || 'Nie udało się wysłać zaproszenia.')
        setSubmitting(false)
        return
      }
      setSuccessMsg(`Zaproszenie wysłane na ${email}`)
      setSubmitting(false)
      onSuccess?.()
    } catch (err) {
      setError(err?.message || 'Błąd sieci.')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={handleClose}>
      <div
        className="w-full max-w-md bg-[#0D1424] border border-[rgba(212,181,112,0.3)] rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl text-[#D4B570]">Zaproś klienta</h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="text-[#8F9AAF] hover:text-[#F4EFE3] text-xl leading-none disabled:opacity-50"
            aria-label="Zamknij"
          >
            ×
          </button>
        </div>

        {successMsg ? (
          <div className="space-y-4">
            <div className="bg-[#0F2A1A] border border-[rgba(71,209,140,0.3)] text-[#47D18C] text-sm rounded-lg p-3">
              {successMsg}
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-[#D4B570] text-[#070B14] py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              Zamknij
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#8F9AAF] uppercase tracking-widest mb-1">
                Imię i nazwisko
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={submitting}
                className="w-full bg-[#070B14] border border-[rgba(212,181,112,0.18)] rounded-lg px-3 py-2 text-[#F4EFE3] focus:outline-none focus:border-[#D4B570] disabled:opacity-50"
                placeholder="Jan Kowalski"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8F9AAF] uppercase tracking-widest mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                className="w-full bg-[#070B14] border border-[rgba(212,181,112,0.18)] rounded-lg px-3 py-2 text-[#F4EFE3] focus:outline-none focus:border-[#D4B570] disabled:opacity-50"
                placeholder="klient@example.com"
              />
            </div>

            {error && (
              <div className="bg-[#2A1414] border border-[rgba(239,107,115,0.3)] text-[#EF6B73] text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 border border-[rgba(212,181,112,0.3)] text-[#D4B570] py-2 rounded-lg hover:bg-[#D4B570] hover:text-[#070B14] transition disabled:opacity-50"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#D4B570] text-[#070B14] py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
              >
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
  const safeClients = clients || []

  const stats = useMemo(() => {
    const active = safeClients.filter(client => client.status === 'active').length || safeClients.length
    const inactive = safeClients.filter(client => client.status === 'inactive' || client.status === 'paused').length
    const checkinsDue = safeClients.filter(client => {
      const last = client.last_check_in_at || client.last_checkin_at
      if (!last) return true
      const days = (Date.now() - new Date(last).getTime()) / 86400000
      return days > 7
    }).length
    const weeklyTraining = safeClients.reduce((sum, client) => sum + (client.weekly_training_count || 2), 0)

    return { active, inactive, checkinsDue, weeklyTraining }
  }, [safeClients])

  return (
    <div className="dashboard-root min-h-screen bg-[#070B14] text-[#F4EFE3] font-sans">
      <nav className="sticky top-0 z-50 bg-[#070B14]/80 backdrop-blur-md border-b border-[rgba(212,181,112,0.18)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
          <span className="font-serif text-2xl text-[#D4B570] tracking-widest">ARETÉ</span>
          <span className="text-xs text-[#8F9AAF] uppercase tracking-widest">Panel Trenera</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setInviteOpen(true)}
            className="bg-[#D4B570] text-[#070B14] px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            + Dodaj klienta
          </button>
          <span className="text-sm text-[#8F9AAF]">{profile?.full_name || profile?.email}</span>
        </div>
      </nav>

      <InviteClientModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => router.refresh()}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-0 bg-transparent text-[#F4EFE3]">
          <div className="bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 m-0 block text-[#F4EFE3]">
            <p className="text-xs text-[#8F9AAF] uppercase tracking-widest mb-1">Aktywni klienci</p>
            <p className="text-3xl font-serif text-[#D4B570]">{stats.active}</p>
          </div>
          <div className="bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 m-0 block text-[#F4EFE3]">
            <p className="text-xs text-[#8F9AAF] uppercase tracking-widest mb-1">Check-iny</p>
            <p className="text-3xl font-serif text-[#D4B570]">{stats.checkinsDue}</p>
          </div>
          <div className="bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 m-0 block text-[#F4EFE3]">
            <p className="text-xs text-[#8F9AAF] uppercase tracking-widest mb-1">Treningi / tydzień</p>
            <p className="text-3xl font-serif text-[#D4B570]">{stats.weeklyTraining}</p>
          </div>
          <div className="bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 m-0 block text-[#F4EFE3]">
            <p className="text-xs text-[#8F9AAF] uppercase tracking-widest mb-1">Bez aktywności</p>
            <p className="text-3xl font-serif text-[#EF6B73]">{stats.inactive}</p>
          </div>
        </div>

        {/* FAZA 6: Needs Attention Panel */}
        {(() => {
          const needsAttention = safeClients.filter(client => {
            const noTrainingDays = daysSince(client.logs?.[0]?.session_date)
            const noCheckinDays = daysSince(client.checkins?.[0]?.created_at)
            return (noTrainingDays !== null && noTrainingDays > 5) || (noCheckinDays !== null && noCheckinDays > 7)
          })

          if (needsAttention.length === 0) return null

          return (
            <div className="bg-[#0D1424] border border-[rgba(239,107,115,0.25)] rounded-2xl p-6 mb-6">
              <h3 className="font-serif text-xl text-[#EF6B73] mb-4">⚠ Wymagają uwagi ({needsAttention.length})</h3>
              <div className="space-y-3">
                {needsAttention.map(client => {
                  const noTrainingDays = daysSince(client.logs?.[0]?.session_date)
                  const noCheckinDays = daysSince(client.checkins?.[0]?.created_at)
                  const flags = []

                  if (noTrainingDays === null) {
                    flags.push('Brak danych o treningu')
                  } else if (noTrainingDays > 5) {
                    flags.push(`Brak treningu: ${Math.floor(noTrainingDays)} dni`)
                  }

                  if (noCheckinDays === null) {
                    flags.push('Brak check-inów')
                  } else if (noCheckinDays > 7) {
                    flags.push(`Brak check-inu: ${Math.floor(noCheckinDays)} dni`)
                  }

                  return (
                    <div
                      key={client.id}
                      onClick={() => router.push(`/dashboard/client/${client.id}`)}
                      className="bg-[#070B14] border border-[rgba(239,107,115,0.15)] rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-[#EF6B73] transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#111B2E] border border-[rgba(239,107,115,0.3)] flex items-center justify-center font-serif text-[#EF6B73] font-bold text-sm">
                        {getInitials(client.full_name, client.email)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#F4EFE3] text-sm">{client.full_name || 'Bez nazwy'}</p>
                        <p className="text-xs text-[#EF6B73]">{flags.join(' • ')}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        <h2 className="font-serif text-2xl text-[#D4B570] mb-4">Klienci</h2>
        {safeClients.length === 0 ? (
          <div className="bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-6 m-0 block text-[#F4EFE3]">
            <p className="text-[#8F9AAF] text-sm">Brak klientów. Lista pojawi się po dodaniu profili klienta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-0 m-0 bg-transparent text-[#F4EFE3]">
            {safeClients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
