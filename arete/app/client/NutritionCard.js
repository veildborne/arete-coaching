'use client'

const MACRO_COLORS = {
  protein: '#52B788',
  fat: '#E8A020',
  carbs: '#5B8DB8',
}

function MacroBar({ label, value, calories, color }) {
  const pct = calories > 0 ? Math.min(100, Math.round((value / calories) * 100)) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="text-[11px] text-muted w-24 shrink-0">{label}</div>
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-[11px] text-muted w-8 text-right">{value}g</div>
    </div>
  )
}

export default function NutritionCard({ nutritionTargets, nutritionSummary }) {
  if (!nutritionTargets) return null

  const { calories, protein_g, fat_g, carbs_g, notes } = nutritionTargets
  const s = nutritionSummary

  return (
    <div className="bg-surface border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] text-muted uppercase tracking-widest">Twoje cele żywieniowe</p>
        {s && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${s.aggressivenessColor}15`, color: s.aggressivenessColor, border: `1px solid ${s.aggressivenessColor}40` }}>
            {s.aggressivenessLabelPl}
          </span>
        )}
      </div>

      <div className="text-center mb-3">
        <span className="font-display text-4xl text-gold">{calories}</span>
        <span className="text-muted text-sm ml-1">kcal / dzień</span>
      </div>

      {s && (
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-white/[0.03] rounded-lg p-2">
            <div className="text-[10px] text-muted mb-0.5">BMR</div>
            <div className="text-xs text-warm font-medium">{s.bmr} kcal</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2">
            <div className="text-[10px] text-muted mb-0.5">Maintenance</div>
            <div className="text-xs text-warm font-medium">{s.tdee} kcal</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2">
            <div className="text-[10px] text-muted mb-0.5">Deficyt</div>
            <div className="text-xs font-medium" style={{ color: s.aggressivenessColor }}>
              {s.deficitPct > 0 ? `-${s.deficitPct}%` : `+${Math.abs(s.deficitPct)}%`}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1.5 mb-4">
        <MacroBar label="Białko" value={protein_g} calories={calories} color={MACRO_COLORS.protein} />
        <MacroBar label="Tłuszcz" value={fat_g} calories={calories} color={MACRO_COLORS.fat} />
        <MacroBar label="Węglowodany" value={carbs_g} calories={calories} color={MACRO_COLORS.carbs} />
      </div>

      {s?.weeklyRateKg && s.deficitPct > 0 && (
        <div className="text-[10px] text-muted text-center mb-3">
          Szacowane tempo: ~{s.weeklyRateKg} kg/tydzień
        </div>
      )}

      {s?.warnings && s.warnings.length > 0 && (
        <div className="space-y-1 mb-3">
          {s.warnings.map((w, i) => (
            <div key={i} className="flex gap-2 text-[10px] px-2 py-1.5 rounded-lg bg-[rgba(239,107,115,0.08)] border border-[rgba(239,107,115,0.2)]">
              <span className="text-danger shrink-0">⚠</span>
              <span className="text-danger/80">{w}</span>
            </div>
          ))}
        </div>
      )}

      {notes && (
        <div className="border-l-2 border-gold/30 pl-3">
          <p className="text-[11px] text-muted/80 leading-relaxed">{notes}</p>
        </div>
      )}
    </div>
  )
}
