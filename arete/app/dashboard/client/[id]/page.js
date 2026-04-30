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

  const { data: questionnaire } = await admin
    .from('questionnaires')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <ClientDetail
      client={client}
      plans={plans || []}
      logs={logs || []}
      checkins={checkins || []}
      questionnaire={questionnaire || null}
      coachName={coach?.full_name}
    />
  )
}