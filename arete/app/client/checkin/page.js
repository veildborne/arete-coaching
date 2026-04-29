import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import CheckinForm from './CheckinForm'

export default async function CheckinPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'coach') redirect('/dashboard')

  // Ostatni check-in — żeby wiedzieć jaki week_number następny
  const { data: lastCheckin } = await supabase
    .from('check_ins')
    .select('week_number, submitted_at')
    .eq('client_id', user.id)
    .order('week_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextWeek = lastCheckin ? lastCheckin.week_number + 1 : 1

  // Aktywny plan
  const { data: activePlan } = await supabase
    .from('training_plans')
    .select('id, name')
    .eq('client_id', user.id)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <CheckinForm
      clientId={user.id}
      weekNumber={nextWeek}
      activePlan={activePlan}
      lastCheckin={lastCheckin}
    />
  )
}