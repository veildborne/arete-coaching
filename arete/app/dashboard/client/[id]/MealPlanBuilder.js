'use client'
import { useState } from 'react'
import { FOODS, MEAL_TEMPLATES, findBestTemplates, calcTemplateMacros, findSwaps } from '@/lib/mealData'

const MACRO_COLORS = { protein: '#52B788', fat: '#E8A020', carbs: '#5B8DB8' }

function MacroChip({ label, value, color }) {
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {label}: {value}g
    </span>
  )
}

function SwapModal({ item, food, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const swaps = findSwaps(item.food_id, item.grams)
  const allFoods = FOODS.filter(f => f.id !== item.food_id)
  const searchResults = search.length >= 2
    ? allFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : swaps.map(s => ({ food: s.food, grams: s.grams, macro: s.macro, delta: s.delta }))

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border-2 border-gold/20 rounded-xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest">Zamień produkt</p>
            <p className="text-sm font-medium text-warm">{food?.name}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-warm transition text-lg">✕</button>
        </div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj dowolnego produktu..."
          className="w-full py-2 px-3 rounded-lg bg-white/[0.04] border border-gold/20 text-warm text-sm font-body outline-none mb-3"/>
        {!search && <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Zamienniki tej samej grupy</p>}
        {searchResults.length === 0 && <p className="text-muted text-sm text-center py-4">Brak wyników</p>}
        {search.length >= 2
          ? searchResults.map(f => {
              const gramsNeeded = Math.round((item.grams * food?.kcal) / (f.kcal || 1))
              const macro = {
                kcal: Math.round((f.kcal * gramsNeeded) / 100),
                protein: Math.round((f.protein * gramsNeeded) / 100 * 10) / 10,
              }
              return (
                <button key={f.id} onClick={() => { onSelect(f.id, gramsNeeded); onClose() }}
                  className="w-full text-left p-3 rounded-lg border border-white/[0.06] hover:border-gold/30 mb-2 transition">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-warm">{f.name}</span>
                    <span className="text-xs text-muted">{gramsNeeded}g</span>
                  </div>
                  <div className="flex gap-2 text-[10px] text-muted">
                    <span>{macro.kcal} kcal</span>
                    <span style={{ color: MACRO_COLORS.protein }}>B:{macro.protein}g</span>
                  </div>
                </button>
              )
            })
          : swaps.map(({ food: f, grams, macro, delta }) => (
              <button key={f.id} onClick={() => { onSelect(f.id, grams); onClose() }}
                className="w-full text-left p-3 rounded-lg border border-white/[0.06] hover:border-gold/30 mb-2 transition">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-warm">{f.name}</span>
                  <span className="text-xs text-muted">{grams}g</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] text-muted">{macro.kcal} kcal</span>
                  {delta.protein !== 0 && <span className="text-[10px]" style={{ color: Math.abs(delta.protein) <= 2 ? '#47D18C' : '#E8A020' }}>B {delta.protein > 0 ? '+' : ''}{delta.protein}g</span>}
                  {delta.fat !== 0 && <span className="text-[10px]" style={{ color: Math.abs(delta.fat) <= 2 ? '#47D18C' : '#E8A020' }}>T {delta.fat > 0 ? '+' : ''}{delta.fat}g</span>}
                  {delta.carbs !== 0 && <span className="text-[10px]" style={{ color: Math.abs(delta.carbs) <= 2 ? '#47D18C' : '#E8A020' }}>W {delta.carbs > 0 ? '+' : ''}{delta.carbs}g</span>}
                </div>
              </button>
            ))
        }
      </div>
    </div>
  )
}

