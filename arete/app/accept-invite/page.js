import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isCoachProfile, isPendingProfile, roleRedirectPath } from '@/lib/auth-roles'
import AcceptInviteClient from './AcceptInviteClient'

export default async function AcceptInvitePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status, full_name, email')
    .eq('id', user.id)
    .single()

  if (isCoachProfile(profile, user)) redirect('/dashboard')
  if (!isPendingProfile(profile)) redirect(roleRedirectPath(profile, user))

  return <AcceptInviteClient profile={profile} userEmail={user.email} />
}
