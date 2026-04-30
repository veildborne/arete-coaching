'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

const tierStyles = {
  paideia: 'border-white/10 bg-white/[0.03] text-text-muted',
  askesis: 'border-gold/25 bg-gold/10 text-gold',
  arete: 'border-gold/35 bg-gold/15 text-gold',
  inperson: 'border-white/10 bg-white/[0.04] text-text',
}

const statusStyles = {
  active: { label: 'Aktywny', className: 'border-success/25 bg-success/10 text-success' },
  lead: { label: 'Lead', className: 'border-amber/25 bg-amber/10 text-amber' },
  paused: { label: 'Wstrzymany', className: 'border-gold/25 bg-gold/10 text-gold' },
  inactive: { label: 'Nieaktywny', className: 'border-danger/25 bg-danger/10 text-danger' },
}

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

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
}

function Panel({ children, className = '' }) {
  return (
    <section className={`rounded-lg border border-border bg-surface/85 shadow-2xl shadow-black/20 ${className}`}>
      {children}
    </section>
  )
}

function ClientCard({ client }) {
  const router = useRouter()
  const tierKey = client.package_tier?.toLowerCase()
  const status = statusStyles[client.status] || statusStyles.lead
  const healthIndex = Math.abs((client.id || client.email || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % 3
  const health = [
    { label: 'stabilny', className: 'bg-success shadow-success/40' },
    { label: 'obserwuj', className: 'bg-gold shadow-gold/40' },
    { label: 'ryzyko', className: 'bg-danger shadow-danger/40' },
  ][healthIndex]

  // MOCK — do podpięcia z Supabase
  const compliance = client.compliance ?? 85
  // MOCK — do podpięcia z Supabase
  const checkinStatus = client.check_in_status || 'Do sprawdzenia'
  const lastTraining = client.last_training_at || client.last_workout_at || client.last_session_date

  return (
    <article className="card-hover rounded-lg border border-border bg-surface/85 p-5 transition hover:border-gold/60 hover:shadow-2xl hover:shadow-black/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 font-display text-lg font-bold text-gold">
            {getInitials(client.full_name, client.email)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-text">{client.full_name || 'Bez imienia'}</h3>
            <p className="truncate text-xs text-text-muted">{client.email}</p>
          </div>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${tierStyles[tierKey] || tierStyles.paideia}`}>
          {client.package_tier || 'Brak tieru'}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-text-muted">
          <span className={`h-2 w-2 rounded-full shadow-lg ${health.className}`} />
          {health.label}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Ostatni trening</p>
          <p className="mt-1 text-sm font-semibold text-text">{formatDate(lastTraining)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Check-in</p>
          <p className="mt-1 text-sm font-semibold text-gold">{checkinStatus}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Compliance</p>
          <p className="mt-1 text-sm font-semibold text-success">{compliance}%</p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => router.push(`/dashboard/client/${client.id}`)}
          className="flex-1 rounded-md border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-gold transition hover:border-gold"
        >
          Zobacz profil
        </button>
        <button
          onClick={() => router.push(`/dashboard/client/${client.id}/plan/new`)}
          className="flex-1 rounded-md bg-gold px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-bg transition hover:bg-[#e0c17b]"
        >
          Nowy plan
        </button>
      </div>
    </article>
  )
}

export default function DashboardClient({ profile, clients }) {
  const router = useRouter()
  const safeClients = clients || []

  const stats = useMemo(() => {
    const active = safeClients.filter(client => client.status === 'active').length
    const inactive = safeClients.filter(client => client.status === 'inactive' || client.status === 'paused').length

    // MOCK — do podpięcia z Supabase
    const checkinsDue = safeClients.filter(client => {
      const last = client.last_check_in_at || client.last_checkin_at
      if (!last) return true
      const days = (Date.now() - new Date(last).getTime()) / 86400000
      return days > 7
    }).length

    // MOCK — do podpięcia z Supabase
    const weeklyTraining = safeClients.reduce((sum, client) => sum + (client.weekly_training_count || 2), 0)

    return { active, inactive, checkinsDue, weeklyTraining }
  }, [safeClients])

  const alerts = useMemo(() => {
    return safeClients.flatMap(client => {
      const items = []
      if (hasNoAssignedPlan(client)) items.push(`${client.full_name || client.email} nie ma przypisanego planu`)
      if (!client.full_name) items.push(`Uzupełnij profil: ${client.email}`)
      return items.map(message => ({ id: `${client.id}-${message}`, clientId: client.id, message }))
    })
  }, [safeClients])

  return (
    <div className="min-h-screen bg-bg font-body text-text">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(212,181,112,0.12),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(192,80,0,0.08),transparent_26%)]" />

      <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="font-display text-xl font-bold tracking-[0.28em] text-gold">
              ARETÉ
            </button>
            <span className="hidden border-l border-border pl-4 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted sm:inline">
              Panel Trenera
            </span>
          </div>
          <p className="max-w-[46vw] truncate text-sm text-text-muted">{profile?.full_name || profile?.email}</p>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <header className="fade-in mb-6">
          <h1 className="font-display text-4xl font-semibold text-text md:text-6xl">Panel Trenera</h1>
          <p className="mt-3 max-w-2xl text-text-muted">
            Przegląd klientów, ryzyk i najbliższych akcji coachingowych.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Aktywni klienci', value: stats.active, tone: 'text-success' },
            { label: 'Check-iny do sprawdzenia', value: stats.checkinsDue, tone: 'text-gold' },
            { label: 'Treningi w tym tygodniu', value: stats.weeklyTraining, tone: 'text-text' },
            { label: 'Klienci bez aktywności', value: stats.inactive, tone: 'text-danger' },
          ].map(item => (
            <Panel key={item.label} className="card-hover p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{item.label}</p>
              <p className={`mt-4 font-display text-4xl font-semibold ${item.tone}`}>{item.value}</p>
            </Panel>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[380px_1fr]">
          <Panel className="p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">Needs Attention</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-text">Wymaga reakcji</h2>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">{alerts.length}</span>
            </div>

            {alerts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-white/[0.02] p-6 text-sm text-text-muted">
                Wszyscy klienci są na dobrej drodze ✓
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="rounded-lg border border-amber/20 bg-amber/10 p-4">
                    <p className="text-sm text-text">{alert.message}</p>
                    <button
                      onClick={() => router.push(`/dashboard/client/${alert.clientId}`)}
                      className="mt-3 rounded-md border border-amber/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold transition hover:border-gold"
                    >
                      Sprawdź
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 grid gap-2">
              <button disabled className="rounded-md border border-border px-4 py-3 text-left text-sm font-semibold text-text-muted opacity-50">
                Dodaj klienta <span className="block text-xs font-normal">wkrótce</span>
              </button>
              <button onClick={() => router.push('/dashboard')} className="rounded-md border border-border px-4 py-3 text-left text-sm font-semibold text-gold transition hover:border-gold">
                Stwórz program
              </button>
              <button onClick={() => router.push('/dashboard')} className="rounded-md border border-border px-4 py-3 text-left text-sm font-semibold text-gold transition hover:border-gold">
                Sprawdź check-iny
              </button>
              <button disabled className="rounded-md border border-border px-4 py-3 text-left text-sm font-semibold text-text-muted opacity-50">
                Wyślij wiadomość <span className="block text-xs font-normal">wkrótce</span>
              </button>
            </div>
          </Panel>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-muted">Client Roster</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-text">Klienci</h2>
              </div>
              <span className="text-sm text-text-muted">{safeClients.length} łącznie</span>
            </div>

            {safeClients.length === 0 ? (
              <Panel className="p-10 text-center">
                <h3 className="font-display text-3xl font-semibold text-text">Brak klientów</h3>
                <p className="mt-2 text-sm text-text-muted">Lista pojawi się po dodaniu profili klienta.</p>
              </Panel>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {safeClients.map(client => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  )
}
