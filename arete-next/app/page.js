'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

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
      scroll: 'PRZEWIŃ',
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
      yesItems: [
        'Chcesz trenować mądrze, nie tylko ciężko',
        'Interesujesz się nauką za treningiem',
        'Szukasz trenera który tłumaczy DLACZEGO',
        'Jesteś gotowy/a na 6-miesięczny proces',
        'Cenisz dane i systematyczność',
      ],
      noItems: [
        'Szukasz magicznej diety na 2 tygodnie',
        'Chcesz motywacyjne hasła zamiast wiedzy',
        'Potrzebujesz kogoś kto krzyczy na Ciebie',
        'Nie jesteś gotowy/a na feedback',
        'Interesuje Cię tylko waga na wadze',
      ],
    },
    packages: {
      tagline: 'PAKIETY',
      title: 'Wybierz swój tier',
      subtitle: 'Od samodzielnego planu po pełny coaching z trenerem',
      paideia: {
        name: 'PAIDEIA', greek: 'παιδεία — edukacja',
        price: '199', suffix: 'PLN · jednorazowo',
        features: ['Plan treningowy PDF', 'Arkusz logowania postępów', 'Dobór ćwiczeń + alternatywy', 'Periodyzacja na 24 tygodnie', 'Bez kontaktu z trenerem'],
      },
      askesis: {
        name: 'ASKESIS', greek: 'ἄσκησις — dyscyplina',
        price: '279', suffix: 'PLN / miesiąc', discount: '249 PLN/mies. przy 3-mies. zobowiązaniu',
        features: ['Wszystko z Paideia', 'Cele kaloryczne + białko', 'Check-in co 2 tygodnie', 'Feedback i korekty planu', 'Piramida żywieniowa Helmsa'],
      },
      arete: {
        name: 'ARETÉ', greek: 'ἀρετή — doskonałość', badge: 'POLECANY',
        price: '449', suffix: 'PLN / miesiąc', discount: '399 PLN/mies. przy 3-mies. zobowiązaniu',
        features: ['Wszystko z Askesis', 'Indywidualny plan żywieniowy', 'Cotygodniowy check-in', 'Dashboard trenera (9 zakładek)', 'Priorytetowy kontakt', 'Pełna analiza postępów'],
      },
      inperson: {
        title: 'Trening stacjonarny',
        subtitle: 'JustGYM · ul. 1 Maja 21 · Częstochowa',
        single: { label: 'POJEDYNCZA SESJA', price: '150', detail: '60 minut' },
        pack8: { label: 'PAKIET 8 SESJI', price: '130', detail: '/sesja · 1040 PLN' },
        pack12: { label: 'PAKIET 12 SESJI', price: '120', detail: '/sesja · 1440 PLN' },
      },
      cta: 'Wybierz ten pakiet',
    },
    process: {
      tagline: 'PROCES',
      title: 'Jak to działa?',
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
      tagline: 'OPINIE',
      title: 'Co mówią klienci',
      items: [
        { text: 'Pierwszy trener który mi wytłumaczył DLACZEGO robię dane ćwiczenie, a nie tylko co robić. Po 3 miesiącach widzę różnicę nie tylko w sylwetce, ale w podejściu do treningu.', name: 'Klientka · Askesis', initials: 'A.K.' },
        { text: 'Miałem za sobą 3 lata bro-splitu z internetu. Alex rozłożył to na czynniki pierwsze i zbudował program oparty na nauce. Progresja siły jak nigdy wcześniej.', name: 'Klient · Areté', initials: 'M.W.' },
        { text: 'Szukałam trenera który rozumie, że kobieta nie musi bać się ciężarów. Podejście evidence-based, pełna periodyzacja, focus na pośladki i barki. Dokładnie to czego potrzebowałam.', name: 'Klientka · Areté', initials: 'J.S.' },
      ],
      note: '* Opinie od pierwszych klientów. Sekcja będzie rozbudowywana.',
    },
    contact: {
      tagline: 'KONTAKT',
      title: 'Zacznij swoją drogę',
      desc: 'Wypełnij formularz, a skontaktuję się z Tobą w ciągu 24 godzin.',
      name: 'Imię',
      email: 'Email',
      goal: 'Cel treningowy',
      goals: ['Hipertrofia', 'Siła', 'Redukcja', 'Rekompozycja', 'Inne'],
      exp: 'Doświadczenie',
      exps: ['Początkujący (0-1 rok)', 'Średniozaawansowany (1-3 lata)', 'Zaawansowany (3+ lat)'],
      pkg: 'Interesujący pakiet',
      pkgs: ['Paideia (199 PLN)', 'Askesis (279 PLN/mies.)', 'Areté (449 PLN/mies.)', 'Stacjonarnie', 'Jeszcze nie wiem'],
      more: 'Powiedz mi więcej',
      submit: 'Wyślij zgłoszenie',
    },
    footer: {
      tagline: 'Coaching oparty na nauce',
      terms: 'Regulamin',
      privacy: 'Prywatność',
      rights: 'Wszelkie prawa zastrzeżone.',
      ip: 'Niniejsza strona stanowi własność intelektualną autora.',
    },
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
      scroll: 'SCROLL',
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
      tagline: 'PHILOSOPHY',
      title: 'Three pillars',
      items: [
        { icon: '⚗️', title: 'Science, not faith', text: 'Every training decision backed by peer-reviewed research. Schoenfeld on volume, Helms on priorities, Israetel on periodization.' },
        { icon: '🎯', title: 'Individualization', text: 'No universal plan exists. Your anatomy, goals, equipment, injuries and time — everything shapes the program.' },
        { icon: '📊', title: 'Data, not feelings', text: 'Volume tracking, RIR, load progression, check-ins — we measure everything. What isn\'t measured isn\'t managed.' },
      ],
    },
    forWho: {
      tagline: 'FOR WHOM',
      title: 'Who is Areté for?',
      yes: 'For you if:',
      no: 'Not for you if:',
      yesItems: [
        'You want to train smart, not just hard',
        'You\'re interested in the science behind training',
        'You want a coach who explains WHY',
        'You\'re ready for a 6-month process',
        'You value data and consistency',
      ],
      noItems: [
        'You want a magic 2-week diet',
        'You want motivational quotes instead of knowledge',
        'You need someone screaming at you',
        'You\'re not ready for honest feedback',
        'You only care about the number on the scale',
      ],
    },
    packages: {
      tagline: 'PACKAGES',
      title: 'Choose your tier',
      subtitle: 'From self-guided plan to full coaching with a trainer',
      paideia: {
        name: 'PAIDEIA', greek: 'παιδεία — education',
        price: '199', suffix: 'PLN · one-time',
        features: ['Training plan PDF', 'Progress tracking sheet', 'Exercise selection + alternatives', '24-week periodization', 'No trainer contact'],
      },
      askesis: {
        name: 'ASKESIS', greek: 'ἄσκησις — discipline',
        price: '279', suffix: 'PLN / month', discount: '249 PLN/mo with 3-month commitment',
        features: ['Everything from Paideia', 'Calorie + protein targets', 'Check-in every 2 weeks', 'Feedback and plan adjustments', 'Helms nutrition pyramid'],
      },
      arete: {
        name: 'ARETÉ', greek: 'ἀρετή — excellence', badge: 'RECOMMENDED',
        price: '449', suffix: 'PLN / month', discount: '399 PLN/mo with 3-month commitment',
        features: ['Everything from Askesis', 'Individual nutrition plan', 'Weekly check-in', 'Trainer dashboard (9 tabs)', 'Priority contact', 'Full progress analysis'],
      },
      inperson: {
        title: 'In-person training',
        subtitle: 'JustGYM · ul. 1 Maja 21 · Częstochowa',
        single: { label: 'SINGLE SESSION', price: '150', detail: '60 minutes' },
        pack8: { label: '8-SESSION PACK', price: '130', detail: '/session · 1040 PLN' },
        pack12: { label: '12-SESSION PACK', price: '120', detail: '/session · 1440 PLN' },
      },
      cta: 'Choose this package',
    },
    process: {
      tagline: 'PROCESS',
      title: 'How does it work?',
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
      tagline: 'TESTIMONIALS',
      title: 'What clients say',
      items: [
        { text: 'First trainer who explained WHY I\'m doing each exercise, not just what to do. After 3 months I see a difference not only in my physique, but in how I approach training.', name: 'Client · Askesis', initials: 'A.K.' },
        { text: 'I had 3 years of bro-split from the internet. Alex broke it down and built a science-based program. Strength progression like never before.', name: 'Client · Areté', initials: 'M.W.' },
        { text: 'I was looking for a trainer who understands women don\'t need to fear heavy weights. Evidence-based approach, full periodization, focus on glutes and shoulders. Exactly what I needed.', name: 'Client · Areté', initials: 'J.S.' },
      ],
      note: '* Reviews from first clients. This section will grow.',
    },
    contact: {
      tagline: 'CONTACT',
      title: 'Start your journey',
      desc: 'Fill out the form and I\'ll get back to you within 24 hours.',
      name: 'Name',
      email: 'Email',
      goal: 'Training goal',
      goals: ['Hypertrophy', 'Strength', 'Fat loss', 'Recomposition', 'Other'],
      exp: 'Experience',
      exps: ['Beginner (0-1 year)', 'Intermediate (1-3 years)', 'Advanced (3+ years)'],
      pkg: 'Package of interest',
      pkgs: ['Paideia (199 PLN)', 'Askesis (279 PLN/mo)', 'Areté (449 PLN/mo)', 'In-person', 'Not sure yet'],
      more: 'Tell me more',
      submit: 'Send application',
    },
    footer: {
      tagline: 'Evidence-based coaching',
      terms: 'Terms',
      privacy: 'Privacy',
      rights: 'All rights reserved.',
      ip: 'This website is the intellectual property of the author.',
    },
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

