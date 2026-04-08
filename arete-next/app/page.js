'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// ═══════ TRANSLATIONS ═══════
const t = {
  pl: {
    nav: { about: 'O mnie', philosophy: 'Podejście', packages: 'Pakiety', process: 'Proces', start: 'Zacznij' },
    hero: {
      tagline: 'Coaching oparty na nauce',
      title1: 'Trenuj z ', titleAccent: 'celem.', title2: 'Rośnij z nauką.',
      desc: 'Bez bro-science. Bez motywacyjnego bełkotu. Uporządkowane, periodyzowane programy treningowe oparte na badaniach naukowych — dla osób, które chcą realnych efektów.',
      cta: 'Zacznij swoją drogę', scroll: 'przewiń'
    },
    epigraphs: [
      { greek: '«ἀρετή — ἡ κατ᾽ ἐξοχὴν ἀνθρωπίνη τελειότης»', text: '"Doskonałość — najwyższa ludzka perfekcja"', attr: 'Aristotle · Nicomachean Ethics' },
      { greek: '«Ἐν τῷ πράττειν μανθάνομεν»', text: '"Uczymy się przez działanie"', attr: 'Aristotle' },
      { greek: '«Πᾶσα ἐπιστήμη χωριζομένη δικαιοσύνης, πανουργία ἐστίν»', text: '"Wiedza bez uczciwości to spryt, nie mądrość"', attr: 'Plato' },
    ],
    about: {
      label: 'O mnie', role: 'Trener · Coach · Manager siłowni',
      bio: [
        'Pół-Grek, pół-Polak, w pełni skupiony na robieniu rzeczy jak należy. Zarządzam siłownią w Częstochowie i spędziłem lata na parkiecie — trenując prawdziwych ludzi, nie budując instagramowych fantazji.',
        ['Stworzyłem ', 'Areté', ', bo miałem dość szumu w branży fitness — recyklingowanych postów "motywacyjnych", szablonowych programów, influencerów, którzy nie potrafią wyjaśnić ', 'dlaczego', ' ich metody działają. Każdy program oparty na ', 'recenzowanych badaniach naukowych', ' — Helms, Israetel, Schoenfeld — ludzie, którzy faktycznie przesuwają granice wiedzy.'],
        ['Wierzę w ', 'zasłużoną ekspertyzę', ', nie pożyczony autorytet. Trening powinien być uporządkowany, progresywny i uczciwy. Zasługujesz na trenera, który traktuje Cię jak inteligentną osobę — nie jak kolejnego followera.'],
      ],
      credentials: ['Manager — JustGYM', 'Trener personalny', 'Evidence-Based', 'Online i stacjonarnie'],
    },
    philosophy: {
      label: 'Podejście', title: 'Co mnie wyróżnia', subtitle: 'Trzy filary za każdym programem, który projektuję.',
      cards: [
        { title: 'Nauka, nie opinia', desc: 'Każda zmienna — objętość, intensywność, częstotliwość, dobór ćwiczeń — oparta na recenzowanych badaniach. Dane dose-response Schoenfelda, piramida priorytetów Helmsa, landmarki objętości Israetela. Nie "co zadziałało u mnie."' },
        { title: 'Wbudowana periodyzacja', desc: 'Żadnych losowych treningów. Strukturalne mezocykle — progresywne przeciążenie przez objętość i intensywność, zaplanowane deloady, autoregulacja przez RIR. Ciało adaptuje się systematycznie, nie chaotycznie.' },
        { title: 'Uczciwość ponad szum', desc: 'Nie obiecam transformacji w 30 dni. Powiem czego się spodziewać, dlaczego, i co mówią badania o ramach czasowych. Jeśli coś nie działa — powiem i dostosuję plan.' },
      ],
    },
    fit: {
      label: 'Dla kogo to jest', title: 'Dopasowanie ma znaczenie',
      yes: 'To jest dla Ciebie, jeśli', no: 'To nie jest dla Ciebie, jeśli',
      yesList: [
        ['Chcesz rozumieć ', 'dlaczego', ' — nie tylko ślepo podążać'],
        'Jesteś gotowa/gotów na plan na minimum 12 tygodni',
        'Cenisz dowody ponad trendy i uczciwość ponad komfort',
        'Chcesz budować sylwetkę — hipertrofia, siła, czy rekompozycja',
      ],
      noList: [
        'Szukasz magicznej pigułki lub 30-dniowej drogi na skróty',
        'Chcesz trenera, który tylko potwierdzi to co już robisz',
        'Nie chcesz śledzić treningów ani trzymać się planu',
        'Oczekujesz motywacyjnych przemówień, nie praktyki',
      ],
    },
    packages: {
      label: 'Pakiety', title: 'Wybierz swoją ścieżkę', badge: 'Rekomendowany',
      paideia: { sub: 'Edukacja — fundament', priceNote: 'jednorazowo', features: ['Spersonalizowany plan treningowy (PDF)', 'Arkusz do logowania postępów', 'Dobór ćwiczeń z alternatywami', 'Periodyzacja na 24 tygodnie'] },
      askesis: { sub: 'Dyscyplina — prowadzony rozwój', unit: 'mies.', priceNote: '249 PLN/mies. przy 3-mies. zobowiązaniu', features: ['Wszystko z Paideia', 'Zalecenia żywieniowe (cele kcal + białko)', 'Check-in z trenerem co 2 tygodnie', 'Korekty planu i feedback'] },
      arete: { sub: 'Doskonałość — pełny system', unit: 'mies.', priceNote: '399 PLN/mies. przy 3-mies. zobowiązaniu', features: ['Wszystko z Askesis', 'Plan żywieniowy z makroskładnikami', 'Cotygodniowy check-in z trenerem', 'Pełna analiza postępów', 'Priorytetowy kontakt i baza wiedzy'] },
      cta: 'Zacznij',
      inperson: { title: 'Trening stacjonarny', single: 'Sesja', pack8: 'Pakiet 8 sesji', pack12: 'Pakiet 12 sesji', per: 'sesja' },
    },
    process: {
      label: 'Proces', title: 'Jak to działa',
      steps: [
        { num: 'Ι', title: 'Zgłoś się', desc: 'Wypełnij formularz poniżej. Opisz cele, doświadczenie i czego szukasz.' },
        { num: 'ΙΙ', title: 'Konsultacja', desc: 'Skontaktuję się, żeby omówić sytuację, potwierdzić pakiet i odpowiedzieć na pytania. Bez presji.' },
        { num: 'ΙΙΙ', title: 'Ankieta', desc: 'Szczegółowa ankieta — historia treningowa, kontuzje, sprzęt, grafik, priorytety. Fundament programu.' },
        { num: 'IV', title: 'Projekt programu', desc: 'Program od zera — split, ćwiczenia, objętość, periodyzacja, żywienie — oparte na Twoich danych i aktualnych badaniach.' },
        { num: 'V', title: 'Dostarczenie', desc: 'Otrzymujesz kompletny pakiet z instrukcjami. Omawiam wszystko — nie tylko co robić, ale dlaczego.' },
        { num: 'VI', title: 'Ciągłe prowadzenie', desc: 'Dla Askesis i Areté: regularne check-iny, śledzenie postępów, korekty planu i bezpośredni kontakt ze mną.' },
      ],
    },
    contact: {
      label: 'Zacznij', title: 'Gotowy trenować z celem?', subtitle: 'Wypełnij formularz. Odpiszę w ciągu 24 godzin.',
      name: 'Imię', goal: 'Cel', exp: 'Doświadczenie', pkg: 'Pakiet', more: 'Powiedz mi więcej', submit: 'Wyślij zgłoszenie',
      goals: ['Hipertrofia / Budowanie mięśni', 'Siła / Powerlifting', 'Redukcja / Rekompozycja', 'Ogólna sprawność / Zdrowie'],
      exps: ['Początkujący (0-1 rok)', 'Średniozaawansowany (1-3 lata)', 'Zaawansowany (3+ lata)'],
      pkgs: ['Paideia (199 PLN)', 'Askesis (279 PLN/mies.)', 'Areté (449 PLN/mies.)', 'Stacjonarnie (Częstochowa)', 'Jeszcze nie wiem'],
    },
    footer: { tagline: 'Coaching oparty na nauce', terms: 'Regulamin', privacy: 'Prywatność', rights: 'Wszelkie prawa zastrzeżone.', ip: 'Niniejsza strona i jej zawartość stanowią własność intelektualną autora.' },
  },
  en: {
    nav: { about: 'About', philosophy: 'Philosophy', packages: 'Packages', process: 'Process', start: 'Start' },
    hero: {
      tagline: 'Evidence-Based Coaching',
      title1: 'Train with ', titleAccent: 'purpose.', title2: 'Grow with science.',
      desc: 'No bro-science. No motivational fluff. Structured, periodized training programs built on peer-reviewed research — for people who want real results.',
      cta: 'Begin your path', scroll: 'scroll'
    },
    epigraphs: [
      { greek: '«ἀρετή — ἡ κατ᾽ ἐξοχὴν ἀνθρωπίνη τελειότης»', text: '"Excellence — the highest human perfection"', attr: 'Aristotle · Nicomachean Ethics' },
      { greek: '«Ἐν τῷ πράττειν μανθάνομεν»', text: '"We learn by doing"', attr: 'Aristotle' },
      { greek: '«Πᾶσα ἐπιστήμη χωριζομένη δικαιοσύνης, πανουργία ἐστίν»', text: '"Knowledge without integrity is cunning, not wisdom"', attr: 'Plato' },
    ],
    about: {
      label: 'About', role: 'Coach · Trainer · Gym Manager',
      bio: [
        "Half-Greek, half-Polish, fully obsessed with doing things right. I manage a gym in Częstochowa, Poland, and I've spent years on the floor — coaching real people, not building Instagram fantasies.",
        ['I built ', 'Areté', " because I was tired of the fitness industry's noise — the recycled \"motivation\" posts, the cookie-cutter programs, the influencers who can't explain ", 'why', ' their methods work. Every program I write is rooted in ', 'peer-reviewed research', ' from Helms, Israetel, Schoenfeld — people who actually advance the field.'],
        ['I believe in ', 'earned expertise', ', not borrowed authority. Training should be structured, progressive, and honest. You deserve a coach who treats you like an intelligent adult — not a follower count.'],
      ],
      credentials: ['Gym Manager — JustGYM', 'Personal Trainer', 'Evidence-Based', 'Online & In-Person'],
    },
    philosophy: {
      label: 'Philosophy', title: 'What makes this different', subtitle: 'Three pillars behind every program I design.',
      cards: [
        { title: 'Science, not opinion', desc: "Every variable — volume, intensity, frequency, exercise selection — is based on peer-reviewed research. Schoenfeld's dose-response data, Helms' priority pyramid, Israetel's volume landmarks. Not \"what worked for me.\"" },
        { title: 'Periodization built in', desc: 'No random workouts. Structured mesocycles — progressive overload through volume and intensity, planned deloads, autoregulation via RIR. Your body adapts systematically, not chaotically.' },
        { title: 'Honesty over hype', desc: "I won't promise a transformation in 30 days. I'll tell you what to expect, why, and what the research says about timelines. If something doesn't work — I'll say so, and adjust." },
      ],
    },
    fit: {
      label: 'Who is this for', title: 'The right fit matters',
      yes: 'This is for you if', no: 'This is not for you if',
      yesList: [
        ['You want to understand ', 'why', ' — not just follow blindly'],
        "You're willing to commit to a structured program for 12+ weeks",
        'You value evidence over trends and honesty over comfort',
        'You want to build a physique — hypertrophy, strength, or recomposition',
      ],
      noList: [
        "You're looking for a magic pill or a 30-day shortcut",
        "You want a coach who just validates what you're already doing",
        "You're not willing to track training or follow a plan",
        'You expect motivational speeches, not practical guidance',
      ],
    },
    packages: {
      label: 'Packages', title: 'Choose your path', badge: 'Recommended',
      paideia: { sub: 'Education — the foundation', priceNote: 'one-time payment', features: ['Personalized training plan (PDF)', 'Progress logging spreadsheet', 'Exercise selection with alternatives', '24-week periodization'] },
      askesis: { sub: 'Discipline — guided growth', unit: 'mo', priceNote: '249 PLN/mo with 3-month commitment', features: ['Everything in Paideia', 'Nutrition guidelines (kcal + protein targets)', 'Bi-weekly check-in with coach', 'Plan adjustments & feedback'] },
      arete: { sub: 'Excellence — the full system', unit: 'mo', priceNote: '399 PLN/mo with 3-month commitment', features: ['Everything in Askesis', 'Full nutrition plan with macros', 'Weekly check-in with coach', 'Full progress analysis dashboard', 'Priority contact & knowledge base'] },
      cta: 'Get started',
      inperson: { title: 'In-Person Training', single: 'Single session', pack8: '8-session pack', pack12: '12-session pack', per: 'session' },
    },
    process: {
      label: 'Process', title: 'How it works',
      steps: [
        { num: 'Ι', title: 'Apply', desc: 'Fill out the form below. Tell me about your goals, experience, and what you\'re looking for.' },
        { num: 'ΙΙ', title: 'Consultation', desc: "I'll reach out to discuss your situation, confirm the right package, and answer questions. No pressure." },
        { num: 'ΙΙΙ', title: 'Onboarding', desc: 'A detailed questionnaire about your history, injuries, equipment, schedule, and priorities. The foundation of your program.' },
        { num: 'IV', title: 'Program design', desc: 'I build your program from scratch — split, exercises, volume, periodization, nutrition — all based on your data and current research.' },
        { num: 'V', title: 'Delivery', desc: 'You receive your complete package with detailed instructions. I walk you through everything — not just what, but why.' },
        { num: 'VI', title: 'Ongoing coaching', desc: 'For Askesis and Areté: regular check-ins, progress tracking, plan adjustments, and direct access to me.' },
      ],
    },
    contact: {
      label: 'Get started', title: 'Ready to train with purpose?', subtitle: "Fill out the form. I'll respond within 24 hours.",
      name: 'Name', goal: 'Goal', exp: 'Experience', pkg: 'Package interest', more: 'Tell me more', submit: 'Send application',
      goals: ['Hypertrophy / Muscle growth', 'Strength / Powerlifting', 'Fat loss / Recomposition', 'General fitness / Health'],
      exps: ['Beginner (0-1 year)', 'Intermediate (1-3 years)', 'Advanced (3+ years)'],
      pkgs: ['Paideia (199 PLN)', 'Askesis (279 PLN/mo)', 'Areté (449 PLN/mo)', 'In-person (Częstochowa)', 'Not sure yet'],
    },
    footer: { tagline: 'Evidence-Based Coaching', terms: 'Terms', privacy: 'Privacy', rights: 'All rights reserved.', ip: 'This website and its contents are the intellectual property of the author.' },
  },
}

