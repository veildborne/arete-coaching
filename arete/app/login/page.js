'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setMsg(null)
    setLoading(true)
    const supabase = createClient()

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setMsg({ type: 'err', text: 'Nieprawidłowy email lub hasło.' }); return }

        // Sprawdź rolę PRZED przekierowaniem — unikamy race condition z cookies
        const userId = data.user?.id
        if (userId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()
          setMsg({ type: 'ok', text: 'Zalogowano! Przekierowuję…' })
          const target = profile?.role === 'coach' ? '/dashboard' : '/client'
          setTimeout(() => { window.location.href = '/api/me/redirect' }, 800)
        } else {
          window.location.href = '/client'
        }

      } else if (mode === 'register') {
        if (password.length < 8) { setMsg({ type: 'err', text: 'Hasło musi mieć min. 8 znaków.' }); return }
        const { error } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: name } }
        })
        if (error?.message?.toLowerCase().includes('already')) {
          setMsg({ type: 'err', text: 'Ten email jest już zajęty.' }); return
        }
        if (error) { setMsg({ type: 'err', text: 'Coś poszło nie tak.' }); return }
        setMsg({ type: 'ok', text: 'Konto utworzone! Możesz się zalogować.' })
        setTimeout(() => { setMode('login'); setMsg(null) }, 1500)

      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
        })
        if (error) { setMsg({ type: 'err', text: 'Coś poszło nie tak.' }); return }
        setMsg({ type: 'ok', text: 'Link do resetu hasła wysłany na email.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const titles = { login: 'Zaloguj się', register: 'Utwórz konto', reset: 'Reset hasła' }

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
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 500, color: '#e8e8e8', letterSpacing: '0.1em', margin: 0 }}>{titles[mode]}</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={labelStyle}>Imię i nazwisko</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="np. Jan Kowalski" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="twoj@email.com" required style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'} />
          </div>
          {mode !== 'reset' && (
            <div>
              <label style={labelStyle}>Hasło</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.2)'} />
            </div>
          )}

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
            {loading ? '…' : mode === 'login' ? 'Zaloguj się' : mode === 'register' ? 'Utwórz konto' : 'Wyślij link'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem', paddingTop: '1.25rem',
          borderTop: '1px solid rgba(184,166,119,0.15)',
          display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center',
        }}>
          {mode === 'login' && (<>
            <button type="button" onClick={() => { setMode('register'); setMsg(null) }} style={linkStyle}>
              Nie masz konta? <span style={{ color: '#b8a677' }}>Zarejestruj się</span>
            </button>
            <button type="button" onClick={() => { setMode('reset'); setMsg(null) }} style={linkStyle}>Zapomniałeś hasła?</button>
          </>)}
          {mode === 'register' && (
            <button type="button" onClick={() => { setMode('login'); setMsg(null) }} style={linkStyle}>
              Masz już konto? <span style={{ color: '#b8a677' }}>Zaloguj się</span>
            </button>
          )}
          {mode === 'reset' && (
            <button type="button" onClick={() => { setMode('login'); setMsg(null) }} style={linkStyle}>← Wróć do logowania</button>
          )}
          <a href="/" style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(160,160,160,0.5)', letterSpacing: '0.1em', textDecoration: 'none' }}>← Wróć na stronę główną</a>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', marginBottom: '0.4rem', fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 500, color: 'rgba(184,166,119,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }
const inputStyle = { width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,166,119,0.2)', borderRadius: '8px', outline: 'none', color: '#e8e8e8', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', transition: 'border-color 0.2s' }
const linkStyle = { background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(160,160,160,0.7)', fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', letterSpacing: '0.02em', padding: 0 }