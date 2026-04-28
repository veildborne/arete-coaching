'use client'

import { useRouter } from 'next/navigation'

const TIER = {
  paideia: { label: 'Paideia', color: '#A07848', bg: 'rgba(160,120,72,0.12)', border: 'rgba(160,120,72,0.3)' },
  askesis: { label: 'Askesis', color: '#C05000', bg: 'rgba(192,80,0,0.12)',   border: 'rgba(192,80,0,0.3)'   },
  arete:   { label: 'Areté',   color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.3)' },
}

const STATUS = {
  active:    { label: 'Aktywny',     color: '#52B788' },
  paused:    { label: 'Wstrzymany',  color: '#E8A020' },
  inactive:  { label: 'Nieaktywny', color: '#A07848' },
  lead:      { label: 'Lead',        color: '#64B5F6' },
  completed: { label: 'Zakończony',  color: '#666'    },
}

function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(' ')
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase()
  }
  return (email || '??').slice(0, 2).toUpperCase()
}

function ClientCard({ client, onClick }) {
  const tier   = TIER[client.package_tier?.toLowerCase()] || { label: client.package_tier || '—', color: '#A07848', bg: 'rgba(160,120,72,0.08)', border: 'rgba(160,120,72,0.2)' }
  const status = STATUS[client.status] || STATUS.lead
  const initials = getInitials(client.full_name, client.email)

  return (
    <div
      onClick={onClick}
      style={{
        background: '#1E0F00',
        border: '1px solid rgba(192,80,0,0.2)',
        borderRadius: 12,
        padding: '20px 22px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(192,80,0,0.55)'
        e.currentTarget.style.background = '#251200'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(192,80,0,0.2)'
        e.currentTarget.style.background = '#1E0F00'
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${tier.color}50, transparent)`,
      }} />

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: tier.bg, border: `1px solid ${tier.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 17, fontWeight: 700, color: tier.color, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 15, fontWeight: 500, color: '#F2EEE8',
            fontFamily: "'Outfit', sans-serif",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {client.full_name || '—'}
          </div>
          <div style={{
            fontSize: 12, color: '#A07848', marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {client.email}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Tier */}
        <span style={{
          fontSize: 10, padding: '3px 10px', borderRadius: 99,
          background: tier.bg, border: `1px solid ${tier.border}`,
          color: tier.color, letterSpacing: '0.08em', fontWeight: 600,
          textTransform: 'uppercase',
        }}>
          {tier.label}
        </span>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: status.color,
            boxShadow: `0 0 6px ${status.color}80`,
          }} />
          <span style={{ fontSize: 11, color: status.color }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Phone */}
      {client.phone && (
        <div style={{ fontSize: 11, color: '#A07848', opacity: 0.6, marginTop: 12 }}>
          {client.phone}
        </div>
      )}
    </div>
  )
}

export default function DashboardClient({ profile, clients }) {
  const router = useRouter()

  const active   = clients.filter(c => c.status === 'active').length
  const leads    = clients.filter(c => c.status === 'lead').length

  return (
    <div style={{
      minHeight: '100vh',
      background: '#140900',
      color: '#F2EEE8',
      fontFamily: "'Outfit', system-ui, sans-serif",
    }}>

      {/* Topbar */}
      <header style={{
        borderBottom: '1px solid rgba(192,80,0,0.2)',
        padding: '0 28px', height: 56,
        display: 'flex', alignItems: 'center', gap: 16,
        position: 'sticky', top: 0,
        background: 'rgba(20,9,0,0.96)',
        backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20, fontWeight: 700, color: '#D4AF37', letterSpacing: '0.12em',
        }}>
          ARETÉ
        </span>
        <span style={{
          fontSize: 9, padding: '2px 7px', borderRadius: 99,
          border: '1px solid rgba(212,175,55,0.25)',
          color: '#8a7d5a', letterSpacing: '0.1em',
        }}>
          BETA
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#A07848' }}>
          {profile?.full_name || profile?.email}
        </span>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px' }}>

        {/* Page header */}
        <div style={{
          borderBottom: '1px solid rgba(192,80,0,0.2)',
          paddingBottom: 24, marginBottom: 32,
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.3em', color: '#C05000',
            textTransform: 'uppercase', marginBottom: 6, margin: '0 0 6px',
          }}>
            Panel Trenera
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 36, fontWeight: 600, color: '#F2EEE8',
            margin: '0 0 8px',
          }}>
            Twoi Klienci
          </h1>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Wszyscy',  value: clients.length,  color: '#A07848' },
              { label: 'Aktywni', value: active,           color: '#52B788' },
              { label: 'Leady',   value: leads,            color: '#64B5F6' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 600, color: s.color,
                  fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 11, color: '#A07848', letterSpacing: '0.05em' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {clients.length === 0 && (
          <div style={{
            border: '1px dashed rgba(192,80,0,0.2)',
            borderRadius: 12, padding: '64px 24px', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28, color: '#A07848', marginBottom: 8,
            }}>
              Brak klientów
            </div>
            <div style={{ fontSize: 13, color: '#A07848', opacity: 0.6 }}>
              Dodaj pierwszego klienta w Supabase → Table Editor → profiles
            </div>
          </div>
        )}

        {/* Grid */}
        {clients.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {clients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={() => router.push(`/dashboard/client/${client.id}`)}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}