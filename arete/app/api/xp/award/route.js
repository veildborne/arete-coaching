import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const XP_SOURCES = {
  workout:  120,
  checkin:  50,
  pr:       150,
  mesocycle: 300,
}

const ACHIEVEMENT_DEFS = [
  { id: 'protos',    xp: 50,  check: (stats) => stats.totalWorkouts >= 1 },
  { id: 'askesis',   xp: 200, check: (stats) => stats.streak >= 28 },
  { id: 'kleos',     xp: 150, check: (stats) => stats.hasPR },
  { id: 'arete_fin', xp: 300, check: (stats) => stats.mesocycleComplete },
]

export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { source, metadata = {} } = body

  if (!XP_SOURCES[source]) return NextResponse.json({ error: 'Invalid source' }, { status: 400 })

  const admin = createAdminClient()
  const xp = XP_SOURCES[source]

  await admin.from('xp_events').insert({
    client_id: user.id,
    source,
    xp,
    description: metadata.description || source,
  })

  const [{ count: totalWorkouts }, { data: logs }, { data: existing }] = await Promise.all([
    admin.from('training_logs').select('*', { count: 'exact', head: true }).eq('client_id', user.id),
    admin.from('training_logs').select('session_date').eq('client_id', user.id).order('session_date', { ascending: false }).limit(30),
    admin.from('achievements').select('achievement_id').eq('client_id', user.id),
  ])

  const existingIds = new Set((existing || []).map(a => a.achievement_id))

  let streak = 0
  if (logs && logs.length > 0) {
    const dates = logs.map(l => new Date(l.session_date).toDateString())
    const unique = [...new Set(dates)]
    let prev = new Date()
    for (const d of unique) {
      const diff = Math.round((prev - new Date(d)) / (1000 * 60 * 60 * 24))
      if (diff <= 2) { streak += diff; prev = new Date(d) }
      else break
    }
  }

  const stats = {
    totalWorkouts: totalWorkouts || 0,
    streak,
    hasPR: metadata.hasPR || false,
    mesocycleComplete: metadata.mesocycleComplete || false,
  }

  const toUnlock = ACHIEVEMENT_DEFS.filter(a => !existingIds.has(a.id) && a.check(stats))
  if (toUnlock.length > 0) {
    await admin.from('achievements').insert(
      toUnlock.map(a => ({ client_id: user.id, achievement_id: a.id, xp_awarded: a.xp }))
    )
    await admin.from('xp_events').insert(
      toUnlock.map(a => ({ client_id: user.id, source: 'achievement', xp: a.xp, description: a.id }))
    )
  }

  return NextResponse.json({ ok: true, xp_awarded: xp, achievements_unlocked: toUnlock.map(a => a.id) })
}
