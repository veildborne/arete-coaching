import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import QuestionnaireForm from './QuestionnaireForm'

export default async function QuestionnairePage({ searchParams }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'coach') redirect('/dashboard')

  const { data: allQuestionnaires } = await supabase
    .from('questionnaires')
    .select('id, submitted_at, created_at, data')
    .eq('client_id', user.id)
    .order('submitted_at', { ascending: false })

  const latest = allQuestionnaires?.[0] || null
  const isNew = searchParams?.new === '1'

  return (
    <QuestionnaireForm
      clientId={user.id}
      existing={isNew ? null : latest}
      allQuestionnaires={allQuestionnaires || []}
      isNew={isNew}
    />
  )
}
