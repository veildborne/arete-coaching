import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import QuestionnaireForm from './QuestionnaireForm'

export default async function QuestionnairePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'coach') redirect('/dashboard')

  // Sprawdź czy już wypełnił
  const { data: existing } = await supabase
    .from('questionnaires')
    .select('id, submitted_at')
    .eq('client_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <QuestionnaireForm
      clientId={user.id}
      existing={existing}
    />
  )
}