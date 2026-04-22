import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ClientPortal from './ClientPortal'

export default async function ClientPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'coach') redirect('/dashboard')

  const { data: activePlan } = await supabase
    .from('training_plans')
    .select('*')
    .eq('client_id', user.id)
    .eq('is_active', true)
    .single()

  const { data: recentLogs } = await supabase
    .from('training_logs')
    .select('*')
    .eq('client_id', user.id)
    .order('session_date', { ascending: false })
    .limit(5)

  return <ClientPortal profile={profile} activePlan={activePlan} recentLogs={recentLogs || []} />
}