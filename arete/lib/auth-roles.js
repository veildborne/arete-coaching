const COACH_EMAILS = new Set([
  'alexander.panorio@gmail.com',
  'alexander.panorios@gmail.com',
])

export function normalizeRole(role) {
  return typeof role === 'string' ? role.trim().toLowerCase() : ''
}

export function isCoachProfile(profile, user) {
  const role = normalizeRole(profile?.role)
  const email = user?.email?.trim().toLowerCase()

  return role === 'coach' || COACH_EMAILS.has(email)
}

export function roleRedirectPath(profile, user) {
  return isCoachProfile(profile, user) ? '/dashboard' : '/client'
}

export function isPendingProfile(profile) {
  return typeof profile?.status === 'string' && profile.status.trim().toLowerCase() === 'inactive'
}
