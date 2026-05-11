import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { client_id, calories, protein_g, fat_g, carbs_g, notes } = body

  const admin = createAdminClient()
  const { error } = await admin
    .from('nutrition_targets')
    .upsert({
      client_id,
      calories,
      protein_g,
      fat_g,
      carbs_g,
      notes: notes || null,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    }, { onConflict: 'client_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const client_id = searchParams.get('client_id')
  if (!client_id) return NextResponse.json({ error: 'Missing client_id' }, { status: 400 })

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('nutrition_targets')
    .select('*')
    .eq('client_id', client_id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
