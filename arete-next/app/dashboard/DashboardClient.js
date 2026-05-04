'use client'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function DashboardClient({ profile, clients }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const tiers = { paideia: 'Paideia', askesis: 'Askesis', arete: 'Areté', inperson: 'Stacjonarny' }
  const statuses = { active: '🟢', paused: '🟡', completed: '⚪', lead: '🔵' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top bar */}
      <div style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
      }}>
        <div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--gold)', letterSpacing: '0.3em' }}>ARETÉ</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '1rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Panel trenera</span>
        </div>
        <button onClick={handleLogout} style={{
          background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)',
          padding: '0.4rem 1rem', fontSize: '0.7rem', letterSpacing: '0.1em', cursor: 'pointer',
          fontFamily: 'var(--font-body)', textTransform: 'uppercase',
        }}>Wyloguj</button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { label: 'Aktywni klienci', value: clients.filter(c => c.status === 'active').length },
            { label: 'Leady', value: clients.filter(c => c.status === 'lead').length },
            { label: 'Wszystkich', value: clients.length },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.5rem',
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{stat.label}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Client list */}
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Klienci</h2>

        {clients.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '3rem',
            textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem',
          }}>
            Brak klientów. Pierwszy klient pojawi się tutaj po rejestracji.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {clients.map(client => (
              <div key={client.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.25rem 1.5rem',
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center', gap: '1rem',
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{client.full_name || 'Bez nazwy'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client.email}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {tiers[client.package_tier] || '—'}
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  {statuses[client.status] || '⚪'} {client.status}
                </div>
                <button style={{
                  background: 'none', border: '1px solid var(--gold-dim)', color: 'var(--gold)',
                  padding: '0.35rem 1rem', fontSize: '0.7rem', letterSpacing: '0.1em',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', textTransform: 'uppercase',
                }}>Szczegóły</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
