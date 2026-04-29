import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import ClientDetail from './ClientDetail'

export default async function ClientPage({ params }) {
  const supabase = createClient() // Next.js 14: NO await

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: coach } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (coach?.role !== 'coach') redirect('/client')

  const { data: client } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .eq('role', 'client')
    .single()

  if (!client) notFound()

  const { data: plans } = await supabase
    .from('training_plans')
    .select('*')
    .eq('client_id', params.id)
    .order('id', { ascending: false })

  const { data: logs } = await supabase
    .from('training_logs')
    .select('*')
    .eq('client_id', params.id)
    .order('session_date', { ascending: false })
    .limit(20)

  const { data: checkins } = await supabase
    .from('check_ins')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <ClientDetail
      client={client}
      plans={plans || []}
      logs={logs || []}
      checkins={checkins || []}
      coachName={coach?.full_name}
    />
  )
}