import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import WorkoutLogger from './WorkoutLogger'

export default async function WorkoutPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'coach') redirect('/dashboard')

  const { data: exercises } = await supabase
    .from('exercises')
    .select('id, name, name_pl, muscle_group, equipment, sfr_rating, stretch_position, compound')
    .order('muscle_group')
    .order('name')

  const { data: activePlan } = await supabase
    .from('training_plans')
    .select('*')
    .eq('client_id', user.id)
    .eq('is_active', true)
    .single()

  return (
    <WorkoutLogger
      profile={profile}
      exercises={exercises || []}
      activePlan={activePlan}
      clientId={user.id}
    />
  )
}