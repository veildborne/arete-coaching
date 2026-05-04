'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { roleRedirectPath } from '@/lib/auth-roles'

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
          const target = roleRedirectPath(profile, data.user)
          setTimeout(() => { window.location.href = target }, 800)
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
            {titles[mode]}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="block mb-[0.4rem] font-body text-[0.7rem] font-medium text-[rgba(184,166,119,0.7)] tracking-[0.15em] uppercase">
                Imię i nazwisko
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="np. Jan Kowalski"
                required
                className="w-full py-[0.8rem] px-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(184,166,119,0.2)] rounded-lg outline-none text-warm font-body text-[0.9rem] transition-[border-color_0.2s] focus:border-[rgba(184,166,119,0.6)]"
              />
            </div>
          )}
          <div>
            <label className="block mb-[0.4rem] font-body text-[0.7rem] font-medium text-[rgba(184,166,119,0.7)] tracking-[0.15em] uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              required
              className="w-full py-[0.8rem] px-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(184,166,119,0.2)] rounded-lg outline-none text-warm font-body text-[0.9rem] transition-[border-color_0.2s] focus:border-[rgba(184,166,119,0.6)]"
            />
          </div>
          {mode !== 'reset' && (
            <div>
              <label className="block mb-[0.4rem] font-body text-[0.7rem] font-medium text-[rgba(184,166,119,0.7)] tracking-[0.15em] uppercase">
                Hasło
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-[0.8rem] px-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(184,166,119,0.2)] rounded-lg outline-none text-warm font-body text-[0.9rem] transition-[border-color_0.2s] focus:border-[rgba(184,166,119,0.6)]"
              />
            </div>
          )}

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
            {loading ? '…' : mode === 'login' ? 'Zaloguj się' : mode === 'register' ? 'Utwórz konto' : 'Wyślij link'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[rgba(184,166,119,0.15)] flex flex-col gap-2 items-center">
          {mode === 'login' && (<>
            <button
              type="button"
              onClick={() => { setMode('register'); setMsg(null) }}
              className="bg-transparent border-0 cursor-pointer text-[rgba(160,160,160,0.7)] font-body text-[0.8rem] tracking-[0.02em] p-0"
            >
              Nie masz konta? <span className="text-[#b8a677]">Zarejestruj się</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('reset'); setMsg(null) }}
              className="bg-transparent border-0 cursor-pointer text-[rgba(160,160,160,0.7)] font-body text-[0.8rem] tracking-[0.02em] p-0"
            >
              Zapomniałeś hasła?
            </button>
          </>)}
          {mode === 'register' && (
            <button
              type="button"
              onClick={() => { setMode('login'); setMsg(null) }}
              className="bg-transparent border-0 cursor-pointer text-[rgba(160,160,160,0.7)] font-body text-[0.8rem] tracking-[0.02em] p-0"
            >
              Masz już konto? <span className="text-[#b8a677]">Zaloguj się</span>
            </button>
          )}
          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => { setMode('login'); setMsg(null) }}
              className="bg-transparent border-0 cursor-pointer text-[rgba(160,160,160,0.7)] font-body text-[0.8rem] tracking-[0.02em] p-0"
            >
              ← Wróć do logowania
            </button>
          )}
          <a href="/" className="mt-2 text-[0.75rem] text-[rgba(160,160,160,0.5)] tracking-[0.1em] no-underline">
            ← Wróć na stronę główną
          </a>
        </div>
      </div>
    </div>
  )
}
