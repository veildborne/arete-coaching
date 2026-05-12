'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { FOODS } from '@/lib/mealData'

const MACRO_COLORS = { protein: '#52B788', fat: '#E8A020', carbs: '#5B8DB8' }

export default function CheatMealTracker({ nutritionTargets }) {
  const [logs, setLogs] = useState([])
  const [form, setForm] = useState({ description: '', calories_est: '', protein_g: '', fat_g: '', carbs_g: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const supabase = createClient()
    supabase.from('cheat_meals').select('*').order('logged_at', { ascending: false }).limit(10)
      .then(({ data }) => { if (data) setLogs(data); setLoading(false) })
  }, [])

  const todayLogs = logs.filter(l => l.logged_at === today)
  const todayExtra = todayLogs.reduce((s, l) => s + (l.calories_est || 0), 0)
  const todayProtein = todayLogs.reduce((s, l) => s + (l.protein_g || 0), 0)
  const todayFat = todayLogs.reduce((s, l) => s + (l.fat_g || 0), 0)
  const todayCarbs = todayLogs.reduce((s, l) => s + (l.carbs_g || 0), 0)
  const remaining = nutritionTargets ? nutritionTargets.calories - todayExtra : null

  const searchResults = search.length >= 2
    ? FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : []

  function selectFood(food) {
    setSelectedFood(food)
    setForm(p => ({ ...p, description: food.name }))
    setSearch(food.name)
    setShowSearch(false)
  }

  function calcFromGrams(g) {
    if (!selectedFood || !g) return
    const gr = parseFloat(g)
    setForm(p => ({
      ...p,
      calories_est: Math.round((selectedFood.kcal * gr) / 100),
      protein_g: Math.round((selectedFood.protein * gr) / 100 * 10) / 10,
      fat_g: Math.round((selectedFood.fat * gr) / 100 * 10) / 10,
      carbs_g: Math.round((selectedFood.carbs * gr) / 100 * 10) / 10,
    }))
  }

  async function handleAdd() {
    if (!form.calories_est) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('cheat_meals').insert({
      logged_at: today,
      description: form.description || 'Odstępstwo',
      calories_est: parseInt(form.calories_est) || 0,
      protein_g: parseFloat(form.protein_g) || 0,
      fat_g: parseFloat(form.fat_g) || 0,
      carbs_g: parseFloat(form.carbs_g) || 0,
    }).select().single()
    setSaving(false)
    if (!error && data) {
      setLogs(prev => [data, ...prev])
      setForm({ description: '', calories_est: '', protein_g: '', fat_g: '', carbs_g: '' })
      setSelectedFood(null)
      setSearch('')
      setGrams('')
    }
  }

  async function handleDelete(id) {
    const supabase = createClient()
    await supabase.from('cheat_meals').delete().eq('id', id)
    setLogs(prev => prev.filter(l => l.id !== id))
  }

  if (!nutritionTargets) return null

  return (
    <div className="bg-surface border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Odstępstwo od diety</p>

      {/* Dzienny budżet */}
      <div className="bg-bg-deep rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted">Cel dzienny</span>
          <span className="text-sm font-medium text-warm">{nutritionTargets.calories} kcal</span>
        </div>
        {todayExtra > 0 && (
          <>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted">Dodatkowe dziś</span>
              <span className="text-sm font-medium text-danger">+{todayExtra} kcal</span>
            </div>
            <div className="flex gap-3 text-[10px] mb-2">
              <span style={{ color: MACRO_COLORS.protein }}>B: +{todayProtein}g</span>
              <span style={{ color: MACRO_COLORS.fat }}>T: +{todayFat}g</span>
              <span style={{ color: MACRO_COLORS.carbs }}>W: +{todayCarbs}g</span>
            </div>
          </>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-white/[0.05]">
          <span className="text-xs text-muted">Pozostało</span>
          <span className="text-lg font-semibold font-display"
            style={{ color: remaining >= 0 ? '#D4B570' : '#EF6B73' }}>
            {remaining} kcal
          </span>
        </div>
        {todayExtra > 0 && (
          <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((todayExtra / nutritionTargets.calories) * 100))}%`, background: remaining < 0 ? '#EF6B73' : '#E8A020' }}/>
          </div>
        )}
      </div>

      {/* Wyszukaj produkt */}
      <div className="mb-3 relative">
        <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Szukaj produktu</p>
        <input type="text" value={search}
          onChange={e => { setSearch(e.target.value); setShowSearch(true); setSelectedFood(null) }}
          onFocus={() => setShowSearch(true)}
          placeholder="np. kawa z mlekiem, ryż, banan..."
          className="w-full py-2 px-3 rounded-lg bg-bg-deep border-2 border-[rgba(212,181,112,0.35)] text-warm text-sm font-body outline-none focus:border-gold/40"/>
        {showSearch && searchResults.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 bg-[#0f1a2e] border-2 border-[rgba(212,181,112,0.3)] rounded-xl mt-1 overflow-hidden shadow-xl">
            {searchResults.map(f => (
              <button key={f.id} onClick={() => selectFood(f)}
                className="w-full text-left px-3 py-2.5 hover:bg-gold/[0.05] border-b border-white/[0.04] last:border-0 transition">
                <div className="flex justify-between">
                  <span className="text-sm text-warm">{f.name}</span>
                  <span className="text-[10px] text-muted">{f.kcal} kcal/100g</span>
                </div>
                <div className="flex gap-2 text-[10px] mt-0.5">
                  <span style={{ color: MACRO_COLORS.protein }}>B:{f.protein}g</span>
                  <span style={{ color: MACRO_COLORS.fat }}>T:{f.fat}g</span>
                  <span style={{ color: MACRO_COLORS.carbs }}>W:{f.carbs}g</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ilość gramów jeśli wybrany produkt */}
      {selectedFood && (
        <div className="mb-3 p-3 bg-gold/[0.05] border border-gold/20 rounded-xl">
          <p className="text-[10px] text-gold uppercase tracking-widest mb-2">{selectedFood.name} — podaj ilość</p>
          <div className="flex gap-2">
            <input type="number" value={grams}
              onChange={e => { setGrams(e.target.value); calcFromGrams(e.target.value) }}
              placeholder="Ile gramów?"
              className="flex-1 py-2 px-3 rounded-lg bg-bg-deep border-2 border-[rgba(212,181,112,0.35)] text-warm text-sm font-body outline-none"/>
            <span className="text-muted text-sm self-center">g</span>
          </div>
          {form.calories_est && (
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-warm font-medium">{form.calories_est} kcal</span>
              <span style={{ color: MACRO_COLORS.protein }}>B:{form.protein_g}g</span>
              <span style={{ color: MACRO_COLORS.fat }}>T:{form.fat_g}g</span>
              <span style={{ color: MACRO_COLORS.carbs }}>W:{form.carbs_g}g</span>
            </div>
          )}
        </div>
      )}

      {/* Manualne wpisanie */}
      <div className="space-y-2 mb-4">
        <p className="text-[10px] text-muted uppercase tracking-widest">Lub wpisz ręcznie</p>
        <input type="text" value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          placeholder="Opis (np. kawa z mlekiem 2%)"
          className="w-full py-2 px-3 rounded-lg bg-bg-deep border-2 border-[rgba(212,181,112,0.35)] text-warm text-sm font-body outline-none focus:border-gold/40"/>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={form.calories_est}
            onChange={e => setForm(p => ({ ...p, calories_est: e.target.value }))}
            placeholder="kcal *"
            className="py-2 px-3 rounded-lg bg-bg-deep border-2 border-[rgba(212,181,112,0.35)] text-warm text-sm font-body outline-none focus:border-gold/40"/>
          <input type="number" value={form.protein_g}
            onChange={e => setForm(p => ({ ...p, protein_g: e.target.value }))}
            placeholder="Białko (g)"
            className="py-2 px-3 rounded-lg bg-bg-deep border-2 border-[rgba(82,183,136,0.35)] text-warm text-sm font-body outline-none"/>
          <input type="number" value={form.fat_g}
            onChange={e => setForm(p => ({ ...p, fat_g: e.target.value }))}
            placeholder="Tłuszcz (g)"
            className="py-2 px-3 rounded-lg bg-bg-deep border-2 border-[rgba(232,160,32,0.35)] text-warm text-sm font-body outline-none"/>
          <input type="number" value={form.carbs_g}
            onChange={e => setForm(p => ({ ...p, carbs_g: e.target.value }))}
            placeholder="Węgle (g)"
            className="py-2 px-3 rounded-lg bg-bg-deep border-2 border-[rgba(91,141,184,0.35)] text-warm text-sm font-body outline-none"/>
        </div>
        <button onClick={handleAdd} disabled={saving || !form.calories_est}
          className="w-full py-2.5 rounded-xl text-sm font-semibold font-body transition disabled:opacity-40"
          style={{ background: 'rgba(212,181,112,0.15)', color: '#D4B570', border: '2px solid rgba(212,181,112,0.3)' }}>
          {saving ? '...' : '+ Dodaj odstępstwo'}
        </button>
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
                  {(l.protein_g > 0 || l.fat_g > 0 || l.carbs_g > 0) && (
                    <div className="flex gap-2 text-[10px] mt-0.5">
                      {l.protein_g > 0 && <span style={{ color: MACRO_COLORS.protein }}>B:{l.protein_g}g</span>}
                      {l.fat_g > 0 && <span style={{ color: MACRO_COLORS.fat }}>T:{l.fat_g}g</span>}
                      {l.carbs_g > 0 && <span style={{ color: MACRO_COLORS.carbs }}>W:{l.carbs_g}g</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-danger">+{l.calories_est} kcal</span>
                  <button onClick={() => handleDelete(l.id)} className="text-muted hover:text-danger transition text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historia poprzednie */}
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
          Loguj odchylenia — odejmą się od budżetu. Możesz szukać produktu lub wpisać ręcznie.
        </p>
      )}
    </div>
  )
}
