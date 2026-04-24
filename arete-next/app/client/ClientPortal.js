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
    for (let i = 0; i < 22; i++) {
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

// ===== MEANDER =====
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

// ===== PROGRESS RING =====
function ProgressRing({ value, max, label }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const r = 45
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div style={{ position: 'relative', width: '110px', height: '110px' }}>
      <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(184,166,119,0.1)" strokeWidth="4" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="4"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4c494" />
            <stop offset="100%" stopColor="#b8a677" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 700,
          color: '#d4c494', lineHeight: 1,
        }}>{value}<span style={{ fontSize: '0.9rem', opacity: 0.5 }}>/{max}</span></div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(160,160,160,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

export default function ClientPortal({ profile, activePlan, recentLogs }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const tiers = {
    paideia: { name: 'Paideia', greek: 'παιδεία', color: '#8a9db8' },
    askesis: { name: 'Askesis', greek: 'ἄσκησις', color: '#b8a677' },
    arete: { name: 'Areté', greek: 'ἀρετή', color: '#d4c494' },
    inperson: { name: 'Stacjonarny', greek: 'κατ᾽ἰδίαν', color: '#a0a0a0' },
  }

  const tier = tiers[profile?.package_tier] || { name: 'Nie przypisano', greek: '—', color: '#8a9db8' }
  const firstName = profile?.full_name?.split(' ')[0] || 'Wojowniku'

  const weekProgress = activePlan
    ? { current: activePlan.current_week || 0, max: activePlan.mesocycle_weeks || 6 }
    : { current: 0, max: 6 }

  const weekSessions = recentLogs.filter(log => {
    if (!log.session_date) return false
    const date = new Date(log.session_date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date > weekAgo
  }).length

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
          }}>Twój Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#e8e8e8', fontWeight: 500 }}>
              {profile?.full_name || 'Klient'}
            </div>
            <div style={{
              fontSize: '0.7rem', color: tier.color,
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
            }}>
              {tier.name}
            </div>
          </div>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}99 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#0f1a2e',
            fontSize: '1rem',
          }}>
            {firstName.charAt(0).toUpperCase()}
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

      {/* MAIN */}
      <main style={{
        maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem 4rem',
        position: 'relative', zIndex: 1,
      }}>
        {/* HERO WELCOME */}
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
            {tier.greek} · χαῖρε
          </div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '2.25rem', fontWeight: 600,
            margin: 0, letterSpacing: '0.02em',
          }}>
            Witaj, <span style={{ color: '#d4c494' }}>{firstName}</span>
          </h1>
          <p style={{ color: 'rgba(160,160,160,0.7)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* PLAN OVERVIEW CARD */}
        <div style={{
          background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
          border: '1px solid rgba(184,166,119,0.2)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.7s 0.1s',
        }}>
          {/* Gold top accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, #d4c494 50%, transparent)',
          }} />

          {activePlan ? (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto',
              alignItems: 'center', gap: '2rem',
            }}>
              <div>
                <div style={{
                  fontSize: '0.65rem', color: 'rgba(184,166,119,0.6)',
                  letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem',
                }}>Twój aktualny plan</div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 600,
                  color: '#e8e8e8', margin: 0, marginBottom: '0.5rem',
                }}>{activePlan.name}</h2>
                <p style={{ fontSize: '0.9rem', color: 'rgba(160,160,160,0.8)', marginBottom: '1rem' }}>
                  Mezocykl {weekProgress.current}/{weekProgress.max} tygodni
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
                    color: '#0f1a2e', border: 'none',
                    padding: '0.75rem 1.5rem', borderRadius: '8px',
                    fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                    textTransform: 'uppercase',
                    transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                  >Zobacz plan →</button>
                  <button style={{
                    background: 'transparent', color: '#b8a677',
                    border: '1px solid rgba(184,166,119,0.3)',
                    padding: '0.75rem 1.5rem', borderRadius: '8px',
                    fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                    textTransform: 'uppercase',
                  }}>Historia</button>
                </div>
              </div>
              <ProgressRing value={weekProgress.current} max={weekProgress.max} label="Tydzień" />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem',
                color: 'rgba(184,166,119,0.3)', lineHeight: 1, marginBottom: '1rem',
              }}>∮</div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem',
                fontWeight: 600, color: '#e8e8e8', margin: 0, marginBottom: '0.5rem',
              }}>Plan treningowy w przygotowaniu</h3>
              <p style={{ color: 'rgba(160,160,160,0.6)', fontSize: '0.9rem' }}>
                Twój spersonalizowany plan pojawi się tutaj gdy trener go przygotuje.
              </p>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem',
          marginBottom: '2rem',
        }}>
          {[
            { icon: '⚡', label: 'Loguj trening', sub: 'Nowa sesja', disabled: false, href: '/client/workout' },
            { icon: '◈', label: 'Check-in', sub: 'Cotygodniowy', disabled: true },
            { icon: '△', label: 'Statystyki', sub: 'Postępy', disabled: true },
            { icon: '◉', label: 'Żywienie', sub: 'Makro dnia', disabled: true },
          ].map((action, i) => (
            <button key={i} disabled={action.disabled} onClick={() => action.href && router.push(action.href)} style={{
              background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
              border: '1px solid rgba(184,166,119,0.15)',
              borderRadius: '12px', padding: '1.25rem 1rem',
              cursor: action.disabled ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              opacity: action.disabled ? 0.5 : 1,
              transition: 'all 0.25s',
              fontFamily: 'Outfit, sans-serif',
              color: '#e8e8e8',
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transitionDelay: `${i * 50 + 200}ms`,
            }}
              onMouseEnter={e => {
                if (action.disabled) return
                e.currentTarget.style.borderColor = 'rgba(184,166,119,0.4)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                if (action.disabled) return
                e.currentTarget.style.borderColor = 'rgba(184,166,119,0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                fontSize: '1.5rem', color: '#b8a677', marginBottom: '0.5rem',
                fontFamily: 'Cormorant Garamond, serif',
              }}>{action.icon}</div>
              <div style={{
                fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase', marginBottom: '0.15rem',
              }}>{action.label}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(160,160,160,0.6)' }}>
                {action.disabled ? 'wkrótce' : action.sub}
              </div>
            </button>
          ))}
        </div>

        <Meander />

        {/* STATS GRID */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
          marginBottom: '2rem', marginTop: '2rem',
        }}>
          {/* Recent sessions */}
          <div style={{
            background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
            border: '1px solid rgba(184,166,119,0.12)',
            borderRadius: '12px', padding: '1.75rem',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: '1.25rem',
            }}>
              <div>
                <div style={{
                  fontSize: '0.65rem', color: 'rgba(184,166,119,0.6)',
                  letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem',
                }}>Ostatnie treningi</div>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.25rem', fontWeight: 600, color: '#e8e8e8',
                }}>Sesje</div>
              </div>
              <div style={{
                background: 'rgba(184,166,119,0.1)', padding: '0.3rem 0.7rem',
                borderRadius: '99px', fontSize: '0.7rem', color: '#d4c494',
                letterSpacing: '0.1em', fontWeight: 500,
              }}>
                {weekSessions} w tym tyg.
              </div>
            </div>
            {recentLogs.length === 0 ? (
              <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem',
                  color: 'rgba(184,166,119,0.25)', lineHeight: 1, marginBottom: '0.5rem',
                }}>○</div>
                <p style={{ color: 'rgba(160,160,160,0.6)', fontSize: '0.85rem' }}>
                  Brak zalogowanych treningów.<br />Zacznij logować żeby śledzić postępy.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {recentLogs.slice(0, 5).map(log => (
                  <div key={log.id} style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(184,166,119,0.04)',
                    borderRadius: '8px',
                    borderLeft: '2px solid rgba(184,166,119,0.4)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#e8e8e8', fontWeight: 500 }}>
                      {log.day_label || 'Trening'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(160,160,160,0.6)' }}>
                      {log.session_date ? new Date(log.session_date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Philosophy / Motivation */}
          <div style={{
            background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
            border: '1px solid rgba(184,166,119,0.12)',
            borderRadius: '12px', padding: '1.75rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', right: '-40px', bottom: '-40px',
              fontFamily: 'Cormorant Garamond, serif', fontSize: '8rem',
              color: 'rgba(184,166,119,0.04)', lineHeight: 1, fontStyle: 'italic',
            }}>ἀ</div>
            <div style={{
              fontSize: '0.65rem', color: 'rgba(184,166,119,0.6)',
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem',
            }}>Maksyma dnia</div>
            <blockquote style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.25rem', lineHeight: 1.5, color: '#e8e8e8',
              fontStyle: 'italic', margin: 0, position: 'relative', zIndex: 1,
            }}>
              "Ἀρχὴ ἥμισυ παντός"
            </blockquote>
            <p style={{
              fontSize: '0.8rem', color: 'rgba(160,160,160,0.7)',
              marginTop: '0.75rem', lineHeight: 1.5, position: 'relative', zIndex: 1,
            }}>
              Początek to połowa wszystkiego.
            </p>
            <div style={{
              fontSize: '0.7rem', color: 'rgba(184,166,119,0.5)',
              marginTop: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              position: 'relative', zIndex: 1,
            }}>— Πυθαγόρας</div>
          </div>
        </div>
      </main>
    </div>
  )
}