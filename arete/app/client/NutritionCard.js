'use client'

const MACRO_COLORS = {
  protein: '#52B788',
  fat: '#E8A020',
  carbs: '#5B8DB8',
}

function MacroRing({ label, value, unit = 'g', color }) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold" style={{ color }}>{value}</div>
      <div className="text-[9px] text-muted uppercase tracking-wider">{unit}</div>
      <div className="text-[9px] text-muted">{label}</div>
    </div>
  )
}

export default function NutritionCard({ nutritionTargets }) {
  if (!nutritionTargets) return null

  const { calories, protein_g, fat_g, carbs_g, notes } = nutritionTargets

  return (
    <div className="bg-surface border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Twoje cele żywieniowe</p>

      <div className="text-center mb-4">
        <span className="font-display text-4xl text-gold">{calories}</span>
        <span className="text-muted text-sm ml-1">kcal</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <MacroRing label="Białko" value={protein_g} color={MACRO_COLORS.protein} />
        <MacroRing label="Tłuszcz" value={fat_g} color={MACRO_COLORS.fat} />
        <MacroRing label="Węgle" value={carbs_g} color={MACRO_COLORS.carbs} />
      </div>

      <div className="space-y-1.5">
        {[
          { label: 'Białko', value: protein_g, kcal: protein_g * 4, color: MACRO_COLORS.protein },
          { label: 'Tłuszcz', value: fat_g, kcal: fat_g * 9, color: MACRO_COLORS.fat },
          { label: 'Węglowodany', value: carbs_g, kcal: carbs_g * 4, color: MACRO_COLORS.carbs },
        ].map(m => (
          <div key={m.label} className="flex items-center gap-2">
            <div className="text-[11px] text-muted w-24 shrink-0">{m.label}</div>
            <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.round((m.kcal / calories) * 100))}%`, background: m.color }} />
            </div>
            <div className="text-[11px] text-muted w-8 text-right">{m.value}g</div>
          </div>
        ))}
      </div>

      {notes && (
        <div className="mt-4 border-l-2 border-gold/30 pl-3">
          <p className="text-[11px] text-muted/80 leading-relaxed">{notes}</p>
        </div>
      )}
    </div>
  )
}
