import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { client_id, name, calories_target, meals } = body

  const admin = createAdminClient()

  await admin.from('meal_plans').update({ is_active: false }).eq('client_id', client_id)

  const { error } = await admin.from('meal_plans').insert({
    client_id,
    name,
    calories_target,
    meals,
    assigned_by: user.id,
    is_active: true,
  })

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
  const { data } = await admin
    .from('meal_plans')
    .select('*')
    .eq('client_id', client_id)
    .eq('is_active', true)
    .maybeSingle()

  return NextResponse.json({ data })
}
