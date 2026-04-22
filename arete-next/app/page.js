'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ===== AUTH MODAL =====
function AuthModal({ lang, onClose }) {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null) // { type: 'ok'|'err', text }
  const overlayRef = useRef(null)

  const copy = {
    pl: {
      login: 'Zaloguj się', register: 'Utwórz konto', reset: 'Reset hasła',
      email: 'Email', password: 'Hasło', name: 'Imię i nazwisko',
      doLogin: 'Zaloguj się', doRegister: 'Utwórz konto', doReset: 'Wyślij link',
      toRegister: 'Nie masz konta?', toLogin: 'Masz już konto?', forgot: 'Zapomniałeś hasła?',
      back: '← Wróć',
      loginOk: 'Zalogowano! Przekierowuję…',
      registerOk: 'Sprawdź email — link weryfikacyjny wysłany.',
      resetOk: 'Link do resetu hasła wysłany na podany email.',
      errInvalid: 'Nieprawidłowy email lub hasło.',
      errEmail: 'Ten email jest już zajęty.',
      errShort: 'Hasło musi mieć min. 8 znaków.',
      errGeneric: 'Coś poszło nie tak. Spróbuj ponownie.',
    },
    en: {
      login: 'Log in', register: 'Create account', reset: 'Reset password',
      email: 'Email', password: 'Password', name: 'Full name',
      doLogin: 'Log in', doRegister: 'Create account', doReset: 'Send link',
      toRegister: "Don't have an account?", toLogin: 'Already have an account?', forgot: 'Forgot password?',
      back: '← Back',
      loginOk: 'Logged in! Redirecting…',
      registerOk: 'Check your email — verification link sent.',
      resetOk: 'Password reset link sent to your email.',
      errInvalid: 'Invalid email or password.',
      errEmail: 'This email is already taken.',
      errShort: 'Password must be at least 8 characters.',
      errGeneric: 'Something went wrong. Please try again.',
    },
    el: {
      login: 'Σύνδεση', register: 'Δημιουργία λογαριασμού', reset: 'Επαναφορά κωδικού',
      email: 'Email', password: 'Κωδικός', name: 'Ονοματεπώνυμο',
      doLogin: 'Σύνδεση', doRegister: 'Δημιουργία', doReset: 'Αποστολή συνδέσμου',
      toRegister: 'Δεν έχεις λογαριασμό;', toLogin: 'Έχεις ήδη λογαριασμό;', forgot: 'Ξέχασες τον κωδικό;',
      back: '← Πίσω',
      loginOk: 'Συνδέθηκες! Ανακατεύθυνση…',
      registerOk: 'Έλεγξε το email σου — εστάλη σύνδεσμος επαλήθευσης.',
      resetOk: 'Ο σύνδεσμος επαναφοράς κωδικού εστάλη στο email σου.',
      errInvalid: 'Λανθασμένο email ή κωδικός.',
      errEmail: 'Αυτό το email χρησιμοποιείται ήδη.',
      errShort: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.',
      errGeneric: 'Κάτι πήγε στραβά. Δοκίμασε ξανά.',
    },
  }
  const c = copy[lang] || copy.pl

  // Close on overlay click
  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', fn)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleSubmit = async () => {
    setMsg(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setMsg({ type: 'err', text: c.errInvalid }); return }
        setMsg({ type: 'ok', text: c.loginOk })
        setTimeout(() => { window.location.href = '/dashboard' }, 1000)

      } else if (mode === 'register') {
        if (password.length < 8) { setMsg({ type: 'err', text: c.errShort }); return }
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        })
        if (error?.message?.toLowerCase().includes('already')) {
          setMsg({ type: 'err', text: c.errEmail }); return
        }
        if (error) { setMsg({ type: 'err', text: c.errGeneric }); return }
        setMsg({ type: 'ok', text: c.registerOk })

      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
        })
        if (error) { setMsg({ type: 'err', text: c.errGeneric }); return }
        setMsg({ type: 'ok', text: c.resetOk })
      }
    } finally {
      setLoading(false)
    }
  }

  const titles = { login: c.login, register: c.register, reset: c.reset }

  return (
    <div ref={overlayRef} onClick={handleOverlay} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,14,26,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
        border: '1px solid rgba(184,166,119,0.25)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(184,166,119,0.1)',
        position: 'relative',
        animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Close btn */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(184,166,119,0.5)', fontSize: '1.4rem', lineHeight: 1,
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.target.style.color = '#b8a677'}
          onMouseLeave={e => e.target.style.color = 'rgba(184,166,119,0.5)'}
        >×</button>

        {/* Greek deco top */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.7rem', letterSpacing: '0.25em', color: 'rgba(184,166,119,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ἀρετή
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 600, color: '#b8a677', letterSpacing: '0.1em' }}>
            ARETÉ
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(184,166,119,0.3), transparent)', marginTop: '1rem' }} />
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 500, color: '#e8e8e8', textAlign: 'center', marginBottom: '1.75rem', letterSpacing: '0.05em' }}>
          {titles[mode]}
        </h2>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={labelStyle}>{c.name}</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="np. Jan Kowalski"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
              />
            </div>
          )}
          <div>
            <label style={labelStyle}>{c.email}</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="jan@example.com"
              style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && !loading && handleSubmit()}
              onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
            />
          </div>
          {mode !== 'reset' && (
            <div>
              <label style={labelStyle}>{c.password}</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && !loading && handleSubmit()}
                onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
              />
            </div>
          )}
        </div>

        {/* Message */}
        {msg && (
          <div style={{
            marginTop: '1rem', padding: '0.6rem 0.9rem', borderRadius: '8px',
            fontSize: '0.82rem', fontFamily: 'Outfit, sans-serif',
            background: msg.type === 'ok' ? 'rgba(76,175,80,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${msg.type === 'ok' ? 'rgba(76,175,80,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: msg.type === 'ok' ? '#81c784' : '#f87171',
          }}>
            {msg.text}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', marginTop: '1.5rem',
            padding: '0.85rem',
            background: loading ? 'rgba(184,166,119,0.3)' : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
            color: loading ? 'rgba(184,166,119,0.6)' : '#0f1a2e',
            border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '…' : mode === 'login' ? c.doLogin : mode === 'register' ? c.doRegister : c.doReset}
        </button>

        {/* Links */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('register'); setMsg(null) }} style={linkStyle}>
                {c.toRegister} <span style={{ color: '#b8a677' }}>Zarejestruj się</span>
              </button>
              <button onClick={() => { setMode('reset'); setMsg(null) }} style={linkStyle}>
                {c.forgot}
              </button>
            </>
          )}
          {mode === 'register' && (
            <button onClick={() => { setMode('login'); setMsg(null) }} style={linkStyle}>
              {c.toLogin} <span style={{ color: '#b8a677' }}>Zaloguj się</span>
            </button>
          )}
          {mode === 'reset' && (
            <button onClick={() => { setMode('login'); setMsg(null) }} style={linkStyle}>
              {c.back}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block', marginBottom: '0.4rem',
  fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem',
  color: 'rgba(184,166,119,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase',
}
const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(184,166,119,0.2)',
  borderRadius: '8px', outline: 'none',
  color: '#e8e8e8', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem',
  transition: 'border-color 0.2s',
}
const linkStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(184,166,119,0.55)', fontFamily: 'Outfit, sans-serif',
  fontSize: '0.8rem', letterSpacing: '0.02em',
  transition: 'color 0.2s',
}

