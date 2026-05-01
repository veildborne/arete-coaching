import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isCoachProfile } from '@/lib/auth-roles'
import WorkoutLogger from '../WorkoutLogger'

export default async function WorkoutPage() {
  const supabase = createClient() // Next.js 14: NO await

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, exercisesRes, planRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),

    supabase
      .from('exercises')
      .select('id, name, name_pl, muscle_group, equipment, sfr_rating, stretch_position')
      .order('name', { ascending: true }),

    supabase
      .from('training_plans')
      .select('*')
      .eq('client_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  const profile    = profileRes.data
  const exercises  = exercisesRes.data ?? []
  const activePlan = planRes.data?.[0] ?? null

  if (isCoachProfile(profile, user)) redirect('/dashboard')

  return (
    <WorkoutLogger
      profile={profile}
      exercises={exercises}
      activePlan={activePlan}
      clientId={user.id}
    />
  )
}