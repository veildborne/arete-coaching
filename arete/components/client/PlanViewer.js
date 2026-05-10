'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

// ─── helpers ────────────────────────────────────────────────────────────────

const GOAL_LABELS = {
  hypertrophy: 'Hipertrofia',
  strength:    'Siła',
  cut:         'Redukcja',
  recomp:      'Rekompo',
}

const MUSCLE_LABELS = {
  chest:         'Klatka',
  back:          'Plecy',
  quads:         'Quady',
  hamstrings:    'Hamstringi',
  glutes:        'Pośladki',
  shoulders:     'Barki',
  side_delts:    'Barki boczne',
  rear_delts:    'Barki tylne',
  biceps:        'Biceps',
  triceps:       'Triceps',
  calves:        'Łydki',
  abs:           'Brzuch',
  lats:          'Najszersze',
  upper_back:    'Górne plecy',
}

const RIR_COLOR = (rir) => {
  if (rir >= 4) return '#52B788'   // deload / zielony
  if (rir === 3) return '#b8a677'  // złoto
  if (rir === 2) return '#C05000'  // amber
  if (rir <= 1)  return '#E57373'  // czerwony — szczyt
  return '#b8a677'
}

// ─── sub-components ─────────────────────────────────────────────────────────

function WeekSelector({ total, current, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
      marginBottom: '20px',
    }}>
      {Array.from({ length: total }, (_, i) => i + 1).map(w => {
        const isDeload = w === total
        const active   = w === current
        return (
          <button
            key={w}
            onClick={() => onChange(w)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: active
                ? `1px solid ${isDeload ? '#52B788' : '#b8a677'}`
                : '1px solid rgba(184,166,119,0.2)',
              background: active
                ? isDeload ? 'rgba(82,183,136,0.15)' : 'rgba(184,166,119,0.12)'
                : 'rgba(255,255,255,0.03)',
              color: active
                ? isDeload ? '#52B788' : '#d4c494'
                : 'rgba(242,238,232,0.45)',
              fontSize: '13px',
              fontFamily: 'Outfit, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: active ? 600 : 400,
            }}
          >
            {isDeload ? `Tyg ${w} — Deload` : `Tyg ${w}`}
          </button>
        )
      })}
    </div>
  )
}

function DayTabs({ days, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      marginBottom: '20px',
      overflowX: 'auto',
      paddingBottom: '4px',
    }}>
      {days.map((day, idx) => {
        const isActive = idx === active
        return (
          <button
            key={idx}
            onClick={() => onChange(idx)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: isActive
                ? '1px solid rgba(192,80,0,0.6)'
                : '1px solid rgba(184,166,119,0.15)',
              background: isActive
                ? 'rgba(192,80,0,0.12)'
                : 'rgba(255,255,255,0.02)',
              color: isActive ? '#d4c494' : 'rgba(242,238,232,0.5)',
              fontSize: '13px',
              fontFamily: 'Outfit, sans-serif',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            {day.label ? `Dzień ${day.label}` : `Dzień ${idx + 1}`}
            {day.name ? ` — ${day.name}` : ''}
          </button>
        )
      })}
    </div>
  )
}

