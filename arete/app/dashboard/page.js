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

  return <DashboardClient profile={profile} clients={clients || []} />
}