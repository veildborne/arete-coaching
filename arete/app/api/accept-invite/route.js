import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isPendingProfile } from '@/lib/auth-roles'

export async function POST() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nieautoryzowany.' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  if (!isPendingProfile(profile)) {
    return NextResponse.json({ error: 'Konto już aktywowane.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
