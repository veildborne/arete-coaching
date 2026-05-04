import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'node:crypto'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isCoachProfile } from '@/lib/auth-roles'

// Bezpieczna paleta — bez 0/O/1/I/l (mniej pomyłek przy przepisywaniu z maila)
const PWD_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

function generateTempPassword(length = 16) {
  const bytes = crypto.randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) out += PWD_CHARSET[bytes[i] % PWD_CHARSET.length]
  return out
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

function welcomeEmailHtml({ full_name, email, password }) {
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222;background:#fafafa;">
      <h1 style="font-size:22px;color:#b8a677;margin:0 0 16px 0;">Witaj w Areté Coaching, ${escapeHtml(full_name)}</h1>
      <p style="line-height:1.5;">Twoje konto zostało utworzone przez trenera. Zaloguj się używając poniższych danych:</p>
      <div style="background:#fff;border:1px solid #e5e5e5;padding:16px;border-radius:8px;font-family:ui-monospace,monospace;margin:16px 0;">
        <div style="margin-bottom:8px;"><strong style="color:#666;">Email:</strong> ${escapeHtml(email)}</div>
        <div><strong style="color:#666;">Hasło tymczasowe:</strong> <span style="font-size:16px;letter-spacing:0.05em;">${escapeHtml(password)}</span></div>
      </div>
      <p style="margin:24px 0;">
        <a href="https://arete-system.pl/login" style="display:inline-block;background:#b8a677;color:#0f1a2e;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">
          Zaloguj się
        </a>
      </p>
      <p style="color:#666;font-size:13px;line-height:1.5;">Po pierwszym zalogowaniu zalecamy zmianę hasła w ustawieniach konta.</p>
      <p style="color:#999;font-size:12px;margin-top:32px;border-top:1px solid #e5e5e5;padding-top:16px;">Areté Coaching — ἀρετή</p>
    </div>
  `
}

export async function POST(request) {
  const sessionClient = createServerSupabase()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nieautoryzowany.' }, { status: 401 })
  }

  const { data: callerProfile } = await sessionClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!isCoachProfile(callerProfile, user)) {
    return NextResponse.json({ error: 'Brak uprawnień.' }, { status: 403 })
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowy JSON' }, { status: 400 })
  }

  const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const full_name = typeof payload?.full_name === 'string' ? payload.full_name.trim() : ''

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Podaj poprawny email.' }, { status: 400 })
  }
  if (!full_name) {
    return NextResponse.json({ error: 'Podaj imię i nazwisko.' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Mailer nie jest skonfigurowany (RESEND_API_KEY).' }, { status: 500 })
  }

  const supabase = createAdminClient()
  const tempPassword = generateTempPassword(16)

  // Tworzymy usera z hasłem od razu — omija PKCE/ITP problem na Safari iOS,
  // bo klient loguje się klasycznie email+hasło zamiast magic-linka.
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name },
  })

  if (createError || !created?.user) {
    return NextResponse.json(
      { error: createError?.message || 'Nie udało się utworzyć konta.' },
      { status: 400 }
    )
  }

  const userId = created.user.id

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      { id: userId, email, full_name, role: 'client', status: 'active' },
      { onConflict: 'id' }
    )

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId).catch(() => {})
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Areté Coaching <noreply@arete-system.pl>',
    to: email,
    subject: 'Witaj w Areté Coaching — Twoje dane do logowania',
    html: welcomeEmailHtml({ full_name, email, password: tempPassword }),
  })

  if (emailError) {
    await supabase.auth.admin.deleteUser(userId).catch(() => {})
    return NextResponse.json(
      { error: emailError?.message || 'Nie udało się wysłać maila powitalnego.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
