'use client'
import { getDailyTipForUser } from '@/lib/dailyTips'

const CATEGORY_ICONS = {
  hydration:   '💧',
  sleep:       '🌙',
  nutrition:   '🥗',
  training:    '⚡',
  recovery:    '🔄',
  stress:      '🧘',
  supplements: '⚗',
  wellbeing:   '☀',
  adherence:   '🏛',
}

const CATEGORY_COLORS = {
  hydration:   '#5B8DB8',
  sleep:       '#8B7DC4',
  nutrition:   '#52B788',
  training:    '#FF8C00',
  recovery:    '#47D18C',
  stress:      '#E8A020',
  supplements: '#D4B570',
  wellbeing:   '#F0C040',
  adherence:   '#D4B570',
}

const CATEGORY_PL = {
  hydration:   'Nawodnienie',
  sleep:       'Sen',
  nutrition:   'Żywienie',
  training:    'Trening',
  recovery:    'Regeneracja',
  stress:      'Stres',
  supplements: 'Suplementy',
  wellbeing:   'Well-being',
  adherence:   'Mindset',
}

export default function DailyTipCard({ userId }) {
  const tip = getDailyTipForUser(userId || 'global')
  const color = CATEGORY_COLORS[tip.category] || '#D4B570'
  const icon = CATEGORY_ICONS[tip.category] || '🏛'
  const catPl = CATEGORY_PL[tip.category] || tip.category

  return (
    <div className="bg-surface border-2 border-[rgba(212,181,112,0.35)] rounded-2xl p-5 relative overflow-hidden">
      {/* Subtle background accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '120px', height: '120px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
        transform: 'translate(30%, -30%)',
        pointerEvents: 'none',
      }}/>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 9, color: color, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 1 }}>
            Dzisiejsza zasada · {catPl}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '1.1rem',
        color: '#F2EEE8',
        marginBottom: '0.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
      }}>
        {tip.title}
      </h3>

      {/* Content */}
      <p style={{
        fontSize: '0.82rem',
        color: '#A07848',
        lineHeight: 1.7,
        marginBottom: '0.75rem',
      }}>
        {tip.content}
      </p>

      {/* Source */}
      <p style={{
        fontSize: '0.65rem',
        color: `${color}60`,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {tip.sourceLabel}
      </p>
    </div>
  )
}