// ===== TRANSLATIONS =====
const t = {
  pl: {
    nav: { about: 'O mnie', approach: 'Podejście', packages: 'Pakiety', process: 'Proces', contact: 'Kontakt', login: 'Zaloguj się' },
    hero: {
      tagline: 'EVIDENCE-BASED COACHING',
      title1: 'Trenuj z ',
      titleAccent: 'celem',
      title2: 'Rośnij z nauką',
      desc: 'Periodyzowane programy treningowe oparte na badaniach naukowych. Hipertrofia, siła, rekompozycja ciała — bez bro-science, bez motywacyjnego bełkotu.',
      cta: 'Rozpocznij',
      secondary: 'Zobacz pakiety',
      features: [
        { sym: '⚗', label: 'Evidence-based', sub: 'Peer-reviewed' },
        { sym: '◈', label: 'Spersonalizowane', sub: 'Pod Ciebie' },
        { sym: '△', label: 'Mierzalne', sub: 'Dane, nie słowa' },
      ],
    },
    about: {
      tagline: 'TRENER',
      name: 'Alexander Panorios',
      role: 'TRENER PERSONALNY · ONLINE COACH',
      bio1: 'Pół-Grek, pół-Polak. Manager siłowni JustGYM w Częstochowie i trener personalny z doświadczeniem — nie influencer który obejrzał kilka filmów na YouTube.',
      bio2: 'Programuję treningi w oparciu o badania Helmsa, Israetela, Schoenfelda i Nuckolsa. Periodyzacja objętości, autoregulacja RIR, stretch-mediated hypertrophy — to nie buzzwordy, to narzędzia które stosuję z każdym klientem.',
      bio3: 'Areté (ἀρετή) to starożytnogrecki ideał doskonałości — nie perfekcji, ale dążenia do najlepszej wersji siebie. To jest moja filozofia coachingu.',
    },
    pillars: {
      tagline: 'FILOZOFIA',
      title: 'Trzy filary',
      items: [
        { icon: '⚗️', title: 'Nauka, nie wiara', text: 'Każda decyzja treningowa oparta na peer-reviewed badaniach. Schoenfeld na objętość, Helms na priorytety, Israetel na periodyzację.' },
        { icon: '🎯', title: 'Indywidualizacja', text: 'Nie ma uniwersalnego planu. Twoja anatomia, cele, sprzęt, kontuzje i czas — wszystko kształtuje program.' },
        { icon: '📊', title: 'Dane, nie uczucia', text: 'Tracking objętości, RIR, progresja ciężarów, check-iny — mierzymy wszystko. Bo co nie jest mierzone, nie jest zarządzane.' },
      ],
    },
    forWho: {
      tagline: 'DLA KOGO',
      title: 'Dla kogo jest Areté?',
      yes: 'Dla Ciebie, jeśli:',
      no: 'Nie dla Ciebie, jeśli:',
      yesItems: ['Chcesz trenować mądrze, nie tylko ciężko', 'Interesujesz się nauką za treningiem', 'Szukasz trenera który tłumaczy DLACZEGO', 'Jesteś gotowy/a na 6-miesięczny proces', 'Cenisz dane i systematyczność'],
      noItems: ['Szukasz magicznej diety na 2 tygodnie', 'Chcesz motywacyjne hasła zamiast wiedzy', 'Potrzebujesz kogoś kto krzyczy na Ciebie', 'Nie jesteś gotowy/a na feedback', 'Interesuje Cię tylko waga na wadze'],
    },
    packages: {
      tagline: 'PAKIETY', title: 'Wybierz swój tier',
      subtitle: 'Od samodzielnego planu po pełny coaching z trenerem',
      paideia: { name: 'PAIDEIA', greek: 'παιδεία — edukacja', price: 199, currency: 'PLN', suffix: 'jednorazowo',
        features: ['Plan treningowy PDF', 'Arkusz logowania postępów', 'Dobór ćwiczeń + alternatywy', 'Periodyzacja na 24 tygodnie', 'Bez kontaktu z trenerem'] },
      askesis: { name: 'ASKESIS', greek: 'ἄσκησις — dyscyplina', price: 279, currency: 'PLN', suffix: '/ miesiąc', discount: '249 PLN/mies. przy 3-mies. zobowiązaniu',
        features: ['Wszystko z Paideia', 'Cele kaloryczne + białko', 'Check-in co 2 tygodnie', 'Feedback i korekty planu', 'Piramida żywieniowa Helmsa'] },
      arete: { name: 'ARETÉ', greek: 'ἀρετή — doskonałość', badge: 'POLECANY', price: 449, currency: 'PLN', suffix: '/ miesiąc', discount: '399 PLN/mies. przy 3-mies. zobowiązaniu',
        features: ['Wszystko z Askesis', 'Indywidualny plan żywieniowy', 'Cotygodniowy check-in', 'Dashboard trenera (9 zakładek)', 'Priorytetowy kontakt', 'Pełna analiza postępów'] },
      inperson: {
        title: 'Trening stacjonarny',
        subtitle: 'JustGYM · ul. 1 Maja 21 · Częstochowa',
        currency: 'PLN',
        single: { label: 'POJEDYNCZA SESJA', price: 150, detail: '60 minut' },
        pack8: { label: 'PAKIET 8 SESJI', price: 130, detail: '/sesja · 1040 PLN' },
        pack12: { label: 'PAKIET 12 SESJI', price: 120, detail: '/sesja · 1440 PLN' },
      },
      cta: 'Wybierz ten pakiet',
    },
    process: {
      tagline: 'PROCES', title: 'Jak to działa?',
      steps: [
        { num: '01', title: 'Zgłoszenie', text: 'Wypełniasz formularz na stronie. Dostaję email z Twoimi podstawowymi danymi.' },
        { num: '02', title: 'Rozmowa', text: 'Kontaktuję się z Tobą, potwierdzamy pakiet i cele. Ustalamy szczegóły współpracy.' },
        { num: '03', title: 'Płatność', text: 'Przelew lub BLIK przez Revolut. Szybko, bezpiecznie, bez pośredników.' },
        { num: '04', title: 'Ankieta', text: 'Wypełniasz szczegółową ankietę onboardingową — cele, historia, kontuzje, sprzęt, preferencje.' },
        { num: '05', title: 'Program', text: 'Na podstawie ankiety buduję Twój spersonalizowany program. Periodyzacja, objętość, RIR — wszystko dopasowane.' },
        { num: '06', title: 'Trening', text: 'Dostajesz gotowy plan i zaczynasz. Check-iny, feedback, korekty — zależnie od pakietu.' },
      ],
    },
    testimonials: {
      tagline: 'OPINIE', title: 'Co mówią klienci',
      items: [
        { text: 'Pierwszy trener który mi wytłumaczył DLACZEGO robię dane ćwiczenie, a nie tylko co robić. Po 3 miesiącach widzę różnicę nie tylko w sylwetce, ale w podejściu do treningu.', name: 'Klientka · Askesis', initials: 'A.K.' },
        { text: 'Miałem za sobą 3 lata bro-splitu z internetu. Alex rozłożył to na czynniki pierwsze i zbudował program oparty na nauce. Progresja siły jak nigdy wcześniej.', name: 'Klient · Areté', initials: 'M.W.' },
        { text: 'Szukałam trenera który rozumie, że kobieta nie musi bać się ciężarów. Podejście evidence-based, pełna periodyzacja, focus na pośladki i barki. Dokładnie to czego potrzebowałam.', name: 'Klientka · Areté', initials: 'J.S.' },
      ],
      note: '* Opinie od pierwszych klientów. Sekcja będzie rozbudowywana.',
    },
    contact: {
      tagline: 'KONTAKT', title: 'Zacznij swoją drogę',
      desc: 'Wypełnij formularz, a skontaktuję się z Tobą w ciągu 24 godzin.',
      name: 'Imię', email: 'Email', goal: 'Cel treningowy',
      goals: ['Hipertrofia', 'Siła', 'Redukcja', 'Rekompozycja', 'Inne'],
      exp: 'Doświadczenie',
      exps: ['Początkujący (0-1 rok)', 'Średniozaawansowany (1-3 lata)', 'Zaawansowany (3+ lat)'],
      pkg: 'Interesujący pakiet',
      pkgs: ['Paideia (199 PLN)', 'Askesis (279 PLN/mies.)', 'Areté (449 PLN/mies.)', 'Stacjonarnie', 'Jeszcze nie wiem'],
      more: 'Powiedz mi więcej', submit: 'Wyślij zgłoszenie',
    },
    footer: { tagline: 'Coaching oparty na nauce', terms: 'Regulamin', privacy: 'Prywatność', rights: 'Wszelkie prawa zastrzeżone.', ip: 'Niniejsza strona stanowi własność intelektualną autora.' },
  },

  en: {
    nav: { about: 'About', approach: 'Approach', packages: 'Packages', process: 'Process', contact: 'Contact', login: 'Log in' },
    hero: {
      tagline: 'EVIDENCE-BASED COACHING',
      title1: 'Train with ',
      titleAccent: 'purpose',
      title2: 'Grow with science',
      desc: 'Periodized training programs built on peer-reviewed research. Hypertrophy, strength, body recomposition — no bro-science, no motivational fluff.',
      cta: 'Get started',
      secondary: 'See packages',
      features: [
        { sym: '⚗', label: 'Evidence-based', sub: 'Peer-reviewed' },
        { sym: '◈', label: 'Individualized', sub: 'Built for you' },
        { sym: '△', label: 'Measurable', sub: 'Data, not words' },
      ],
    },
    about: {
      tagline: 'COACH',
      name: 'Alexander Panorios',
      role: 'PERSONAL TRAINER · ONLINE COACH',
      bio1: 'Half-Greek, half-Polish. Gym manager at JustGYM Częstochowa and experienced personal trainer — not an influencer who watched a few YouTube videos.',
      bio2: 'I program training based on research by Helms, Israetel, Schoenfeld and Nuckols. Volume periodization, RIR autoregulation, stretch-mediated hypertrophy — these aren\'t buzzwords, they\'re tools I use with every client.',
      bio3: 'Areté (ἀρετή) is the ancient Greek ideal of excellence — not perfection, but the pursuit of becoming your best self. That\'s my coaching philosophy.',
    },
    pillars: {
      tagline: 'PHILOSOPHY', title: 'Three pillars',
      items: [
        { icon: '⚗️', title: 'Science, not faith', text: 'Every training decision backed by peer-reviewed research. Schoenfeld on volume, Helms on priorities, Israetel on periodization.' },
        { icon: '🎯', title: 'Individualization', text: 'No universal plan exists. Your anatomy, goals, equipment, injuries and time — everything shapes the program.' },
        { icon: '📊', title: 'Data, not feelings', text: 'Volume tracking, RIR, load progression, check-ins — we measure everything. What isn\'t measured isn\'t managed.' },
      ],
    },
    forWho: {
      tagline: 'FOR WHOM', title: 'Who is Areté for?',
      yes: 'For you if:', no: 'Not for you if:',
      yesItems: ['You want to train smart, not just hard', 'You\'re interested in the science behind training', 'You want a coach who explains WHY', 'You\'re ready for a 6-month process', 'You value data and consistency'],
      noItems: ['You want a magic 2-week diet', 'You want motivational quotes instead of knowledge', 'You need someone screaming at you', 'You\'re not ready for honest feedback', 'You only care about the number on the scale'],
    },
    packages: {
      tagline: 'PACKAGES', title: 'Choose your tier',
      subtitle: 'From self-guided plan to full coaching with a trainer',
      paideia: { name: 'PAIDEIA', greek: 'παιδεία — education', price: 47, currency: 'EUR', suffix: 'one-time',
        features: ['Training plan PDF', 'Progress tracking sheet', 'Exercise selection + alternatives', '24-week periodization', 'No trainer contact'] },
      askesis: { name: 'ASKESIS', greek: 'ἄσκησις — discipline', price: 65, currency: 'EUR', suffix: '/ month', discount: '€58/mo with 3-month commitment',
        features: ['Everything from Paideia', 'Calorie + protein targets', 'Check-in every 2 weeks', 'Feedback and plan adjustments', 'Helms nutrition pyramid'] },
      arete: { name: 'ARETÉ', greek: 'ἀρετή — excellence', badge: 'RECOMMENDED', price: 105, currency: 'EUR', suffix: '/ month', discount: '€94/mo with 3-month commitment',
        features: ['Everything from Askesis', 'Individual nutrition plan', 'Weekly check-in', 'Trainer dashboard (9 tabs)', 'Priority contact', 'Full progress analysis'] },
      inperson: {
        title: 'In-person training',
        subtitle: 'JustGYM · ul. 1 Maja 21 · Częstochowa',
        currency: 'EUR',
        single: { label: 'SINGLE SESSION', price: 35, detail: '60 minutes' },
        pack8: { label: '8-SESSION PACK', price: 30, detail: '/session · €245' },
        pack12: { label: '12-SESSION PACK', price: 28, detail: '/session · €340' },
      },
      cta: 'Choose this package',
    },
    process: {
      tagline: 'PROCESS', title: 'How does it work?',
      steps: [
        { num: '01', title: 'Application', text: 'Fill out the form on this page. I receive an email with your basic info.' },
        { num: '02', title: 'Conversation', text: 'I reach out to you, we confirm the package and goals. We work out the details.' },
        { num: '03', title: 'Payment', text: 'Transfer or BLIK via Revolut. Fast, secure, no middlemen.' },
        { num: '04', title: 'Questionnaire', text: 'You fill out a detailed onboarding questionnaire — goals, history, injuries, equipment, preferences.' },
        { num: '05', title: 'Program', text: 'Based on your questionnaire I build your personalized program. Periodization, volume, RIR — all tailored.' },
        { num: '06', title: 'Training', text: 'You receive your plan and start. Check-ins, feedback, adjustments — depending on package.' },
      ],
    },
    testimonials: {
      tagline: 'TESTIMONIALS', title: 'What clients say',
      items: [
        { text: 'First trainer who explained WHY I\'m doing each exercise, not just what to do. After 3 months I see a difference not only in my physique, but in how I approach training.', name: 'Client · Askesis', initials: 'A.K.' },
        { text: 'I had 3 years of bro-split from the internet. Alex broke it down and built a science-based program. Strength progression like never before.', name: 'Client · Areté', initials: 'M.W.' },
        { text: 'I was looking for a trainer who understands women don\'t need to fear heavy weights. Evidence-based approach, full periodization, focus on glutes and shoulders. Exactly what I needed.', name: 'Client · Areté', initials: 'J.S.' },
      ],
      note: '* Reviews from first clients. This section will grow.',
    },
    contact: {
      tagline: 'CONTACT', title: 'Start your journey',
      desc: 'Fill out the form and I\'ll get back to you within 24 hours.',
      name: 'Name', email: 'Email', goal: 'Training goal',
      goals: ['Hypertrophy', 'Strength', 'Fat loss', 'Recomposition', 'Other'],
      exp: 'Experience',
      exps: ['Beginner (0-1 year)', 'Intermediate (1-3 years)', 'Advanced (3+ years)'],
      pkg: 'Package of interest',
      pkgs: ['Paideia (€47)', 'Askesis (€65/mo)', 'Areté (€105/mo)', 'In-person', 'Not sure yet'],
      more: 'Tell me more', submit: 'Send application',
    },
    footer: { tagline: 'Evidence-based coaching', terms: 'Terms', privacy: 'Privacy', rights: 'All rights reserved.', ip: 'This website is the intellectual property of the author.' },
  },

  el: {
    nav: { about: 'Σχετικά', approach: 'Προσέγγιση', packages: 'Πακέτα', process: 'Διαδικασία', contact: 'Επικοινωνία', login: 'Σύνδεση' },
    hero: {
      tagline: 'ΕΠΙΣΤΗΜΟΝΙΚΉ ΠΡΟΠΌΝΗΣΗ',
      title1: 'Προπονήσου με ',
      titleAccent: 'σκοπό',
      title2: 'Ανάπτυξη με επιστήμη',
      desc: 'Περιοδικοποιημένα προγράμματα προπόνησης βασισμένα σε επιστημονικές έρευνες. Υπερτροφία, δύναμη, ανασύνθεση σώματος — χωρίς bro-science, χωρίς κενά λόγια.',
      cta: 'Ξεκίνα',
      secondary: 'Δες τα πακέτα',
      features: [
        { sym: '⚗', label: 'Επιστημονικό', sub: 'Τεκμηριωμένο' },
        { sym: '◈', label: 'Εξατομικευμένο', sub: 'Για εσένα' },
        { sym: '△', label: 'Μετρήσιμο', sub: 'Δεδομένα' },
      ],
    },
    about: {
      tagline: 'ΠΡΟΠΟΝΗΤΉΣ',
      name: 'Αλέξανδρος Πανώριος',
      role: 'ΠΡΟΣΩΠΙΚΌΣ ΠΡΟΠΟΝΗΤΉΣ · ONLINE COACH',
      bio1: 'Μισός Έλληνας, μισός Πολωνός. Διευθυντής του γυμναστηρίου JustGYM στην Τσενστοχόβα και έμπειρος προσωπικός προπονητής — όχι influencer που είδε μερικά βίντεο στο YouTube.',
      bio2: 'Σχεδιάζω προγράμματα προπόνησης βασισμένα στις έρευνες των Helms, Israetel, Schoenfeld και Nuckols. Περιοδικοποίηση όγκου, αυτορρύθμιση RIR, υπερτροφία μέσω διάτασης — δεν είναι buzzwords, είναι εργαλεία που χρησιμοποιώ με κάθε πελάτη.',
      bio3: 'Αρετή (ἀρετή) είναι το αρχαιοελληνικό ιδανικό της τελειότητας — όχι της απόλυτης μορφής, αλλά της προσπάθειας να γίνεις η καλύτερη εκδοχή του εαυτού σου. Αυτή είναι η φιλοσοφία μου στο coaching.',
    },
    pillars: {
      tagline: 'ΦΙΛΟΣΟΦΊΑ', title: 'Τρεις πυλώνες',
      items: [
        { icon: '⚗️', title: 'Επιστήμη, όχι πίστη', text: 'Κάθε προπονητική απόφαση στηρίζεται σε επιστημονικές έρευνες. Schoenfeld για τον όγκο, Helms για τις προτεραιότητες, Israetel για την περιοδικοποίηση.' },
        { icon: '🎯', title: 'Εξατομίκευση', text: 'Δεν υπάρχει καθολικό πρόγραμμα. Η ανατομία σου, οι στόχοι, ο εξοπλισμός, οι τραυματισμοί και ο χρόνος — όλα διαμορφώνουν το πρόγραμμα.' },
        { icon: '📊', title: 'Δεδομένα, όχι συναισθήματα', text: 'Παρακολούθηση όγκου, RIR, πρόοδος βαρών, check-ins — μετράμε τα πάντα. Γιατί ό,τι δεν μετριέται, δεν διαχειρίζεται.' },
      ],
    },
    forWho: {
      tagline: 'ΓΙΑ ΠΟΙΟΝ', title: 'Για ποιον είναι η Αρετή;',
      yes: 'Για εσένα, αν:', no: 'Όχι για εσένα, αν:',
      yesItems: ['Θέλεις να προπονείσαι έξυπνα, όχι μόνο σκληρά', 'Σε ενδιαφέρει η επιστήμη πίσω από την προπόνηση', 'Ψάχνεις προπονητή που εξηγεί ΓΙΑΤΊ', 'Είσαι έτοιμος/η για μια διαδικασία 6 μηνών', 'Εκτιμάς τα δεδομένα και τη συστηματικότητα'],
      noItems: ['Ψάχνεις μαγική δίαιτα δύο εβδομάδων', 'Θέλεις συνθήματα αντί για γνώση', 'Χρειάζεσαι κάποιον να σου φωνάζει', 'Δεν είσαι έτοιμος/η για ειλικρινές feedback', 'Σε ενδιαφέρει μόνο το νούμερο στη ζυγαριά'],
    },
    packages: {
      tagline: 'ΠΑΚΈΤΑ', title: 'Διάλεξε το επίπεδό σου',
      subtitle: 'Από αυτόνομο πρόγραμμα μέχρι πλήρες coaching με προπονητή',
      paideia: { name: 'PAIDEIA', greek: 'παιδεία — εκπαίδευση', price: 47, currency: 'EUR', suffix: 'εφάπαξ',
        features: ['Πρόγραμμα προπόνησης PDF', 'Φύλλο καταγραφής προόδου', 'Επιλογή ασκήσεων + εναλλακτικές', 'Περιοδικοποίηση 24 εβδομάδων', 'Χωρίς επαφή με προπονητή'] },
      askesis: { name: 'ASKESIS', greek: 'ἄσκησις — πειθαρχία', price: 65, currency: 'EUR', suffix: '/ μήνα', discount: '€58/μήνα με δέσμευση 3 μηνών',
        features: ['Όλα από το Paideia', 'Στόχοι θερμίδων + πρωτεΐνης', 'Check-in κάθε 2 εβδομάδες', 'Feedback και διορθώσεις πλάνου', 'Διατροφική πυραμίδα Helms'] },
      arete: { name: 'ARETÉ', greek: 'ἀρετή — τελειότητα', badge: 'ΠΡΟΤΕΙΝΌΜΕΝΟ', price: 105, currency: 'EUR', suffix: '/ μήνα', discount: '€94/μήνα με δέσμευση 3 μηνών',
        features: ['Όλα από το Askesis', 'Εξατομικευμένο διατροφικό πλάνο', 'Εβδομαδιαίο check-in', 'Dashboard προπονητή (9 καρτέλες)', 'Προτεραιότητα επικοινωνίας', 'Πλήρης ανάλυση προόδου'] },
      inperson: {
        title: 'Προπόνηση από κοντά',
        subtitle: 'JustGYM · ul. 1 Maja 21 · Częstochowa',
        currency: 'EUR',
        single: { label: 'ΜΙΑ ΣΥΝΕΔΡΊΑ', price: 35, detail: '60 λεπτά' },
        pack8: { label: 'ΠΑΚΈΤΟ 8 ΣΥΝΕΔΡΙΏΝ', price: 30, detail: '/συνεδρία · €245' },
        pack12: { label: 'ΠΑΚΈΤΟ 12 ΣΥΝΕΔΡΙΏΝ', price: 28, detail: '/συνεδρία · €340' },
      },
      cta: 'Διάλεξε αυτό το πακέτο',
    },
    process: {
      tagline: 'ΔΙΑΔΙΚΑΣΊΑ', title: 'Πώς λειτουργεί;',
      steps: [
        { num: '01', title: 'Αίτηση', text: 'Συμπληρώνεις τη φόρμα στη σελίδα. Λαμβάνω email με τα βασικά σου στοιχεία.' },
        { num: '02', title: 'Συζήτηση', text: 'Επικοινωνώ μαζί σου, επιβεβαιώνουμε το πακέτο και τους στόχους. Συμφωνούμε τις λεπτομέρειες.' },
        { num: '03', title: 'Πληρωμή', text: 'Μεταφορά ή BLIK μέσω Revolut. Γρήγορα, ασφαλή, χωρίς μεσάζοντες.' },
        { num: '04', title: 'Ερωτηματολόγιο', text: 'Συμπληρώνεις λεπτομερές onboarding ερωτηματολόγιο — στόχοι, ιστορικό, τραυματισμοί, εξοπλισμός, προτιμήσεις.' },
        { num: '05', title: 'Πρόγραμμα', text: 'Βάσει του ερωτηματολογίου φτιάχνω το εξατομικευμένο σου πρόγραμμα. Περιοδικοποίηση, όγκος, RIR — όλα προσαρμοσμένα.' },
        { num: '06', title: 'Προπόνηση', text: 'Λαμβάνεις το πλάνο σου και ξεκινάς. Check-ins, feedback, διορθώσεις — ανάλογα με το πακέτο.' },
      ],
    },
    testimonials: {
      tagline: 'ΜΑΡΤΥΡΊΕΣ', title: 'Τι λένε οι πελάτες',
      items: [
        { text: 'Ο πρώτος προπονητής που μου εξήγησε ΓΙΑΤΊ κάνω κάθε άσκηση, όχι απλώς τι να κάνω. Μετά από 3 μήνες βλέπω διαφορά όχι μόνο στη φυσική κατάσταση, αλλά και στην προσέγγισή μου στην προπόνηση.', name: 'Πελάτισσα · Askesis', initials: 'Α.Κ.' },
        { text: 'Είχα 3 χρόνια bro-split από το internet. Ο Αλέξ το ανέλυσε από την αρχή και έφτιαξε ένα πρόγραμμα βασισμένο σε επιστήμη. Πρόοδος δύναμης όπως ποτέ.', name: 'Πελάτης · Areté', initials: 'Μ.Β.' },
        { text: 'Έψαχνα προπονητή που καταλαβαίνει ότι η γυναίκα δεν χρειάζεται να φοβάται τα βάρη. Επιστημονική προσέγγιση, πλήρης περιοδικοποίηση, εστίαση σε γλουτούς και ώμους. Ακριβώς αυτό που χρειαζόμουν.', name: 'Πελάτισσα · Areté', initials: 'Γ.Σ.' },
      ],
      note: '* Μαρτυρίες από τους πρώτους πελάτες. Η ενότητα θα εμπλουτίζεται.',
    },
    contact: {
      tagline: 'ΕΠΙΚΟΙΝΩΝΊΑ', title: 'Ξεκίνα το ταξίδι σου',
      desc: 'Συμπλήρωσε τη φόρμα και θα επικοινωνήσω μαζί σου εντός 24 ωρών.',
      name: 'Όνομα', email: 'Email', goal: 'Στόχος προπόνησης',
      goals: ['Υπερτροφία', 'Δύναμη', 'Απώλεια λίπους', 'Ανασύνθεση', 'Άλλο'],
      exp: 'Εμπειρία',
      exps: ['Αρχάριος (0-1 έτος)', 'Μέσου επιπέδου (1-3 έτη)', 'Προχωρημένος (3+ έτη)'],
      pkg: 'Πακέτο ενδιαφέροντος',
      pkgs: ['Paideia (€47)', 'Askesis (€65/μήνα)', 'Areté (€105/μήνα)', 'Από κοντά', 'Δεν είμαι σίγουρος/η ακόμα'],
      more: 'Πες μου περισσότερα', submit: 'Αποστολή αίτησης',
    },
    footer: { tagline: 'Προπόνηση βασισμένη στην επιστήμη', terms: 'Όροι', privacy: 'Απόρρητο', rights: 'Όλα τα δικαιώματα διατηρούνται.', ip: 'Η ιστοσελίδα αποτελεί πνευματική ιδιοκτησία του δημιουργού.' },
  },
}

