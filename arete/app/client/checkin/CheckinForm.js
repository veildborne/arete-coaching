'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function SliderField({ label, name, value, onChange, min = 1, max = 10, lowLabel, highLabel }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-[13px] text-warm font-body">
          {label}
        </label>
        <span className="text-lg font-bold text-gold font-display min-w-[28px] text-right">
          {value ?? '—'}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value ?? min}
        onChange={e => onChange(name, parseInt(e.target.value))}
        className="w-full accent-[#b8a677] cursor-pointer"
      />
      {(lowLabel || highLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[rgba(184,166,119,0.5)]">{lowLabel}</span>
          <span className="text-[10px] text-[rgba(184,166,119,0.5)]">{highLabel}</span>
        </div>
      )}
    </div>
  )
}

export default function CheckinForm({ clientId, weekNumber, activePlan, lastCheckin }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    body_weight: '',
    energy_level: 5,
    sleep_quality: 5,
    soreness_level: 5,
    adherence_pct: 80,
    client_notes: '',
  })

  function set(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit() {
    setSaving(true)
    const supabase = createClient()
    const payload = {
      client_id: clientId,
      week_number: weekNumber,
      plan_id: activePlan?.id || null,
      body_weight: form.body_weight ? parseFloat(form.body_weight) : null,
      energy_level: form.energy_level,
      sleep_quality: form.sleep_quality,
      soreness_level: form.soreness_level,
      adherence_pct: form.adherence_pct,
      client_notes: form.client_notes || null,
    }
    const { error } = await supabase.from('check_ins').insert(payload)
    setSaving(false)
    if (!error) setDone(true)
    else alert('Błąd zapisu: ' + error.message)
  }

  if (done) return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#131f36_0%,#0a0f1a_60%,#060912_100%)] flex items-center justify-center font-body">
      <div className="text-center">
        <div className="font-display text-[64px] text-[#b8a677] mb-4 leading-none">
          ✓
        </div>
        <h2 className="font-display text-[28px] text-warm mb-2 m-0">
          Check-in wysłany!
        </h2>
        <p className="text-[rgba(184,166,119,0.6)] text-sm mb-8">
          Tydzień {weekNumber} — trener zobaczy Twój raport
        </p>
        <button
          onClick={() => router.push('/client')}
          className="py-[10px] px-7 rounded-full bg-transparent border border-[rgba(184,166,119,0.3)] text-[#b8a677] text-[13px] cursor-pointer font-body tracking-[0.1em]"
        >
          Wróć do panelu
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#131f36_0%,#0a0f1a_60%,#060912_100%)] text-warm font-body">
      {/* Topbar */}
      <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.85)] backdrop-blur-xl border-b border-[rgba(184,166,119,0.15)] px-8 h-14 flex items-center justify-between">
        <button
          onClick={() => router.push('/client')}
          className="text-[13px] text-[rgba(184,166,119,0.7)] bg-transparent border-0 cursor-pointer font-body p-0 tracking-[0.05em]"
        >
          ← Powrót
        </button>
        <span className="font-display text-xl font-semibold text-gold tracking-[0.35em]">
          ARETÉ
        </span>
      </nav>

      <main className="max-w-[560px] mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8 border-b border-[rgba(184,166,119,0.15)] pb-6">
          <p className="text-[10px] tracking-[0.3em] text-[rgba(184,166,119,0.6)] uppercase m-0 mb-[6px]">
            Raport tygodniowy
          </p>
          <h1 className="font-display text-[32px] font-semibold text-warm m-0 mb-[6px]">
            Tydzień {weekNumber}
          </h1>
          {activePlan && (
            <p className="text-[13px] text-[rgba(184,166,119,0.6)] m-0">
              Plan: {activePlan.name}
            </p>
          )}
          {lastCheckin && (
            <p className="text-xs text-[rgba(184,166,119,0.4)] mt-1 mb-0">
              Ostatni check-in: tydzień {lastCheckin.week_number}
            </p>
          )}
        </div>

        {/* Karta formularza */}
        <div className="bg-gradient-to-br from-[#131f36] to-[#0f1a2e] border border-[rgba(184,166,119,0.15)] rounded-2xl p-7 relative overflow-hidden mb-4">
          {/* gold top line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,196,148,0.4)] to-transparent" />

          {/* Waga */}
          <div className="mb-7">
            <label className="text-[13px] text-warm block mb-2 font-body">
              Masa ciała (kg)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="np. 82.5"
              value={form.body_weight}
              onChange={e => set('body_weight', e.target.value)}
              className="w-full py-[10px] px-[14px] rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(184,166,119,0.2)] text-warm text-[15px] font-body box-border outline-none"
            />
          </div>

          <SliderField
            label="Poziom energii"
            name="energy_level"
            value={form.energy_level}
            onChange={set}
            lowLabel="Kompletne wyczerpanie"
            highLabel="Pełen energii"
          />
          <SliderField
            label="Jakość snu"
            name="sleep_quality"
            value={form.sleep_quality}
            onChange={set}
            lowLabel="Bardzo zły sen"
            highLabel="Doskonały sen"
          />
          <SliderField
            label="Zakwasy / bolesność mięśni"
            name="soreness_level"
            value={form.soreness_level}
            onChange={set}
            lowLabel="Brak zakwasów"
            highLabel="Silny ból"
          />
          <SliderField
            label="Przestrzeganie diety / planu"
            name="adherence_pct"
            value={form.adherence_pct}
            onChange={set}
            min={0}
            max={100}
            lowLabel="0%"
            highLabel="100%"
          />

          {/* Notatki */}
          <div className="mb-0">
            <label className="text-[13px] text-warm block mb-2 font-body">
              Notatki dla trenera{' '}
              <span className="text-[rgba(184,166,119,0.5)]">(opcjonalne)</span>
            </label>
            <textarea
              placeholder="Jak minął tydzień? Co sprawiało trudność? Uwagi..."
              value={form.client_notes}
              onChange={e => set('client_notes', e.target.value)}
              rows={4}
              className="w-full py-[10px] px-[14px] rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(184,166,119,0.2)] text-warm text-sm font-body box-border outline-none resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`w-full py-[14px] rounded-full border-0 text-sm font-bold font-body tracking-[0.1em] uppercase transition-all ${
            saving ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{
            background: saving ? 'rgba(184,166,119,0.15)' : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
            color: saving ? 'rgba(184,166,119,0.5)' : '#0f1a2e',
          }}
        >
          {saving ? 'Wysyłanie...' : `Wyślij check-in — Tydzień ${weekNumber}`}
        </button>
      </main>
    </div>
  )
}
