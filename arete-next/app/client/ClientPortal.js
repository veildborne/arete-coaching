'use client'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function ClientPortal({ profile, activePlan, recentLogs }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const tiers = { paideia: 'Paideia', askesis: 'Askesis', arete: 'Areté' }

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
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '1rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Twój panel</span>
        </div>
        <button onClick={handleLogout} style={{
          background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)',
          padding: '0.4rem 1rem', fontSize: '0.7rem', letterSpacing: '0.1em', cursor: 'pointer',
          fontFamily: 'var(--font-body)', textTransform: 'uppercase',
        }}>Wyloguj</button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem',
          }}>
            Cześć, <span style={{ color: 'var(--gold)' }}>{profile?.full_name || 'Wojowniku'}</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Pakiet: {tiers[profile?.package_tier] || 'Nie przypisano'}
          </p>
        </div>

        {/* Active plan */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '2rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--gold-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Aktualny plan</div>
          {activePlan ? (
            <>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>{activePlan.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Tydzień {activePlan.current_week} / {activePlan.mesocycle_weeks} mezocyklu
              </p>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Twój plan treningowy pojawi się tutaj gdy trener go przypisze.
            </p>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.5rem',
            textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.3s',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏋️</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Zaloguj trening</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Wkrótce</div>
          </div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.5rem',
            textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.3s',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Check-in</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Wkrótce</div>
          </div>
        </div>

        {/* Recent logs */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '2rem',
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--gold-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Ostatnie treningi</div>
          {recentLogs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Brak zalogowanych treningów. Zacznij logować żeby śledzić postępy.
            </p>
          ) : (
            recentLogs.map(log => (
              <div key={log.id} style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.85rem' }}>{log.day_label || 'Trening'}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.session_date}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