// ===== MEANDER SVG =====
function MeanderSVG({ animated = false }) {
  const pattern = "M0,10 L5,10 L5,5 L10,5 L10,15 L15,15 L15,5 L20,5 L20,10 L25,10 L25,5 L30,5 L30,15 L35,15 L35,5 L40,5 L40,10"
  const fullPath = Array.from({ length: 20 }, (_, i) =>
    pattern.replace(/(\d+)/g, (m) => parseInt(m) + i * 40)
  ).join(' ')
  return (
    <div className={`meander-line ${animated ? 'meander-animated anim-fade' : ''}`}>
      <svg viewBox="0 0 800 20" preserveAspectRatio="none">
        <path d={fullPath} />
      </svg>
    </div>
  )
}

// ===== PARTICLES — 52 fireflies, bigger, glowier =====
function ParticlesCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // 52 fireflies (+30% from 40)
    for (let i = 0; i < 52; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.2,          // 1.2 - 4.2 px (was 0.5-2.5)
        speedX: (Math.random() - 0.5) * 0.22,   // slower drift
        speedY: (Math.random() - 0.5) * 0.22,
        opacity: Math.random() * 0.5 + 0.25,    // 0.25 - 0.75 (brighter)
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.01,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += p.pulseSpeed
        const pulseFactor = 0.4 + 0.6 * Math.abs(Math.sin(p.pulse))
        const currentOpacity = p.opacity * pulseFactor

        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        // Outer glow (firefly halo)
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6)
        grad.addColorStop(0, `rgba(232, 200, 74, ${currentOpacity * 0.4})`)
        grad.addColorStop(0.4, `rgba(212, 175, 55, ${currentOpacity * 0.15})`)
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2)
        ctx.fill()

        // Inner bright core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 200, 74, ${currentOpacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="particles-canvas" />
}