// ===== PARTICLES =====
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

    // Create particles — gold sparks
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += 0.02
        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse))

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${currentOpacity})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${currentOpacity * 0.15})`
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

// ===== COUNTER COMPONENT =====
function Counter({ end, duration = 1500, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        const startTime = performance.now()
        const animate = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          // Ease out
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

  return <span ref={ref} className="counter-value">{count}{suffix}</span>
}

// ===== MAIN PAGE =====
export default function Home() {
  const [lang, setLang] = useState('pl')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [heroTyped, setHeroTyped] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const heroDecoRef = useRef(null)
  const l = t[lang]

  // Scroll effects: nav shrink, progress bar, parallax
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
      // Scroll progress
      const h = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0)
      // Parallax on hero deco
      if (heroDecoRef.current) {
        heroDecoRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' })

    document.querySelectorAll('.anim-fade, .anim-fade-left, .anim-fade-right, .meander-animated').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [lang])

  // Typewriter effect for hero
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
      {/* SCROLL PROGRESS */}
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
              </div>
            </li>
            <li>
              <button className="nav-login" onClick={() => window.location.href = '/login'}>
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
            <button className="hero-cta anim-fade delay-4" onClick={() => scrollTo('contact')}>
              <span>{l.hero.cta}</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
        {/* Shield / warrior deco with parallax */}
        <div className="hero-deco" ref={heroDecoRef}>
          <svg width="400" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
            <path d="M100 30 L100 170 M30 100 L170 100" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <text x="100" y="105" textAnchor="middle" fill="currentColor" fontSize="24" fontFamily="Cormorant Garamond" opacity="0.4">ἀρετή</text>
          </svg>
        </div>
        <div className="hero-scroll">
          <span>{l.hero.scroll}</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="14" height="22" rx="7" /><line x1="8" y1="6" x2="8" y2="10" /></svg>
        </div>
      </section>

      <MeanderSVG animated />

      {/* ABOUT */}
      <section id="about" className="section section-alt">
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

      {/* EPIGRAPH */}
      <div className="epigraph anim-fade">
        «ἓν οἶδα ὅτι οὐδὲν οἶδα»
        <div className="epigraph-source">— ΣΩΚΡΆΤΗΣ</div>
      </div>

      <MeanderSVG animated />

      {/* PILLARS */}
      <section id="approach" className="section">
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
              <div className="pkg-price"><Counter end={199} /></div>
              <div className="pkg-price-suffix">{l.packages.paideia.suffix}</div>
              <ul className="pkg-features">
                {l.packages.paideia.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <button className="pkg-cta" onClick={() => scrollTo('contact')}>{l.packages.cta}</button>
            </div>

            {/* ASKESIS */}
            <div className="pkg-card anim-fade delay-3">
              <div className="pkg-name">{l.packages.askesis.name}</div>
              <div className="pkg-greek">{l.packages.askesis.greek}</div>
              <div className="pkg-price"><Counter end={279} /></div>
              <div className="pkg-price-suffix">{l.packages.askesis.suffix}</div>
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
              <div className="pkg-price"><Counter end={449} /></div>
              <div className="pkg-price-suffix">{l.packages.arete.suffix}</div>
              <div className="pkg-discount">{l.packages.arete.discount}</div>
              <ul className="pkg-features">
                {l.packages.arete.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <button className="pkg-cta" onClick={() => scrollTo('contact')}>{l.packages.cta}</button>
            </div>
          </div>

          {/* IN-PERSON */}
          <div className="anim-fade delay-3">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>{l.packages.inperson.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{l.packages.inperson.subtitle}</p>
            <div className="inperson-card">
              <div>
                <div className="inperson-item-label">{l.packages.inperson.single.label}</div>
                <div className="inperson-item-price"><Counter end={150} /></div>
                <div className="inperson-item-detail">{l.packages.inperson.single.detail}</div>
              </div>
              <div>
                <div className="inperson-item-label">{l.packages.inperson.pack8.label}</div>
                <div className="inperson-item-price"><Counter end={130} /></div>
                <div className="inperson-item-detail">{l.packages.inperson.pack8.detail}</div>
              </div>
              <div>
                <div className="inperson-item-label">{l.packages.inperson.pack12.label}</div>
                <div className="inperson-item-price"><Counter end={120} /></div>
                <div className="inperson-item-detail">{l.packages.inperson.pack12.detail}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MeanderSVG animated />

      {/* PROCESS */}
      <section id="process" className="section section-alt">
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

      {/* EPIGRAPH 2 */}
      <div className="epigraph anim-fade">
        «γνῶθι σεαυτόν»
        <div className="epigraph-source">— ΔΕΛΦΟΊ</div>
      </div>

      <MeanderSVG animated />

      {/* TESTIMONIALS */}
      <section className="section">
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
