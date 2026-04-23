'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

// ===== FIREFLY PARTICLES =====
function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.4 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.012 + 0.008,
      })
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY; p.pulse += p.pulseSpeed
        const pf = 0.4 + 0.6 * Math.abs(Math.sin(p.pulse))
        const op = p.opacity * pf
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
        grad.addColorStop(0, `rgba(232, 200, 74, ${op * 0.3})`)
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)')
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 200, 74, ${op})`; ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.6 }} />
}

// ===== STAT CARD with counter animation =====
function StatCard({ label, value, icon, delay = 0 }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  useEffect(() => {
    if (!visible) return
    const duration = 1200
    const start = performance.now()
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * value))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, value])

  return (
    <div style={{
      background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
      border: '1px solid rgba(184,166,119,0.15)',
      borderRadius: '12px',
      padding: '1.5rem 1.75rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.5s, transform 0.5s',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,166,119,0.4), transparent)',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: 'rgba(184,166,119,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.1rem', opacity: 0.4 }}>{icon}</div>
      </div>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '2.5rem', fontWeight: 700,
        background: 'linear-gradient(135deg, #d4c494 0%, #b8a677 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1,
      }}>
        {count}
      </div>
    </div>
  )
}

// ===== MEANDER DIVIDER =====
function Meander() {
  const pattern = "M0,10 L5,10 L5,5 L10,5 L10,15 L15,15 L15,5 L20,5 L20,10 L25,10 L25,5 L30,5 L30,15 L35,15 L35,5 L40,5 L40,10"
  const fullPath = Array.from({ length: 20 }, (_, i) =>
    pattern.replace(/(\d+)/g, (m) => parseInt(m) + i * 40)
  ).join(' ')
  return (
    <div style={{ width: '100%', height: '20px', margin: '1rem 0', opacity: 0.15 }}>
      <svg viewBox="0 0 800 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path d={fullPath} fill="none" stroke="#b8a677" strokeWidth="0.8" />
      </svg>
    </div>
  )
}

export default function DashboardClient({ profile, clients }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('clients')
  const [visible, setVisible] = useState(false)

  useEffect(() => { setVisible(true) }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const tiers = { paideia: 'Paideia', askesis: 'Askesis', arete: 'Areté', inperson: 'Stacjonarny' }
  const tierColors = {
    paideia: '#8a9db8',
    askesis: '#b8a677',
    arete: '#d4c494',
    inperson: '#a0a0a0',
  }
  const statusConfig = {
    active: { label: 'Aktywny', color: '#4caf50', dot: '#4caf50' },
    paused: { label: 'Wstrzymany', color: '#e8a020', dot: '#e8a020' },
    completed: { label: 'Zakończony', color: '#8a9db8', dot: '#8a9db8' },
    lead: { label: 'Lead', color: '#64b5f6', dot: '#64b5f6' },
  }

  const filteredClients = clients.filter(c => {
    const matchSearch = !search || (c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const stats = {
    active: clients.filter(c => c.status === 'active').length,
    leads: clients.filter(c => c.status === 'lead').length,
    total: clients.length,
    revenue: clients.filter(c => c.status === 'active').reduce((sum, c) => {
      const prices = { paideia: 0, askesis: 279, arete: 449, inperson: 0 }
      return sum + (prices[c.package_tier] || 0)
    }, 0),
  }

  const sideItems = [
    { id: 'clients', label: 'Klienci', icon: '◉' },
    { id: 'programs', label: 'Programy', icon: '△', disabled: true },
    { id: 'checkins', label: 'Check-iny', icon: '◈', disabled: true },
    { id: 'library', label: 'Biblioteka', icon: '⚗', disabled: true },
    { id: 'analytics', label: 'Analityka', icon: '◎', disabled: true },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      color: '#e8e8e8',
      fontFamily: 'Outfit, sans-serif',
      position: 'relative',
    }}>
      <Particles />

      {/* TOP BAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(184,166,119,0.15)',
        padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem',
            color: '#d4c494', letterSpacing: '0.35em', fontWeight: 600,
          }}>ARETÉ</span>
          <span style={{
            fontSize: '0.65rem', color: 'rgba(184,166,119,0.5)',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            paddingLeft: '1.5rem', borderLeft: '1px solid rgba(184,166,119,0.2)',
          }}>Panel Trenera</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#e8e8e8', fontWeight: 500 }}>
              {profile?.full_name || 'Trener'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(184,166,119,0.6)', letterSpacing: '0.1em' }}>
              COACH
            </div>
          </div>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #b8a677 0%, #8a7d5a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#0f1a2e',
            fontSize: '1rem',
          }}>
            {(profile?.full_name || 'C').charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} style={{
            background: 'transparent',
            border: '1px solid rgba(184,166,119,0.3)', color: 'rgba(184,166,119,0.7)',
            padding: '0.5rem 1rem', borderRadius: '6px',
            fontSize: '0.7rem', letterSpacing: '0.15em', cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.borderColor = '#b8a677'; e.target.style.color = '#d4c494' }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(184,166,119,0.3)'; e.target.style.color = 'rgba(184,166,119,0.7)' }}
          >Wyloguj</button>
        </div>
      </nav>

      {/* LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0, position: 'relative', zIndex: 1 }}>
        {/* SIDEBAR */}
        <aside style={{
          minHeight: 'calc(100vh - 73px)',
          padding: '2rem 1rem',
          borderRight: '1px solid rgba(184,166,119,0.1)',
          background: 'rgba(10,14,26,0.4)',
        }}>
          <div style={{
            fontSize: '0.65rem', color: 'rgba(184,166,119,0.5)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '0 0.75rem', marginBottom: '0.75rem',
          }}>Menu</div>
          {sideItems.map(item => (
            <button key={item.id} onClick={() => !item.disabled && setActiveTab(item.id)}
              disabled={item.disabled}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem', marginBottom: '0.25rem',
                background: activeTab === item.id ? 'rgba(184,166,119,0.1)' : 'transparent',
                border: 'none', borderLeft: activeTab === item.id ? '2px solid #b8a677' : '2px solid transparent',
                color: item.disabled ? 'rgba(160,160,160,0.3)' : activeTab === item.id ? '#d4c494' : '#a0a0a0',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif',
                letterSpacing: '0.05em', textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!item.disabled && activeTab !== item.id) e.target.style.color = '#e8e8e8' }}
              onMouseLeave={e => { if (!item.disabled && activeTab !== item.id) e.target.style.color = '#a0a0a0' }}
            >
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.disabled && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: 'rgba(184,166,119,0.4)' }}>wkrótce</span>}
            </button>
          ))}
        </aside>

        {/* MAIN */}
        <main style={{ padding: '2.5rem 2.5rem 4rem', maxWidth: '1400px' }}>
          {/* WELCOME */}
          <div style={{
            marginBottom: '2.5rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'all 0.6s',
          }}>
            <div style={{
              fontSize: '0.7rem', color: 'rgba(184,166,119,0.5)',
              letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>
              ἡγεμονία · leadership
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '2.25rem', fontWeight: 600,
              margin: 0, letterSpacing: '0.02em',
            }}>
              Witaj z powrotem, <span style={{ color: '#d4c494' }}>{profile?.full_name?.split(' ')[0] || 'Trenerze'}</span>
            </h1>
            <p style={{ color: 'rgba(160,160,160,0.7)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* STATS */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
            marginBottom: '2rem',
          }}>
            <StatCard label="Aktywni klienci" value={stats.active} icon="◉" delay={100} />
            <StatCard label="Leady" value={stats.leads} icon="◈" delay={200} />
            <StatCard label="Wszystkich" value={stats.total} icon="△" delay={300} />
            <StatCard label="Przychód / mies (PLN)" value={stats.revenue} icon="⚜" delay={400} />
          </div>

          <Meander />

          {/* CLIENTS SECTION */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '1.5rem', marginTop: '2rem',
          }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 600,
              margin: 0,
            }}>Klienci</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Szukaj po imieniu lub emailu..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(184,166,119,0.2)',
                  color: '#e8e8e8', padding: '0.55rem 0.9rem',
                  borderRadius: '8px', outline: 'none',
                  fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif',
                  width: '280px', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
              />
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(184,166,119,0.2)',
                color: '#e8e8e8', padding: '0.55rem 0.9rem',
                borderRadius: '8px', outline: 'none',
                fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
              }}>
                <option value="all">Wszystkie statusy</option>
                <option value="active">Aktywni</option>
                <option value="lead">Leady</option>
                <option value="paused">Wstrzymani</option>
                <option value="completed">Zakończeni</option>
              </select>
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div style={{
              background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
              border: '1px dashed rgba(184,166,119,0.2)',
              borderRadius: '12px',
              padding: '4rem 2rem', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem',
                color: 'rgba(184,166,119,0.3)', lineHeight: 1, marginBottom: '1rem',
              }}>∅</div>
              <p style={{ color: 'rgba(160,160,160,0.7)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {clients.length === 0 ? 'Brak klientów.' : 'Brak wyników dla tych filtrów.'}
              </p>
              <p style={{ color: 'rgba(160,160,160,0.4)', fontSize: '0.8rem' }}>
                {clients.length === 0 ? 'Pierwszy klient pojawi się tutaj po rejestracji.' : 'Spróbuj zmienić kryteria wyszukiwania.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {filteredClients.map((client, i) => {
                const status = statusConfig[client.status] || statusConfig.lead
                return (
                  <div key={client.id} style={{
                    background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
                    border: '1px solid rgba(184,166,119,0.1)',
                    borderRadius: '10px', padding: '1.1rem 1.5rem',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto',
                    alignItems: 'center', gap: '1rem',
                    transition: 'all 0.25s',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(8px)',
                    transitionDelay: `${i * 40}ms`,
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(184,166,119,0.35)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(184,166,119,0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${tierColors[client.package_tier] || '#8a9db8'} 0%, ${tierColors[client.package_tier] || '#8a9db8'}99 100%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Cormorant Garamond, serif', fontWeight: 700,
                        color: '#0f1a2e', fontSize: '0.9rem',
                      }}>
                        {(client.full_name || client.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#e8e8e8' }}>
                          {client.full_name || 'Bez nazwy'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(160,160,160,0.6)' }}>
                          {client.email}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.78rem', fontWeight: 500,
                      color: tierColors[client.package_tier] || '#a0a0a0',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                      {tiers[client.package_tier] || '—'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: status.dot, boxShadow: `0 0 8px ${status.dot}`,
                      }} />
                      <span style={{ fontSize: '0.8rem', color: status.color, fontWeight: 500 }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(160,160,160,0.5)' }}>
                      {client.created_at ? new Date(client.created_at).toLocaleDateString('pl-PL') : '—'}
                    </div>
                    <button style={{
                      background: 'transparent',
                      border: '1px solid rgba(184,166,119,0.3)',
                      color: '#b8a677',
                      padding: '0.45rem 1.1rem', borderRadius: '6px',
                      fontSize: '0.7rem', letterSpacing: '0.12em',
                      cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                      textTransform: 'uppercase', fontWeight: 500,
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => {
                        e.target.style.background = 'rgba(184,166,119,0.1)'
                        e.target.style.color = '#d4c494'
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = 'transparent'
                        e.target.style.color = '#b8a677'
                      }}
                    >Szczegóły →</button>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}