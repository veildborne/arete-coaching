'use client'
import { FOODS } from '@/lib/mealData'

const MACRO_COLORS = { protein: '#52B788', fat: '#E8A020', carbs: '#5B8DB8' }

export default function MealPlanCard({ mealPlan }) {
  if (!mealPlan) return null

  return (
    <div className="bg-surface border border-[rgba(212,181,112,0.18)] rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Plan żywieniowy</p>
      <p className="text-sm font-semibold text-warm mb-4">{mealPlan.name}</p>

      <div className="space-y-3">
        {(mealPlan.meals || []).map((meal, i) => {
          let mealKcal = 0, mealProt = 0
          meal.items.forEach(item => {
            const food = FOODS.find(f => f.id === item.food_id)
            if (!food) return
            mealKcal += (food.kcal    * item.grams) / 100
            mealProt += (food.protein * item.grams) / 100
          })
          return (
            <div key={i} className="bg-bg-deep rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gold uppercase tracking-widest">{meal.name}</span>
                <div className="flex gap-2">
                  <span className="text-[10px] text-muted">{Math.round(mealKcal)} kcal</span>
                  <span className="text-[10px]" style={{ color: MACRO_COLORS.protein }}>B:{Math.round(mealProt)}g</span>
                </div>
              </div>
              <div className="space-y-1">
                {meal.items.map((item, ii) => {
                  const food = FOODS.find(f => f.id === item.food_id)
                  if (!food) return null
                  return (
                    <div key={ii} className="flex justify-between text-xs">
                      <span className="text-muted">{food.name}</span>
                      <span className="text-warm">{item.grams}g</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
