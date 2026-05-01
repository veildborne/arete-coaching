'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const TIER_COLORS = {
  paideia: { color: '#a07850', bg: 'rgba(160,120,80,0.12)', border: 'rgba(160,120,80,0.3)' },
  askesis: { color: '#8a9db5', bg: 'rgba(138,157,181,0.12)', border: 'rgba(138,157,181,0.3)' },
  arete:   { color: '#b8a677', bg: 'rgba(184,166,119,0.12)', border: 'rgba(184,166,119,0.35)' },
}
const STATUS_COLORS = {
  active:    { color: '#4caf50', label: 'Aktywny' },
  paused:    { color: '#e8a020', label: 'Wstrzymany' },
  completed: { color: '#8a9db5', label: 'Zakończony' },
  lead:      { color: '#64b5f6', label: 'Lead' },
}

function getInitials(name, email) {
  if (name) {
    const p = name.trim().split(' ')
    return p.length >= 2 ? (p[0][0] + p[p.length-1][0]).toUpperCase() : name.slice(0,2).toUpperCase()
  }
  return (email || '??').slice(0,2).toUpperCase()
}

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Pill({ children, color, bg, border }) {
  return (
    <span style={{
      fontSize: 11, padding: '3px 10px', borderRadius: 99,
      background: bg || 'rgba(255,255,255,0.05)',
      border: `1px solid ${border || 'rgba(255,255,255,0.12)'}`,
      color: color || '#a0a0a0', fontWeight: 500, letterSpacing: '0.04em',
    }}>{children}</span>
  )
}

function Section({ title, children, action }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 18, fontWeight: 600, color: '#e8e8e8', margin: 0,
        }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div style={{
      padding: '32px 20px', textAlign: 'center',
      border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10,
      color: '#444', fontSize: 13,
    }}>
      <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.3 }}>∅</div>
      {text}
    </div>
  )
}

// ─── Ankieta viewer ───────────────────────────────────────────────────────────

const BLOCK_LABELS = {
  imie: 'Imię i nazwisko', wiek: 'Wiek', plec: 'Płeć',
  wzrost_cm: 'Wzrost (cm)', waga_kg: 'Waga (kg)',
  cel: 'Główny cel', cel_wagowy: 'Cel wagowy', deadline: 'Deadline',
  priorytetowe_partie: 'Priorytetowe partie', staz: 'Staż treningowy',
  aktualny_split: 'Aktualny split', pr_squat: 'PR Przysiad',
  pr_bench: 'PR Wyciskanie', pr_deadlift: 'PR Martwy ciąg',
  pr_ohp: 'PR OHP', pr_row: 'PR Wiosłowanie',
  programy_wczesniej: 'Programy wcześniej', kontuzje_aktualne: 'Aktualne kontuzje',
  kontuzje_przeszle: 'Przeszłe kontuzje', cwiczenia_unikane: 'Unikane ćwiczenia',
  mobilnosc: 'Problemy z mobilnością', dni_tydzien: 'Dni / tydzień',
  czas_sesji: 'Czas sesji', miejsce_treningu: 'Miejsce treningu',
  brak_sprzetu: 'Brak sprzętu', cardio_typ: 'Cardio', cardio_ile: 'Cardio ile razy',
  dieta_aktualna: 'Dieta aktualna', posilki_dziennie: 'Posiłki / dzień',
  dieta_doswiadczenie: 'Doświadczenie z dietą', alergie: 'Alergie',
  suplementy: 'Suplementy', praca: 'Typ pracy', sen: 'Sen',
  stres: 'Poziom stresu', dodatkowe_info: 'Dodatkowe info',
}

const BLOCKS_ORDER = [
  { title: 'Dane podstawowe',       keys: ['imie','wiek','plec','wzrost_cm','waga_kg'] },
  { title: 'Cel treningowy',        keys: ['cel','cel_wagowy','deadline','priorytetowe_partie'] },
  { title: 'Historia treningowa',   keys: ['staz','aktualny_split','pr_squat','pr_bench','pr_deadlift','pr_ohp','pr_row','programy_wczesniej'] },
  { title: 'Kontuzje i ograniczenia', keys: ['kontuzje_aktualne','kontuzje_przeszle','cwiczenia_unikane','mobilnosc'] },
  { title: 'Dostępność i sprzęt',   keys: ['dni_tydzien','czas_sesji','miejsce_treningu','brak_sprzetu','cardio_typ','cardio_ile'] },
  { title: 'Żywienie',              keys: ['dieta_aktualna','posilki_dziennie','dieta_doswiadczenie','alergie','suplementy'] },
  { title: 'Styl życia',            keys: ['praca','sen','stres','dodatkowe_info'] },
]

