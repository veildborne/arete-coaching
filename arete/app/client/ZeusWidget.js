'use client'
import { useEffect, useState } from 'react'

const SPRITE_COLS = 7
const SPRITE_ROWS = 11
const SPRITE_W = 179
const SPRITE_H = 114
const DISPLAY_W = 80
const DISPLAY_H = Math.round(DISPLAY_W * SPRITE_H / SPRITE_W) // = 51px

const STATES = {
  idle:      { row: 0, frames: [0,1,2,3,4,5,6], fps: 5 },
  walk:      { row: 1, frames: [0,1,2,3,4,5,6], fps: 8 },
  celebrate: { row: 3, frames: [0,1,2,3,4,5,6], fps: 8 },
  alert:     { row: 5, frames: [0,1,2,3,4,5],   fps: 6 },
  sleep:     { row: 6, frames: [2,3,4],          fps: 2 },
  warrior:   { row: 4, frames: [0,1,2,3,4,5,6], fps: 8 },
  point:     { row: 7, frames: [0,1,2,3,4],      fps: 5 },
  training:  { row: 9, frames: [0,1,2,3,4],      fps: 6 },
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
    const hasNoWorkout = recentLogs.length === 0

    if (hour >= 22 || hour < 6) {
      setState('sleep')
      setTooltip('Śpij dobrze — regeneracja to część procesu.')
    } else if (pendingCheckin) {
      setState('alert')
      setTooltip('Trener czeka na Twój raport!')
    } else if (recentWorkout) {
      setState('celebrate')
      setTooltip('Świetna robota! Trening zaliczony! 💪')
    } else if (hasNoWorkout) {
      setState('point')
      setTooltip('Czas na pierwszy trening!')
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
      {(() => {
        const s = STATES[state] || STATES.idle
        const currentFrame = s.frames[frame % s.frames.length]
        const scale = DISPLAY_W / SPRITE_W
        const bgW = SPRITE_W * SPRITE_COLS * scale
        const bgH = SPRITE_H * SPRITE_ROWS * scale
        const posX = -(currentFrame * SPRITE_W * scale)
        const posY = -(s.row * SPRITE_H * scale)
        return (
          <div
            onClick={() => setMinimized(m => !m)}
            title={tooltip}
            style={{
              width: DISPLAY_W,
              height: DISPLAY_H,
              overflow: 'hidden',
              cursor: 'pointer',
              imageRendering: 'pixelated',
              borderRadius: minimized ? '50%' : 6,
              border: '2px solid rgba(212,181,112,0.4)',
              background: 'rgba(10,14,26,0.6)',
              transition: 'all 0.2s',
              backgroundImage: 'url(/mascot/mascot-small.png)',
              backgroundSize: `${bgW}px ${bgH}px`,
              backgroundPosition: `${posX}px ${posY}px`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )
      })()}

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
