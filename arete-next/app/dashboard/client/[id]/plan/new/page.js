import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import PlanBuilder from './PlanBuilder'

export default async function NewPlanPage({ params }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: coach } = await supabase
    .from('profiles').select('role, full_name').eq('id', user.id).single()
  if (coach?.role !== 'coach') redirect('/client')

  const { data: client } = await supabase
    .from('profiles').select('*').eq('id', params.id).eq('role', 'client').single()
  if (!client) notFound()

  const { data: questionnaire } = await supabase
    .from('questionnaires')
    .select('*')
    .eq('client_id', params.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('muscle_group')

  return (
    <PlanBuilder
      client={client}
      questionnaire={questionnaire}
      exercises={exercises || []}
      clientId={params.id}
    />
  )
}