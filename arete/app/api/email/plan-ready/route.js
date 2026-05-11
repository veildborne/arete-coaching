import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { sendPlanReadyEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId } = await request.json()
  const admin = createAdminClient()

  const [{ data: client }, { data: coach }, { data: plan }] = await Promise.all([
    admin.from('profiles').select('email, full_name').eq('id', clientId).single(),
    admin.from('profiles').select('full_name').eq('id', user.id).single(),
    admin.from('training_plans').select('name').eq('client_id', clientId).eq('is_active', true).single(),
  ])

  if (!client?.email) return NextResponse.json({ error: 'No client email' }, { status: 400 })

  await sendPlanReadyEmail({
    clientEmail: client.email,
    clientName: client.full_name?.split(' ')[0] || 'Kliencie',
    planName: plan?.name || 'Nowy plan',
    coachName: coach?.full_name || 'Trener',
  })

  return NextResponse.json({ ok: true })
}
