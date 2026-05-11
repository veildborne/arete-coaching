import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { redirect } from 'next/navigation'
import ClientPortal from './ClientPortal'
import { isCoachProfile, isPendingProfile } from '@/lib/auth-roles'

export default async function ClientPage() {
  const supabase = createClient() // Next.js 14: NO await
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (isCoachProfile(profile, user)) redirect('/dashboard')
  if (isPendingProfile(profile)) redirect('/accept-invite')

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

  const { data: questionnaire } = await supabase
    .from('questionnaires')
    .select('id')
    .eq('client_id', user.id)
    .maybeSingle()

  const { data: checkins } = await supabase
    .from('check_ins')
    .select('id, week_number, submitted_at, body_weight, energy_level, sleep_quality, soreness_level, adherence_pct, client_notes, coach_feedback')
    .eq('client_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(10)

  // Single-coach setup — pierwszy profil z role='coach'. Admin client bo RLS
  // może blokować czytanie cudzych profili z poziomu klienta.
  const admin = createAdminClient()
  const { data: coach } = await admin
    .from('profiles')
    .select('full_name')
    .eq('role', 'coach')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  const { data: xpEvents } = await supabase
    .from('xp_events')
    .select('xp')
    .eq('client_id', user.id)
  const { data: clientAchievements } = await supabase
    .from('achievements')
    .select('achievement_id, unlocked_at')
    .eq('client_id', user.id)

  const { data: nutritionTargets } = await supabase
    .from('nutrition_targets')
    .select('*')
    .eq('client_id', user.id)
    .maybeSingle()

  return (
    <ClientPortal
      profile={profile}
      activePlan={activePlan}
      recentLogs={recentLogs || []}
      questionnaire={questionnaire}
      coachName={coach?.full_name || null}
      checkins={checkins || []}
      totalXP={xpEvents ? xpEvents.reduce((s, e) => s + e.xp, 0) : 0}
      clientAchievements={clientAchievements || []}
      nutritionTargets={nutritionTargets || null}
    />
  )
}