function AddItemModal({ mealIdx, onAdd, onClose, existingIds }) {
  const [search, setSearch] = useState('')
  const [grams, setGrams] = useState('100')
  const [selected, setSelected] = useState(null)

  const results = search.length >= 2
    ? FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) && !existingIds.has(f.id)).slice(0, 8)
    : []

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border-2 border-gold/20 rounded-xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-warm">Dodaj produkt do posiłku</p>
          <button onClick={onClose} className="text-muted hover:text-warm text-lg">✕</button>
        </div>
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setSelected(null) }}
          placeholder="Szukaj produktu..."
          autoFocus
          className="w-full py-2 px-3 rounded-lg bg-white/[0.04] border border-gold/20 text-warm text-sm font-body outline-none mb-2"/>
        {!selected && results.map(f => (
          <button key={f.id} onClick={() => setSelected(f)}
            className="w-full text-left p-2.5 rounded-lg hover:bg-gold/[0.05] border-b border-white/[0.04] transition">
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
        {selected && (
          <div className="mt-2">
            <p className="text-sm text-gold mb-2">{selected.name}</p>
            <div className="flex gap-2 mb-3">
              <input type="number" value={grams} onChange={e => setGrams(e.target.value)}
                placeholder="Ilość (g)"
                className="flex-1 py-2 px-3 rounded-lg bg-white/[0.04] border border-gold/20 text-warm text-sm font-body outline-none"/>
              <span className="text-muted self-center">g</span>
            </div>
            {grams && (
              <div className="flex gap-2 text-xs mb-3">
                <span className="text-warm">{Math.round((selected.kcal * parseInt(grams)) / 100)} kcal</span>
                <span style={{ color: MACRO_COLORS.protein }}>B:{Math.round((selected.protein * parseInt(grams)) / 100)}g</span>
                <span style={{ color: MACRO_COLORS.fat }}>T:{Math.round((selected.fat * parseInt(grams)) / 100)}g</span>
                <span style={{ color: MACRO_COLORS.carbs }}>W:{Math.round((selected.carbs * parseInt(grams)) / 100)}g</span>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setSelected(null)} className="flex-1 py-2 rounded-lg border border-white/[0.1] text-muted text-sm">← Wróć</button>
              <button onClick={() => { onAdd(mealIdx, selected.id, parseInt(grams) || 100); onClose() }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold"
                style={{ background: 'rgba(212,181,112,0.15)', color: '#D4B570', border: '1px solid rgba(212,181,112,0.3)' }}>
                Dodaj
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MealPlanBuilder({ clientId, questionnaire, nutritionTargets, initialPlan }) {
  const suggested = findBestTemplates(questionnaire, nutritionTargets)
  const defaultTemplate = suggested[0] || MEAL_TEMPLATES[0]

  function scaleTemplateToCalories(template, targetKcal) {
    if (!template || !targetKcal) return template
    const currentMacro = calcTemplateMacros(template)
    if (currentMacro.kcal === 0) return template
    const scale = targetKcal / currentMacro.kcal
    return {
      ...template,
      meals: template.meals.map(meal => ({
        ...meal,
        items: meal.items.map(item => ({ ...item, grams: Math.round(item.grams * scale) }))
      }))
    }
  }

  const scaledDefault = nutritionTargets?.calories && defaultTemplate
    ? scaleTemplateToCalories(defaultTemplate, nutritionTargets.calories)
    : defaultTemplate

  const [meals, setMeals] = useState(initialPlan?.meals || scaledDefault?.meals || [])
  const [planName, setPlanName] = useState(initialPlan?.name || `${defaultTemplate?.name || 'Plan'} — ${nutritionTargets?.calories || ''}kcal`)
  const [selectedTemplate, setSelectedTemplate] = useState(suggested[0]?.id || defaultTemplate?.id || null)
  const [swapTarget, setSwapTarget] = useState(null)
  const [addTarget, setAddTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function applyTemplate(template) {
    const targetKcal = nutritionTargets?.calories
    const scaled = targetKcal ? scaleTemplateToCalories(template, targetKcal) : template
    setMeals(scaled.meals)
    setPlanName(`${template.name} — ${targetKcal || ''}kcal`)
    setSelectedTemplate(template.id)
  }

  function updateItemGrams(mealIdx, itemIdx, grams) {
    setMeals(prev => prev.map((meal, mi) =>
      mi !== mealIdx ? meal : {
        ...meal,
        items: meal.items.map((item, ii) =>
          ii !== itemIdx ? item : { ...item, grams: parseInt(grams) || 0 }
        )
      }
    ))
  }

  function swapItem(mealIdx, itemIdx, newFoodId, newGrams) {
    setMeals(prev => prev.map((meal, mi) =>
      mi !== mealIdx ? meal : {
        ...meal,
        items: meal.items.map((item, ii) =>
          ii !== itemIdx ? item : { food_id: newFoodId, grams: newGrams }
        )
      }
    ))
  }

  function removeItem(mealIdx, itemIdx) {
    setMeals(prev => prev.map((meal, mi) =>
      mi !== mealIdx ? meal : { ...meal, items: meal.items.filter((_, ii) => ii !== itemIdx) }
    ).filter(meal => meal.items.length > 0))
  }

  function addItem(mealIdx, foodId, grams) {
    setMeals(prev => prev.map((meal, mi) =>
      mi !== mealIdx ? meal : { ...meal, items: [...meal.items, { food_id: foodId, grams }] }
    ))
  }

  // Total macros
  let totalKcal = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0
  meals.forEach(meal => {
    meal.items.forEach(item => {
      const food = FOODS.find(f => f.id === item.food_id)
      if (!food) return
      totalKcal    += (food.kcal    * item.grams) / 100
      totalProtein += (food.protein * item.grams) / 100
      totalFat     += (food.fat     * item.grams) / 100
      totalCarbs   += (food.carbs   * item.grams) / 100
    })
  })
  totalKcal    = Math.round(totalKcal)
  totalProtein = Math.round(totalProtein)
  totalFat     = Math.round(totalFat)
  totalCarbs   = Math.round(totalCarbs)

  const targetKcal = nutritionTargets?.calories || 0
  const kcalDiff   = totalKcal - targetKcal

  async function handleSave() {
    if (!planName.trim() || meals.length === 0) return
    setSaving(true)
    const res = await fetch('/api/nutrition/meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, name: planName, calories_target: totalKcal, meals }),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  return (
    <div className="space-y-4">
      {swapTarget && (
        <SwapModal
          item={swapTarget.item}
          food={FOODS.find(f => f.id === swapTarget.item.food_id)}
          onSelect={(newFoodId, newGrams) => swapItem(swapTarget.mealIdx, swapTarget.itemIdx, newFoodId, newGrams)}
          onClose={() => setSwapTarget(null)}
        />
      )}

      {addTarget !== null && (
        <AddItemModal
          mealIdx={addTarget}
          existingIds={new Set(meals[addTarget]?.items.map(i => i.food_id) || [])}
          onAdd={addItem}
          onClose={() => setAddTarget(null)}
        />
      )}

      {/* Suggested templates */}
      {suggested.length > 0 && (
        <div className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-4">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Sugerowane szablony</p>
          <div className="space-y-2">
            {suggested.map(t => {
              const scaled = nutritionTargets?.calories ? scaleTemplateToCalories(t, nutritionTargets.calories) : t
              const macro = calcTemplateMacros(scaled)
              return (
                <button key={t.id} onClick={() => applyTemplate(t)}
                  className="w-full text-left p-3 rounded-lg border transition"
                  style={{ borderColor: selectedTemplate === t.id ? 'rgba(212,181,112,0.4)' : 'rgba(255,255,255,0.06)', background: selectedTemplate === t.id ? 'rgba(212,181,112,0.05)' : 'transparent' }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-warm">{t.name}</span>
                    <span className="text-xs text-gold">{macro.kcal} kcal</span>
                  </div>
                  <div className="flex gap-2">
                    <MacroChip label="B" value={macro.protein} color={MACRO_COLORS.protein}/>
                    <MacroChip label="T" value={macro.fat} color={MACRO_COLORS.fat}/>
                    <MacroChip label="W" value={macro.carbs} color={MACRO_COLORS.carbs}/>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Plan name */}
      <input value={planName} onChange={e => setPlanName(e.target.value)}
        placeholder="Nazwa planu żywieniowego..."
        className="w-full py-2.5 px-3.5 rounded-lg bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] text-warm text-sm font-body outline-none focus:border-gold/40"/>

      {/* Live macro summary */}
      {meals.length > 0 && (
        <div className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted uppercase tracking-widest">Łączne makro</span>
            {targetKcal > 0 && (
              <span className="text-[11px]" style={{ color: Math.abs(kcalDiff) <= 50 ? '#47D18C' : Math.abs(kcalDiff) <= 150 ? '#E8A020' : '#EF6B73' }}>
                {kcalDiff > 0 ? '+' : ''}{kcalDiff} kcal vs cel
              </span>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <span className="text-warm font-semibold">{totalKcal} kcal</span>
            <MacroChip label="B" value={totalProtein} color={MACRO_COLORS.protein}/>
            <MacroChip label="T" value={totalFat} color={MACRO_COLORS.fat}/>
            <MacroChip label="W" value={totalCarbs} color={MACRO_COLORS.carbs}/>
          </div>
          {Math.abs(kcalDiff) > 150 && (
            <p className="text-[10px] text-[#E8A020] mt-2">
              ⚠ Makro różni się od celu o {Math.abs(kcalDiff)} kcal — dostosuj gramaturę produktów
            </p>
          )}
        </div>
      )}

      {/* Meals */}
      {meals.map((meal, mealIdx) => {
        let mealKcal = 0
        meal.items.forEach(item => {
          const food = FOODS.find(f => f.id === item.food_id)
          if (food) mealKcal += (food.kcal * item.grams) / 100
        })
        return (
          <div key={mealIdx} className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] text-gold uppercase tracking-widest">{meal.name}</p>
              <span className="text-[10px] text-muted">{Math.round(mealKcal)} kcal</span>
            </div>
            <div className="space-y-2">
              {meal.items.map((item, itemIdx) => {
                const food = FOODS.find(f => f.id === item.food_id)
                if (!food) return null
                const itemKcal = Math.round((food.kcal * item.grams) / 100)
                const itemProt = Math.round((food.protein * item.grams) / 100)
                return (
                  <div key={itemIdx} className="flex items-center gap-2 bg-white/[0.02] rounded-lg px-3 py-2">
                    <span className="flex-1 text-sm text-warm min-w-0 truncate">{food.name}</span>
                    <input type="number" value={item.grams}
                      onChange={e => updateItemGrams(mealIdx, itemIdx, e.target.value)}
                      className="w-14 py-1 px-2 rounded bg-white/[0.04] border border-gold/15 text-warm text-xs text-center font-body outline-none shrink-0"/>
                    <span className="text-[10px] text-muted shrink-0">g</span>
                    <span className="text-[10px] text-muted shrink-0 hidden sm:block">{itemKcal} kcal</span>
                    <span className="text-[10px] shrink-0" style={{ color: MACRO_COLORS.protein }}>B:{itemProt}g</span>
                    <button onClick={() => setSwapTarget({ mealIdx, itemIdx, item })}
                      className="text-[10px] px-2 py-1 rounded border border-[rgba(100,181,246,0.25)] text-[#64B5F6] shrink-0">⇄</button>
                    <button onClick={() => removeItem(mealIdx, itemIdx)}
                      className="text-[10px] px-2 py-1 rounded border border-danger/20 text-danger shrink-0">✕</button>
                  </div>
                )
              })}
            </div>
            <button onClick={() => setAddTarget(mealIdx)}
              className="mt-2 w-full py-1.5 rounded-lg text-xs border border-dashed border-gold/20 text-gold/50 hover:border-gold/40 hover:text-gold/70 transition">
              + Dodaj produkt do {meal.name.toLowerCase()}
            </button>
          </div>
        )
      })}

      {/* Save */}
      <button onClick={handleSave} disabled={saving || meals.length === 0}
        className="w-full py-3 rounded-xl text-sm font-bold font-body tracking-wider disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg,#b8a677,#d4c494)', color: '#0f1a2e' }}>
        {saving ? 'Zapisuję...' : saved ? '✓ Zapisano!' : 'Zapisz plan żywieniowy'}
      </button>
    </div>
  )
}
