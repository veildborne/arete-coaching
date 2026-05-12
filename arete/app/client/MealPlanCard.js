'use client'
import { useState } from 'react'
import { FOODS, findSwaps } from '@/lib/mealData'

const MACRO_COLORS = { protein: '#52B788', fat: '#E8A020', carbs: '#5B8DB8' }

function SwapModal({ item, food, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const swaps = findSwaps(item.food_id, item.grams)
  const allFoods = FOODS.filter(f => f.id !== item.food_id)
  const searchResults = search.length >= 2
    ? allFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : null

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0f1a2e] border-2 border-gold/20 rounded-xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest">Zamień produkt</p>
            <p className="text-sm font-medium text-warm">{food?.name}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-warm text-lg">✕</button>
        </div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj innego produktu..."
          autoFocus
          className="w-full py-2 px-3 rounded-lg bg-white/[0.04] border border-gold/20 text-warm text-sm font-body outline-none mb-3"/>

        {!searchResults && (
          <>
            <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Zamienniki tej samej grupy</p>
            {swaps.length === 0 && <p className="text-muted text-sm text-center py-4">Brak zamienników</p>}
            {swaps.map(({ food: f, grams, macro, delta }) => (
              <button key={f.id} onClick={() => { onSelect(f.id, grams); onClose() }}
                className="w-full text-left p-3 rounded-lg border border-white/[0.06] hover:border-gold/30 mb-2 transition">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-warm">{f.name}</span>
                  <span className="text-xs text-muted">{grams}g</span>
                </div>
                <div className="flex gap-2 flex-wrap text-[10px]">
                  <span className="text-muted">{macro.kcal} kcal</span>
                  {delta.protein !== 0 && <span style={{ color: Math.abs(delta.protein) <= 2 ? '#47D18C' : '#E8A020' }}>B {delta.protein > 0 ? '+' : ''}{delta.protein}g</span>}
                  {delta.fat !== 0 && <span style={{ color: Math.abs(delta.fat) <= 2 ? '#47D18C' : '#E8A020' }}>T {delta.fat > 0 ? '+' : ''}{delta.fat}g</span>}
                  {delta.carbs !== 0 && <span style={{ color: Math.abs(delta.carbs) <= 2 ? '#47D18C' : '#E8A020' }}>W {delta.carbs > 0 ? '+' : ''}{delta.carbs}g</span>}
                </div>
              </button>
            ))}
          </>
        )}

        {searchResults && searchResults.length === 0 && (
          <p className="text-muted text-sm text-center py-4">Brak wyników</p>
        )}
        {searchResults && searchResults.map(f => {
          const gramsNeeded = Math.round((item.grams * (food?.kcal || 100)) / (f.kcal || 1))
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
        })}
      </div>
    </div>
  )
}

export default function MealPlanCard({ mealPlan }) {
  const [meals, setMeals] = useState(mealPlan?.meals || [])
  const [swapTarget, setSwapTarget] = useState(null)
  const [changed, setChanged] = useState(false)

  if (!mealPlan) return null

  function swapItem(mealIdx, itemIdx, newFoodId, newGrams) {
    setMeals(prev => prev.map((meal, mi) =>
      mi !== mealIdx ? meal : {
        ...meal,
        items: meal.items.map((item, ii) =>
          ii !== itemIdx ? item : { food_id: newFoodId, grams: newGrams }
        )
      }
    ))
    setChanged(true)
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

  return (
    <div className="bg-surface border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      {swapTarget && (
        <SwapModal
          item={swapTarget.item}
          food={FOODS.find(f => f.id === swapTarget.item.food_id)}
          onSelect={(newFoodId, newGrams) => swapItem(swapTarget.mealIdx, swapTarget.itemIdx, newFoodId, newGrams)}
          onClose={() => setSwapTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-muted uppercase tracking-widest">Twój plan żywieniowy</p>
          <h3 className="text-lg font-display font-semibold text-gold">{mealPlan.name}</h3>
        </div>
        {changed && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-[#E8A020]/10 border border-[#E8A020]/30 text-[#E8A020]">
            Zmodyfikowany
          </span>
        )}
      </div>

      {/* Total macros */}
      <div className="bg-bg-deep rounded-xl p-4 mb-4">
        <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Łączne makro dzienne</p>
        <div className="flex gap-3 flex-wrap">
          <span className="text-warm font-semibold">{totalKcal} kcal</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: `${MACRO_COLORS.protein}15`, color: MACRO_COLORS.protein, border: `1px solid ${MACRO_COLORS.protein}30` }}>
            B: {totalProtein}g
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: `${MACRO_COLORS.fat}15`, color: MACRO_COLORS.fat, border: `1px solid ${MACRO_COLORS.fat}30` }}>
            T: {totalFat}g
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: `${MACRO_COLORS.carbs}15`, color: MACRO_COLORS.carbs, border: `1px solid ${MACRO_COLORS.carbs}30` }}>
            W: {totalCarbs}g
          </span>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {meals.map((meal, mealIdx) => {
          let mealKcal = 0
          meal.items.forEach(item => {
            const food = FOODS.find(f => f.id === item.food_id)
            if (food) mealKcal += (food.kcal * item.grams) / 100
          })
          return (
            <div key={mealIdx} className="bg-bg-deep border border-gold/15 rounded-xl p-4">
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
                    <div key={itemIdx} className="flex items-center justify-between gap-2 bg-white/[0.02] rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-warm truncate">{food.name}</p>
                        <div className="flex gap-2 text-[10px] mt-0.5">
                          <span className="text-muted">{item.grams}g</span>
                          <span className="text-muted">·</span>
                          <span className="text-muted">{itemKcal} kcal</span>
                          <span style={{ color: MACRO_COLORS.protein }}>B:{itemProt}g</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSwapTarget({ mealIdx, itemIdx, item })}
                        className="text-[10px] px-2 py-1 rounded border border-[rgba(100,181,246,0.25)] text-[#64B5F6] shrink-0"
                      >
                        ⇄
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {changed && (
        <p className="text-[10px] text-muted text-center mt-4">
          💡 Twoje zmiany są zapisane lokalnie — trener widzi oryginalny plan
        </p>
      )}
    </div>
  )
}
