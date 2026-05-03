'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function AcceptInviteClient() {
  const router = useRouter()
  const [sessionLoading, setSessionLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [authType, setAuthType] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const supabase = createClient()

    const initSession = async () => {
      try {
        // 1. Parsuj hash (Supabase invite/recovery używa implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type') || ''

        setAuthType(type)

        if (accessToken && refreshToken) {
          // 2. Ustaw sesję z tokenów z hasha
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            setMsg({ type: 'err', text: 'Link wygasł lub jest nieprawidłowy.' })
            setSessionLoading(false)
            return
          }

          // Wyczyść hash z URL (estetyka)
          window.history.replaceState(null, '', window.location.pathname)
        }

        // 3. Pobierz aktualnego usera (może być już zalogowany z ciasteczek)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setMsg({ type: 'err', text: 'Nie znaleziono sesji. Zaloguj się ponownie.' })
          setSessionLoading(false)
          return
        }

        // 4. Pobierz profil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, status, full_name, email')
          .eq('id', user.id)
          .single()

        if (profileError) {
          setMsg({ type: 'err', text: 'Nie udało się pobrać profilu.' })
          setSessionLoading(false)
          return
        }

        // 5. Jeśli coach lub już aktywny → przekieruj
        const isCoach = profileData?.role === 'coach'
        const isPending = profileData?.status?.toLowerCase() === 'pending'

        if (isCoach) {
          router.push('/dashboard')
          return
        }

        if (!isPending && type !== 'recovery') {
          router.push('/client')
          return
        }

        // 6. Gotowe — pokaż formularz
        setProfile(profileData)
        setSessionLoading(false)
      } catch (err) {
        setMsg({ type: 'err', text: err?.message || 'Błąd inicjalizacji.' })
        setSessionLoading(false)
      }
    }

    initSession()
  }, [router])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setMsg(null)

    if (password.length < 8) {
      setMsg({ type: 'err', text: 'Hasło musi mieć min. 8 znaków.' })
      return
    }
    if (password !== confirm) {
      setMsg({ type: 'err', text: 'Hasła nie są takie same.' })
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // 1. Ustaw hasło
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setMsg({ type: 'err', text: updateError.message || 'Nie udało się ustawić hasła.' })
        setLoading(false)
        return
      }

      // 2. Flip status do 'active' (tylko dla invite flow, recovery pomija)
      if (authType === 'invite' || profile?.status?.toLowerCase() === 'pending') {
        const res = await fetch('/api/accept-invite', { method: 'POST' })
        const json = await res.json().catch(() => ({}))
        if (!res.ok && res.status !== 400) {
          // 400 = już aktywne, OK to zignorować
          setMsg({ type: 'err', text: json.error || 'Nie udało się aktywować konta.' })
          setLoading(false)
          return
        }
      }

      // 3. Przekieruj
      setMsg({ type: 'ok', text: 'Hasło ustawione! Przekierowuję…' })
      setTimeout(() => {
        if (authType === 'invite') {
          window.location.href = '/client/questionnaire'
        } else {
          window.location.href = '/client'
        }
      }, 600)
    } catch (err) {
      setMsg({ type: 'err', text: err?.message || 'Błąd sieci.' })
      setLoading(false)
    }
  }

  const displayName = profile?.full_name || profile?.email || ''

  // Loading state
  if (sessionLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
        fontFamily: 'Outfit, sans-serif', color: '#d4c494',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '1rem' }}>ARETÉ</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(160,160,160,0.7)' }}>Ładowanie…</div>
        </div>
      </div>
    )
  }

  // Error state (no session, no profile)
  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
        padding: '2rem', fontFamily: 'Outfit, sans-serif',
      }}>
        <div style={{
          width: '100%', maxWidth: '440px',
          background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
          border: '1px solid rgba(184,166,119,0.25)', borderRadius: '16px',
          padding: '2.75rem 2.25rem', textAlign: 'center',
        }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#d4c494', marginBottom: '1rem' }}>ARETÉ</h1>
          {msg && (
            <div style={{
              padding: '0.65rem 0.9rem', borderRadius: '8px', fontSize: '0.85rem',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', marginBottom: '1rem',
            }}>{msg.text}</div>
          )}
          <a href="/login" style={{
            display: 'inline-block', marginTop: '1rem', color: '#b8a677', fontSize: '0.85rem',
            textDecoration: 'none', letterSpacing: '0.05em',
          }}>← Wróć do logowania</a>
        </div>
      </div>
    )
  }

  // Password form
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      padding: '2rem', fontFamily: 'Outfit, sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'linear-gradient(145deg, #131f36 0%, #0f1a2e 100%)',
        border: '1px solid rgba(184,166,119,0.25)', borderRadius: '16px',
        padding: '2.75rem 2.25rem', position: 'relative',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(184,166,119,0.1)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(184,166,119,0.5), transparent)',
        }} />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.7rem', letterSpacing: '0.25em', color: 'rgba(184,166,119,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ἀρετή</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 600, color: '#d4c494', letterSpacing: '0.3em', margin: 0 }}>ARETÉ</h1>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(184,166,119,0.3), transparent)', marginTop: '1.25rem', marginBottom: '1.25rem' }} />
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 500, color: '#e8e8e8', letterSpacing: '0.1em', margin: 0 }}>
            {authType === 'recovery' ? 'Reset hasła' : `Witaj${displayName ? `, ${displayName}` : ''}`}
          </h2>
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(160,160,160,0.7)', letterSpacing: '0.02em' }}>
            {authType === 'recovery' ? 'Ustaw nowe hasło.' : 'Ustaw hasło, aby aktywować konto.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nowe hasło</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Powtórz hasło</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'}
            />
          </div>

          {msg && (
            <div style={{
              padding: '0.65rem 0.9rem', borderRadius: '8px', fontSize: '0.82rem',
              background: msg.type === 'ok' ? 'rgba(76,175,80,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${msg.type === 'ok' ? 'rgba(76,175,80,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: msg.type === 'ok' ? '#81c784' : '#f87171',
            }}>{msg.text}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: '0.5rem', padding: '0.9rem',
            background: loading ? 'rgba(184,166,119,0.3)' : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
            color: loading ? 'rgba(184,166,119,0.6)' : '#0f1a2e',
            border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            {loading ? '…' : (authType === 'recovery' ? 'Zmień hasło' : 'Aktywuj konto')}
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', marginBottom: '0.4rem', fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 500, color: 'rgba(184,166,119,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }
const inputStyle = { width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,166,119,0.2)', borderRadius: '8px', outline: 'none', color: '#e8e8e8', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', transition: 'border-color 0.2s' }
