'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError('Wystąpił błąd. Spróbuj ponownie.')
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        padding: '3rem 2.5rem',
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: 600,
            color: 'var(--gold)',
            letterSpacing: '0.35em',
            marginBottom: '0.5rem',
          }}>ARETÉ</h1>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>Panel klienta</p>
        </div>

        {!sent ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="twoj@email.com"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <p style={{
                fontSize: '0.8rem',
                color: '#c0392b',
                marginBottom: '1rem',
              }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading ? 'var(--gold-dim)' : 'var(--gold)',
                color: 'var(--bg-primary)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                transition: 'background 0.3s',
              }}
            >
              {loading ? 'Wysyłam...' : 'Wyślij link logowania'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
            }}>✉️</div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}>Sprawdź skrzynkę</h2>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}>
              Wysłałem link logowania na <strong style={{ color: 'var(--gold)' }}>{email}</strong>.
              Kliknij link w mailu żeby się zalogować.
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '1.5rem',
            }}>Nie widzisz maila? Sprawdź spam.</p>
          </div>
        )}

        {/* Back to home */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
        }}>
          <a href="/" style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>← Wróć na stronę główną</a>
        </div>
      </div>
    </div>
  )
}
