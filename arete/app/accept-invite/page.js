'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function AcceptInvitePage() {
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
        let type = 'invite' // default

        // 1a. Sprawdź czy jest ?code= (PKCE flow)
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')

        if (code) {
          // Wymień kod na sesję (Supabase SDK zrobi to automatycznie przez exchangeCodeForSession)
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            setMsg({ type: 'err', text: 'Link wygasł lub jest nieprawidłowy.' })
            setSessionLoading(false)
            return
          }
          // Wyczyść ?code= z URL
          window.history.replaceState(null, '', window.location.pathname)
          type = 'invite' // PKCE flow = invite
          setAuthType(type)
        } else {
          // 1b. Parsuj hash (implicit flow)
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          type = hashParams.get('type') || 'invite'

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

        // 5. Jeśli coach → przekieruj do dashboard
        const isCoach = profileData?.role === 'coach'

        if (isCoach) {
          router.push('/dashboard')
          return
        }

        // Dla invite/recovery flow — zawsze pokaż formularz hasła
        // (klient może być już 'active' z invite, ale jeszcze nie ustawił hasła)

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

      // 2. Wywołaj accept-invite API (aktywuje konto jeśli było inactive)
      if (authType === 'invite') {
        const res = await fetch('/api/accept-invite', { method: 'POST' })
        const json = await res.json().catch(() => ({}))
        if (!res.ok && res.status !== 404) {
          setMsg({ type: 'err', text: json.error || 'Błąd aktywacji konta.' })
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
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,#131f36_0%,#0a0f1a_60%,#060912_100%)] font-body text-gold">
        <div className="text-center">
          <div className="font-display text-[2rem] mb-4">ARETÉ</div>
          <div className="text-[0.9rem] text-[rgba(160,160,160,0.7)]">Ładowanie…</div>
        </div>
      </div>
    )
  }

  // Error state (no session, no profile)
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,#131f36_0%,#0a0f1a_60%,#060912_100%)] p-8 font-body">
        <div className="w-full max-w-[440px] bg-gradient-to-br from-[#131f36] to-[#0f1a2e] border border-[rgba(184,166,119,0.25)] rounded-2xl p-11 text-center">
          <h1 className="font-display text-[1.8rem] text-gold mb-4">ARETÉ</h1>
          {msg && (
            <div className="py-[0.65rem] px-[0.9rem] rounded-lg text-[0.85rem] bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[#f87171] mb-4">
              {msg.text}
            </div>
          )}
          <a href="/login" className="inline-block mt-4 text-[#b8a677] text-[0.85rem] no-underline tracking-[0.05em]">
            ← Wróć do logowania
          </a>
        </div>
      </div>
    )
  }

  // Password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,#131f36_0%,#0a0f1a_60%,#060912_100%)] p-8 font-body">
      <div className="w-full max-w-[440px] bg-gradient-to-br from-[#131f36] to-[#0f1a2e] border border-[rgba(184,166,119,0.25)] rounded-2xl p-11 relative shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(184,166,119,0.1)]">
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(184,166,119,0.5)] to-transparent" />
        <div className="text-center mb-8">
          <div className="font-display text-[0.7rem] tracking-[0.25em] text-[rgba(184,166,119,0.4)] uppercase mb-2">
            ἀρετή
          </div>
          <h1 className="font-display text-[1.8rem] font-semibold text-gold tracking-[0.3em] m-0">
            ARETÉ
          </h1>
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(184,166,119,0.3)] to-transparent mt-5 mb-5" />
          <h2 className="font-body text-base font-medium text-warm tracking-[0.1em] m-0">
            {authType === 'recovery' ? 'Reset hasła' : `Witaj${displayName ? `, ${displayName}` : ''}`}
          </h2>
          <p className="mt-3 text-[0.85rem] text-[rgba(160,160,160,0.7)] tracking-[0.02em]">
            {authType === 'recovery' ? 'Ustaw nowe hasło.' : 'Ustaw hasło, aby aktywować konto.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-[0.4rem] font-body text-[0.7rem] font-medium text-[rgba(184,166,119,0.7)] tracking-[0.15em] uppercase">
              Nowe hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full py-[0.8rem] px-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(184,166,119,0.2)] rounded-lg outline-none text-warm font-body text-[0.9rem] transition-[border-color_0.2s] focus:border-[rgba(184,166,119,0.6)]"
            />
          </div>
          <div>
            <label className="block mb-[0.4rem] font-body text-[0.7rem] font-medium text-[rgba(184,166,119,0.7)] tracking-[0.15em] uppercase">
              Powtórz hasło
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full py-[0.8rem] px-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(184,166,119,0.2)] rounded-lg outline-none text-warm font-body text-[0.9rem] transition-[border-color_0.2s] focus:border-[rgba(184,166,119,0.6)]"
            />
          </div>

          {msg && (
            <div className={`py-[0.65rem] px-[0.9rem] rounded-lg text-[0.82rem] ${
              msg.type === 'ok'
                ? 'bg-[rgba(76,175,80,0.12)] border border-[rgba(76,175,80,0.3)] text-[#81c784]'
                : 'bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[#f87171]'
            }`}>
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-[0.9rem] border-0 rounded-lg font-body text-[0.85rem] font-semibold tracking-[0.15em] uppercase ${
              loading ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            style={{
              background: loading ? 'rgba(184,166,119,0.3)' : 'linear-gradient(135deg, #b8a677 0%, #d4c494 100%)',
              color: loading ? 'rgba(184,166,119,0.6)' : '#0f1a2e',
            }}
          >
            {loading ? '…' : (authType === 'recovery' ? 'Zmień hasło' : 'Aktywuj konto')}
          </button>
        </form>
      </div>
    </div>
  )
}
