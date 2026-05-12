'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { IconClients, IconAttention, IconAdd, IconLogout, IconProgress, IconReport } from '@/lib/GreekIcons'

function getInitials(name, email) {
  const source = name || email || 'AR'
  const parts = source.trim().split(/\s+/)
  if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

function daysSince(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  return (Date.now() - date.getTime()) / 86400000
}

function calculateCompliance(logs, plans) {
  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  const recentLogs = (logs || []).filter(log => new Date(log.session_date) >= fourWeeksAgo)
  const activePlan = (plans || []).find(p => p.is_active)
  if (!activePlan) return null
  const planData = activePlan.plan_data || {}
  const sessions = planData.sessions || {}
  const sessionsPerWeek = typeof sessions === 'object' && !Array.isArray(sessions)
    ? Object.keys(sessions).length : 0
  if (!sessionsPerWeek) return null
  const expectedSessions = sessionsPerWeek * 4
  const completedSessions = recentLogs.filter(log => log.completed !== false).length
  return Math.round((completedSessions / expectedSessions) * 100)
}

const TIER_LABELS = { paideia: 'Paideia', askesis: 'Askesis', arete: 'Areté', stacjonarny: 'Stacj.' }
const TIER_COLORS = {
  paideia:     { color: '#a07850', border: 'rgba(160,120,80,0.4)' },
  askesis:     { color: '#8a9db5', border: 'rgba(138,157,181,0.4)' },
  arete:       { color: '#D4B570', border: 'rgba(212,181,112,0.5)' },
  stacjonarny: { color: '#6b7280', border: 'rgba(107,114,128,0.4)' },
}

function ClientCard({ client, onProfile, onNewPlan }) {
  const initials = getInitials(client.full_name, client.email)
  const noTrainingDays = daysSince(client.logs?.[0]?.session_date)
  const noCheckinDays = daysSince(client.checkins?.[0]?.created_at)
  const needsAttention = (noTrainingDays !== null && noTrainingDays > 5) || (noCheckinDays !== null && noCheckinDays > 7)
  const hasPlan = (client.plans || []).some(p => p.is_active)
  const compliance = calculateCompliance(client.logs, client.plans)
  const tier = client.package_tier || client.tier
  const tierStyle = TIER_COLORS[tier] || TIER_COLORS.askesis
  const activePlanName = (client.plans || []).find(p => p.is_active)?.plan_data?.split_name
  const statusColor = needsAttention ? '#EF6B73' : !hasPlan ? '#E8A020' : '#47D18C'

  return (
    <div onClick={onProfile}
      className="bg-[rgba(15,20,35,0.85)] border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5 hover:border-[rgba(212,181,112,0.35)] transition cursor-pointer group">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-base shrink-0"
          style={{ background: 'rgba(212,181,112,0.1)', border: `1.5px solid rgba(212,181,112,0.3)`, color: '#D4B570' }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-medium text-warm text-sm truncate">{client.full_name || 'Bez nazwy'}</p>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColor }} />
          </div>
          <p className="text-xs text-muted truncate">{client.email}</p>
        </div>
        {tier && (
          <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium tracking-wide"
            style={{ color: tierStyle.color, border: `1px solid ${tierStyle.border}`, background: `${tierStyle.color}10` }}>
            {TIER_LABELS[tier] || tier}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Treningi', value: client.logs?.length ?? 0 },
          { label: 'Ost. trening', value: noTrainingDays === null ? '—' : noTrainingDays < 1 ? 'dziś' : `${Math.floor(noTrainingDays)}d` },
          { label: 'Realizacja planu', value: compliance === null ? '—' : `${compliance}%`, color: compliance === null ? '#8F9AAF' : compliance >= 80 ? '#47D18C' : compliance >= 60 ? '#E8A020' : '#EF6B73' },
        ].map(m => (
          <div key={m.label} className="bg-bg-deep rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted mb-0.5">{m.label}</p>
            <p className="text-sm font-semibold" style={{ color: m.color || '#f2eee8' }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="min-h-[18px] mb-3">
        {!hasPlan && <p className="text-[11px] text-[#E8A020]">⚠ Brak aktywnego planu</p>}
        {hasPlan && activePlanName && <p className="text-[11px] text-[#47D18C]">✓ {activePlanName}</p>}
        {needsAttention && hasPlan && (
          <p className="text-[11px] text-danger">
            {noTrainingDays !== null && noTrainingDays > 5
              ? `⚠ Brak treningu ${Math.floor(noTrainingDays)} dni`
              : `⚠ Brak check-inu ${Math.floor(noCheckinDays)} dni`}
          </p>
        )}
      </div>

      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
        <button onClick={onProfile}
          className="flex-1 text-xs border-2 border-[rgba(212,181,112,0.35)] text-gold py-2 rounded-lg hover:bg-gold hover:text-bg-deep transition">
          Profil
        </button>
        <button onClick={onNewPlan}
          className="flex-1 text-xs border-2 border-[rgba(212,181,112,0.35)] text-gold py-2 rounded-lg hover:bg-gold hover:text-bg-deep transition">
          Nowy plan
        </button>
      </div>
    </div>
  )
}

function InviteClientModal({ open, onClose, onSuccess }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  if (!open) return null
  const reset = () => { setFullName(''); setEmail(''); setError(''); setSuccessMsg(''); setSubmitting(false) }
  const handleClose = () => { if (submitting) return; reset(); onClose() }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccessMsg(''); setSubmitting(true)
    try {
      const res = await fetch('/api/invite-client', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, full_name: fullName }) })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) { setError(json.error || 'Nie udało się wysłać zaproszenia.'); setSubmitting(false); return }
      setSuccessMsg(`Zaproszenie wysłane na ${email}`)
      setSubmitting(false)
      onSuccess?.()
    } catch (err) { setError(err?.message || 'Błąd sieci.'); setSubmitting(false) }
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="w-full max-w-md bg-[rgba(15,20,35,0.85)] border border-[rgba(212,181,112,0.3)] rounded-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl text-gold">Zaproś klienta</h3>
          <button onClick={handleClose} className="text-muted hover:text-warm text-2xl leading-none">×</button>
        </div>
        {successMsg ? (
          <div className="space-y-4">
            <div className="bg-[#0F2A1A] border border-[rgba(71,209,140,0.3)] text-success text-sm rounded-lg p-4 text-center">✓ {successMsg}</div>
            <button onClick={handleClose} className="w-full bg-gold text-bg-deep py-2.5 rounded-lg font-medium hover:opacity-90">Zamknij</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-widest mb-1.5">Imię i nazwisko</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required disabled={submitting}
                className="w-full bg-bg-deep border-2 border-[rgba(212,181,112,0.35)] rounded-lg px-3 py-2.5 text-warm focus:outline-none focus:border-gold text-sm" placeholder="Jan Kowalski" />
            </div>
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-widest mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={submitting}
                className="w-full bg-bg-deep border-2 border-[rgba(212,181,112,0.35)] rounded-lg px-3 py-2.5 text-warm focus:outline-none focus:border-gold text-sm" placeholder="klient@example.com" />
            </div>
            {error && <div className="bg-[#2A1414] border border-[rgba(239,107,115,0.3)] text-danger text-sm rounded-lg p-3">{error}</div>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={handleClose} className="flex-1 border border-[rgba(212,181,112,0.3)] text-gold py-2.5 rounded-lg text-sm hover:bg-gold/10">Anuluj</button>
              <button type="submit" disabled={submitting} className="flex-1 bg-gold text-bg-deep py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Wysyłanie…' : 'Wyślij zaproszenie'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function DashboardClient({ profile, clients }) {
  const router = useRouter()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('overview')
  const safeClients = clients || []

  const stats = useMemo(() => {
    const active = safeClients.length
    const needsAttention = safeClients.filter(c => {
      const noTraining = daysSince(c.logs?.[0]?.session_date)
      const noCheckin = daysSince(c.checkins?.[0]?.created_at)
      return (noTraining !== null && noTraining > 5) || (noCheckin !== null && noCheckin > 7)
    }).length
    const withoutPlan = safeClients.filter(c => !(c.plans || []).some(p => p.is_active)).length
    const totalLogs = safeClients.reduce((sum, c) => sum + (c.logs?.length || 0), 0)
    const pendingCheckins = safeClients.reduce((sum, c) => sum + (c.checkins || []).filter(ci => !ci.coach_feedback).length, 0)
    return { active, needsAttention, withoutPlan, totalLogs, pendingCheckins }
  }, [safeClients])

  const attentionClients = safeClients.filter(c => {
    const noTraining = daysSince(c.logs?.[0]?.session_date)
    const noCheckin = daysSince(c.checkins?.[0]?.created_at)
    return (noTraining !== null && noTraining > 5) || (noCheckin !== null && noCheckin > 7)
  })

  const recentEvents = useMemo(() => {
    const events = []
    safeClients.forEach(client => {
      const name = client.full_name?.split(' ')?.[0] || 'Klient'
      if (client.logs?.[0]) events.push({ id: `log-${client.id}`, icon: '⚡', color: '#47D18C', text: `${name} ukończył trening`, date: client.logs[0].session_date || client.logs[0].created_at, clientId: client.id })
      if (client.checkins?.[0]) {
        const pending = !client.checkins[0].coach_feedback
        events.push({ id: `ci-${client.id}`, icon: '◈', color: pending ? '#EF6B73' : '#D4B570', text: `${name} wysłał check-in${pending ? ' — czeka na odpowiedź' : ''}`, date: client.checkins[0].submitted_at || client.checkins[0].created_at, clientId: client.id, urgent: pending })
      }
    })
    return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)
  }, [safeClients])

  const firstName = profile?.full_name?.split(' ')?.[0] || 'Trenerze'

  return (
    <div className="min-h-screen text-warm font-body relative">

      <nav style={{position:'sticky',top:0,zIndex:50,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(212,181,112,0.12)',height:'52px',display:'flex',alignItems:'center',padding:'0 10px',gap:'6px'}}>
        <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.1rem',color:'#D4B570',letterSpacing:'0.2em',flexShrink:0}}>ARETÉ</span>
        <span style={{fontSize:'8px',padding:'2px 6px',borderRadius:'4px',border:'1px solid rgba(212,181,112,0.2)',color:'rgba(212,181,112,0.4)',letterSpacing:'0.1em',flexShrink:0}}>α 0.1</span>
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'2px'}}>
          {[{id:'overview',label:'Przegląd'},{id:'clients',label:'Klienci'},{id:'attention',label:'Uwaga',badge:stats.needsAttention},{id:'checkins',label:'Raporty',badge:stats.pendingCheckins}].map(({id,label,badge})=>(
            <button key={id} onClick={()=>setActiveNav(id)} style={{position:'relative',padding:'5px 8px',borderRadius:'8px',fontSize:'11px',border:'none',cursor:'pointer',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap',background:activeNav===id?'rgba(212,181,112,0.12)':'transparent',color:activeNav===id?'#D4B570':'#8F9AAF'}}>
              {label}
              {badge>0&&<span style={{position:'absolute',top:'-3px',right:'-3px',fontSize:'8px',background:'#EF6B73',color:'white',borderRadius:'50%',width:'13px',height:'13px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>{badge}</span>}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'5px',flexShrink:0}}>
          <button onClick={()=>setInviteOpen(true)} style={{background:'#D4B570',color:'#0f0f0f',border:'none',borderRadius:'8px',padding:'5px 10px',fontSize:'11px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px'}}>
            <IconAdd size={14} color="#0f0f0f"/> Dodaj
          </button>
          <a href="/dashboard/knowledge"
            style={{background:'rgba(212,181,112,0.1)',color:'#D4B570',border:'2px solid rgba(212,181,112,0.3)',borderRadius:'8px',padding:'5px 10px',fontSize:'11px',fontWeight:'600',textDecoration:'none',whiteSpace:'nowrap'}}>
            Baza wiedzy
          </a>
          <div style={{width:'26px',height:'26px',borderRadius:'50%',background:'rgba(212,181,112,0.15)',border:'1px solid rgba(212,181,112,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'#D4B570',fontSize:'10px',fontWeight:'bold'}}>{getInitials(profile?.full_name,profile?.email)}</div>
          <button onClick={async()=>{const s=createClient();await s.auth.signOut();window.location.href='/'}} style={{background:'none',border:'none',cursor:'pointer',padding:'4px',display:'flex',alignItems:'center'}}>
            <IconLogout size={18}/>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <div className="mb-5">
          <p className="text-xs text-muted mb-1 capitalize">{new Date().toLocaleDateString('pl-PL',{weekday:'long',day:'numeric',month:'long'})}</p>
          <h1 className="font-display text-2xl text-gold">Witaj, {firstName}</h1>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'20px'}}>
          {[
            {label:'Klienci',value:stats.active,icon:<IconClients size={18}/>,color:'#D4B570',id:'clients'},
            {label:'Uwaga',value:stats.needsAttention,icon:<IconAttention size={18} color={stats.needsAttention>0?'#EF6B73':'#47D18C'}/>,color:stats.needsAttention>0?'#EF6B73':'#47D18C',id:'attention'},
            {label:'Bez planu',value:stats.withoutPlan,icon:<IconProgress size={18} color={stats.withoutPlan>0?'#E8A020':'#47D18C'}/>,color:stats.withoutPlan>0?'#E8A020':'#47D18C',id:null},
            {label:'Treningi',value:stats.totalLogs,icon:<IconProgress size={18}/>,color:'#D4B570',id:null},
            {label:'Raporty',value:stats.pendingCheckins,icon:<IconReport size={18} color={stats.pendingCheckins>0?'#EF6B73':'#47D18C'}/>,color:stats.pendingCheckins>0?'#EF6B73':'#47D18C',id:'checkins'},
          ].map(({label,value,icon,color,id})=>(
            <div key={label} onClick={()=>id&&setActiveNav(id)} style={{background:'rgba(15,20,35,0.85)',border:'2px solid rgba(212,181,112,0.35)',borderRadius:'12px',padding:'10px 12px',cursor:id?'pointer':'default'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px'}}>
                <p style={{fontSize:'9px',color:'#8F9AAF',textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>{label}</p>
                {icon}
              </div>
              <p style={{fontSize:'1.4rem',fontFamily:'Cormorant Garamond,serif',color,margin:0}}>{value}</p>
            </div>
          ))}
        </div>

        {/* NEEDS ATTENTION */}
        {(activeNav === 'overview' || activeNav === 'attention') && attentionClients.length > 0 && (
          <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-danger">⚠</span>
              <h3 className="font-display text-lg text-danger">Wymagają reakcji</h3>
              <span className="ml-auto text-xs text-danger border border-danger/30 px-2 py-0.5 rounded-full">{attentionClients.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {attentionClients.map(client => {
                const noTraining = daysSince(client.logs?.[0]?.session_date)
                const noCheckin  = daysSince(client.checkins?.[0]?.created_at)
                const flags = []
                if (noTraining !== null && noTraining > 5) flags.push(`Brak treningu ${Math.floor(noTraining)} dni`)
                if (noCheckin  !== null && noCheckin  > 7) flags.push(`Brak raportu ${Math.floor(noCheckin)} dni`)
                return (
                  <div key={client.id} onClick={() => router.push(`/dashboard/client/${client.id}`)}
                    className="flex items-center gap-3 bg-danger/5 border border-danger/15 rounded-xl p-3 cursor-pointer hover:border-danger/30 transition">
                    <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center font-display text-danger font-bold text-xs shrink-0">
                      {getInitials(client.full_name, client.email)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm truncate">{client.full_name || 'Bez nazwy'}</p>
                      <p className="text-xs text-danger truncate">{flags.join(' · ')}</p>
                    </div>
                    <span className="text-muted text-sm">→</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PENDING CHECKINS */}
        {activeNav === 'checkins' && (
          <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5 mb-6">
            <p className="text-[10px] text-danger uppercase tracking-widest mb-4">Oczekujące raporty ({stats.pendingCheckins})</p>
            {stats.pendingCheckins === 0 ? (
              <p className="text-muted text-sm text-center py-4">Wszystkie raporty obsłużone ✓</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {safeClients.filter(c => (c.checkins || []).some(ci => !ci.coach_feedback)).map(client => (
                  <div key={client.id} onClick={() => router.push(`/dashboard/client/${client.id}`)}
                    className="flex items-center gap-3 bg-danger/5 border border-danger/15 rounded-xl p-3 cursor-pointer hover:border-danger/30 transition">
                    <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center font-display text-danger font-bold text-xs shrink-0">
                      {getInitials(client.full_name, client.email)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-warm truncate">{client.full_name || 'Bez nazwy'}</p>
                      <p className="text-xs text-danger">Odpowiedz na raport →</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CLIENTS GRID */}
        {(activeNav === 'overview' || activeNav === 'clients' || activeNav === 'attention') && (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl text-gold">
                  {activeNav === 'attention' ? 'Wymagają reakcji' : 'Klienci'}
                </h2>
                <span className="text-xs text-muted">
                  {(activeNav === 'attention' ? attentionClients : safeClients).length} {safeClients.length === 1 ? 'osoba' : 'osób'}
                </span>
              </div>
              {safeClients.length === 0 ? (
                <div className="bg-[rgba(15,20,35,0.85)] border border-dashed border-[rgba(212,181,112,0.35)] rounded-2xl p-12 text-center">
                  <p className="text-4xl mb-4 opacity-20">◎</p>
                  <p className="text-warm font-medium mb-2">Brak klientów</p>
                  <p className="text-muted text-sm mb-6">Dodaj pierwszego klienta aby zacząć.</p>
                  <button onClick={() => setInviteOpen(true)} className="bg-gold text-bg-deep px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90">
                    + Dodaj klienta
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeNav === 'attention' ? attentionClients : safeClients).map(client => (
                    <ClientCard key={client.id} client={client}
                      onProfile={() => router.push(`/dashboard/client/${client.id}`)}
                      onNewPlan={() => router.push(`/dashboard/client/${client.id}/plan/new`)} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            {activeNav === 'overview' && (
              <div className="space-y-4">
                {/* Activity Feed */}
                {recentEvents.length > 0 && (
                  <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
                    <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Ostatnia aktywność</p>
                    <div className="space-y-2">
                      {recentEvents.map(event => (
                        <div key={event.id} onClick={() => router.push(`/dashboard/client/${event.clientId}`)}
                          className="flex items-center gap-3 py-2 border-b border-[rgba(212,181,112,0.06)] last:border-0 cursor-pointer hover:opacity-80 transition">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                            style={{ background: `${event.color}15`, border: `1px solid ${event.color}30`, color: event.color }}>
                            {event.icon}
                          </div>
                          <p className="flex-1 text-xs text-warm leading-snug">{event.text}</p>
                          {event.urgent && <span className="text-[10px] text-danger border border-danger/30 px-1.5 py-0.5 rounded-full shrink-0">!</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance summary */}
                {(() => {
                  const withCompliance = safeClients
                    .map(c => ({ c, pct: calculateCompliance(c.logs, c.plans) }))
                    .filter(({ pct }) => pct !== null)
                    .sort((a, b) => a.pct - b.pct)
                  if (withCompliance.length === 0) return null
                  const avg = Math.round(withCompliance.reduce((s, { pct }) => s + pct, 0) / withCompliance.length)
                  return (
                    <div className="bg-[rgba(15,20,35,0.85)] backdrop-blur-sm border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] text-muted uppercase tracking-widest">Realizacja — 4 tygodnie</p>
                        <span className="text-sm font-semibold" style={{ color: avg >= 80 ? '#47D18C' : avg >= 60 ? '#E8A020' : '#EF6B73' }}>śr. {avg}%</span>
                      </div>
                      <div className="space-y-2">
                        {withCompliance.map(({ c, pct }) => (
                          <div key={c.id} onClick={() => router.push(`/dashboard/client/${c.id}`)} className="cursor-pointer hover:opacity-80 transition">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-warm">{c.full_name?.split(' ')[0] || 'Klient'}</span>
                              <span style={{ color: pct >= 80 ? '#47D18C' : pct >= 60 ? '#E8A020' : '#EF6B73' }}>{pct}%</span>
                            </div>
                            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 80 ? '#47D18C' : pct >= 60 ? '#E8A020' : '#EF6B73' }}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

      </main>

      <InviteClientModal open={inviteOpen} onClose={() => setInviteOpen(false)} onSuccess={() => router.refresh()} />
    </div>
  )
}
