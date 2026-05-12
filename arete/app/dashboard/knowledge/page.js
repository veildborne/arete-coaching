'use client'
import React from 'react'

const KNOWLEDGE = {
  volume: {
    title: 'Objętość tygodniowa (MEV/MRV)',
    icon: '▦',
    color: '#D4B570',
    items: [
      { muscle: 'Klatka',        mev: 8,  mav: 14, mrv: 20, freq: '2x', notes: 'Stretch position kluczowy — Cable Fly, Incline DB' },
      { muscle: 'Plecy',         mev: 10, mav: 16, mrv: 25, freq: '2x', notes: 'Wysoka MRV — toleruje dużo. Mix wiosłowanie + pull' },
      { muscle: 'Barki boczne',  mev: 6,  mav: 12, mrv: 20, freq: '3x', notes: 'Mała partia, szybko się regeneruje. Cable > hantle' },
      { muscle: 'Barki tylne',   mev: 6,  mav: 12, mrv: 18, freq: '3x', notes: 'Face pull, Reverse Pec Deck — stretch position' },
      { muscle: 'Biceps',        mev: 6,  mav: 12, mrv: 18, freq: '2x', notes: 'Stretch = Incline DB Curl. Cable trzyma napięcie' },
      { muscle: 'Triceps',       mev: 6,  mav: 12, mrv: 18, freq: '2x', notes: 'Overhead position stretch — Overhead Cable Extension' },
      { muscle: 'Czwórgłowe',    mev: 8,  mav: 14, mrv: 20, freq: '2x', notes: 'Hack Squat, Leg Press > Barbell Squat dla hipertrofii' },
      { muscle: 'Dwugłowe uda',  mev: 6,  mav: 10, mrv: 16, freq: '2x', notes: 'Seated Leg Curl > Lying. RDL = stretch + compound' },
      { muscle: 'Pośladki',      mev: 6,  mav: 12, mrv: 20, freq: '3x', notes: 'Hip Thrust #1. Wysoka tolerancja — kobiety często więcej' },
      { muscle: 'Łydki',         mev: 6,  mav: 12, mrv: 20, freq: '3x', notes: 'Seated (soleus) + Standing (gastrocnemius). Full stretch!' },
      { muscle: 'Brzuch',        mev: 6,  mav: 10, mrv: 16, freq: '3x', notes: 'Cable Crunch z pełnym stretchem. Nie plank jako główne' },
      { muscle: 'Przedramiona',  mev: 4,  mav: 8,  mrv: 14, freq: '2x', notes: 'Zazwyczaj wystarczy carry-over z innych ćwiczeń' },
    ]
  },
  rir: {
    title: 'Periodyzacja RIR (Helms/Zourdos)',
    icon: '◈',
    color: '#52B788',
    weeks: [
      { week: 1, rir: 3, desc: 'Akumulacja — uczymy się ćwiczeń, budujemy bazę. Nigdy do upadku.' },
      { week: 2, rir: 3, desc: 'Akumulacja — zwiększamy objętość. RIR nadal komfortowy.' },
      { week: 3, rir: 2, desc: 'Intensyfikacja — zaczyna być wymagające. Technika musi być czysta.' },
      { week: 4, rir: 2, desc: 'Intensyfikacja — objętość na MAV. Klient powinien czuć progres.' },
      { week: 5, rir: 1, desc: 'Peak — zbliżamy się do MRV. Ostatni tydzień pełnej objętości.' },
      { week: 6, rir: 4, desc: 'DELOAD — -50% objętości, -10-20% ciężaru. Konieczny dla superkompensacji.' },
    ]
  },
  exercises: {
    title: 'Dobór ćwiczeń (SFR)',
    icon: '⚡',
    color: '#5B8DB8',
    principles: [
      { title: 'Stretch Position', desc: 'Ćwiczenia z rozciągnięciem pod obciążeniem dają najwyższy stimulus hipertroficzny. Priorytetuj: Incline DB Press, Cable Fly, RDL, Seated Leg Curl, Incline Curl.', rating: 'S-tier' },
      { title: 'SFR — Stimulus to Fatigue Ratio', desc: 'Wybieraj ćwiczenia z wysokim SFR. Deadlift = niski SFR (dużo zmęczenia systemu). Cable Fly = wysoki SFR (dużo stimulus, mało zmęczenia).', rating: 'Kluczowe' },
      { title: 'Compound First', desc: 'Zacznij sesję od ćwiczeń wielostawowych gdy jesteś świeży. Izolacje na końcu gdy mięsień jest już zmęczony.', rating: 'Zasada' },
      { title: 'Unilateral dla dysproporcji', desc: 'Gdy klient ma asymetrię — zamień bilateral na unilateral. Bulgarian, Single Arm Row, Single Leg Curl. Zawsze zacznij od słabszej strony.', rating: 'Fix' },
      { title: 'Ból i kontuzje', desc: 'Ból > 3/10 = zmień ćwiczenie natychmiast. Nie progresuj przez ból. Znajdź wariację bezbolesną i wróć do oryginalnego gdy wróci zdrowie.', rating: '⚠ Ważne' },
    ]
  },
  nutrition: {
    title: 'Żywienie (Helms/McDonald/Israetel)',
    icon: '⚗',
    color: '#E8A020',
    protocols: [
      { title: 'Białko', desc: 'Redukcja: 2.2g/kg BW. Masa: 2.0g/kg BW. Minimum absolutne: 1.6g/kg. Rozkład na 4-5 posiłków 0.4g/kg każdy dla maksymalnej MPS.', source: 'Helms 2014' },
      { title: 'Tłuszcz', desc: 'Minimum 0.7-0.8g/kg BW dla zdrowia hormonalnego (szczególnie testosteron). Nie schodzić poniżej nawet w głębokiej redukcji.', source: 'McDonald' },
      { title: 'Węglowodany', desc: 'Reszta kalorii po białku i tłuszczu. Ważne wokół treningu dla performance. W redukcji można ciąć węgle, nie białko.', source: 'Ogólne' },
      { title: 'Deficyt redukcja', desc: '-300 do -500 kcal/dzień. Tempo: 0.5-1.0% masy ciała/tydzień. Szybciej = więcej utraty mięśni. Wolniej = lepsze zachowanie masy.', source: 'Helms/Israetel' },
      { title: 'Surplus masa', desc: '+200 do +300 kcal/dzień dla początkujących. +100 do +200 dla zaawansowanych. Szybszy surplus = więcej tłuszczu.', source: 'Israetel' },
      { title: '7-dniowa średnia wagi', desc: 'Nigdy nie oceniaj po jednym pomiarze. Średnia z 7 dni = realna zmiana. Waga rano, po toalecie, przed jedzeniem.', source: 'McDonald' },
      { title: 'Adaptacja metaboliczna', desc: 'Po 8-12 tygodniach redukcji — diet break 1-2 tygodnie na maintenancje. Resetuje leptynę i metabolizm. Potem wróć do deficytu.', source: 'Helms/Trexler' },
    ]
  },
  calculators: {
    title: 'Kalkulatory',
    icon: 'Σ',
    color: '#D4B570',
  }
}