function ExerciseCard({ exercise, weekData, weekIdx }) {
  const [expanded, setExpanded] = useState(false)

  // Fallback do flat exercise data jeśli weekData nie istnieje
  const effectiveData = weekData || {
    sets: exercise.sets,
    reps: exercise.rep_range || exercise.reps,
    rir: exercise.rir ?? 2,
    weight_suggestion: exercise.weight_suggestion,
    notes: exercise.notes,
  }
  if (!effectiveData.sets) return null
  const { sets, reps, rir, weight_suggestion, notes } = effectiveData

  const rirColor = RIR_COLOR(rir)

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(184,166,119,0.1)',
        borderRadius: '10px',
        marginBottom: '10px',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      {/* header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          cursor: 'pointer',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            color: '#f2eee8',
            marginBottom: '3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {exercise.name_pl || exercise.name}
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '12px',
            color: 'rgba(184,166,119,0.7)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {MUSCLE_LABELS[exercise.muscle_group] || exercise.muscle_group}
            {exercise.compound && (
              <span style={{ marginLeft: '6px', color: '#C05000' }}>• Wielostawowe</span>
            )}
          </div>
        </div>

        {/* pill summary */}
        <div style={{
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          flexShrink: 0,
          marginLeft: '12px',
        }}>
          <span style={{
            padding: '4px 10px',
            background: 'rgba(184,166,119,0.1)',
            borderRadius: '6px',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            color: '#d4c494',
            fontWeight: 600,
          }}>
            {sets}×{reps}
          </span>
          <span style={{
            padding: '4px 10px',
            background: `${rirColor}18`,
            borderRadius: '6px',
            border: `1px solid ${rirColor}40`,
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            color: rirColor,
            fontWeight: 600,
          }}>
            RIR {rir}
          </span>
          <span style={{
            color: 'rgba(184,166,119,0.4)',
            fontSize: '14px',
            marginLeft: '4px',
          }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* expanded detail */}
      {expanded && (
        <div style={{
          padding: '0 16px 16px',
          borderTop: '1px solid rgba(184,166,119,0.08)',
        }}>
          {/* weekly progression */}
          <div style={{ marginTop: '12px', marginBottom: '10px' }}>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '11px',
              color: 'rgba(184,166,119,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              Progresja mezocyklu
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {exercise.weeks?.map((wk, i) => {
                const isCurrent = i === weekIdx
                const isDeload  = i === exercise.weeks.length - 1
                return (
                  <div
                    key={i}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: isCurrent
                        ? 'rgba(192,80,0,0.15)'
                        : 'rgba(255,255,255,0.03)',
                      border: isCurrent
                        ? '1px solid rgba(192,80,0,0.5)'
                        : '1px solid rgba(184,166,119,0.08)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '10px',
                      color: isDeload
                        ? '#52B788'
                        : isCurrent ? '#C05000' : 'rgba(184,166,119,0.4)',
                      marginBottom: '2px',
                    }}>
                      {isDeload ? 'DL' : `T${i + 1}`}
                    </div>
                    <div style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '12px',
                      color: isCurrent ? '#d4c494' : 'rgba(242,238,232,0.5)',
                      fontWeight: isCurrent ? 600 : 400,
                    }}>
                      {wk.sets}×{wk.reps}
                    </div>
                    <div style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '11px',
                      color: RIR_COLOR(wk.rir),
                    }}>
                      R{wk.rir}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* weight suggestion */}
          {weight_suggestion && (
            <div style={{
              padding: '8px 12px',
              background: 'rgba(192,80,0,0.08)',
              borderRadius: '8px',
              borderLeft: '3px solid #C05000',
              marginBottom: '8px',
            }}>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '12px',
                color: 'rgba(184,166,119,0.7)',
                marginBottom: '2px',
              }}>Sugerowany ciężar</div>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: '#C05000',
              }}>
                {weight_suggestion} kg
              </div>
            </div>
          )}

          {/* notes */}
          {notes && (
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '13px',
              color: 'rgba(184,166,119,0.7)',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              {notes}
            </div>
          )}

          {/* stretch / equipment badges */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
            {exercise.stretch_position && (
              <span style={{
                padding: '3px 8px',
                background: 'rgba(82,183,136,0.1)',
                border: '1px solid rgba(82,183,136,0.3)',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#52B788',
                fontFamily: 'Outfit, sans-serif',
              }}>
                ✦ Stretch position
              </span>
            )}
            {exercise.sfr_rating && (
              <span style={{
                padding: '3px 8px',
                background: 'rgba(184,166,119,0.08)',
                border: '1px solid rgba(184,166,119,0.2)',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#b8a677',
                fontFamily: 'Outfit, sans-serif',
              }}>
                SFR {exercise.sfr_rating}/5
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── main component ──────────────────────────────────────────────────────────

export default function PlanViewer() {
  const [plan,        setPlan]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [activeWeek,  setActiveWeek]  = useState(1)
  const [activeDay,   setActiveDay]   = useState(0)

  useEffect(() => {
    async function fetchPlan() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Nie zalogowany')

        const { data, error: err } = await supabase
          .from('training_plans')
          .select('*')
          .eq('client_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (err) {
          // no plan yet — not a hard error
          if (err.code === 'PGRST116') {
            setPlan(null)
          } else {
            throw err
          }
        } else {
          setPlan(data)
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [])

  // ── loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 0',
      }}>
        <div style={{
          width: '32px', height: '32px',
          border: '2px solid rgba(184,166,119,0.2)',
          borderTop: '2px solid #b8a677',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── error ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: 'rgba(139,26,26,0.15)',
        border: '1px solid rgba(229,115,115,0.3)',
        borderRadius: '10px',
        color: '#E57373',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
      }}>
        Błąd: {error}
      </div>
    )
  }

  // ── no plan ────────────────────────────────────────────────────
  if (!plan) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '22px',
          color: '#d4c494',
          marginBottom: '10px',
        }}>
          Brak aktywnego planu
        </div>
        <div style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '14px',
          color: 'rgba(184,166,119,0.6)',
          lineHeight: 1.6,
        }}>
          Twój trener przygotowuje dla Ciebie<br />
          spersonalizowany program treningowy.
        </div>
      </div>
    )
  }

  // ── parse plan_data ────────────────────────────────────────────
  const planData = plan.plan_data || {}
  const weeks    = planData.mesocycle_weeks || planData.weeks || 6
  const isDeload = activeWeek === weeks

  // sessions to object {A: {...}, B: {...}} lub array
  const rawSessions = planData.sessions || {}
  const days = Array.isArray(rawSessions)
    ? rawSessions
    : Object.entries(rawSessions).map(([key, val]) => ({
        key,
        name: val.name || val.label || `Dzień ${key}`,
        exercises: Array.isArray(val.exercises) ? val.exercises : [],
        muscles: val.muscles || [],
      }))

  const currentDay = days[activeDay] || days[0]

  // exercises mogą być plain lub mieć tygodniową progresję
  const rawExercises = currentDay?.exercises || []
  const exercises = rawExercises.map(ex => {
    // jeśli ćwiczenie ma weeks[] — wyciągnij dane dla aktywnego tygodnia
    if (ex.weeks && Array.isArray(ex.weeks)) {
      const weekData = ex.weeks[activeWeek - 1] || ex.weeks[0] || {}
      return { ...ex, ...weekData }
    }
    return ex
  })

  // ── render ─────────────────────────────────────────────────────
  return (
    <div style={{ padding: '0 0 40px' }}>

      {/* plan header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(19,31,54,0.8) 0%, rgba(10,15,26,0.9) 100%)',
        border: '1px solid rgba(184,166,119,0.15)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '22px',
          color: '#d4c494',
          marginBottom: '8px',
          letterSpacing: '0.02em',
        }}>
          {plan.name}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {plan.goal && (
            <span style={{
              padding: '4px 10px',
              background: 'rgba(192,80,0,0.12)',
              border: '1px solid rgba(192,80,0,0.4)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#C05000',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {GOAL_LABELS[plan.goal] || plan.goal}
            </span>
          )}
          {plan.split && (
            <span style={{
              padding: '4px 10px',
              background: 'rgba(184,166,119,0.08)',
              border: '1px solid rgba(184,166,119,0.2)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#b8a677',
              fontFamily: 'Outfit, sans-serif',
            }}>
              {plan.split}
            </span>
          )}
          <span style={{
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(184,166,119,0.1)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'rgba(184,166,119,0.6)',
            fontFamily: 'Outfit, sans-serif',
          }}>
            {weeks} tygodni
          </span>
        </div>
      </div>

      {/* deload banner */}
      {isDeload && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(82,183,136,0.1)',
          border: '1px solid rgba(82,183,136,0.35)',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '20px' }}>🌿</span>
          <div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#52B788',
            }}>
              Tydzień deload
            </div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '12px',
              color: 'rgba(82,183,136,0.7)',
            }}>
              50% objętości · RIR 4-5 · priorytet: regeneracja
            </div>
          </div>
        </div>
      )}

      {/* week selector */}
      <div style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: '11px',
        color: 'rgba(184,166,119,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '8px',
      }}>
        Tydzień mezocyklu
      </div>
      <WeekSelector
        total={weeks}
        current={activeWeek}
        onChange={setActiveWeek}
      />

      {/* day tabs */}
      {days.length > 0 && (
        <>
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '11px',
            color: 'rgba(184,166,119,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '8px',
          }}>
            Sesja treningowa
          </div>
          <DayTabs
            days={days}
            active={activeDay}
            onChange={setActiveDay}
          />
        </>
      )}

      {/* exercises */}
      {exercises.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 0',
          color: 'rgba(184,166,119,0.4)',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '14px',
        }}>
          Brak ćwiczeń w tej sesji.
        </div>
      ) : (
        <div>
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '11px',
            color: 'rgba(184,166,119,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px',
          }}>
            {exercises.length} ćwiczenia · kliknij po szczegóły
          </div>

          {exercises.map((ex, idx) => {
            const weekData = ex.weeks?.[activeWeek - 1]
            return (
              <ExerciseCard
                key={ex.exercise_id || idx}
                exercise={ex}
                weekData={weekData}
                weekIdx={activeWeek - 1}
              />
            )
          })}
        </div>
      )}

      {/* legend */}
      <div style={{
        marginTop: '32px',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(184,166,119,0.08)',
        borderRadius: '10px',
      }}>
        <div style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '11px',
          color: 'rgba(184,166,119,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '10px',
        }}>
          Legenda RIR
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { rir: 0, label: 'Do upadku' },
            { rir: 1, label: 'Szczyt' },
            { rir: 2, label: 'Wysokie' },
            { rir: 3, label: 'Bazowe' },
            { rir: 4, label: 'Deload' },
          ].map(({ rir, label }) => (
            <div key={rir} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                width: '10px', height: '10px',
                borderRadius: '50%',
                background: RIR_COLOR(rir),
                display: 'inline-block',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '12px',
                color: 'rgba(242,238,232,0.5)',
              }}>
                RIR {rir} — {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
