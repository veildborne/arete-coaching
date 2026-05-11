import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { sendFeedbackEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId, feedbackText, weekNumber } = await request.json()
  const admin = createAdminClient()

  const [{ data: client }, { data: coach }] = await Promise.all([
    admin.from('profiles').select('email, full_name').eq('id', clientId).single(),
    admin.from('profiles').select('full_name').eq('id', user.id).single(),
  ])

  if (!client?.email) return NextResponse.json({ error: 'No client email' }, { status: 400 })

  await sendFeedbackEmail({
    clientEmail: client.email,
    clientName: client.full_name?.split(' ')[0] || 'Kliencie',
    coachName: coach?.full_name || 'Trener',
    feedbackText,
    weekNumber,
  })

  return NextResponse.json({ ok: true })
}
