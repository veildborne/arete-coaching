'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TIER_COLORS = {
  paideia: { color: '#a07850', bg: 'rgba(160,120,80,0.12)', border: 'rgba(160,120,80,0.3)' },
  askesis: { color: '#8a9db5', bg: 'rgba(138,157,181,0.12)', border: 'rgba(138,157,181,0.3)' },
  arete:   { color: '#b8a677', bg: 'rgba(184,166,119,0.12)', border: 'rgba(184,166,119,0.35)' },
}
const STATUS_COLORS = {
  active:    { color: '#4caf50', label: 'Aktywny' },
  paused:    { color: '#e8a020', label: 'Wstrzymany' },
  completed: { color: '#8a9db5', label: 'Zakończony' },
  lead:      { color: '#64b5f6', label: 'Lead' },
}

function getInitials(name, email) {
  if (name) {
    const p = name.trim().split(' ')
    return p.length >= 2 ? (p[0][0] + p[p.length-1][0]).toUpperCase() : name.slice(0,2).toUpperCase()
  }
  return (email || '??').slice(0,2).toUpperCase()
}

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Pill({ children, color, bg, border }) {
  return (
    <span style={{
      fontSize: 11, padding: '3px 10px', borderRadius: 99,
      background: bg || 'rgba(255,255,255,0.05)',
      border: `1px solid ${border || 'rgba(255,255,255,0.12)'}`,
      color: color || '#a0a0a0', fontWeight: 500, letterSpacing: '0.04em',
    }}>{children}</span>
  )
}

function Section({ title, children, action }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 18, fontWeight: 600, color: '#e8e8e8', margin: 0,
        }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div style={{
      padding: '32px 20px', textAlign: 'center',
      border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10,
      color: '#444', fontSize: 13,
    }}>
      <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.3 }}>∅</div>
      {text}
    </div>
  )
}

export default function ClientDetail({ client, plans, logs, checkins, coachName }) {
  const router = useRouter()
  const [tab, setTab] = useState('plans')

  const tier = TIER_COLORS[client.package_tier?.toLowerCase()] || {}
  const status = STATUS_COLORS[client.status] || STATUS_COLORS.lead
  const initials = getInitials(client.full_name, client.email)

  const TABS = [
    { id: 'plans',    label: 'Plany treningowe', count: plans.length },
    { id: 'logs',     label: 'Historia treningów', count: logs.length },
    { id: 'checkins', label: 'Check-iny', count: checkins.length },
  ]

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f',
      color: '#e8e8e8', fontFamily: "'Outfit', system-ui, sans-serif",
    }}>

      {/* Topbar */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 28px', height: 56,
        display: 'flex', alignItems: 'center', gap: 16,
        position: 'sticky', top: 0,
        background: 'rgba(15,15,15,0.95)',
        backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20, fontWeight: 700, color: '#b8a677', letterSpacing: '0.1em',
        }}>ARETÉ</span>
        <span style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 99,
          border: '1px solid rgba(184,166,119,0.3)', color: '#8a7d5a', letterSpacing: '0.07em',
        }}>BETA</span>
        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 16 }}>|</span>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            fontSize: 13, color: '#666', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.target.style.color = '#b8a677'}
          onMouseLeave={e => e.target.style.color = '#666'}
        >← Klienci</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#555' }}>{coachName}</span>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

        {/* Client card */}
        <div style={{
          background: 'linear-gradient(135deg, #131f36 0%, #0f1a2e 100%)',
          border: '1px solid rgba(184,166,119,0.15)',
          borderRadius: 14, padding: '24px 28px',
          marginBottom: 28, position: 'relative', overflow: 'hidden',
        }}>
          {/* gold top line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(184,166,119,0.4), transparent)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: tier.bg || 'rgba(255,255,255,0.05)',
              border: `1px solid ${tier.border || 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 700, color: tier.color || '#888',
              flexShrink: 0,
            }}>{initials}</div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22, fontWeight: 600, color: '#e8e8e8', margin: 0,
                }}>{client.full_name || 'Bez nazwy'}</h1>
                {client.package_tier && (
                  <Pill color={tier.color} bg={tier.bg} border={tier.border}>
                    {client.package_tier.charAt(0).toUpperCase() + client.package_tier.slice(1)}
                  </Pill>
                )}
                <Pill color={status.color} bg={`${status.color}15`} border={`${status.color}40`}>
                  {status.label}
                </Pill>
              </div>
              <div style={{ fontSize: 13, color: '#555', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>{client.email}</span>
                {client.phone && <span>{client.phone}</span>}
                <span>Dołączył: {formatDate(client.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 24,
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontSize: 13, padding: '9px 16px',
              borderBottom: `2px solid ${tab === t.id ? '#b8a677' : 'transparent'}`,
              color: tab === t.id ? '#b8a677' : '#555',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${tab === t.id ? '#b8a677' : 'transparent'}`,
              cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              transition: 'color 0.15s', marginBottom: -1,
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              {t.label}
              {t.count > 0 && (
                <span style={{
                  fontSize: 10, padding: '1px 6px', borderRadius: 99,
                  background: tab === t.id ? 'rgba(184,166,119,0.15)' : 'rgba(255,255,255,0.05)',
                  color: tab === t.id ? '#b8a677' : '#444',
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* PLANS TAB */}
        {tab === 'plans' && (
          <Section title="Plany treningowe" action={
            <button style={{
              fontSize: 12, padding: '7px 16px', borderRadius: 99,
              border: '1px solid rgba(184,166,119,0.3)', background: 'transparent',
              color: '#b8a677', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,166,119,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >+ Nowy plan</button>
          }>
            {plans.length === 0 ? (
              <EmptyState text="Brak planów. Kliknij '+ Nowy plan' żeby dodać pierwszy." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plans.map(plan => (
                  <div key={plan.id} style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '14px 18px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,166,119,0.2)'; e.currentTarget.style.background = '#1e1e1e' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#1a1a1a' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#e8e8e8', marginBottom: 4 }}>
                        {plan.name || 'Plan bez nazwy'}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {plan.split && <Pill>{plan.split}</Pill>}
                        {plan.goal  && <Pill>{plan.goal}</Pill>}
                      </div>
                    </div>
                    <span style={{ color: '#333', fontSize: 14 }}>›</span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* LOGS TAB */}
        {tab === 'logs' && (
          <Section title="Historia treningów">
            {logs.length === 0 ? (
              <EmptyState text="Brak zalogowanych treningów." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {logs.map(log => (
                  <div key={log.id} style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '12px 18px',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(184,166,119,0.08)',
                      border: '1px solid rgba(184,166,119,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600, color: '#b8a677', flexShrink: 0,
                    }}>
                      {log.day_label || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#e8e8e8' }}>
                        Dzień {log.day_label || '—'}
                      </div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                        {formatDate(log.session_date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* CHECKINS TAB */}
        {tab === 'checkins' && (
          <Section title="Check-iny">
            {checkins.length === 0 ? (
              <EmptyState text="Brak check-inów. Klient jeszcze nie wysłał żadnego." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {checkins.map(ci => (
                  <div key={ci.id} style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '14px 18px',
                  }}>
                    <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>
                      {formatDate(ci.created_at)}
                    </div>
                    <pre style={{
                      fontSize: 12, color: '#a0a0a0',
                      whiteSpace: 'pre-wrap', fontFamily: "'Outfit', sans-serif",
                      margin: 0, lineHeight: 1.6,
                    }}>
                      {JSON.stringify(ci, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

      </main>
    </div>
  )
}