function AnkietaViewer({ questionnaire }) {
  if (!questionnaire) return (
    <div style={{
      padding: '32px 20px', textAlign: 'center',
      border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10,
    }}>
      <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.3 }}>∅</div>
      <div style={{ color: '#444', fontSize: 13 }}>Klient nie wypełnił jeszcze ankiety.</div>
    </div>
  )

  const data = questionnaire.data || {}

  return (
    <div>
      <div style={{ fontSize: 11, color: 'rgba(184,166,119,0.5)', marginBottom: 16, letterSpacing: '0.05em' }}>
        Wypełniono: {formatDate(questionnaire.created_at)}
      </div>
      {BLOCKS_ORDER.map(block => {
        const entries = block.keys
          .map(k => ({ label: BLOCK_LABELS[k] || k, value: data[k] }))
          .filter(e => e.value)
        if (entries.length === 0) return null
        return (
          <div key={block.title} style={{
            background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '16px 18px', marginBottom: 10,
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14, color: '#b8a677', fontWeight: 600,
              marginBottom: 12, paddingBottom: 8,
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>{block.title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {entries.map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: '#555', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  <div style={{ fontSize: 13, color: '#e8e8e8', lineHeight: 1.4 }}>{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Check-in card with feedback ─────────────────────────────────────────────

function CheckinCard({ ci, onFeedbackSaved }) {
  const [open, setOpen]     = useState(false)
  const [text, setText]     = useState(ci.coach_feedback || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const hasFeedback = !!ci.coach_feedback

  async function saveFeedback() {
    if (!text.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('check_ins')
      .update({ coach_feedback: text.trim() })
      .eq('id', ci.id)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setOpen(false)
      onFeedbackSaved?.(ci.id, text.trim())
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div style={{
      background: '#1a1a1a',
      border: `1px solid ${hasFeedback ? 'rgba(184,166,119,0.15)' : 'rgba(239,107,115,0.2)'}`,
      borderRadius: 10, padding: '16px 18px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, color: '#b8a677', fontWeight: 600,
          }}>Tydzień {ci.week_number}</span>
          {hasFeedback ? (
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 99,
              background: 'rgba(71,209,140,0.1)', border: '1px solid rgba(71,209,140,0.25)',
              color: '#47D18C', letterSpacing: '0.05em',
            }}>Odpowiedziano</span>
          ) : (
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 99,
              background: 'rgba(239,107,115,0.1)', border: '1px solid rgba(239,107,115,0.25)',
              color: '#EF6B73', letterSpacing: '0.05em',
            }}>Oczekuje</span>
          )}
        </div>
        <span style={{ fontSize: 11, color: '#555' }}>{formatDate(ci.submitted_at || ci.created_at)}</span>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { label: 'Masa ciała',  value: ci.body_weight ? `${ci.body_weight} kg` : '—' },
          { label: 'Energia',     value: ci.energy_level ? `${ci.energy_level}/10` : '—' },
          { label: 'Sen',         value: ci.sleep_quality ? `${ci.sleep_quality}/10` : '—' },
          { label: 'Zakwasy',     value: ci.soreness_level ? `${ci.soreness_level}/10` : '—' },
          { label: 'Adherencja',  value: ci.adherence_pct != null ? `${ci.adherence_pct}%` : '—' },
        ].map(m => (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 12px',
          }}>
            <div style={{ fontSize: 10, color: '#555', marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 14, color: '#e8e8e8', fontWeight: 500 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Client notes */}
      {ci.client_notes && (
        <div style={{
          background: 'rgba(255,255,255,0.02)', borderRadius: 6,
          padding: '10px 12px', marginBottom: 10,
          borderLeft: '2px solid rgba(184,166,119,0.3)',
        }}>
          <div style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>Notatki klienta</div>
          <div style={{ fontSize: 13, color: '#a0a0a0', lineHeight: 1.5 }}>{ci.client_notes}</div>
        </div>
      )}

      {/* Existing feedback */}
      {hasFeedback && !open && (
        <div style={{
          background: 'rgba(184,166,119,0.05)', borderRadius: 6,
          padding: '10px 12px', marginBottom: 10,
          borderLeft: '2px solid rgba(184,166,119,0.4)',
        }}>
          <div style={{ fontSize: 10, color: '#b8a677', marginBottom: 4 }}>Twój feedback</div>
          <div style={{ fontSize: 13, color: '#a0a0a0', lineHeight: 1.5 }}>{ci.coach_feedback}</div>
        </div>
      )}

      {/* Feedback form */}
      {open && (
        <div style={{ marginBottom: 10 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Napisz feedback dla klienta — korekty planu, wskazówki, motywacja..."
            rows={4}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(184,166,119,0.25)',
              color: '#e8e8e8', fontSize: 13,
              fontFamily: "'Outfit', sans-serif",
              boxSizing: 'border-box', outline: 'none',
              resize: 'vertical', lineHeight: 1.6, marginBottom: 8,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(184,166,119,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(184,166,119,0.25)'}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={saveFeedback}
              disabled={saving || !text.trim()}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8,
                background: saving ? 'rgba(184,166,119,0.3)' : 'linear-gradient(135deg, #b8a677, #d4c494)',
                border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                color: '#0f1a2e', fontSize: 13, fontWeight: 700,
                fontFamily: "'Outfit', sans-serif", letterSpacing: '0.06em',
              }}
            >
              {saving ? 'Zapisuję...' : 'Wyślij feedback'}
            </button>
            <button
              onClick={() => { setOpen(false); setText(ci.coach_feedback || '') }}
              style={{
                padding: '9px 16px', borderRadius: 8,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#666', fontSize: 13, cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif",
              }}
            >Anuluj</button>
          </div>
        </div>
      )}

      {/* Action button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: '100%', padding: '8px 0', borderRadius: 8,
            background: 'transparent',
            border: `1px solid ${hasFeedback ? 'rgba(184,166,119,0.2)' : 'rgba(239,107,115,0.3)'}`,
            color: hasFeedback ? 'rgba(184,166,119,0.6)' : '#EF6B73',
            fontSize: 12, cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif", letterSpacing: '0.06em',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,166,119,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {hasFeedback ? '✎ Edytuj feedback' : '+ Dodaj feedback'}
        </button>
      )}

      {/* Saved confirmation */}
      {saved && (
        <div style={{
          marginTop: 8, textAlign: 'center', fontSize: 12,
          color: '#47D18C', fontFamily: "'Outfit', sans-serif",
        }}>
          ✓ Feedback wysłany
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ClientDetail({ client, plans, logs, checkins: initialCheckins, questionnaire, coachName }) {
  const router = useRouter()
  const [tab, setTab] = useState('plans')
  const [checkins, setCheckins] = useState(initialCheckins)

  const tier     = TIER_COLORS[client.package_tier?.toLowerCase()] || {}
  const status   = STATUS_COLORS[client.status] || STATUS_COLORS.lead
  const initials = getInitials(client.full_name, client.email)

  const pendingFeedback = checkins.filter(ci => !ci.coach_feedback).length

  const TABS = [
    { id: 'plans',         label: 'Plany',           count: plans.length },
    { id: 'logs',          label: 'Treningi',         count: logs.length },
    { id: 'checkins',      label: 'Check-iny',        count: pendingFeedback > 0 ? pendingFeedback : checkins.length, urgent: pendingFeedback > 0 },
    { id: 'questionnaire', label: 'Ankieta',          count: questionnaire ? 1 : 0 },
  ]

  // Update local state after coach saves feedback
  function handleFeedbackSaved(checkinId, feedbackText) {
    setCheckins(prev => prev.map(ci =>
      ci.id === checkinId ? { ...ci, coach_feedback: feedbackText } : ci
    ))
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f',
      color: '#e8e8e8', fontFamily: "'Outfit', system-ui, sans-serif",
    }}>
      {/* Topbar */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 28px', height: 56,
        display: 'flex', alignItems: 'center', gap: 16,
        position: 'sticky', top: 0,
        background: 'rgba(15,15,15,0.95)',
        backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20, fontWeight: 700, color: '#b8a677', letterSpacing: '0.1em',
        }}>ARETÉ</span>
        <span style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 99,
          border: '1px solid rgba(184,166,119,0.3)', color: '#8a7d5a', letterSpacing: '0.07em',
        }}>BETA</span>
        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 16 }}>|</span>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            fontSize: 13, color: '#666', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: 0,
          }}
          onMouseEnter={e => e.target.style.color = '#b8a677'}
          onMouseLeave={e => e.target.style.color = '#666'}
        >← Klienci</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#555' }}>{coachName}</span>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

        {/* Client card */}
        <div style={{
          background: 'linear-gradient(135deg, #131f36 0%, #0f1a2e 100%)',
          border: '1px solid rgba(184,166,119,0.15)',
          borderRadius: 14, padding: '24px 28px',
          marginBottom: 28, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(184,166,119,0.4), transparent)',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: tier.bg || 'rgba(255,255,255,0.05)',
              border: `1px solid ${tier.border || 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 700, color: tier.color || '#888', flexShrink: 0,
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22, fontWeight: 600, color: '#e8e8e8', margin: 0,
                }}>{client.full_name || 'Bez nazwy'}</h1>
                {client.package_tier && (
                  <Pill color={tier.color} bg={tier.bg} border={tier.border}>
                    {client.package_tier.charAt(0).toUpperCase() + client.package_tier.slice(1)}
                  </Pill>
                )}
                <Pill color={status.color} bg={`${status.color}15`} border={`${status.color}40`}>
                  {status.label}
                </Pill>
                {questionnaire && (
                  <Pill color="#52B788" bg="rgba(82,183,136,0.1)" border="rgba(82,183,136,0.3)">
                    Ankieta ✓
                  </Pill>
                )}
                {pendingFeedback > 0 && (
                  <Pill color="#EF6B73" bg="rgba(239,107,115,0.1)" border="rgba(239,107,115,0.3)">
                    {pendingFeedback} check-in bez odpowiedzi
                  </Pill>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#555', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>{client.email}</span>
                {client.phone && <span>{client.phone}</span>}
                <span>Dołączył: {formatDate(client.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 2,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 24,
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontSize: 13, padding: '9px 16px',
              borderBottom: `2px solid ${tab === t.id ? '#b8a677' : 'transparent'}`,
              color: tab === t.id ? '#b8a677' : '#555',
              background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              transition: 'color 0.15s', marginBottom: -1,
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              {t.label}
              {t.count > 0 && (
                <span style={{
                  fontSize: 10, padding: '1px 6px', borderRadius: 99,
                  background: t.urgent
                    ? 'rgba(239,107,115,0.15)'
                    : tab === t.id ? 'rgba(184,166,119,0.15)' : 'rgba(255,255,255,0.05)',
                  color: t.urgent ? '#EF6B73' : tab === t.id ? '#b8a677' : '#444',
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* PLANS TAB */}
        {tab === 'plans' && (
          <Section title="Plany treningowe" action={
            <button
              onClick={() => router.push(`/dashboard/client/${client.id}/plan/new`)}
              style={{
                fontSize: 12, padding: '7px 16px', borderRadius: 99,
                border: '1px solid rgba(184,166,119,0.3)', background: 'transparent',
                color: '#b8a677', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,166,119,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >+ Nowy plan</button>
          }>
            {plans.length === 0 ? (
              <EmptyState text="Brak planów. Kliknij '+ Nowy plan' żeby dodać pierwszy." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plans.map(plan => (
                  <div key={plan.id} style={{
                    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '14px 18px',
                    display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,166,119,0.2)'; e.currentTarget.style.background = '#1e1e1e' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#1a1a1a' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#e8e8e8', marginBottom: 4 }}>
                        {plan.name || 'Plan bez nazwy'}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {plan.split && <Pill>{plan.split}</Pill>}
                        {plan.goal  && <Pill>{plan.goal}</Pill>}
                      </div>
                    </div>
                    <span style={{ color: '#333', fontSize: 14 }}>›</span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* LOGS TAB */}
        {tab === 'logs' && (
          <Section title="Historia treningów">
            {logs.length === 0 ? (
              <EmptyState text="Brak zalogowanych treningów." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {logs.map(log => (
                  <div key={log.id} style={{
                    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '12px 18px',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(184,166,119,0.08)',
                      border: '1px solid rgba(184,166,119,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600, color: '#b8a677', flexShrink: 0,
                    }}>
                      {log.day_label || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#e8e8e8' }}>Dzień {log.day_label || '—'}</div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{formatDate(log.session_date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* CHECKINS TAB */}
        {tab === 'checkins' && (
          <Section title="Check-iny">
            {checkins.length === 0 ? (
              <EmptyState text="Brak check-inów. Klient jeszcze nie wysłał żadnego." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Summary */}
                {pendingFeedback > 0 && (
                  <div style={{
                    padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(239,107,115,0.08)',
                    border: '1px solid rgba(239,107,115,0.2)',
                    fontSize: 13, color: '#EF6B73',
                    marginBottom: 4,
                  }}>
                    ⚠ {pendingFeedback} {pendingFeedback === 1 ? 'check-in czeka' : 'check-iny czekają'} na Twój feedback
                  </div>
                )}
                {checkins.map(ci => (
                  <CheckinCard
                    key={ci.id}
                    ci={ci}
                    onFeedbackSaved={handleFeedbackSaved}
                  />
                ))}
              </div>
            )}
          </Section>
        )}

        {/* ANKIETA TAB */}
        {tab === 'questionnaire' && (
          <Section title="Ankieta onboardingowa">
            <AnkietaViewer questionnaire={questionnaire} />
          </Section>
        )}

      </main>
    </div>
  )
}