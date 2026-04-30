'use client'

import { useMemo } from 'react'
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

function ClientCard({ client }) {
  const router = useRouter()
  const initials = getInitials(client.full_name, client.email)
  const needsPlan = hasNoAssignedPlan(client)

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
        </div>
        <div className={`ml-auto w-2 h-2 rounded-full ${needsPlan ? 'bg-[#EF6B73]' : 'bg-[#47D18C]'} block p-0 text-[#F4EFE3]`}></div>
      </div>
      <div className="flex gap-2 px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
        <button onClick={() => router.push(`/dashboard/client/${client.id}`)} className="flex-1 text-xs border border-[rgba(212,181,112,0.3)] text-[#D4B570] py-2 rounded-lg hover:bg-[#D4B570] hover:text-[#070B14] transition">Zobacz profil</button>
        <button onClick={() => router.push(`/dashboard/client/${client.id}/plan/new`)} className="flex-1 text-xs border border-[rgba(212,181,112,0.3)] text-[#D4B570] py-2 rounded-lg hover:bg-[#D4B570] hover:text-[#070B14] transition">Nowy plan</button>
      </div>
    </div>
  )
}

export default function DashboardClient({ profile, clients }) {
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
    <div className="min-h-screen bg-[#070B14] text-[#F4EFE3] font-sans">
      <nav className="sticky top-0 z-50 bg-[#070B14]/80 backdrop-blur-md border-b border-[rgba(212,181,112,0.18)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
          <span className="font-serif text-2xl text-[#D4B570] tracking-widest">ARETÉ</span>
          <span className="text-xs text-[#8F9AAF] uppercase tracking-widest">Panel Trenera</span>
        </div>
        <span className="text-sm text-[#8F9AAF]">{profile?.full_name || profile?.email}</span>
      </nav>

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