// ═══════ COMPONENTS ═══════
const MeanderSVG = () => (
  <div className="meander-divider">
    <svg viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="meander" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse"><path d="M0 12 H12 V0 H24 V12 H36 V24 H48" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.3"/></pattern></defs>
      <rect width="1200" height="24" fill="url(#meander)"/>
    </svg>
  </div>
)

const GoldRule = () => <div className="gold-rule"><div className="diamond"></div></div>

const Epigraph = ({ data }) => (
  <div className="epigraph fade-in">
    <span className="greek-original">{data.greek}</span>
    {data.text}
    <span className="attribution">{data.attr}</span>
  </div>
)

const RenderBio = ({ para }) => {
  if (typeof para === 'string') return <p className="about-text">{para}</p>
  return (
    <p className="about-text">
      {para.map((part, i) => i % 2 === 0 ? part : <strong key={i}>{part}</strong>)}
    </p>
  )
}

const RenderFitItem = ({ item }) => {
  if (typeof item === 'string') return <li>{item}</li>
  return <li>{item.map((part, i) => i % 2 === 0 ? part : <strong key={i}>{part}</strong>)}</li>
}

// ═══════ MAIN PAGE ═══════
export default function Home() {
  const [lang, setLang] = useState('pl')
  const [menuOpen, setMenuOpen] = useState(false)
  const l = t[lang]

  useEffect(() => {
    const saved = localStorage.getItem('arete-lang')
    if (saved && t[saved]) setLang(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('arete-lang', lang)
  }, [lang])

  // Scroll nav effect
  useEffect(() => {
    const handler = () => {
      document.querySelector('.nav')?.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Fade-in observer
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' })
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [lang])

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <a href="#" className="nav-logo">Areté</a>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {['about','philosophy','packages','process'].map(id => (
            <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{l.nav[id]}</a></li>
          ))}
          <li><a href="#contact" onClick={e => { e.preventDefault(); scrollTo('contact') }}>{l.nav.start}</a></li>
          <li>
            <div className="lang-toggle">
              <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`lang-btn${lang === 'pl' ? ' active' : ''}`} onClick={() => setLang('pl')}>PL</button>
            </div>
          </li>
        </ul>
        <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero section">
        <div className="container hero-content fade-in">
          <p className="hero-tagline">{l.hero.tagline}</p>
          <h1 className="hero-title">{l.hero.title1}<span className="accent">{l.hero.titleAccent}</span><br /><span className="line2">{l.hero.title2}</span></h1>
          <p className="hero-desc">{l.hero.desc}</p>
          <a href="#contact" className="hero-cta" onClick={e => { e.preventDefault(); scrollTo('contact') }}>{l.hero.cta} <span className="arrow">→</span></a>
        </div>
        <div className="hero-deco">
          <svg width="400" height="500" viewBox="0 0 400 500" fill="none"><path d="M200 20C120 20 60 80 60 180C60 320 200 480 200 480C200 480 340 320 340 180C340 80 280 20 200 20Z" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"/><path d="M200 60C150 60 100 110 100 180C100 280 200 420 200 420C200 420 300 280 300 180C300 110 250 60 200 60Z" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3"/><line x1="200" y1="80" x2="200" y2="400" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2"/><line x1="110" y1="200" x2="290" y2="200" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2"/></svg>
        </div>
        <div className="hero-scroll">{l.hero.scroll} <span>↓</span></div>
      </section>

      <MeanderSVG />
      <Epigraph data={l.epigraphs[0]} />

      {/* ABOUT */}
      <section className="about section" id="about">
        <div className="container">
          <div className="section-label">{l.about.label}</div>
          <div className="about-grid fade-in">
            <div className="about-photo-wrap">
              <img src="/img/alex.jpg" alt="Alexander Panorios" className="about-photo" />
            </div>
            <div>
              <h2 className="about-name">Alexander Panorios</h2>
              <p className="about-role">{l.about.role}</p>
              {l.about.bio.map((para, i) => <RenderBio key={i} para={para} />)}
              <div className="about-credentials">
                {l.about.credentials.map((c, i) => <div key={i} className="credential">{c}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoldRule />

      {/* PHILOSOPHY */}
      <section className="section" id="philosophy">
        <div className="container">
          <div className="section-label">{l.philosophy.label}</div>
          <h2 className="section-title">{l.philosophy.title}</h2>
          <p className="section-subtitle">{l.philosophy.subtitle}</p>
          <div className="philosophy-grid fade-in">
            {l.philosophy.cards.map((card, i) => (
              <div key={i} className="philosophy-card">
                <div className="card-icon">
                  {i === 0 && <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#D4AF37" strokeWidth="1" opacity=".4"/><path d="M24 10V38M14 24H34M16 16L32 32M32 16L16 32" stroke="#D4AF37" strokeWidth=".75" opacity=".5"/><circle cx="24" cy="24" r="6" stroke="#D4AF37" strokeWidth="1"/></svg>}
                  {i === 1 && <svg viewBox="0 0 48 48" fill="none"><path d="M8 36 L16 12 L24 32 L32 8 L40 28" stroke="#D4AF37" strokeWidth="1.2"/><circle cx="16" cy="12" r="2.5" fill="#D4AF37" opacity=".5"/><circle cx="24" cy="32" r="2.5" fill="#D4AF37" opacity=".5"/><circle cx="32" cy="8" r="2.5" fill="#D4AF37" opacity=".5"/><circle cx="40" cy="28" r="2.5" fill="#D4AF37" opacity=".5"/></svg>}
                  {i === 2 && <svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="2" stroke="#D4AF37" strokeWidth="1" opacity=".4"/><path d="M16 26L22 32L34 18" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MeanderSVG />
      <Epigraph data={l.epigraphs[1]} />

      {/* FIT */}
      <section className="fit-section section" id="fit">
        <div className="container">
          <div className="section-label">{l.fit.label}</div>
          <h2 className="section-title">{l.fit.title}</h2>
          <div className="fit-grid fade-in">
            <div className="fit-col">
              <h3><span style={{color:'var(--gold)'}}>✦</span> {l.fit.yes}</h3>
              <ul className="fit-list">{l.fit.yesList.map((item, i) => <RenderFitItem key={i} item={item} />)}</ul>
            </div>
            <div className="fit-col">
              <h3><span style={{color:'#6b3a3a'}}>✕</span> {l.fit.no}</h3>
              <ul className="fit-list not-for">{l.fit.noList.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="section" id="packages">
        <div className="container">
          <div className="section-label">{l.packages.label}</div>
          <h2 className="section-title">{l.packages.title}</h2>
          <div className="packages-grid fade-in">
            {/* Paideia */}
            <div className="package-card">
              <div className="package-greek-name">παιδεία</div>
              <h3 className="package-name">Paideia</h3>
              <p className="package-subtitle">{l.packages.paideia.sub}</p>
              <div className="package-price">199 PLN</div>
              <p className="package-price-note">{l.packages.paideia.priceNote}</p>
              <ul className="package-features">{l.packages.paideia.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <a href="#contact" className="package-cta" onClick={e => { e.preventDefault(); scrollTo('contact') }}><span>{l.packages.cta}</span></a>
            </div>
            {/* Askesis */}
            <div className="package-card">
              <div className="package-greek-name">ἄσκησις</div>
              <h3 className="package-name">Askesis</h3>
              <p className="package-subtitle">{l.packages.askesis.sub}</p>
              <div className="package-price">279 PLN <small>/{l.packages.askesis.unit}</small></div>
              <p className="package-price-note">{l.packages.askesis.priceNote}</p>
              <ul className="package-features">{l.packages.askesis.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <a href="#contact" className="package-cta" onClick={e => { e.preventDefault(); scrollTo('contact') }}><span>{l.packages.cta}</span></a>
            </div>
            {/* Areté */}
            <div className="package-card featured">
              <div className="package-badge">{l.packages.badge}</div>
              <div className="package-greek-name">ἀρετή</div>
              <h3 className="package-name">Areté</h3>
              <p className="package-subtitle">{l.packages.arete.sub}</p>
              <div className="package-price">449 PLN <small>/{l.packages.arete.unit}</small></div>
              <p className="package-price-note">{l.packages.arete.priceNote}</p>
              <ul className="package-features">{l.packages.arete.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <a href="#contact" className="package-cta" onClick={e => { e.preventDefault(); scrollTo('contact') }}><span>{l.packages.cta}</span></a>
            </div>
          </div>

          {/* In-person */}
          <div className="inperson fade-in">
            <h3>{l.packages.inperson.title}</h3>
            <p className="inperson-loc">📍 JustGYM, ul. 1 Maja 21, Częstochowa</p>
            <div className="inperson-prices">
              <div className="inperson-price"><div className="label">{l.packages.inperson.single} (60 min)</div><div className="value">150 PLN</div></div>
              <div className="inperson-price"><div className="label">{l.packages.inperson.pack8}</div><div className="value">1 040 PLN</div><div className="note">130 PLN/{l.packages.inperson.per}</div></div>
              <div className="inperson-price"><div className="label">{l.packages.inperson.pack12}</div><div className="value">1 440 PLN</div><div className="note">120 PLN/{l.packages.inperson.per}</div></div>
            </div>
          </div>
        </div>
      </section>

      <MeanderSVG />
      <Epigraph data={l.epigraphs[2]} />

      {/* PROCESS */}
      <section className="process-section section" id="process">
        <div className="container">
          <div className="section-label">{l.process.label}</div>
          <h2 className="section-title">{l.process.title}</h2>
          <div className="process-steps fade-in">
            {l.process.steps.map((step, i) => (
              <div key={i} className="process-step">
                <div className="step-number">{step.num}</div>
                <div className="step-content"><h3>{step.title}</h3><p>{step.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldRule />

      {/* CONTACT */}
      <section className="cta-section section" id="contact">
        <div className="container">
          <div className="section-label" style={{justifyContent:'center'}}>{l.contact.label}</div>
          <h2 className="section-title" style={{textAlign:'center'}}>{l.contact.title}</h2>
          <p className="section-subtitle">{l.contact.subtitle}</p>
          <div className="form-wrap fade-in">
            <form action="https://api.web3forms.com/submit" method="POST">
              <input type="hidden" name="access_key" value="e5ceca0e-63b1-40ca-be31-d064a5b3a277" />
              <input type="hidden" name="subject" value="Areté — New Lead" />
              <input type="hidden" name="from_name" value="Areté Coaching" />
              <div className="form-row">
                <div className="form-group"><label className="form-label">{l.contact.name}</label><input type="text" name="name" className="form-input" required /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" name="email" className="form-input" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">{l.contact.goal}</label>
                  <select name="goal" className="form-select" required defaultValue="">
                    <option value="" disabled>—</option>
                    {l.contact.goals.map((g, i) => <option key={i} value={['hypertrophy','strength','fat-loss','general'][i]}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">{l.contact.exp}</label>
                  <select name="experience" className="form-select" required defaultValue="">
                    <option value="" disabled>—</option>
                    {l.contact.exps.map((e, i) => <option key={i} value={['beginner','intermediate','advanced'][i]}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">{l.contact.pkg}</label>
                <select name="package" className="form-select" defaultValue="">
                  <option value="" disabled>—</option>
                  {l.contact.pkgs.map((p, i) => <option key={i} value={['paideia','askesis','arete','inperson','unsure'][i]}>{p}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">{l.contact.more}</label><textarea name="message" className="form-textarea" /></div>
              <button type="submit" className="form-submit"><span>{l.contact.submit}</span></button>
            </form>
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
