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

  if (profile?.questionnaire_requested === false) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif",
        padding: '24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '64px',
            color: '#b8a677',
            marginBottom: '16px',
          }}>
            🔒
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '28px',
            color: '#e8e8e8',
            margin: '0 0 12px',
          }}>
            Ankieta niedostępna
          </h2>
          <p style={{
            color: 'rgba(184,166,119,0.6)',
            fontSize: '14px',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}>
            Ankieta zostanie udostępniona gdy trener wyśle Ci zaproszenie do jej wypełnienia.
          </p>
          <a href="/client" style={{
            display: 'inline-block',
            padding: '10px 28px',
            borderRadius: '99px',
            background: 'transparent',
            border: '1px solid rgba(184,166,119,0.3)',
            color: '#b8a677',
            fontSize: '13px',
            textDecoration: 'none',
            fontFamily: "'Outfit', sans-serif",
          }}>
            ← Wróć do panelu
          </a>
        </div>
      </div>
    )
  }

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
