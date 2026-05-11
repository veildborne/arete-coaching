'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const MUSCLE_PL = {
  chest:'Klatka', back:'Plecy', shoulders_lat:'Barki boczne',
  shoulders_rear:'Barki tylne', biceps:'Biceps', triceps:'Triceps',
  quads:'Czwórgłowe', hamstrings:'Dwugłowe', glutes:'Pośladki',
  calves:'Łydki', abs:'Brzuch', forearms:'Przedramiona',
}

export default function PlanViewer() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('training_plans')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data }) => {
        setPlan(data)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="text-center py-20 text-muted">Ładowanie planu...</div>
  )

  if (!plan) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4 opacity-20">▦</p>
      <p className="text-warm font-medium mb-2">Brak aktywnego planu</p>
      <p className="text-muted text-sm">Trener przygotuje Twój plan treningowy.</p>
    </div>
  )

  const payload = plan.plan_data || {}
  const sessions = payload.sessions || {}
  const progression = payload.weekly_progression || []

  return (
    <div className="space-y-6">
      {/* Header planu */}
      <div className="bg-black/30 backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-6">
        <p className="text-[10px] text-gold/60 uppercase tracking-widest mb-1">Aktywny plan</p>
        <h2 className="font-display text-2xl text-gold mb-3">{plan.name}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <span>Tydzień {plan.current_week || 1} z {payload.mesocycle_weeks || 6}</span>
          <span>{payload.split_name || payload.split || '—'}</span>
          <span>{payload.goal || '—'}</span>
        </div>

        {/* Progresja RIR */}
        {progression.length > 0 && (
          <div className="flex gap-1.5 mt-4">
            {progression.map(w => (
              <div key={w.week}
                className={`flex-1 text-center py-1.5 rounded-lg text-[10px] ${w.isDeload ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : w.week === (plan.current_week || 1) ? 'bg-gold/15 border border-gold/30 text-gold' : 'bg-white/[0.03] border border-white/[0.06] text-muted'}`}>
                <div className="mb-0.5">{w.isDeload ? 'DL' : `T${w.week}`}</div>
                <div className="font-semibold">{w.isDeload ? '—' : `R${w.rir}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sesje */}
      {Object.entries(sessions).map(([key, session]) => (
        <div key={key} className="bg-black/30 backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center font-display text-lg font-bold text-gold">
              {key}
            </div>
            <div>
              <p className="text-sm font-medium text-warm">{session.name}</p>
              <p className="text-[11px] text-muted">
                {session.exercises?.length || 0} ćwiczeń · {(session.exercises || []).reduce((s, e) => s + (e.sets || 0), 0)} serii
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {(session.exercises || []).map((ex, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3">
                <div className="w-1 h-full min-h-[32px] rounded-full shrink-0"
                  style={{ background: ex.stretch_position ? '#52B788' : 'rgba(212,181,112,0.3)' }}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-warm truncate">{ex.name_pl || ex.name}</p>
                  <p className="text-[11px] text-muted">{MUSCLE_PL[ex.muscle_group] || ex.muscle_group}</p>
                </div>
                <div className="flex gap-3 text-xs text-muted shrink-0">
                  <span>{ex.sets} serii</span>
                  <span>{ex.rep_range}</span>
                  <span>RIR {ex.rir_target}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Notatka coacha do planu */}
          {plan.coach_note && (
            <div className="mt-4 border-l-2 border-gold/30 pl-3">
              <p className="text-[10px] text-gold uppercase tracking-widest mb-1">Notatka trenera</p>
              <p className="text-xs text-warm/80 leading-relaxed">{plan.coach_note}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
