'use client'
import { useState } from 'react'

const MACRO_COLORS = {
  protein: '#52B788',
  fat: '#E8A020',
  carbs: '#5B8DB8',
}

function MacroBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted">{label}</span>
        <span style={{ color }}>{value}g</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function NutritionPanel({ clientId, initialTargets }) {
  const [targets, setTargets] = useState(initialTargets || null)
  const [editing, setEditing] = useState(!initialTargets)
  const [form, setForm] = useState({
    calories: initialTargets?.calories || '',
    protein_g: initialTargets?.protein_g || '',
    fat_g: initialTargets?.fat_g || '',
    carbs_g: initialTargets?.carbs_g || '',
    notes: initialTargets?.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const totalMacroKcal = targets
    ? (targets.protein_g * 4) + (targets.fat_g * 9) + (targets.carbs_g * 4)
    : 0

  async function handleSave() {
    const { calories, protein_g, fat_g, carbs_g } = form
    if (!calories || !protein_g || !fat_g || !carbs_g) return
    setSaving(true)
    const res = await fetch('/api/nutrition/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        calories: parseInt(calories),
        protein_g: parseInt(protein_g),
        fat_g: parseInt(fat_g),
        carbs_g: parseInt(carbs_g),
        notes: form.notes,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setTargets({
        calories: parseInt(calories),
        protein_g: parseInt(protein_g),
        fat_g: parseInt(fat_g),
        carbs_g: parseInt(carbs_g),
        notes: form.notes,
      })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="bg-[#1a1a1a] border border-white/[0.07] rounded-[10px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] text-muted uppercase tracking-widest">Cele żywieniowe</div>
        <div className="flex gap-2 items-center">
          {saved && <span className="text-[11px] text-success">✓ Zapisano</span>}
          <button
            onClick={() => setEditing(e => !e)}
            className="text-[11px] px-3 py-1 rounded-full border border-gold/20 text-gold/60 hover:text-gold transition"
          >
            {editing ? 'Anuluj' : '✎ Edytuj'}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'calories',  label: 'Kalorie (kcal)', color: '#D4B570' },
              { key: 'protein_g', label: 'Białko (g)',      color: MACRO_COLORS.protein },
              { key: 'fat_g',     label: 'Tłuszcz (g)',     color: MACRO_COLORS.fat },
              { key: 'carbs_g',   label: 'Węglowodany (g)', color: MACRO_COLORS.carbs },
            ].map(f => (
              <div key={f.key}>
                <div className="text-[10px] mb-1 uppercase tracking-widest" style={{ color: f.color }}>{f.label}</div>
                <input
                  type="number"
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.04] border border-gold/20 text-[#e8e8e8] text-sm font-body outline-none focus:border-gold/40"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] text-muted mb-1 uppercase tracking-widest">Notatka dla klienta</div>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="np. białko rozłóż na 4-5 posiłków, ostatni posiłek 2h przed snem..."
              rows={2}
              className="w-full py-2 px-3 rounded-lg bg-white/[0.04] border border-gold/20 text-[#e8e8e8] text-sm font-body outline-none resize-none focus:border-gold/40"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-bold font-body tracking-wider"
            style={{ background: saving ? 'rgba(212,181,112,0.2)' : 'linear-gradient(135deg,#b8a677,#d4c494)', color: '#0f1a2e', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Zapisuję...' : 'Zapisz cele'}
          </button>
        </div>
      ) : targets ? (
        <div className="space-y-3">
          <div className="text-center py-2 mb-2">
            <span className="font-display text-3xl text-gold">{targets.calories}</span>
            <span className="text-muted text-sm ml-1">kcal / dzień</span>
          </div>
          <MacroBar label="Białko" value={targets.protein_g} total={targets.protein_g + targets.fat_g + targets.carbs_g} color={MACRO_COLORS.protein} />
          <MacroBar label="Tłuszcz" value={targets.fat_g} total={targets.protein_g + targets.fat_g + targets.carbs_g} color={MACRO_COLORS.fat} />
          <MacroBar label="Węglowodany" value={targets.carbs_g} total={targets.protein_g + targets.fat_g + targets.carbs_g} color={MACRO_COLORS.carbs} />
          {targets.notes && (
            <div className="border-l-2 border-gold/30 pl-3 mt-3">
              <p className="text-[11px] text-muted leading-relaxed">{targets.notes}</p>
            </div>
          )}
          <div className="text-[10px] text-muted/40 text-center">
            Makro = {totalMacroKcal} kcal ({targets.protein_g * 4} B + {targets.fat_g * 9} T + {targets.carbs_g * 4} W)
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-muted text-sm">
          Brak ustawionych celów żywieniowych
        </div>
      )}
    </div>
  )
}
