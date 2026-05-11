'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function SliderField({ label, name, value, onChange, min = 1, max = 10, lowLabel, highLabel }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <label className="text-sm text-warm font-body">{label}</label>
        <span className="text-base font-bold text-gold font-display min-w-[28px] text-right">{value ?? '—'}</span>
      </div>
      <input type="range" min={min} max={max} value={value ?? min}
        onChange={e => onChange(name, parseInt(e.target.value))}
        className="w-full accent-[#D4B570] cursor-pointer" />
      {(lowLabel || highLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted">{lowLabel}</span>
          <span className="text-[10px] text-muted">{highLabel}</span>
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
    body_weight: '', energy_level: 5, sleep_quality: 5,
    soreness_level: 5, adherence_pct: 80, client_notes: '',
  })

  function set(name, value) { setForm(prev => ({ ...prev, [name]: value })) }

  async function handleSubmit() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('check_ins').insert({
      client_id: clientId, week_number: weekNumber,
      plan_id: activePlan?.id || null,
      body_weight: form.body_weight ? parseFloat(form.body_weight) : null,
      energy_level: form.energy_level, sleep_quality: form.sleep_quality,
      soreness_level: form.soreness_level, adherence_pct: form.adherence_pct,
      client_notes: form.client_notes || null,
    })
    setSaving(false)
    if (!error) {
      // Award XP for checkin
      fetch('/api/xp/award', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'checkin', metadata: { description: 'Raport tygodniowy wysłany' } }) })
      setDone(true)
    } else alert('Błąd zapisu: ' + error.message)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center font-body">
      <div className="text-center">
        <div className="font-display text-6xl text-gold mb-4">✓</div>
        <h2 className="font-display text-2xl text-warm mb-2">Raport wysłany!</h2>
        <p className="text-muted text-sm mb-8">Tydzień {weekNumber} — trener zobaczy Twój raport</p>
        <button onClick={() => router.push('/client')}
          className="py-3 px-8 rounded-full border border-gold/30 text-gold text-sm cursor-pointer font-body tracking-widest hover:bg-gold/10 transition">
          Wróć do panelu
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen text-warm font-body">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-[rgba(212,181,112,0.12)] px-6 h-14 flex items-center justify-between">
        <button onClick={() => router.push('/client')}
          className="text-sm text-muted hover:text-gold transition font-body">
          ← Powrót
        </button>
        <div className="flex items-center gap-2">
          <span className="font-display text-xl text-gold tracking-widest">ARETÉ</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-gold/20 text-gold/40 tracking-widest">α 0.1</span>
        </div>
      </nav>

      <main className="max-w-lg mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] tracking-widest text-gold/60 uppercase mb-1">Raport tygodniowy</p>
          <h1 className="font-display text-3xl text-gold mb-1">Tydzień {weekNumber}</h1>
          {activePlan && <p className="text-xs text-muted">{activePlan.name}</p>}
          {lastCheckin && <p className="text-xs text-muted/50 mt-0.5">Ostatni raport: tydzień {lastCheckin.week_number}</p>}
        </div>

        {/* Form card */}
        <div className="bg-black/30 backdrop-blur-sm border border-[rgba(212,181,112,0.15)] rounded-2xl p-6 mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"/>

          <div className="mb-6">
            <label className="text-sm text-warm block mb-2">Masa ciała (kg)</label>
            <input type="number" step="0.1" placeholder="np. 82.5"
              value={form.body_weight} onChange={e => set('body_weight', e.target.value)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] border border-[rgba(212,181,112,0.2)] text-warm text-sm font-body outline-none focus:border-gold/50 transition"/>
          </div>

          <SliderField label="Poziom energii" name="energy_level" value={form.energy_level} onChange={set} lowLabel="Wyczerpany" highLabel="Pełen energii"/>
          <SliderField label="Jakość snu" name="sleep_quality" value={form.sleep_quality} onChange={set} lowLabel="Bardzo zły" highLabel="Doskonały"/>
          <SliderField label="Zakwasy / ból mięśni" name="soreness_level" value={form.soreness_level} onChange={set} lowLabel="Silny ból" highLabel="Brak"/>
          <SliderField label="Realizacja diety / planu" name="adherence_pct" value={form.adherence_pct} onChange={set} min={0} max={100} lowLabel="0%" highLabel="100%"/>

          <div>
            <label className="text-sm text-warm block mb-2">
              Notatki dla trenera <span className="text-muted">(opcjonalne)</span>
            </label>
            <textarea placeholder="Jak minął tydzień? Co sprawiało trudność?"
              value={form.client_notes} onChange={e => set('client_notes', e.target.value)}
              rows={3}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] border border-[rgba(212,181,112,0.2)] text-warm text-sm font-body outline-none resize-none focus:border-gold/50 transition leading-relaxed"/>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={saving}
          className="w-full py-4 rounded-2xl text-sm font-bold font-body tracking-widest uppercase transition-all"
          style={{ background: saving ? 'rgba(212,181,112,0.15)' : 'linear-gradient(135deg,#b8a677,#d4c494)', color: saving ? 'rgba(212,181,112,0.5)' : '#0f1a2e', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Wysyłanie...' : `Wyślij raport — Tydzień ${weekNumber}`}
        </button>
      </main>
    </div>
  )
}
