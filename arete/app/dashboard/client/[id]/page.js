import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { redirect, notFound } from 'next/navigation'
import ClientDetail from './ClientDetail'
import { isCoachProfile } from '@/lib/auth-roles'

export default async function ClientPage({ params }) {
  const supabase = createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: coach } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!isCoachProfile(coach, user)) redirect('/client')

  const { data: client } = await admin
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!client) notFound()

  const { data: plans } = await admin
    .from('training_plans')
    .select('*')
    .eq('client_id', params.id)
    .order('id', { ascending: false })

  const { data: logs } = await admin
    .from('training_logs')
    .select('*')
    .eq('client_id', params.id)
    .order('session_date', { ascending: false })
    .limit(20)

  const { data: checkins } = await admin
    .from('check_ins')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: questionnaires } = await admin
    .from('questionnaires')
    .select('id, submitted_at, created_at, data')
    .eq('client_id', params.id)
    .order('submitted_at', { ascending: false })
  console.log('[page.js] questionnaires fetched:', questionnaires?.length, 'for client:', params.id)

  const { data: questionnaire } = await admin
    .from('questionnaires')
    .select('*')
    .eq('client_id', params.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  console.log('[page.js] questionnaire single:', questionnaire?.id)

  const { data: weightLogs } = await admin
    .from('weight_logs')
    .select('weight_kg, logged_at')
    .eq('client_id', params.id)
    .order('logged_at', { ascending: false })
    .limit(14)

  const { data: nutritionTargets } = await admin
    .from('nutrition_targets')
    .select('*')
    .eq('client_id', params.id)
    .maybeSingle()

  const { data: mealPlan } = await admin
    .from('meal_plans')
    .select('*')
    .eq('client_id', params.id)
    .eq('is_active', true)
    .maybeSingle()

  return (
    <ClientDetail
      client={client}
      plans={plans || []}
      logs={logs || []}
      checkins={checkins || []}
      questionnaire={questionnaire || null}
      coachName={coach?.full_name}
      questionnaires={questionnaires || []}
      weightLogs={weightLogs || []}
      nutritionTargets={nutritionTargets || null}
      mealPlan={mealPlan || null}
      coach_profile_note={client?.coach_profile_note || null}
    />
  )
}