import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { redirect, notFound } from 'next/navigation'
import PlanBuilder from './PlanBuilder'
import { isCoachProfile } from '@/lib/auth-roles'

async function loadExercises(admin) {
  const { data, error } = await admin
    .from('exercises')
    .select('*')
    .order('name', { ascending: true })

  if (!error && data?.length) return data

  const fallback = await admin
    .from('exercise_library')
    .select('*')
    .order('name', { ascending: true })

  return fallback.data || []
}

export default async function NewPlanPage({ params }) {
  const supabase = createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: coach } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!isCoachProfile(coach, user)) redirect('/client')

  const { data: client } = await admin
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!client) notFound()

  const { data: questionnaire } = await admin
    .from('questionnaires')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const exercises = await loadExercises(admin)

  return (
    <PlanBuilder
      client={client}
      questionnaire={questionnaire}
      exercises={exercises}
      clientId={params.id}
    />
  )
}