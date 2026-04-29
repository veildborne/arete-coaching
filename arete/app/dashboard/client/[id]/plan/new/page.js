import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import PlanBuilder from './PlanBuilder'
import { isCoachProfile } from '@/lib/auth-roles'

async function loadExercises(supabase) {
  const primary = await supabase
    .from('exercises')
    .select('*')
    .order('name', { ascending: true })

  if (!primary.error) return primary.data || []

  const fallback = await supabase
    .from('exercise_library')
    .select('*')
    .order('name', { ascending: true })

  return fallback.data || []
}

export default async function NewPlanPage({ params }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: coach } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!isCoachProfile(coach, user)) redirect('/client')

  const { data: client } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!client) notFound()

  const { data: questionnaire } = await supabase
    .from('questionnaires')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const exercises = await loadExercises(supabase)

  return (
    <PlanBuilder
      client={client}
      questionnaire={questionnaire}
      exercises={exercises}
      clientId={params.id}
    />
  )
}
