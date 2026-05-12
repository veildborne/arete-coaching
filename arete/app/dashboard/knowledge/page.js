'use client'
import { useState } from 'react'
import React from 'react'

const GOLD = '#D4B570'
const GREEN = '#47D18C'
const RED = '#EF6B73'
const BLUE = '#5B8DB8'
const ORANGE = '#E8A020'

function Calc1RM() {
  const [weight, setWeight] = React.useState('')
  const [reps, setReps] = React.useState('')
  const e1rm = weight && reps ? Math.round(parseFloat(weight) * (1 + parseInt(reps) / 30)) : null
  return (
    <div className="p-4 bg-black/20 rounded-xl border border-gold/20">
      <p className="text-xs text-gold font-semibold mb-3">Kalkulator e1RM (Epley)</p>
      <p className="text-[10px] text-muted mb-3 font-mono">weight × (1 + reps/30)</p>
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <p className="text-[10px] text-muted mb-1">Ciężar (kg)</p>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="100"
            className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none"/>
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-muted mb-1">Powtórzenia</p>
          <input type="number" value={reps} onChange={e=>setReps(e.target.value)} placeholder="8"
            className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none"/>
        </div>
      </div>
      {e1rm && (
        <div className="text-center p-3 bg-gold/10 border border-gold/30 rounded-lg">
          <p className="text-[10px] text-muted mb-1">Szacowany 1RM</p>
          <p className="font-display text-2xl text-gold">{e1rm} kg</p>
          <div className="grid grid-cols-4 gap-1 mt-2">
            {[70,75,80,85,90,95].map(pct => (
              <div key={pct} className="text-center">
                <p className="text-[9px] text-muted">{pct}%</p>
                <p className="text-xs text-warm">{Math.round(e1rm * pct / 100)} kg</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CalcTDEE() {
  const [w, setW] = React.useState('')
  const [h, setH] = React.useState('')
  const [age, setAge] = React.useState('')
  const [sex, setSex] = React.useState('M')
  const [act, setAct] = React.useState('1.55')
  const tdee = w && h && age ? Math.round(
    (sex==='M' ? 10*parseFloat(w)+6.25*parseFloat(h)-5*parseFloat(age)+5 : 10*parseFloat(w)+6.25*parseFloat(h)-5*parseFloat(age)-161)
    * parseFloat(act)
  ) : null
  return (
    <div className="p-4 bg-black/20 rounded-xl border border-gold/20">
      <p className="text-xs text-gold font-semibold mb-3">Kalkulator TDEE (Mifflin-St Jeor)</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {[{l:'Waga (kg)',v:w,s:setW,ph:'80'},{l:'Wzrost (cm)',v:h,s:setH,ph:'175'},{l:'Wiek',v:age,s:setAge,ph:'25'}].map(f=>(
          <div key={f.l}>
            <p className="text-[10px] text-muted mb-1">{f.l}</p>
            <input type="number" value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.ph}
              className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none"/>
          </div>
        ))}
        <div>
          <p className="text-[10px] text-muted mb-1">Płeć</p>
          <select value={sex} onChange={e=>setSex(e.target.value)} className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none">
            <option value="M">Mężczyzna</option>
            <option value="F">Kobieta</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-[10px] text-muted mb-1">Aktywność</p>
        <select value={act} onChange={e=>setAct(e.target.value)} className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none">
          <option value="1.2">Siedzący</option>
          <option value="1.375">Lekki (1-3x/tyg)</option>
          <option value="1.55">Umiarkowany (3-5x/tyg)</option>
          <option value="1.725">Aktywny (6-7x/tyg)</option>
          <option value="1.9">Bardzo aktywny (2x dziennie)</option>
        </select>
      </div>
      {tdee && (
        <div className="text-center p-3 bg-gold/10 border border-gold/30 rounded-lg">
          <p className="font-display text-2xl text-gold">{tdee} kcal</p>
          <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
            <div><p className="text-muted">Redukcja</p><p className="text-warm">{tdee-300} kcal</p></div>
            <div><p className="text-muted">Maintenance</p><p className="text-warm">{tdee} kcal</p></div>
            <div><p className="text-muted">Masa</p><p className="text-warm">{tdee+250} kcal</p></div>
          </div>
          <div className="mt-2 text-[10px] text-muted">
            Białko: {Math.round(parseFloat(w)*2.2)}g redukcja / {Math.round(parseFloat(w)*2.0)}g masa
          </div>
        </div>
      )}
    </div>
  )
}

function CalcMacro() {
  const [kcal, setKcal] = React.useState('')
  const [w, setW] = React.useState('')
  const [cel, setCel] = React.useState('cut')
  const result = kcal && w ? (() => {
    const waga = parseFloat(w)
    const calories = parseInt(kcal)
    const proteinMulti = cel === 'cut' ? 2.2 : 2.0
    const protein = Math.round(waga * proteinMulti)
    const fat = Math.max(Math.round(waga * 0.8), 50)
    const carbsKcal = Math.max(0, calories - protein*4 - fat*9)
    const carbs = Math.round(carbsKcal / 4)
    return { protein, fat, carbs, total: protein*4 + fat*9 + carbs*4 }
  })() : null
  return (
    <div className="p-4 bg-black/20 rounded-xl border border-gold/20">
      <p className="text-xs text-gold font-semibold mb-3">Kalkulator makro (Helms/McDonald)</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-[10px] text-muted mb-1">Kalorie (kcal)</p>
          <input type="number" value={kcal} onChange={e=>setKcal(e.target.value)} placeholder="2000"
            className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none"/>
        </div>
        <div>
          <p className="text-[10px] text-muted mb-1">Waga (kg)</p>
          <input type="number" value={w} onChange={e=>setW(e.target.value)} placeholder="80"
            className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none"/>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] text-muted mb-1">Cel</p>
          <select value={cel} onChange={e=>setCel(e.target.value)} className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none">
            <option value="cut">Redukcja (białko 2.2g/kg)</option>
            <option value="bulk">Masa (białko 2.0g/kg)</option>
            <option value="recomp">Rekompozycja (białko 2.2g/kg)</option>
          </select>
        </div>
      </div>
      {result && (
        <div className="p-3 bg-gold/10 border border-gold/30 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-center mb-2">
            <div><p className="text-[9px] text-[#52B788]">BIAŁKO</p><p className="text-lg font-semibold text-warm">{result.protein}g</p><p className="text-[9px] text-muted">{result.protein*4} kcal</p></div>
            <div><p className="text-[9px] text-[#E8A020]">TŁUSZCZ</p><p className="text-lg font-semibold text-warm">{result.fat}g</p><p className="text-[9px] text-muted">{result.fat*9} kcal</p></div>
            <div><p className="text-[9px] text-[#5B8DB8]">WĘGLE</p><p className="text-lg font-semibold text-warm">{result.carbs}g</p><p className="text-[9px] text-muted">{result.carbs*4} kcal</p></div>
          </div>
          <p className="text-center text-[10px] text-muted">Makro = {result.total} kcal</p>
        </div>
      )}
    </div>
  )
}

function CalcRIR() {
  const [perc, setPerc] = React.useState('')
  const [rm, setRm] = React.useState('')
  const result = perc && rm ? (() => {
    const e1rm = parseFloat(rm)
    const p = parseFloat(perc) / 100
    const weight = Math.round(e1rm * p)
    // Epley: e1rm = w * (1 + reps/30) → reps = 30 * (e1rm/w - 1)
    const reps = Math.round(30 * (e1rm / weight - 1))
    return { weight, reps }
  })() : null
  return (
    <div className="p-4 bg-black/20 rounded-xl border border-gold/20">
      <p className="text-xs text-gold font-semibold mb-3">Kalkulator % 1RM → ciężar</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-[10px] text-muted mb-1">e1RM (kg)</p>
          <input type="number" value={rm} onChange={e=>setRm(e.target.value)} placeholder="100"
            className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none"/>
        </div>
        <div>
          <p className="text-[10px] text-muted mb-1">Intensywność (%)</p>
          <input type="number" value={perc} onChange={e=>setPerc(e.target.value)} placeholder="75"
            className="w-full py-2 px-3 rounded-lg bg-black/30 border border-gold/20 text-warm text-sm font-body outline-none"/>
        </div>
      </div>
      {result && (
        <div className="text-center p-3 bg-gold/10 border border-gold/30 rounded-lg">
          <p className="font-display text-xl text-gold">{result.weight} kg</p>
          <p className="text-[10px] text-muted">≈ {result.reps} powtórzeń do upadku</p>
        </div>
      )}
      <div className="mt-3 grid grid-cols-4 gap-1">
        {[[100,'1RM'],[95,'2-3'],[90,'4-5'],[85,'6-7'],[80,'8-10'],[75,'10-12'],[70,'12-15'],[65,'15-20']].map(([p,r])=>(
          <div key={p} className="text-center p-1.5 bg-white/[0.03] rounded text-[10px]">
            <p className="text-muted">{p}%</p>
            <p className="text-warm">{r} powt.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const SECTIONS = [
  {
    id: 'volume',
    icon: '▦',
    title: 'Objętość tygodniowa MEV/MAV/MRV',
    source: 'Mike Israetel / RP Hypertrophy',
    color: GOLD,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] mb-2">
          <div className="p-2 rounded-lg" style={{background:'rgba(71,209,140,0.1)',border:'1px solid rgba(71,209,140,0.2)'}}>
            <p style={{color:GREEN}} className="font-bold">MEV</p>
            <p className="text-muted">Minimum do progresu</p>
          </div>
          <div className="p-2 rounded-lg" style={{background:'rgba(212,181,112,0.1)',border:'1px solid rgba(212,181,112,0.2)'}}>
            <p style={{color:GOLD}} className="font-bold">MAV</p>
            <p className="text-muted">Maksymalne adaptacje</p>
          </div>
          <div className="p-2 rounded-lg" style={{background:'rgba(239,107,115,0.1)',border:'1px solid rgba(239,107,115,0.2)'}}>
            <p style={{color:RED}} className="font-bold">MRV</p>
            <p className="text-muted">Max do regeneracji</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold/20">
                {['Partia','Beg MEV','Beg MAV','Beg MRV','Int MEV','Int MAV','Int MRV','Adv MEV','Adv MAV','Adv MRV','Freq','Uwagi'].map(h=>(
                  <th key={h} className="text-left py-2 px-2 text-[9px] text-muted uppercase tracking-widest font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Klatka',       8,14,18, 10,16,20, 12,18,22, '2x', 'Stretch: Incline DB, Cable Fly'],
                ['Plecy',        10,15,20, 12,18,22, 14,20,25, '2x', 'Wysoka tolerancja. Mix wiosłowanie+pull'],
                ['Barki boczne', 6,10,14, 8,12,16,  10,14,20, '3x', 'Mała partia, szybka regen. Cable>hantle'],
                ['Barki tylne',  6,10,14, 8,12,16,  10,14,18, '3x', 'Face pull, Rev Pec Deck — stretch'],
                ['Biceps',       6,10,14, 8,12,16,  10,14,18, '2x', 'Stretch: Incline DB Curl. Cable trzyma napięcie'],
                ['Triceps',      6,10,14, 8,12,16,  10,14,18, '2x', 'Overhead stretch: Overhead Cable Ext'],
                ['Czwórogłowe', 8,14,18, 10,16,20, 12,18,22, '2x', 'Hack Squat, Leg Press > barbell squat'],
                ['Dwugłowe uda', 6,10,14, 8,12,16, 10,14,18, '2x', 'Seated Leg Curl > Lying. RDL = stretch'],
                ['Pośladki',     6,12,16, 8,14,20, 10,16,22, '3x', 'Hip Thrust #1. Kobiety często więcej'],
                ['Łydki',        6,10,14, 8,12,16, 10,14,20, '3x', 'Seated (soleus) + Standing (gastroc)'],
                ['Brzuch',       6,10,14, 8,12,16, 10,14,18, '3x', 'Cable Crunch z pełnym stretchem'],
                ['Przedramiona', 4,8,12,  6,10,14,  8,12,16,  '2x', 'Carry-over z innych ćwiczeń'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-gold/[0.06] hover:bg-gold/[0.03] transition">
                  <td className="py-2 px-2 font-medium text-warm whitespace-nowrap">{row[0]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:GREEN}}>{row[1]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:GOLD}}>{row[2]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:RED}}>{row[3]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:GREEN}}>{row[4]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:GOLD}}>{row[5]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:RED}}>{row[6]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:GREEN}}>{row[7]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:GOLD}}>{row[8]}</td>
                  <td className="py-2 px-2 font-mono" style={{color:RED}}>{row[9]}</td>
                  <td className="py-2 px-2 text-muted">{row[10]}</td>
                  <td className="py-2 px-2 text-muted text-[10px]">{row[11]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-gold/10 text-xs text-muted leading-relaxed">
          <span style={{color:GOLD}} className="font-semibold">Zasady Israetela: </span>
          Start przy MEV → ramp do MAV przez mezocykl → tydzień 6 deload → nowy cykl startuje wyżej.
          Przy złej regeneracji (sen, stres, praca fizyczna) → obniż non-priority do MEV, zachowaj MAV dla partii priorytetowych.
          MRV to sufit — przekroczenie = regres, nie progres.
        </div>
      </div>
    )
  },
  {
    id: 'periodization',
    icon: '◈',
    title: 'Periodyzacja RIR i mezocykl',
    source: 'Helms / Zourdos / Israetel',
    color: GREEN,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:'Beginner', weeks:[[1,'RIR 3'],[2,'RIR 3'],[3,'RIR 2'],[4,'RIR 2'],[5,'RIR 2'],[6,'Deload']], note:'Wyższe RIR — uczą się techniki' },
            { label:'Intermediate', weeks:[[1,'RIR 3'],[2,'RIR 2'],[3,'RIR 2'],[4,'RIR 1'],[5,'RIR 1'],[6,'Deload']], note:'Standardowa progresja' },
            { label:'Advanced', weeks:[[1,'RIR 2'],[2,'RIR 2'],[3,'RIR 1'],[4,'RIR 1'],[5,'RIR 0'],[6,'Deload']], note:'Tydzień 5 do niemal upadku' },
          ].map(lvl => (
            <div key={lvl.label} className="p-3 bg-black/20 rounded-xl border border-green-500/20">
              <p className="text-[10px] font-semibold text-warm mb-2">{lvl.label}</p>
              {lvl.weeks.map(([w,r]) => (
                <div key={w} className={`flex justify-between text-xs py-1 border-b border-white/[0.04] ${w===6?'text-blue-400':'text-warm'}`}>
                  <span>Tydzień {w}</span>
                  <span style={{color: w===6?BLUE:GREEN}}>{r}</span>
                </div>
              ))}
              <p className="text-[10px] text-muted mt-2">{lvl.note}</p>
            </div>
          ))}
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-gold/10">
          <p className="text-xs font-semibold text-gold mb-2">Volume ramp przez mezocykl (Israetel)</p>
          <div className="grid grid-cols-6 gap-1 text-center text-[10px]">
            {[['T1','Base','gray'],['T2','Base','gray'],['T3','Base+1',GOLD],['T4','Base+1',GOLD],['T5','Base+2',RED],['T6','Deload',BLUE]].map(([t,v,c])=>(
              <div key={t} className="p-2 rounded-lg bg-white/[0.03]">
                <p className="text-muted">{t}</p>
                <p style={{color:c}} className="font-semibold">{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-black/20 rounded-xl border border-gold/10 text-xs">
            <p className="text-gold font-semibold mb-2">Deload — zasady</p>
            <ul className="space-y-1 text-muted">
              <li>• Objętość: -40-50% serii</li>
              <li>• Intensywność: -10-20% ciężaru</li>
              <li>• RIR: 4-5 (bardzo lekko)</li>
              <li>• Czas: 1 tydzień po 4-6 tygodniach</li>
              <li>• NIE pomijaj — supercompensacja wymaga odpoczynku</li>
            </ul>
          </div>
          <div className="p-3 bg-black/20 rounded-xl border border-gold/10 text-xs">
            <p className="text-gold font-semibold mb-2">Progresja między mezocyklami</p>
            <ul className="space-y-1 text-muted">
              <li>• Nowy cykl startuje wyżej niż poprzedni</li>
              <li>• Wymiana 1-2 ćwiczeń na partię</li>
              <li>• Base sets = poprzednie Base+1</li>
              <li>• Po 2-3 cyklach — dłuższa przerwa (diet break)</li>
              <li>• Monitoruj e1RM — powinien rosnąć</li>
            </ul>
          </div>
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-gold/10 text-xs">
          <p className="text-gold font-semibold mb-2">Double Progression (alternatywa do RIR)</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gold/20">
                {['Wynik','Decyzja'].map(h=><th key={h} className="text-left py-1 px-2 text-[9px] text-muted">{h}</th>)}
              </tr></thead>
              <tbody>
                {[
                  ['12/12/12 @ RIR 1-2','Dodaj ciężar na następnej sesji'],
                  ['12/11/10 @ RIR 1-2','Zostaw ciężar, dobij górny zakres'],
                  ['9/7/6 @ RIR 0','Za ciężko — obniż o 5-10%'],
                  ['Ból >3/10','Nie progresuj, zmień ćwiczenie'],
                  ['Spadek 2 treningi z rzędu','Sprawdź regenerację / deload'],
                ].map(([r,d],i)=>(
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="py-1.5 px-2 text-warm">{r}</td>
                    <td className="py-1.5 px-2 text-muted">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'exercise_selection',
    icon: '⚡',
    title: 'Dobór ćwiczeń i SFR',
    source: 'Israetel / Schoenfeld / Milo Wolf',
    color: ORANGE,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-black/20 rounded-xl border border-orange-500/20 text-xs">
            <p style={{color:ORANGE}} className="font-semibold mb-2">SFR — Stimulus to Fatigue Ratio</p>
            <p className="text-muted mb-2">Wybieraj ćwiczenia dające maksymalny stimulus przy minimalnym zmęczeniu ogólnoustrojowym.</p>
            <div className="space-y-1">
              {[['Wysoki SFR ✓','Cable Fly, Incline DB Curl, Seated Leg Curl, Hip Thrust','#47D18C'],
                ['Niski SFR ✗','Deadlift, Barbell Row, Barbell Squat','#EF6B73']].map(([l,ex,c])=>(
                <div key={l}>
                  <p style={{color:c}} className="text-[9px] font-semibold">{l}</p>
                  <p className="text-muted text-[10px]">{ex}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-black/20 rounded-xl border border-orange-500/20 text-xs">
            <p style={{color:ORANGE}} className="font-semibold mb-2">Stretch Position (Milo Wolf 2023)</p>
            <p className="text-muted mb-2">Ćwiczenia z obciążeniem w rozciągnięciu dają silniejszy sygnał hipertroficzny.</p>
            <div className="space-y-1">
              {[
                ['Klatka','Incline DB Press, Cable Fly'],
                ['Plecy','Pullover, Straight Arm Pulldown'],
                ['Biceps','Incline DB Curl, Cable Curl dolny'],
                ['Pośladki','Hip Thrust, Cable Pull Through'],
                ['Uda tyłu','Seated Leg Curl, RDL'],
                ['Barki boczne','Cable Lateral Raise'],
              ].map(([m,ex])=>(
                <div key={m} className="flex justify-between py-0.5">
                  <span style={{color:ORANGE}}>{m}:</span>
                  <span className="text-muted text-right">{ex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-gold/10">
          <p className="text-xs font-semibold text-gold mb-3">Hierarchia doboru ćwiczeń</p>
          <div className="space-y-2">
            {[
              {tier:'S',color:'#FFD700',desc:'Stretch position + wysoki SFR + bezpieczne',ex:'Hip Thrust, Incline DB Curl, Cable Fly, Seated Leg Curl, Cable Row'},
              {tier:'A',color:GOLD,desc:'Wysoki SFR, dobre stretch, compound',ex:'Pull Up, DB Row, RDL, Leg Press, DB Shoulder Press'},
              {tier:'B',color:ORANGE,desc:'Dobre ćwiczenia, przeciętny SFR',ex:'Barbell Row, DB Press, Barbell Curl, Lunge'},
              {tier:'C',color:'#666',desc:'Niski SFR lub wysokie ryzyko — używaj rzadko',ex:'Deadlift, Barbell Squat (jako główne hipertrofia)'},
            ].map(t=>(
              <div key={t.tier} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0" style={{background:`${t.color}20`,color:t.color}}>{t.tier}</span>
                <div>
                  <p className="text-xs text-muted">{t.desc}</p>
                  <p className="text-[10px]" style={{color:t.color}}>{t.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-gold/10 text-xs">
          <p className="text-gold font-semibold mb-2">Zasady doboru dla partii</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Compound first','Wielostawowe na początku sesji gdy jesteś świeży'],
              ['Izolacje na końcu','Gdy mięsień jest już zmęczony — pełne wysycenie'],
              ['Unilateral przy dysproporcji','Zawsze zacznij od słabszej strony'],
              ['Rotacja ćwiczeń','Zmień 1-2 ćwiczenia między mezocyklami'],
              ['Technika > ciężar','Sypie się technika = nie progresuj ciężaru'],
              ['Ból = sygnał stop','>3/10 — zmień ćwiczenie, nie ignoruj'],
            ].map(([t,d])=>(
              <div key={t} className="p-2 bg-white/[0.02] rounded-lg">
                <p style={{color:ORANGE}} className="text-[9px] font-semibold mb-0.5">{t}</p>
                <p className="text-muted text-[10px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'nutrition',
    icon: '⚗',
    title: 'Żywienie — protokoły',
    source: 'Helms / McDonald / Israetel / Aragon',
    color: '#E8A020',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            {label:'Białko — redukcja',value:'2.0–2.4 g/kg BW',note:'Wyżej chroni masę mięśniową w deficycie',color:GREEN},
            {label:'Białko — masa',value:'1.8–2.2 g/kg BW',note:'W surplus można zejść niżej',color:GREEN},
            {label:'Tłuszcz minimum',value:'0.7–0.8 g/kg BW',note:'Poniżej = ryzyko hormonalne',color:ORANGE},
          ].map(m=>(
            <div key={m.label} className="p-3 rounded-xl border" style={{border:`1px solid ${m.color}30`,background:`${m.color}08`}}>
              <p className="text-[9px] text-muted uppercase mb-1">{m.label}</p>
              <p style={{color:m.color}} className="font-bold text-base">{m.value}</p>
              <p className="text-muted text-[10px] mt-1">{m.note}</p>
            </div>
          ))}
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-gold/10">
          <p className="text-xs font-semibold text-gold mb-2">Decyzje w redukcji (McDonald)</p>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold/20">
              {['Sytuacja','Decyzja'].map(h=><th key={h} className="text-left py-1 px-2 text-[9px] text-muted">{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                ['Spadek 0.5-1.0%/tydzień','Zostaw kalorie'],
                ['Stoi 2 tyg, adherence >80%','-100-200 kcal'],
                ['Stoi, pas spada','Nie zmieniaj — to woda/mięśnie'],
                ['Stoi, adherence <80%','Popraw wykonanie, nie tnij kalorii'],
                ['Spada za szybko, energia niska','+100-200 kcal'],
                ['Kroki poniżej celu','Najpierw kroki, nie tnij kalorii'],
                ['Głód 5/5, sen zły','Zmniejsz agresywność redukcji'],
              ].map(([s,d],i)=>(
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="py-1.5 px-2 text-warm">{s}</td>
                  <td className="py-1.5 px-2 text-muted">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-black/20 rounded-xl border border-gold/10">
            <p className="text-gold font-semibold mb-2">Diet Break (Helms/Trexler)</p>
            <ul className="space-y-1 text-muted">
              <li>• Po 8-12 tyg redukcji</li>
              <li>• 1-2 tygodnie na maintenance</li>
              <li>• Resetuje leptynę i metabolizm</li>
              <li>• Zachowuje masę mięśniową</li>
              <li>• Potem wróć do deficytu</li>
            </ul>
          </div>
          <div className="p-3 bg-black/20 rounded-xl border border-gold/10">
            <p className="text-gold font-semibold mb-2">Timing posiłków (Helms)</p>
            <ul className="space-y-1 text-muted">
              <li>• 3-5 posiłków dla MPS</li>
              <li>• Białko równomiernie ~0.4g/kg/posiłek</li>
              <li>• Węgle wokół treningu</li>
              <li>• Przed snem: kazeina/twaróg</li>
              <li>• Okno anaboliczne: 2h po treningu</li>
            </ul>
          </div>
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-gold/10 text-xs">
          <p className="text-gold font-semibold mb-2">7-dniowa średnia wagi (McDonald)</p>
          <p className="text-muted">Nigdy nie oceniaj po jednym pomiarze. Waga waha się ±1-2 kg dziennie z powodu wody, soli, glikogenu, trawienia, fazy cyklu. Decyzje podejmuj na podstawie trendu z minimum 7 dni.</p>
          <p className="text-muted mt-1">Tempo redukcji: 0.5-1.0% masy ciała/tydzień. Szybciej = więcej utraty mięśni.</p>
        </div>
      </div>
    )
  },
  {
    id: 'supplements',
    icon: '◎',
    title: 'Suplementacja — evidence-based',
    source: 'ISSN / Examine / Helms',
    color: BLUE,
    content: (
      <div className="space-y-3">
        {[
          {name:'Kreatyna',tier:'S',dose:'3-5g/dzień',timing:'Dowolna pora, regularność kluczowa',note:'Najlepiej przebadany suplement. Poprawia siłę, masę, regenerację. Monohydrat = najtańszy i najlepszy.',color:GREEN},
          {name:'Witamina D3',tier:'S',dose:'2000-4000 IU/dzień',timing:'Z posiłkiem tłuszczowym',note:'Niedobór powszechny w Polsce (jesień-wiosna). Wpływa na testosteron, odporność, nastrój.',color:GREEN},
          {name:'Omega-3 (EPA/DHA)',tier:'A',dose:'2-3g EPA+DHA/dzień',timing:'Z posiłkiem',note:'Redukcja stanu zapalnego, zdrowie sercowo-naczyniowe, potencjalnie antykataboliczne.',color:GOLD},
          {name:'Magnez (glicynian)',tier:'A',dose:'300-400mg/dzień',timing:'Wieczorem',note:'Wspiera sen, regenerację, funkcję mięśni. Glicynian > tlenek (lepsze wchłanianie).',color:GOLD},
          {name:'Kofeina',tier:'A',dose:'3-6mg/kg BW',timing:'30-60 min przed treningiem',note:'Poprawia siłę, wytrzymałość, skupienie. Tolerancja rośnie — rób przerwy.',color:GOLD},
          {name:'Beta-alanina',tier:'B',dose:'3.2-6.4g/dzień',timing:'Podzielona na dawki',note:'Poprawia wytrzymałość w seriach 8-15 powt. Mrowienie to normalny efekt uboczny.',color:ORANGE},
          {name:'Ashwagandha',tier:'B',dose:'300-600mg/dzień',timing:'Wieczorem',note:'Redukcja kortyzolu, potencjalny wzrost testosteronu, poprawa snu.',color:ORANGE},
          {name:'Cynk',tier:'B',dose:'25-45mg/dzień',timing:'Na pusty żołądek lub z posiłkiem',note:'Kluczowy dla testosteronu. Niedobór przy intensywnym treningu. Nie łączyć z wapniem.',color:ORANGE},
        ].map(s=>(
          <div key={s.name} className="flex gap-3 p-3 bg-black/20 rounded-xl border border-white/[0.05]">
            <div className="shrink-0">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{background:`${s.color}20`,color:s.color}}>{s.tier}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-warm">{s.name}</p>
                <span className="text-[10px] text-muted">{s.dose}</span>
              </div>
              <p className="text-[10px] text-muted mb-0.5">{s.timing}</p>
              <p className="text-[10px] text-muted/70">{s.note}</p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'recovery',
    icon: '🌙',
    title: 'Regeneracja i sen',
    source: 'Walker / Huberman / Attia',
    color: '#8B7DC4',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-black/20 rounded-xl border border-purple-500/20">
            <p style={{color:'#8B7DC4'}} className="font-semibold mb-2">Optymalizacja snu (Walker)</p>
            <ul className="space-y-1 text-muted">
              <li>• 7-9 godzin dla dorosłych</li>
              <li>• Stała godzina pobudki — ważniejsza niż zasypiania</li>
              <li>• Temperatura sypialni: 18-19°C</li>
              <li>• Ostatnia kawa: 8-10h przed snem</li>
              <li>• Światło rano synchronizuje zegar biologiczny</li>
              <li>• Alkohol niszczy fazę REM</li>
            </ul>
          </div>
          <div className="p-3 bg-black/20 rounded-xl border border-purple-500/20">
            <p style={{color:'#8B7DC4'}} className="font-semibold mb-2">Alerty regeneracji</p>
            <table className="w-full">
              <tbody>
                {[
                  ['Sen <6h przez 3 dni','Nie zwiększaj intensywności'],
                  ['Energia niska + siła spada','Rozważ deload'],
                  ['Stres >4/5','Nie obcinaj kalorii agresywnie'],
                  ['Ból >3/10','Alert dla trenera'],
                  ['HRV znacznie niższy','Dzień regeneracyjny'],
                ].map(([s,d],i)=>(
                  <tr key={i} className="border-b border-white/[0.04] text-[10px]">
                    <td className="py-1 text-warm">{s}</td>
                    <td className="py-1 text-muted pl-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-gold/10 text-xs">
          <p className="text-gold font-semibold mb-2">Kortyzol i kompozycja ciała (Attia)</p>
          <p className="text-muted">Chroniczny wysoki kortyzol → retencja wody, gromadzenie tłuszczu brzusznego, katabolizm mięśni, zaburzenia snu. Stres treningowy + stres życiowy = stres całkowity. Przy wysokim stresie życiowym redukuj intensywność treningów zamiast go zwiększać.</p>
        </div>
      </div>
    )
  },
  {
    id: 'splits',
    icon: '▦',
    title: 'Podziały treningowe — kiedy co',
    source: 'Israetel / Nuckols',
    color: GOLD,
    content: (
      <div className="space-y-3">
        {[
          {name:'Full Body x2-3',days:'2-3 dni',best:'Beginner, powrót po przerwie, ograniczony czas',pros:'Wysoka częstotliwość, każda partia 2-3x/tydzień',cons:'Mała objętość per sesja, trudno osiągnąć MAV'},
          {name:'Upper / Lower x4',days:'4 dni',best:'Intermediate, balans objętość/częstotliwość',pros:'Solidna objętość, każda partia 2x/tydzień',cons:'Nogi zawsze razem — może być za dużo per sesja'},
          {name:'PPL x5-6',days:'5-6 dni',best:'Advanced, wysokie MRV, dużo czasu',pros:'Wysoka objętość i częstotliwość, dużo specjalizacji',cons:'Wymaga dobrej regeneracji, mało dni odpoczynku'},
          {name:'Glute Focus / LUL',days:'3-4 dni',best:'Kobiety z priorytetem pośladków i ud',pros:'3x/tydzień nogi, 2x górna, idealne dla kobiet',cons:'Górna partia trenowana rzadziej'},
        ].map(s=>(
          <div key={s.name} className="p-3 bg-black/20 rounded-xl border border-gold/10 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold text-warm">{s.name}</p>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">{s.days}</span>
            </div>
            <p className="text-muted mb-1"><span className="text-gold">Dla:</span> {s.best}</p>
            <p className="text-muted mb-0.5"><span style={{color:GREEN}}>+</span> {s.pros}</p>
            <p className="text-muted"><span style={{color:RED}}>-</span> {s.cons}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'calculators',
    icon: 'Σ',
    title: 'Kalkulatory',
    source: 'Epley / Mifflin-St Jeor / Helms',
    color: GOLD,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Calc1RM />
          <CalcTDEE />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CalcMacro />
          <CalcRIR />
        </div>
      </div>
    )
  },
]

export default function KnowledgePage() {
  const [openSection, setOpenSection] = useState('volume')

  return (
    <div className="min-h-screen text-warm font-body">
      <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b-2 border-[rgba(212,181,112,0.3)] px-6 h-14 flex items-center gap-4">
        <a href="/dashboard" className="text-muted hover:text-gold transition text-sm">← Dashboard</a>
        <span className="font-display text-xl text-gold tracking-widest">ARETÉ</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded border border-gold/20 text-gold/40">α 0.1</span>
        <span className="text-muted text-sm ml-2">Baza wiedzy coacha</span>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-[10px] text-gold/60 uppercase tracking-widest mb-1">Coach Reference</p>
          <h1 className="font-display text-3xl text-gold">Baza wiedzy</h1>
          <p className="text-muted text-sm mt-1">Israetel · Helms · Schoenfeld · Nuckols · Zourdos · McDonald · Walker · Attia</p>
        </div>

        <div className="space-y-2">
          {SECTIONS.map(section => (
            <div key={section.id} className="rounded-2xl overflow-hidden border-2"
              style={{ borderColor: openSection === section.id ? `${section.color}40` : 'rgba(212,181,112,0.15)' }}>

              {/* Header */}
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition"
                style={{ background: openSection === section.id ? `${section.color}08` : 'rgba(0,0,0,0.2)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl" style={{ color: section.color }}>{section.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-warm">{section.title}</p>
                    <p className="text-[10px] text-muted">{section.source}</p>
                  </div>
                </div>
                <span className="text-muted transition-transform text-lg"
                  style={{ transform: openSection === section.id ? 'rotate(180deg)' : 'rotate(0)' }}>
                  ▾
                </span>
              </button>

              {/* Content */}
              {openSection === section.id && (
                <div className="px-5 py-5 border-t" style={{ borderColor: `${section.color}20` }}>
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
