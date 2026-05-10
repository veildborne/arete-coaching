import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isCoachProfile } from '@/lib/auth-roles'

function questionnaireEmailHtml({ full_name, url }) {
  return `
    <div style="background:#0a0f1a;padding:40px 20px;font-family:'Outfit',Arial,sans-serif;min-height:100vh">
      <div style="max-width:480px;margin:0 auto;background:#131f36;border:1px solid rgba(184,166,119,0.25);border-radius:16px;padding:40px;text-align:center">
        <div style="font-size:11px;letter-spacing:0.25em;color:rgba(184,166,119,0.4);margin-bottom:8px">ἀρετή</div>
        <h1 style="font-size:28px;color:#b8a677;letter-spacing:0.3em;margin:0 0 24px">ARETÉ</h1>
        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(184,166,119,0.3),transparent);margin-bottom:24px"></div>
        <h2 style="font-size:16px;color:#f2eee8;font-weight:500;margin:0 0 12px">Ankieta treningowa</h2>
        <p style="font-size:14px;color:rgba(160,160,160,0.7);line-height:1.6;margin:0 0 32px">
          Cześć ${full_name}!<br><br>
          Twój trener prosi Cię o wypełnienie ankiety treningowej. Zajmie to około 5 minut i pomoże przygotować lepszy plan.
        </p>
        <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#b8a677,#d4c494);color:#0f1a2e;font-weight:700;font-size:14px;letter-spacing:0.1em;padding:14px 32px;border-radius:10px;text-decoration:none">
          Wypełnij ankietę →
        </a>
        <p style="font-size:11px;color:rgba(160,160,160,0.4);margin-top:32px;line-height:1.6">
          Link jest aktywny i prowadzi bezpośrednio do Twojego panelu.
        </p>
        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(184,166,119,0.15),transparent);margin:24px 0"></div>
        <div style="font-size:11px;color:rgba(184,166,119,0.3)">Areté Coaching — ἀρετή</div>
      </div>
    </div>
  `
}

export async function POST(request) {
  const sessionClient = createServerSupabase()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nieautoryzowany.' }, { status: 401 })

  const { data: callerProfile } = await sessionClient
    .from('profiles').select('role').eq('id', user.id).single()
  if (!isCoachProfile(callerProfile, user)) {
    return NextResponse.json({ error: 'Brak uprawnień.' }, { status: 403 })
  }

  let payload
  try { payload = await request.json() } catch {
    return NextResponse.json({ error: 'Nieprawidłowy JSON' }, { status: 400 })
  }

  const { client_id } = payload
  if (!client_id) return NextResponse.json({ error: 'Brak client_id.' }, { status: 400 })

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Mailer nie jest skonfigurowany.' }, { status: 500 })
  }

  const admin = createAdminClient()
  const { data: client } = await admin
    .from('profiles').select('email, full_name').eq('id', client_id).single()

  if (!client) return NextResponse.json({ error: 'Nie znaleziono klienta.' }, { status: 404 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const url = 'https://arete-system.pl/client/questionnaire?new=1'

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Areté Coaching <noreply@arete-system.pl>',
    to: client.email,
    subject: 'Areté — Twój trener prosi o wypełnienie ankiety',
    html: questionnaireEmailHtml({ full_name: client.full_name || 'Kliencie', url }),
  })

  if (emailError) {
    return NextResponse.json({ error: emailError?.message || 'Błąd wysyłania.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
