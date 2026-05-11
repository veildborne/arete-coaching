import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const clientId = params.id

  const [
    { data: client },
    { data: plans },
    { data: logs },
    { data: checkins },
    { data: questionnaire },
    { data: nutritionTargets },
    { data: weightLogs },
  ] = await Promise.all([
    admin.from('profiles').select('*').eq('id', clientId).single(),
    admin.from('training_plans').select('*').eq('client_id', clientId).order('id', { ascending: false }),
    admin.from('training_logs').select('*').eq('client_id', clientId).order('session_date', { ascending: false }).limit(30),
    admin.from('check_ins').select('*').eq('client_id', clientId).order('submitted_at', { ascending: false }).limit(10),
    admin.from('questionnaires').select('*').eq('client_id', clientId).order('submitted_at', { ascending: false }).limit(1).maybeSingle(),
    admin.from('nutrition_targets').select('*').eq('client_id', clientId).maybeSingle(),
    admin.from('weight_logs').select('weight_kg, logged_at').eq('client_id', clientId).order('logged_at', { ascending: false }).limit(14),
  ])

  return NextResponse.json({
    client, plans: plans || [], logs: logs || [],
    checkins: checkins || [], questionnaire,
    nutritionTargets, weightLogs: weightLogs || [],
    generatedAt: new Date().toISOString(),
  })
}
