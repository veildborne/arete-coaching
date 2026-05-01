import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import WorkoutLogger from '@/components/client/WorkoutLogger'

export default async function WorkoutPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch in parallel
  const [profileRes, exercisesRes, planRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, role, package_tier')
      .eq('id', user.id)
      .single(),

    supabase
      .from('exercises')
      .select('id, name, name_pl, muscle_group, equipment, sfr_rating, stretch_position')
      .order('name', { ascending: true }),

    supabase
      .from('training_plans')
      .select('id, plan_data, current_week, status')
      .eq('client_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  const profile   = profileRes.data
  const exercises = exercisesRes.data ?? []
  const activePlan = planRes.data?.[0] ?? null

  // Guard: only clients
  if (profile?.role === 'coach') redirect('/dashboard')

  return (
    <WorkoutLogger
      profile={profile}
      exercises={exercises}
      activePlan={activePlan}
      clientId={user.id}
    />
  )
}