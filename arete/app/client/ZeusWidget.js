'use client'
import { useEffect, useState } from 'react'

const SPRITE_COLS = 4
const SPRITE_ROWS = 4
const SPRITE_W = 275  // 1100px / 4 cols
const SPRITE_H = 275  // 1100px / 4 rows

const STATES = {
  idle:      { row: 0, frames: [0,1,2,3], fps: 4 },
  walk:      { row: 1, frames: [0,1,2,3], fps: 8 },
  celebrate: { row: 2, frames: [0,1],     fps: 4 },
  alert:     { row: 2, frames: [2,3],     fps: 6 },
  sleep:     { row: 3, frames: [0,1],     fps: 2 },
  warrior:   { row: 3, frames: [2,3],     fps: 6 },
}

export default function ZeusWidget({ recentLogs = [], checkins = [] }) {
  const [frame, setFrame] = useState(0)
  const [state, setState] = useState('idle')
  const [visible, setVisible] = useState(true)
  const [minimized, setMinimized] = useState(false)
  const [tooltip, setTooltip] = useState('')

  // Determine state based on data
  useEffect(() => {
    const hour = new Date().getHours()
    const pendingCheckin = checkins.some(c => !c.coach_feedback)
    const recentWorkout = recentLogs.length > 0 &&
      new Date() - new Date(recentLogs[0]?.session_date) < 86400000 * 2

    if (hour >= 22 || hour < 6) {
      setState('sleep')
      setTooltip('Śpij dobrze — regeneracja to część procesu.')
    } else if (pendingCheckin) {
      setState('alert')
      setTooltip('Trener czeka na Twój raport!')
    } else if (recentWorkout) {
      setState('celebrate')
      setTooltip('Świetna robota! Trening zaliczony.')
    } else {
      setState('idle')
      setTooltip('Cześć! Co dzisiaj trenujemy?')
    }
  }, [recentLogs, checkins])

  // Animate frames
  useEffect(() => {
    const s = STATES[state] || STATES.idle
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % s.frames.length)
    }, 1000 / s.fps)
    return () => clearInterval(interval)
  }, [state])

  if (!visible) return null

  const s = STATES[state] || STATES.idle
  const currentFrame = s.frames[frame]
  const bgX = -(currentFrame * SPRITE_W)
  const bgY = -(s.row * SPRITE_H)
  const displaySize = 64

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
    }}>
      {/* Tooltip */}
      {!minimized && tooltip && (
        <div style={{
          background: 'rgba(10,14,26,0.95)',
          border: '2px solid rgba(212,181,112,0.4)',
          borderRadius: 12, padding: '8px 12px',
          fontSize: 11, color: '#D4B570',
          maxWidth: 180, textAlign: 'center',
          lineHeight: 1.5,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          {tooltip}
        </div>
      )}

      {/* Sprite */}
      <div
        onClick={() => setMinimized(m => !m)}
        style={{
          width: minimized ? 40 : displaySize,
          height: minimized ? 40 : displaySize,
          cursor: 'pointer',
          imageRendering: 'pixelated',
          overflow: 'hidden',
          borderRadius: minimized ? '50%' : 8,
          border: '2px solid rgba(212,181,112,0.4)',
          background: 'rgba(10,14,26,0.6)',
          transition: 'all 0.2s',
          position: 'relative',
        }}
        title={tooltip}
      >
        <div style={{
          width: SPRITE_W,
          height: SPRITE_H,
          backgroundImage: 'url(/mascot/mascot-small.png)',
          backgroundPosition: `${bgX}px ${bgY}px`,
          backgroundSize: `${SPRITE_W * SPRITE_COLS}px ${SPRITE_H * SPRITE_ROWS}px`,
          imageRendering: 'pixelated',
          transform: `scale(${displaySize / SPRITE_W})`,
          transformOrigin: 'top left',
        }}/>
      </div>

      {/* Close */}
      {!minimized && (
        <button onClick={() => setVisible(false)}
          style={{background:'none',border:'none',color:'rgba(212,181,112,0.3)',fontSize:10,cursor:'pointer',padding:0}}>
          ukryj
        </button>
      )}
    </div>
  )
}
