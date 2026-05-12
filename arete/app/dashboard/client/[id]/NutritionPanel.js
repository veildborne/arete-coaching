'use client'
import { useState } from 'react'
import { calculateNutritionFromQuestionnaire } from '@/lib/nutritionEngine'

const MACRO_COLORS = {
  protein: '#52B788',
  fat: '#E8A020',
  carbs: '#5B8DB8',
}

function getPhaseTransitionHint(questionnaire, currentTargets) {
  if (!questionnaire?.data || !currentTargets) return null
  const q = questionnaire.data
  const currentGoal = q.cel || ''
  const waga = parseFloat(q.waga_kg) || 0

  // Wykryj poprzedni cel na podstawie kalorii
  // Jeśli kalorie > TDEE to masa, jeśli < to redukcja
  const tdeeApprox = waga * 30 // uproszczony TDEE
  const isCurrentlyBulking = currentTargets.calories > tdeeApprox + 100
  const isCurrentlyCutting = currentTargets.calories < tdeeApprox - 100

  const hints = []

  if (isCurrentlyBulking && currentGoal === 'Redukcja tkanki tłuszczowej') {
    hints.push({
      type: 'warning',
      title: 'Przejście masa → redukcja',
      steps: [
        `Faza 1 (2-4 tyg): Maintenance — ${Math.round(tdeeApprox)} kcal. Pozwól metabolizmowi się zresetować.`,
        `Faza 2: Stopniowe obniżanie o 100-200 kcal co 1-2 tygodnie.`,
        `Cel: ${Math.round(tdeeApprox - 300)} kcal (deficyt ~300 kcal).`,
        `Białko: utrzymaj ${Math.round(waga * 2.2)}g — chroni masę mięśniową w deficycie.`,
      ],
      source: 'McDonald / Israetel'
    })
  }

  if (isCurrentlyCutting && currentGoal === 'Budowa masy mięśniowej') {
    hints.push({
      type: 'info',
      title: 'Przejście redukcja → masa',
      steps: [
        `Faza 1 (1-2 tyg): Diet break — ${Math.round(tdeeApprox)} kcal. Resetuje leptynę i metabolizm.`,
        `Faza 2: Stopniowe zwiększanie o 100-200 kcal co 1-2 tygodnie.`,
        `Cel: ${Math.round(tdeeApprox + 200)} kcal (surplus ~200 kcal dla minimize fat gain).`,
        `Białko: ${Math.round(waga * 2.0)}g — w surplus można zejść do 2.0g/kg.`,
      ],
      source: 'Israetel / Helms'
    })
  }

  if (currentGoal === 'Rekompozycja') {
    hints.push({
      type: 'info',
      title: 'Rekompozycja',
      steps: [
        `TDEE: ${Math.round(tdeeApprox)} kcal — kalorii na utrzymanie.`,
        `Białko wysokie: ${Math.round(waga * 2.2)}g — kluczowe dla rekomp.`,
        `Cykl kaloryczny: dni treningowe +100-150 kcal, dni odpoczynku -100-150 kcal.`,
        `Efekty wolniejsze niż dedykowana masa/redukcja — informuj klienta.`,
      ],
      source: 'Helms / Nuckols'
    })
  }

  // Pokazuj wskazówki też dla aktywnej fazy (nie tylko przejścia)
  if (isCurrentlyCutting && currentGoal === 'Redukcja tkanki tłuszczowej') {
    hints.push({
      type: 'info',
      title: 'Aktywna redukcja',
      steps: [
        `Tempo: 0.5-1.0% masy ciała/tydzień = ${Math.round(waga * 0.005)}-${Math.round(waga * 0.01)} kg/tydzień.`,
        `Białko: min ${Math.round(waga * 2.2)}g — chroni masę mięśniową w deficycie (McDonald).`,
        `7-dniowa średnia wagi — nie oceniaj po jednym pomiarze.`,
        `Jeśli waga stoi 2 tyg + adherencja dobra → obetnij 100-150 kcal.`,
        `Jeśli energia spada mocno → rozważ diet break 1-2 tyg na ${Math.round(waga * 30)} kcal.`,
      ],
      source: 'Helms / McDonald / Israetel'
    })
  }

  if (isCurrentlyBulking && currentGoal === 'Budowa masy mięśniowej') {
    hints.push({
      type: 'info',
      title: 'Aktywna masa',
      steps: [
        `Tempo: 0.25-0.5% masy/tydzień = ${Math.round(waga * 0.0025)}-${Math.round(waga * 0.005)} kg/tydzień.`,
        `Białko: ${Math.round(waga * 2.0)}g — w surplus można zejść do 2.0g/kg (Helms).`,
        `Jeśli tyjesz szybciej niż ${Math.round(waga * 0.005)} kg/tydzień → obetnij 100 kcal.`,
        `Siła powinna rosnąć — brak progresu przy nadwadze = za dużo tłuszczu.`,
      ],
      source: 'Israetel / Helms'
    })
  }

  return hints.length > 0 ? hints[0] : null
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

export default function NutritionPanel({ clientId, initialTargets, questionnaire }) {
  const suggested = calculateNutritionFromQuestionnaire(questionnaire?.data)

  const [targets, setTargets]   = useState(initialTargets || null)
  const [editing, setEditing]   = useState(!initialTargets)
  const [showRationale, setShowRationale] = useState(false)
  const [form, setForm] = useState({
    calories:  initialTargets?.calories  || suggested?.calories  || '',
    protein_g: initialTargets?.protein_g || suggested?.protein_g || '',
    fat_g:     initialTargets?.fat_g     || suggested?.fat_g     || '',
    carbs_g:   initialTargets?.carbs_g   || suggested?.carbs_g   || '',
    notes:     initialTargets?.notes     || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  function applySuggested() {
    if (!suggested) return
    setForm(p => ({
      ...p,
      calories:  suggested.targetCalories,
      protein_g: suggested.protein_g,
      fat_g:     suggested.fat_g,
      carbs_g:   suggested.carbs_g,
    }))
  }

  function applyWithCustomKcal(targetKcal) {
    if (!questionnaire?.data) return
    const q = questionnaire.data
    const waga = parseFloat(q.waga_kg) || 0
    const cel = q.cel || ''
    const proteinMulti = cel === 'Redukcja tkanki tłuszczowej' ? 2.2 : 2.0
    const protein_g = Math.round(waga * proteinMulti)
    const fat_g = Math.max(Math.round((waga * 0.8) / 5) * 5, 54)
    const carbsKcal = Math.max(0, targetKcal - protein_g * 4 - fat_g * 9)
    const carbs_g = Math.round(carbsKcal / 4)
    setForm(p => ({ ...p, protein_g, fat_g, carbs_g }))
  }

  const totalMacroKcal = targets
    ? (targets.protein_g * 4) + (targets.fat_g * 9) + (targets.carbs_g * 4)
    : 0

  // Live macro kcal check while editing
  const liveKcal = form.protein_g && form.fat_g && form.carbs_g
    ? (parseInt(form.protein_g) * 4) + (parseInt(form.fat_g) * 9) + (parseInt(form.carbs_g) * 4)
    : 0
  const liveCalDiff = form.calories && liveKcal
    ? liveKcal - parseInt(form.calories)
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
        calories:  parseInt(calories),
        protein_g: parseInt(protein_g),
        fat_g:     parseInt(fat_g),
        carbs_g:   parseInt(carbs_g),
        notes:     form.notes,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setTargets({
        calories:  parseInt(calories),
        protein_g: parseInt(protein_g),
        fat_g:     parseInt(fat_g),
        carbs_g:   parseInt(carbs_g),
        notes:     form.notes,
      })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-5">
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

      {/* Suggested banner */}
      {suggested && !editing && (
        <div className="mb-4 p-3 rounded-lg border border-[rgba(82,183,136,0.2)] bg-[rgba(82,183,136,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-success">✦ Sugestia algorytmu</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${suggested.aggressivenessColor}15`, color: suggested.aggressivenessColor, border: `1px solid ${suggested.aggressivenessColor}40` }}>
                {suggested.aggressivenessLabelPl}
              </span>
              <button onClick={() => setShowRationale(r => !r)} className="text-[10px] text-muted hover:text-warm transition">
                {showRationale ? 'Ukryj' : 'Szczegóły'}
              </button>
            </div>
          </div>

          {showRationale && (
            <div className="mb-3 space-y-1">
              <p className="text-[11px] text-muted leading-relaxed">{suggested.rationale}</p>
              <div className="flex gap-3 text-[10px] mt-1">
                <span className="text-muted">BMR: <span className="text-warm">{suggested.bmr} kcal</span></span>
                <span className="text-muted">TDEE: <span className="text-warm">{suggested.tdee} kcal</span></span>
                <span className="text-muted">Deficyt: <span className="text-warm">{suggested.deficitPct}%</span></span>
              </div>
              <div className="text-[10px] text-muted">
                Tempo redukcji: ~{suggested.weeklyRateKg} kg/tydzień
              </div>
            </div>
          )}

          <div className="flex gap-3 text-xs mb-2">
            <span className="text-warm font-medium">{suggested.targetCalories} kcal</span>
            <span style={{ color: '#52B788' }}>B: {suggested.protein_g}g</span>
            <span style={{ color: '#E8A020' }}>T: {suggested.fat_g}g</span>
            <span style={{ color: '#5B8DB8' }}>W: {suggested.carbs_g}g</span>
            <span className="text-muted text-[10px] self-center">{suggested.proteinPerKg}g/kg</span>
          </div>

          {suggested.warnings && suggested.warnings.length > 0 && (
            <div className="mb-2 space-y-1">
              {suggested.warnings.map((w, i) => (
                <div key={i} className="flex gap-2 text-[10px] px-2 py-1.5 rounded-lg bg-[rgba(239,107,115,0.08)] border border-[rgba(239,107,115,0.2)]">
                  <span className="text-danger shrink-0">⚠</span>
                  <span className="text-danger/80">{w}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { applySuggested(); setEditing(true) }}
            className="text-[11px] px-3 py-1.5 rounded-lg border border-success/30 text-success hover:bg-success/10 transition"
          >
            Zastosuj i edytuj →
          </button>
        </div>
      )}

      {/* Phase transition hints */}
      {(() => {
        const hint = getPhaseTransitionHint(questionnaire, targets)
        if (!hint) return null
        const isWarning = hint.type === 'warning'
        return (
          <div className="mb-4 p-4 rounded-xl border"
            style={{ borderColor: isWarning ? 'rgba(232,160,32,0.3)' : 'rgba(91,141,184,0.3)', background: isWarning ? 'rgba(232,160,32,0.04)' : 'rgba(91,141,184,0.04)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: isWarning ? '#E8A020' : '#5B8DB8' }}>
                {isWarning ? '⚠' : 'ℹ'}
              </span>
              <p className="text-xs font-semibold" style={{ color: isWarning ? '#E8A020' : '#5B8DB8' }}>
                {hint.title}
              </p>
              <span className="text-[9px] text-muted ml-auto">{hint.source}</span>
            </div>
            <div className="space-y-1.5">
              {hint.steps.map((step, i) => (
                <div key={i} className="flex gap-2 text-xs text-muted">
                  <span style={{ color: isWarning ? '#E8A020' : '#5B8DB8' }} className="shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {editing ? (
        <div className="space-y-3">
          {/* Suggested quick-apply while editing */}
          {suggested && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[11px] text-muted">Sugestia: {suggested.targetCalories} kcal / B{suggested.protein_g} T{suggested.fat_g} W{suggested.carbs_g}</span>
              <button onClick={applySuggested} className="text-[10px] px-2.5 py-1 rounded border border-gold/20 text-gold/60 hover:text-gold transition">
                Zastosuj
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] mb-1 uppercase tracking-widest" style={{ color: '#D4B570' }}>Kalorie (kcal)</div>
              <input
                type="number"
                value={form.calories}
                onChange={e => setForm(p => ({ ...p, calories: e.target.value }))}
                className="w-full py-2 px-3 rounded-lg bg-white/[0.04] border border-gold/20 text-[#e8e8e8] text-sm font-body outline-none focus:border-gold/40"
              />
              <button onClick={() => applyWithCustomKcal(parseInt(form.calories))}
                className="text-[10px] px-2.5 py-1.5 rounded-lg border border-gold/20 text-gold/60 hover:text-gold transition w-full mt-1">
                ↻ Przelicz makro dla {form.calories} kcal
              </button>
            </div>
            {[
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

          {/* Live macro check */}
          {liveKcal > 0 && (
            <div className={`text-[11px] px-3 py-2 rounded-lg border ${Math.abs(liveCalDiff) <= 50 ? 'border-success/20 text-success' : 'border-[rgba(232,160,32,0.3)] text-[#E8A020]'}`}>
              Makro = {liveKcal} kcal
              {liveCalDiff !== 0 && ` (${liveCalDiff > 0 ? '+' : ''}${liveCalDiff} vs cel)`}
              {Math.abs(liveCalDiff) <= 50 && ' ✓'}
            </div>
          )}

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
          {suggested ? (
            <div>
              <p className="mb-3">Brak ustawionych celów</p>
              <button
                onClick={() => { applySuggested(); setEditing(true) }}
                className="text-[11px] px-4 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition"
              >
                ✦ Użyj sugestii algorytmu
              </button>
            </div>
          ) : 'Brak ustawionych celów żywieniowych — uzupełnij ankietę klienta'}
        </div>
      )}
    </div>
  )
}