// ===== COUNTER =====
function Counter({ end, duration = 1500 }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setStarted(false)
    setCount(0)
  }, [end])

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        const startTime = performance.now()
        const animate = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * end))
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration, started])

  return <span ref={ref} className="counter-value">{count}</span>
}

// ===== SIDE QUOTE (decorative Greek text along edges) =====
function SideQuote({ text, source, position = 'left', top = '20%' }) {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add('visible')
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`side-quote side-quote-${position}`}
      style={{ top }}
    >
      {text}
      {source && <span className="side-quote-source">— {source}</span>}
    </div>
  )
}

// ===== CURRENCY SYMBOL =====
const currencySymbol = (c) => c === 'EUR' ? '€' : c === 'PLN' ? 'zł' : c

// ===== MAIN =====
export default function Home() {
  const [lang, setLang] = useState('pl')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [heroTyped, setHeroTyped] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)
  const heroDecoRef = useRef(null)
  const l = t[lang]
  const closeAuth = useCallback(() => setAuthOpen(false), [])

  // Scroll
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
      const h = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0)
      if (heroDecoRef.current) {
        heroDecoRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Animations observer
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' })

    document.querySelectorAll('.anim-fade, .anim-fade-left, .anim-fade-right, .meander-animated').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [lang])

  // Typewriter
  useEffect(() => {
    const fullText = l.hero.titleAccent
    setHeroTyped('')
    setShowCursor(true)
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setHeroTyped(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setTimeout(() => setShowCursor(false), 2000)
      }
    }, 120)
    return () => clearInterval(timer)
  }, [lang])

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {authOpen && <AuthModal lang={lang} onClose={closeAuth} />}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand">ARETÉ</div>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><a onClick={() => scrollTo('about')}>{l.nav.about}</a></li>
            <li><a onClick={() => scrollTo('approach')}>{l.nav.approach}</a></li>
            <li><a onClick={() => scrollTo('packages')}>{l.nav.packages}</a></li>
            <li><a onClick={() => scrollTo('process')}>{l.nav.process}</a></li>
            <li><a onClick={() => scrollTo('contact')}>{l.nav.contact}</a></li>
            <li>
              <div className="nav-lang">
                <button className={lang === 'pl' ? 'active' : ''} onClick={() => setLang('pl')}>PL</button>
                <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
                <button className={lang === 'el' ? 'active' : ''} onClick={() => setLang('el')}>ΕΛ</button>
              </div>
            </li>
            <li>
              <button className="nav-login" onClick={() => setAuthOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {l.nav.login}
              </button>
            </li>
          </ul>
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <ParticlesCanvas />
        <div className="container">
          <div className="hero-content">
            <div className="hero-tagline anim-fade delay-1">{l.hero.tagline}</div>
            <h1 className="hero-title anim-fade delay-2">
              {l.hero.title1}<span className="accent">{heroTyped}</span>{showCursor && <span className="typewriter-cursor" />}
              <br />
              <span className="line2">{l.hero.title2}</span>
            </h1>
            <p className="hero-desc anim-fade delay-3">{l.hero.desc}</p>
            <div className="hero-cta-row anim-fade delay-4">
              <button className="hero-cta" onClick={() => scrollTo('contact')}>
                <span>{l.hero.cta}</span>
                <span className="arrow">→</span>
              </button>
              <a className="hero-secondary" onClick={() => scrollTo('packages')}>{l.hero.secondary}</a>
            </div>
            <div className="hero-features anim-fade delay-5">
              {l.hero.features.map((f, i) => (
                <div key={i} className="hero-feature">
                  <div className="hero-feature-sym">{f.sym}</div>
                  <div className="hero-feature-label">{f.label}</div>
                  <div className="hero-feature-sub">{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-deco" ref={heroDecoRef}>
          <svg width="420" height="420" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
            <path d="M100 30 L100 170 M30 100 L170 100" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <text x="100" y="108" textAnchor="middle" fill="currentColor" fontSize="28" fontFamily="Cormorant Garamond" opacity="0.5">ἀρετή</text>
          </svg>
        </div>
      </section>

      <MeanderSVG animated />

      {/* ABOUT */}
      <section id="about" className="section section-alt">
        <SideQuote text="ἓν οἶδα ὅτι οὐδὲν οἶδα" source="ΣΩΚΡΆΤΗΣ" position="left" top="12%" />
        <SideQuote text="γνῶθι σεαυτόν" source="ΔΕΛΦΟΊ" position="right" top="25%" />
        <div className="container">
          <div className="about-grid">
            <div className="about-photo-wrap anim-fade-left">
              <img src="/img/alex.jpg" alt="Alexander Panorios" className="about-photo" />
            </div>
            <div>
              <div className="section-tagline anim-fade delay-1">{l.about.tagline}</div>
              <h2 className="about-name anim-fade delay-2">{l.about.name}</h2>
              <div className="about-role anim-fade delay-3">{l.about.role}</div>
              <p className="about-text anim-fade delay-3">{l.about.bio1}</p>
              <p className="about-text anim-fade delay-4">{l.about.bio2}</p>
              <p className="about-text anim-fade delay-5">{l.about.bio3}</p>
            </div>
          </div>
        </div>
      </section>

      <MeanderSVG animated />

      {/* PILLARS */}
      <section id="approach" className="section">
        <SideQuote text="νοῦς ὑγιὴς ἐν σώματι ὑγιεῖ" source="IUVENALIS" position="left" top="20%" />
        <SideQuote text="μηδὲν ἄγαν" source="ΔΕΛΦΟΊ" position="right" top="55%" />
        <div className="container">
          <div className="section-header">
            <div className="section-tagline anim-fade">{l.pillars.tagline}</div>
            <h2 className="section-title anim-fade delay-1">{l.pillars.title}</h2>
          </div>
          <div className="pillars-grid">
            {l.pillars.items.map((item, i) => (
              <div key={i} className={`pillar-card anim-fade delay-${i + 2}`}>
                <div className="pillar-icon">{item.icon}</div>
                <h3 className="pillar-title">{item.title}</h3>
                <p className="pillar-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MeanderSVG animated />

      {/* FOR WHO */}
      <section className="section section-alt">
        <SideQuote text="χαλεπὰ τὰ καλά" source="ΠΛΆΤΩΝ" position="left" top="15%" />
        <SideQuote text="πάθει μάθος" source="ΑΙΣΧΎΛΟΣ" position="right" top="60%" />
        <div className="container">
          <div className="section-header">
            <div className="section-tagline anim-fade">{l.forWho.tagline}</div>
            <h2 className="section-title anim-fade delay-1">{l.forWho.title}</h2>
          </div>
          <div className="for-grid">
            <div className="for-col anim-fade-left delay-2">
              <h3 style={{ color: 'var(--gold)' }}>{l.forWho.yes}</h3>
              {l.forWho.yesItems.map((item, i) => (
                <div key={i} className="for-item">
                  <span className="for-icon yes">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="for-col anim-fade-right delay-3">
              <h3 style={{ color: '#6b4040' }}>{l.forWho.no}</h3>
              {l.forWho.noItems.map((item, i) => (
                <div key={i} className="for-item">
                  <span className="for-icon no">✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MeanderSVG animated />

      {/* PACKAGES */}
      <section id="packages" className="section">
        <SideQuote text="ἀρχὴ ἥμισυ παντός" source="ΠΥΘΑΓΌΡΑΣ" position="left" top="10%" />
        <SideQuote text="τὸ σῶμα γίγνωσκε" source="ΑΡΧΑῖΟΝ" position="right" top="55%" />
        <div className="container">
          <div className="section-header">
            <div className="section-tagline anim-fade">{l.packages.tagline}</div>
            <h2 className="section-title anim-fade delay-1">{l.packages.title}</h2>
            <p className="section-subtitle anim-fade delay-2">{l.packages.subtitle}</p>
          </div>

          <div className="packages-grid">
            {/* PAIDEIA */}
            <div className="pkg-card anim-fade delay-2">
              <div className="pkg-name">{l.packages.paideia.name}</div>
              <div className="pkg-greek">{l.packages.paideia.greek}</div>
              <div className="pkg-price">
                <span className="pkg-price-currency">{currencySymbol(l.packages.paideia.currency)}</span>
                <Counter key={`paideia-${lang}`} end={l.packages.paideia.price} />
              </div>
              <div className="pkg-price-suffix">{l.packages.paideia.currency} · {l.packages.paideia.suffix}</div>
              <ul className="pkg-features">
                {l.packages.paideia.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <button className="pkg-cta" onClick={() => scrollTo('contact')}>{l.packages.cta}</button>
            </div>

            {/* ASKESIS */}
            <div className="pkg-card anim-fade delay-3">
              <div className="pkg-name">{l.packages.askesis.name}</div>
              <div className="pkg-greek">{l.packages.askesis.greek}</div>
              <div className="pkg-price">
                <span className="pkg-price-currency">{currencySymbol(l.packages.askesis.currency)}</span>
                <Counter key={`askesis-${lang}`} end={l.packages.askesis.price} />
              </div>
              <div className="pkg-price-suffix">{l.packages.askesis.currency} {l.packages.askesis.suffix}</div>
              <div className="pkg-discount">{l.packages.askesis.discount}</div>
              <ul className="pkg-features">
                {l.packages.askesis.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <button className="pkg-cta" onClick={() => scrollTo('contact')}>{l.packages.cta}</button>
            </div>

            {/* ARETÉ */}
            <div className="pkg-card featured anim-fade delay-4">
              <div className="pkg-badge">{l.packages.arete.badge}</div>
              <div className="pkg-name">{l.packages.arete.name}</div>
              <div className="pkg-greek">{l.packages.arete.greek}</div>
              <div className="pkg-price">
                <span className="pkg-price-currency">{currencySymbol(l.packages.arete.currency)}</span>
                <Counter key={`arete-${lang}`} end={l.packages.arete.price} />
              </div>
              <div className="pkg-price-suffix">{l.packages.arete.currency} {l.packages.arete.suffix}</div>
              <div className="pkg-discount">{l.packages.arete.discount}</div>
              <ul className="pkg-features">
                {l.packages.arete.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <button className="pkg-cta" onClick={() => scrollTo('contact')}>{l.packages.cta}</button>
            </div>
          </div>

          {/* IN-PERSON */}
          <div className="inperson-wrap anim-fade delay-3">
            <h3 className="inperson-title">{l.packages.inperson.title}</h3>
            <p className="inperson-subtitle">{l.packages.inperson.subtitle}</p>
            <div className="inperson-card">
              <div>
                <div className="inperson-item-label">{l.packages.inperson.single.label}</div>
                <div className="inperson-item-price">
                  <span className="inperson-item-currency">{currencySymbol(l.packages.inperson.currency)}</span>
                  <Counter key={`single-${lang}`} end={l.packages.inperson.single.price} />
                </div>
                <div className="inperson-item-detail">{l.packages.inperson.single.detail}</div>
              </div>
              <div>
                <div className="inperson-item-label">{l.packages.inperson.pack8.label}</div>
                <div className="inperson-item-price">
                  <span className="inperson-item-currency">{currencySymbol(l.packages.inperson.currency)}</span>
                  <Counter key={`p8-${lang}`} end={l.packages.inperson.pack8.price} />
                </div>
                <div className="inperson-item-detail">{l.packages.inperson.pack8.detail}</div>
              </div>
              <div>
                <div className="inperson-item-label">{l.packages.inperson.pack12.label}</div>
                <div className="inperson-item-price">
                  <span className="inperson-item-currency">{currencySymbol(l.packages.inperson.currency)}</span>
                  <Counter key={`p12-${lang}`} end={l.packages.inperson.pack12.price} />
                </div>
                <div className="inperson-item-detail">{l.packages.inperson.pack12.detail}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MeanderSVG animated />

      {/* PROCESS */}
      <section id="process" className="section section-alt">
        <SideQuote text="ἀρχὴ σοφίας ἡ τῶν ὀνομάτων ἐπίσκεψις" source="ΑΝΤΙΣΘΈΝΗΣ" position="left" top="18%" />
        <SideQuote text="ἔργον εὖ ποιεῖν" source="" position="right" top="58%" />
        <div className="container">
          <div className="section-header">
            <div className="section-tagline anim-fade">{l.process.tagline}</div>
            <h2 className="section-title anim-fade delay-1">{l.process.title}</h2>
          </div>
          <div className="process-grid">
            {l.process.steps.map((step, i) => (
              <div key={i} className={`process-step anim-fade delay-${(i % 3) + 2}`}>
                <div className="process-num">{step.num}</div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MeanderSVG animated />

      {/* TESTIMONIALS */}
      <section className="section">
        <SideQuote text="ἡ ἀλήθεια ἐν τοῖς ἔργοις" source="" position="left" top="15%" />
        <SideQuote text="ἔργα μαρτυρεῖ" source="" position="right" top="55%" />
        <div className="container">
          <div className="section-header">
            <div className="section-tagline anim-fade">{l.testimonials.tagline}</div>
            <h2 className="section-title anim-fade delay-1">{l.testimonials.title}</h2>
          </div>
          <div className="testimonials-grid">
            {l.testimonials.items.map((item, i) => (
              <div key={i} className={`testimonial-card anim-fade delay-${i + 2}`}>
                <p className="testimonial-text">{item.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{item.initials}</div>
                  <div>
                    <div className="testimonial-name">{item.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="testimonials-note anim-fade">{l.testimonials.note}</p>
        </div>
      </section>

      <MeanderSVG animated />

      {/* CONTACT */}
      <section id="contact" className="section section-alt">
        <SideQuote text="ἀρχὴ ἥμισυ παντός" source="ΠΥΘΑΓΌΡΑΣ" position="left" top="18%" />
        <SideQuote text="τόλμα ἄρχεσθαι" source="" position="right" top="55%" />
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info anim-fade-left">
              <div className="section-tagline">{l.contact.tagline}</div>
              <h2>{l.contact.title}</h2>
              <p>{l.contact.desc}</p>
              <div style={{ marginTop: '2rem' }}>
                <div className="contact-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  alexander.panorios@gmail.com
                </div>
                <div className="contact-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  +48 730 198 366
                </div>
                <div className="contact-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  JustGYM · ul. 1 Maja 21 · Częstochowa
                </div>
              </div>
            </div>
            <div className="anim-fade-right delay-2">
              <form action="https://api.web3forms.com/submit" method="POST">
                <input type="hidden" name="access_key" value="e5ceca0e-63b1-40ca-be31-d064a5b3a277" />
                <input type="hidden" name="subject" value="Nowe zgłoszenie — Areté Coaching" />
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{l.contact.name}</label>
                    <input type="text" name="name" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{l.contact.email}</label>
                    <input type="email" name="email" className="form-input" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{l.contact.goal}</label>
                    <select name="goal" className="form-select" defaultValue="">
                      <option value="" disabled>—</option>
                      {l.contact.goals.map((g, i) => <option key={i} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{l.contact.exp}</label>
                    <select name="experience" className="form-select" defaultValue="">
                      <option value="" disabled>—</option>
                      {l.contact.exps.map((e, i) => <option key={i} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{l.contact.pkg}</label>
                  <select name="package" className="form-select" defaultValue="">
                    <option value="" disabled>—</option>
                    {l.contact.pkgs.map((p, i) => <option key={i} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{l.contact.more}</label>
                  <textarea name="message" className="form-textarea" />
                </div>
                <button type="submit" className="form-submit">{l.contact.submit}</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <MeanderSVG />

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="footer-brand">ARETÉ</div>
              <div className="footer-contact">{l.footer.tagline}<br />alexander.panorios@gmail.com<br />+48 730 198 366</div>
            </div>
            <div className="footer-links">
              <a href="/regulamin">{l.footer.terms}</a>
              <a href="/prywatnosc">{l.footer.privacy}</a>
            </div>
          </div>
          <div className="footer-copy">© 2025–2026 Alexander Panorios. {l.footer.rights}<br />{l.footer.ip}</div>
        </div>
      </footer>
    </>
  )
}