export default function KnowledgePage() {
  return (
    <div className="min-h-screen text-warm font-body">
      <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b-2 border-[rgba(212,181,112,0.3)] px-6 h-14 flex items-center gap-4">
        <a href="/dashboard" className="text-muted hover:text-gold transition text-sm">← Dashboard</a>
        <span className="font-display text-xl text-gold tracking-widest">ARETÉ</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded border border-gold/20 text-gold/40">α 0.1</span>
        <span className="text-muted text-sm ml-2">Baza wiedzy</span>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        <div className="mb-6">
          <p className="text-[10px] text-gold/60 uppercase tracking-widest mb-1">Coach Reference</p>
          <h1 className="font-display text-3xl text-gold">Baza wiedzy</h1>
          <p className="text-muted text-sm mt-1">Israetel · Helms · Schoenfeld · Nuckols · Zourdos</p>
        </div>

        {/* OBJĘTOŚĆ MEV/MRV */}
        <section className="bg-[rgba(15,20,35,0.85)] border-2 border-[rgba(212,181,112,0.3)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl text-gold">{KNOWLEDGE.volume.icon}</span>
            <h2 className="font-display text-xl text-gold">{KNOWLEDGE.volume.title}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(212,181,112,0.2)]">
                  {['Partia','MEV','MAV','MRV','Freq','Uwagi'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] text-muted uppercase tracking-widest font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KNOWLEDGE.volume.items.map((item, i) => (
                  <tr key={i} className="border-b border-[rgba(212,181,112,0.08)] hover:bg-gold/[0.03] transition">
                    <td className="py-2.5 px-3 font-medium text-warm">{item.muscle}</td>
                    <td className="py-2.5 px-3 text-[#47D18C] font-mono">{item.mev}</td>
                    <td className="py-2.5 px-3 text-gold font-mono">{item.mav}</td>
                    <td className="py-2.5 px-3 text-[#EF6B73] font-mono">{item.mrv}</td>
                    <td className="py-2.5 px-3 text-muted">{item.freq}</td>
                    <td className="py-2.5 px-3 text-muted text-xs">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <span className="text-[#47D18C]">● MEV = minimum efektywna objętość</span>
            <span className="text-gold">● MAV = maksymalne adaptacje</span>
            <span className="text-[#EF6B73]">● MRV = maksimum do regeneracji</span>
          </div>
        </section>

        {/* PERIODYZACJA RIR */}
        <section className="bg-[rgba(15,20,35,0.85)] border-2 border-[rgba(212,181,112,0.3)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl" style={{color:'#52B788'}}>{KNOWLEDGE.rir.icon}</span>
            <h2 className="font-display text-xl text-gold">{KNOWLEDGE.rir.title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {KNOWLEDGE.rir.weeks.map((w, i) => (
              <div key={i} className={`rounded-xl p-4 border-2 ${w.week === 6 ? 'border-[rgba(91,141,184,0.4)] bg-[rgba(91,141,184,0.05)]' : 'border-[rgba(212,181,112,0.2)] bg-[rgba(212,181,112,0.03)]'}`}>
                <div className="text-[10px] text-muted uppercase tracking-widest mb-1">Tydzień {w.week}</div>
                <div className={`font-display text-2xl mb-2 ${w.week === 6 ? 'text-[#5B8DB8]' : 'text-gold'}`}>
                  {w.week === 6 ? 'DL' : `RIR ${w.rir}`}
                </div>
                <p className="text-xs text-muted leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DOBÓR ĆWICZEŃ */}
        <section className="bg-[rgba(15,20,35,0.85)] border-2 border-[rgba(212,181,112,0.3)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl" style={{color:'#5B8DB8'}}>{KNOWLEDGE.exercises.icon}</span>
            <h2 className="font-display text-xl text-gold">{KNOWLEDGE.exercises.title}</h2>
          </div>
          <div className="space-y-3">
            {KNOWLEDGE.exercises.principles.map((p, i) => (
              <div key={i} className="flex gap-4 p-4 bg-[rgba(212,181,112,0.03)] border border-[rgba(212,181,112,0.15)] rounded-xl">
                <span className="text-[10px] px-2 py-1 rounded-full border border-gold/30 text-gold/70 h-fit shrink-0 whitespace-nowrap">{p.rating}</span>
                <div>
                  <p className="text-sm font-medium text-warm mb-1">{p.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ŻYWIENIE */}
        <section className="bg-[rgba(15,20,35,0.85)] border-2 border-[rgba(212,181,112,0.3)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl" style={{color:'#E8A020'}}>{KNOWLEDGE.nutrition.icon}</span>
            <h2 className="font-display text-xl text-gold">{KNOWLEDGE.nutrition.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {KNOWLEDGE.nutrition.protocols.map((p, i) => (
              <div key={i} className="p-4 bg-[rgba(232,160,32,0.03)] border border-[rgba(232,160,32,0.2)] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-warm">{p.title}</p>
                  <span className="text-[9px] text-muted border border-[rgba(212,181,112,0.2)] px-2 py-0.5 rounded-full">{p.source}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* KALKULATORY */}
        <section className="bg-[rgba(15,20,35,0.85)] border-2 border-[rgba(212,181,112,0.3)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl text-gold">Σ</span>
            <h2 className="font-display text-xl text-gold">Kalkulatory</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* e1RM */}
            <E1RMCalc />
            {/* TDEE */}
            <TDEECalc />
          </div>
        </section>

      </main>
    </div>
  )
}

function E1RMCalc() {
  const [weight, setWeight] = React.useState('')
  const [reps, setReps] = React.useState('')
  const e1rm = weight && reps ? Math.round(parseFloat(weight) * (1 + parseInt(reps) / 30)) : null

  return (
    <div className="p-4 bg-[rgba(212,181,112,0.03)] border border-[rgba(212,181,112,0.2)] rounded-xl">
      <p className="text-sm font-medium text-gold mb-3">e1RM — Epley</p>
      <p className="text-[10px] text-muted mb-3">weight × (1 + reps/30)</p>
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <p className="text-[10px] text-muted mb-1">Ciężar (kg)</p>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="100"
            className="w-full py-2 px-3 rounded-lg bg-black/30 border-2 border-[rgba(212,181,112,0.3)] text-warm text-sm font-body outline-none"/>
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-muted mb-1">Powtórzenia</p>
          <input type="number" value={reps} onChange={e=>setReps(e.target.value)} placeholder="8"
            className="w-full py-2 px-3 rounded-lg bg-black/30 border-2 border-[rgba(212,181,112,0.3)] text-warm text-sm font-body outline-none"/>
        </div>
      </div>
      {e1rm && (
        <div className="text-center p-3 bg-gold/10 border border-gold/30 rounded-lg">
          <p className="text-[10px] text-muted mb-1">Szacowany 1RM</p>
          <p className="font-display text-2xl text-gold">{e1rm} kg</p>
        </div>
      )}
    </div>
  )
}

function TDEECalc() {
  const [weight, setWeight] = React.useState('')
  const [height, setHeight] = React.useState('')
  const [age, setAge] = React.useState('')
  const [sex, setSex] = React.useState('M')
  const [activity, setActivity] = React.useState('1.55')

  const tdee = weight && height && age ? Math.round(
    (sex === 'M'
      ? 10*parseFloat(weight) + 6.25*parseFloat(height) - 5*parseFloat(age) + 5
      : 10*parseFloat(weight) + 6.25*parseFloat(height) - 5*parseFloat(age) - 161
    ) * parseFloat(activity)
  ) : null

  return (
    <div className="p-4 bg-[rgba(212,181,112,0.03)] border border-[rgba(212,181,112,0.2)] rounded-xl">
      <p className="text-sm font-medium text-gold mb-3">TDEE — Mifflin-St Jeor</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          {label:'Waga (kg)',val:weight,set:setWeight,ph:'80'},
          {label:'Wzrost (cm)',val:height,set:setHeight,ph:'175'},
          {label:'Wiek',val:age,set:setAge,ph:'25'},
        ].map(f=>(
          <div key={f.label}>
            <p className="text-[10px] text-muted mb-1">{f.label}</p>
            <input type="number" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
              className="w-full py-2 px-3 rounded-lg bg-black/30 border-2 border-[rgba(212,181,112,0.3)] text-warm text-sm font-body outline-none"/>
          </div>
        ))}
        <div>
          <p className="text-[10px] text-muted mb-1">Płeć</p>
          <select value={sex} onChange={e=>setSex(e.target.value)}
            className="w-full py-2 px-3 rounded-lg bg-black/30 border-2 border-[rgba(212,181,112,0.3)] text-warm text-sm font-body outline-none">
            <option value="M">Mężczyzna</option>
            <option value="F">Kobieta</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-[10px] text-muted mb-1">Aktywność</p>
        <select value={activity} onChange={e=>setActivity(e.target.value)}
          className="w-full py-2 px-3 rounded-lg bg-black/30 border-2 border-[rgba(212,181,112,0.3)] text-warm text-sm font-body outline-none">
          <option value="1.2">Siedzący (brak ćwiczeń)</option>
          <option value="1.375">Lekki (1-3 treningi/tyg)</option>
          <option value="1.55">Umiarkowany (3-5 treningów/tyg)</option>
          <option value="1.725">Aktywny (6-7 treningów/tyg)</option>
          <option value="1.9">Bardzo aktywny (2x dziennie)</option>
        </select>
      </div>
      {tdee && (
        <div className="text-center p-3 bg-gold/10 border border-gold/30 rounded-lg">
          <p className="text-[10px] text-muted mb-1">TDEE</p>
          <p className="font-display text-2xl text-gold">{tdee} kcal</p>
          <div className="flex justify-center gap-3 mt-2 text-[10px] text-muted">
            <span>Redukcja: {tdee-300} kcal</span>
            <span>Masa: {tdee+300} kcal</span>
          </div>
        </div>
      )}
    </div>
  )
}
