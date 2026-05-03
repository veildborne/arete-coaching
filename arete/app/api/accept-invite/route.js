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

  // Pozwól na ustawienie hasła nawet dla już aktywnych (invite flow zmieniony)
  // Tylko upewnij się że profil istnieje
  if (!profile) {
    return NextResponse.json({ error: 'Profil nie znaleziony.' }, { status: 404 })
  }

  // Ustaw status na 'active' jeśli był inactive
  if (isPendingProfile(profile)) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'active' })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
