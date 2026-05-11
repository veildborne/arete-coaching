'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function CheatMealTracker({ nutritionTargets }) {
  const [logs, setLogs] = useState([])
  const [form, setForm] = useState({ description: '', calories_est: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('cheat_meals')
      .select('*')
      .order('logged_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setLogs(data)
        setLoading(false)
      })
  }, [])

  const todayLogs = logs.filter(l => l.logged_at === today)
  const todayExtra = todayLogs.reduce((s, l) => s + (l.calories_est || 0), 0)
  const remaining = nutritionTargets
    ? nutritionTargets.calories - todayExtra
    : null

  async function handleAdd() {
    if (!form.calories_est) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('cheat_meals')
      .insert({
        logged_at: today,
        description: form.description || 'Cheat meal',
        calories_est: parseInt(form.calories_est),
      })
      .select()
      .single()
    setSaving(false)
    if (!error && data) {
      setLogs(prev => [data, ...prev])
      setForm({ description: '', calories_est: '' })
    }
  }

  async function handleDelete(id) {
    const supabase = createClient()
    await supabase.from('cheat_meals').delete().eq('id', id)
    setLogs(prev => prev.filter(l => l.id !== id))
  }

  if (!nutritionTargets) return null

  return (
    <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Cheat meal / odchylenie</p>

      {/* Dzienny budżet */}
      <div className="bg-bg-deep rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted">Cel dzienny</span>
          <span className="text-sm font-medium text-warm">{nutritionTargets.calories} kcal</span>
        </div>
        {todayExtra > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted">Dodatkowe dziś</span>
            <span className="text-sm font-medium text-danger">+{todayExtra} kcal</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-white/[0.05]">
          <span className="text-xs text-muted">Pozostało</span>
          <span
            className="text-lg font-semibold font-display"
            style={{ color: remaining >= 0 ? '#D4B570' : '#EF6B73' }}
          >
            {remaining} kcal
          </span>
        </div>
        {todayExtra > 0 && (
          <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((todayExtra / nutritionTargets.calories) * 100))}%`,
                background: remaining < 0 ? '#EF6B73' : '#E8A020',
              }}
            />
          </div>
        )}
      </div>

      {/* Dodaj odchylenie */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          placeholder="Co zjadłeś? (opcjonalnie)"
          className="w-full py-2 px-3 rounded-lg bg-bg-deep border border-[rgba(212,181,112,0.15)] text-warm text-sm font-body outline-none focus:border-gold/40"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={form.calories_est}
            onChange={e => setForm(p => ({ ...p, calories_est: e.target.value }))}
            placeholder="Szacowane kcal"
            className="flex-1 py-2 px-3 rounded-lg bg-bg-deep border border-[rgba(212,181,112,0.15)] text-warm text-sm font-body outline-none focus:border-gold/40"
          />
          <button
            onClick={handleAdd}
            disabled={saving || !form.calories_est}
            className="px-4 py-2 rounded-lg text-sm font-semibold font-body transition disabled:opacity-40"
            style={{ background: 'rgba(212,181,112,0.15)', color: '#D4B570', border: '1px solid rgba(212,181,112,0.3)' }}
          >
            {saving ? '...' : '+ Dodaj'}
          </button>
        </div>
      </div>

      {/* Historia dziś */}
      {todayLogs.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Dziś</p>
          <div className="space-y-1.5">
            {todayLogs.map(l => (
              <div key={l.id} className="flex items-center justify-between bg-bg-deep rounded-lg px-3 py-2">
                <div>
                  <span className="text-sm text-warm">{l.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-danger">+{l.calories_est} kcal</span>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-muted hover:text-danger transition text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historia poprzednie dni */}
      {logs.filter(l => l.logged_at !== today).length > 0 && (
        <div>
          <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Poprzednie</p>
          <div className="space-y-1">
            {logs.filter(l => l.logged_at !== today).slice(0, 5).map(l => (
              <div key={l.id} className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.04] last:border-0">
                <span className="text-muted">
                  {new Date(l.logged_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })} — {l.description}
                </span>
                <span className="text-muted">+{l.calories_est} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && logs.length === 0 && (
        <p className="text-xs text-muted/50 text-center py-2">
          Loguj odchylenia od diety — odejmą się od dziennego budżetu.
        </p>
      )}
    </div>
  )
}
