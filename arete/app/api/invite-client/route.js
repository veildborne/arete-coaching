import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isCoachProfile } from '@/lib/auth-roles'

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

  const supabase = createAdminClient()

  const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name },
  })

  if (inviteError || !invited?.user) {
    return NextResponse.json(
      { error: inviteError?.message || 'Nie udało się wysłać zaproszenia.' },
      { status: 400 }
    )
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: invited.user.id,
        email,
        full_name,
        role: 'client',
        status: 'pending',
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
