'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const stages = ['Fundament', 'Akumulacja', 'Wzrost', 'Intensyfikacja', 'Próba', 'Regeneracja']

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

  const todayDate = new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F4EFE3] font-sans pb-20">
      <nav className="sticky top-0 z-50 bg-[#070B14]/80 backdrop-blur-md border-b border-[rgba(212,181,112,0.18)] px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-2xl text-[#D4B570] tracking-widest">ARETÉ</span>
        <div className="flex items-center gap-3 px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
          <span className="text-sm text-[#8F9AAF]">{firstName}</span>
          <button onClick={handleLogout} className="text-xs border border-[rgba(212,181,112,0.3)] text-[#D4B570] px-3 py-1.5 rounded-lg hover:bg-[#D4B570] hover:text-[#070B14] transition">Wyloguj</button>
        </div>
      </nav>

      <main className={`max-w-2xl mx-auto px-4 py-8 space-y-6 transition-opacity duration-500 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="block bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-6 m-0 text-[#F4EFE3]">
          <p className="text-xs text-[#D4B570] tracking-widest uppercase mb-1">ARETÉ · ΧΑΙΡΕ</p>
          <h1 className="text-3xl font-serif mb-1">Witaj, <span className="text-[#D4B570]">{firstName}</span></h1>
          <p className="text-sm text-[#8F9AAF] mb-4">{todayDate}</p>
          <p className="text-sm text-[#8F9AAF] mb-4">
            {activePlan ? `${planInfo.mesocycleName} · tydzień ${planInfo.currentWeek}/${planInfo.maxWeeks}` : 'Plan treningowy w przygotowaniu'}
          </p>
          <button onClick={() => router.push(activePlan ? '/client/workout' : '/client/plan')} className="bg-[#D4B570] text-[#070B14] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm">Zobacz plan →</button>
        </div>

        <div className="block bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-6 m-0 text-[#F4EFE3]">
          <p className="text-xs text-[#8F9AAF] uppercase tracking-widest mb-3">Dzisiejszy quest</p>
          <h2 className="text-2xl font-serif text-[#D4B570] mb-2">{planInfo.isRestDay ? 'Regeneracja' : planInfo.sessionName}</h2>
          <div className="flex gap-4 text-sm text-[#8F9AAF] mb-4 px-0 py-0 m-0 bg-transparent">
            <span>{planInfo.exerciseCount} ćwiczeń</span>
            <span>~{planInfo.estimatedTime} min</span>
            <span>RIR {planInfo.rir}</span>
            <span className="text-[#47D18C]">+120 XP</span>
          </div>
          <button onClick={() => router.push('/client/workout')} disabled={!activePlan} className="w-full bg-[#D4B570] text-[#070B14] font-bold py-4 rounded-xl hover:opacity-90 transition text-lg tracking-wide disabled:opacity-50">START</button>
        </div>

        <div className="block bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-6 m-0 text-[#F4EFE3]">
          <div className="flex justify-between items-center mb-3 px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
            <div className="block px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
              <p className="text-xs text-[#8F9AAF] uppercase tracking-widest">Poziom</p>
              <p className="text-2xl font-serif text-[#D4B570]">3 · Adept</p>
            </div>
            <span className="text-sm text-[#8F9AAF]">340 / 500 XP</span>
          </div>
          <div className="block w-full bg-[#111B2E] rounded-full h-2 p-0 m-0 text-[#F4EFE3]">
            <div className="block bg-[#D4B570] h-2 rounded-full p-0 m-0 text-[#070B14] w-[68%]"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-0 m-0 bg-transparent text-[#F4EFE3]">
          <button onClick={() => router.push('/client/workout')} className="bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 text-center hover:border-[#D4B570] transition">
            <div className="block text-2xl mb-2 p-0 bg-transparent text-[#F4EFE3]">⚡</div>
            <p className="text-sm font-medium">Loguj trening</p>
            <p className="text-xs text-[#8F9AAF]">Nowa sesja</p>
          </button>
          <button onClick={() => router.push('/client/checkin')} className="bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-5 text-center hover:border-[#D4B570] transition">
            <div className="block text-2xl mb-2 p-0 bg-transparent text-[#F4EFE3]">◈</div>
            <p className="text-sm font-medium">Check-in</p>
            <p className="text-xs text-[#8F9AAF]">Cotygodniowy</p>
          </button>
        </div>

        <div className="block bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-6 m-0 text-[#F4EFE3]">
          <p className="text-xs text-[#8F9AAF] uppercase tracking-widest mb-3">Wiadomość od trenera</p>
          <div className="flex gap-3 px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
            <div className="w-10 h-10 rounded-full bg-[#D4B570] flex items-center justify-center text-[#070B14] font-bold text-sm flex-shrink-0 p-0 m-0">AP</div>
            <div className="block px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
              <p className="text-sm font-medium text-[#D4B570] mb-1">Alexander</p>
              <p className="text-sm text-[#8F9AAF]">W tym tygodniu pilnujemy techniki w RDL.</p>
            </div>
          </div>
        </div>

        <div className="block bg-[#0D1424] border border-[rgba(212,181,112,0.18)] rounded-2xl p-6 m-0 text-[#F4EFE3]">
          <p className="text-xs text-[#8F9AAF] uppercase tracking-widest mb-4">Ostatnia aktywność</p>
          {safeLogs.length === 0 ? (
            <div className="block text-center py-8 px-0 m-0 bg-transparent text-[#F4EFE3]">
              <p className="text-[#8F9AAF] text-sm">Jeszcze nie ma aktywności.<br />Pierwszy trening otworzy historię.</p>
            </div>
          ) : (
            <div className="block divide-y divide-[rgba(212,181,112,0.18)] p-0 m-0 bg-transparent text-[#F4EFE3]">
              {safeLogs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between gap-4 py-3 px-0 m-0 bg-transparent text-[#F4EFE3]">
                  <div className="block px-0 py-0 m-0 bg-transparent text-[#F4EFE3]">
                    <p className="text-sm font-medium">{log.day_label || log.session_name || 'Trening ukończony'}</p>
                    <p className="text-xs text-[#8F9AAF]">Sesja treningowa</p>
                  </div>
                  <span className="text-[#8F9AAF] text-sm">{formatDate(log.session_date || log.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#070B14]/95 backdrop-blur-md border-t border-[rgba(212,181,112,0.18)] px-4 py-3 flex justify-around z-50">
        <button onClick={() => router.push('/client')} className="flex flex-col items-center gap-1 text-[#D4B570]">
          <span className="text-lg">⌂</span>
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => router.push('/client/workout')} className="flex flex-col items-center gap-1 text-[#8F9AAF] hover:text-[#D4B570] transition">
          <span className="text-lg">⚡</span>
          <span className="text-xs">Trening</span>
        </button>
        <button onClick={() => router.push('/client/plan')} className="flex flex-col items-center gap-1 text-[#8F9AAF] hover:text-[#D4B570] transition">
          <span className="text-lg">▦</span>
          <span className="text-xs">Plan</span>
        </button>
        <button onClick={() => router.push('/client/checkin')} className="flex flex-col items-center gap-1 text-[#8F9AAF] hover:text-[#D4B570] transition">
          <span className="text-lg">✓</span>
          <span className="text-xs">Check-in</span>
        </button>
      </nav>
    </div>
  )
}
