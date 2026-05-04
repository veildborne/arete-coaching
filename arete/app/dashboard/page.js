import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { isCoachProfile } from '@/lib/auth-roles'

export default async function DashboardPage() {
  const supabase = createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!isCoachProfile(profile, user)) redirect('/client')

  const { data: clients } = await admin
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  // FAZA 6: Fetch plans, logs, check-ins dla compliance i auto-flags
  const { data: allPlans } = await admin
    .from('training_plans')
    .select('client_id, is_active, plan_data, plan_json')

  const { data: allLogs } = await admin
    .from('training_logs')
    .select('client_id, session_date, completed, exercises')
    .order('session_date', { ascending: false })
    .limit(1000) // ostatnie 1000 logów (enough for recent analysis)

  const { data: allCheckins } = await admin
    .from('check_ins')
    .select('client_id, created_at')
    .order('created_at', { ascending: false })
    .limit(500)

  // Mapuj dane per klient
  const clientsWithData = (clients || []).map(client => ({
    ...client,
    plans: (allPlans || []).filter(p => p.client_id === client.id),
    logs: (allLogs || []).filter(l => l.client_id === client.id),
    checkins: (allCheckins || []).filter(c => c.client_id === client.id),
  }))

  return <DashboardClient profile={profile} clients={clientsWithData} />
}