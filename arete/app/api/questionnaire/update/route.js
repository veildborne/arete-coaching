import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { isCoachProfile } from '@/lib/auth-roles'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const supabase = createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: coach } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isCoachProfile(coach, user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { questionnaireId, data } = await req.json()
  if (!questionnaireId || !data) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const { error } = await admin
    .from('questionnaires')
    .update({ data })
    .eq('id', questionnaireId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
