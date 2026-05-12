'use client'

// ARETÉ Greek Pixel Icons
// Styl: pixel art + grecka symbolika + żywe kolory

const GOLD = '#D4B570'
const BRIGHT_GOLD = '#F0C040'
const BLUE = '#4A9EFF'
const GREEN = '#47D18C'
const RED = '#EF6B73'
const PURPLE = '#B088F0'
const CYAN = '#40D0E0'

function PixelGrid({ pixels, size = 20, color = GOLD }) {
  const cols = pixels[0].length
  const rows = pixels.length
  const cellSize = size / Math.max(cols, rows)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
      {pixels.map((row, y) =>
        row.map((cell, x) => cell ? (
          <rect key={`${x}-${y}`}
            x={x * cellSize} y={y * cellSize}
            width={cellSize} height={cellSize}
            fill={typeof cell === 'string' ? cell : color}
          />
        ) : null)
      )}
    </svg>
  )
}

// ─── IKONY ────────────────────────────────────────────────────────────────────

export function IconHome({ size = 20, color = BRIGHT_GOLD }) {
  // Grecka świątynia z kolumnami
  const G = BRIGHT_GOLD, D = '#8B6914', W = '#F8E8A0'
  const pixels = [
    [0,0,0,0,0,G,G,G,G,G,G,G,G,0,0,0,0],
    [0,0,0,0,G,G,G,G,G,G,G,G,G,G,0,0,0],
    [0,0,0,G,G,G,G,G,G,G,G,G,G,G,G,0,0],
    [0,0,0,G,G,G,G,G,G,G,G,G,G,G,G,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,G,0,0,G,0,0,G,0,0,G,0,0,G,0,0],
    [0,0,G,0,0,G,0,0,G,0,0,G,0,0,G,0,0],
    [0,0,W,0,0,W,0,0,W,0,0,W,0,0,W,0,0],
    [0,0,G,0,0,G,0,0,G,0,0,G,0,0,G,0,0],
    [0,0,G,0,0,G,0,0,G,0,0,G,0,0,G,0,0],
    [0,0,W,0,0,W,0,0,W,0,0,W,0,0,W,0,0],
    [0,0,G,0,0,G,0,0,G,0,0,G,0,0,G,0,0],
    [0,0,G,0,0,G,0,0,G,0,0,G,0,0,G,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,0],
    [G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G],
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconTraining({ size = 20, color = '#FF6B35' }) {
  // Piorun Zeusa
  const L = '#FF6B35', Y = '#FFD700', W = '#FFF0A0'
  const pixels = [
    [0,0,0,0,Y,Y,Y,Y,Y,0,0,0,0],
    [0,0,0,Y,Y,Y,Y,Y,Y,0,0,0,0],
    [0,0,Y,Y,Y,Y,Y,0,0,0,0,0,0],
    [0,Y,Y,Y,Y,Y,0,0,0,0,0,0,0],
    [Y,Y,Y,Y,Y,Y,Y,Y,Y,0,0,0,0],
    [0,0,W,W,W,W,W,W,W,Y,0,0,0],
    [0,0,0,0,W,W,W,W,W,Y,Y,0,0],
    [0,0,0,0,0,W,W,W,W,Y,Y,Y,0],
    [0,0,0,0,0,0,W,W,W,Y,Y,Y,Y],
    [0,0,0,0,0,0,0,L,L,L,Y,Y,Y],
    [0,0,0,0,0,0,0,0,L,L,L,Y,Y],
    [0,0,0,0,0,0,0,0,0,L,L,L,Y],
    [0,0,0,0,0,0,0,0,0,0,L,L,L],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconPlan({ size = 20, color = CYAN }) {
  // Zwój pergaminu
  const B = '#8B6914', G = BRIGHT_GOLD, W = '#FFF8E0', C = CYAN
  const pixels = [
    [B,B,B,B,B,B,B,B,B,B,B,B,0],
    [B,W,W,W,W,W,W,W,W,W,W,B,0],
    [B,W,C,C,C,C,C,C,C,W,W,B,0],
    [B,W,C,0,0,0,0,0,C,W,W,B,0],
    [B,W,C,G,G,G,G,0,C,W,W,B,0],
    [B,W,C,0,0,0,0,0,C,W,W,B,0],
    [B,W,C,G,G,G,0,0,C,W,W,B,0],
    [B,W,C,0,0,0,0,0,C,W,W,B,0],
    [B,W,C,G,G,0,0,0,C,W,W,B,0],
    [B,W,C,0,0,0,0,0,C,W,W,B,0],
    [B,W,W,W,W,W,W,W,W,W,W,B,0],
    [B,B,B,B,B,B,B,B,B,B,B,B,0],
    [0,B,B,0,0,0,0,0,0,0,B,B,0],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconReport({ size = 20, color = GREEN }) {
  // Tarcza ze znacznikiem
  const G = GREEN, Y = BRIGHT_GOLD, W = '#E0FFE8'
  const pixels = [
    [0,0,Y,Y,Y,Y,Y,Y,Y,Y,Y,0,0],
    [0,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,0],
    [Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y],
    [Y,Y,W,W,W,W,W,W,W,W,W,Y,Y],
    [Y,Y,W,0,0,G,0,0,0,0,W,Y,Y],
    [Y,Y,W,0,G,G,0,0,0,0,W,Y,Y],
    [Y,Y,W,G,G,0,0,G,G,0,W,Y,Y],
    [Y,Y,W,0,0,0,G,G,0,0,W,Y,Y],
    [Y,Y,W,0,0,G,G,0,0,0,W,Y,Y],
    [Y,Y,W,0,0,0,0,0,0,0,W,Y,Y],
    [0,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,0],
    [0,0,Y,Y,Y,Y,Y,Y,Y,Y,Y,0,0],
    [0,0,0,0,Y,Y,Y,Y,Y,0,0,0,0],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconAttention({ size = 20, color = RED }) {
  // Oko Opatrzności w trójkącie
  const R = RED, Y = '#FFD700', W = '#FFFFFF', B = '#000080'
  const pixels = [
    [0,0,0,0,0,0,Y,0,0,0,0,0,0],
    [0,0,0,0,0,Y,Y,Y,0,0,0,0,0],
    [0,0,0,0,R,R,Y,R,R,0,0,0,0],
    [0,0,0,R,R,R,R,R,R,R,0,0,0],
    [0,0,R,R,R,W,W,W,R,R,R,0,0],
    [0,R,R,R,W,W,B,W,W,R,R,R,0],
    [0,R,R,R,W,B,B,B,W,R,R,R,0],
    [0,R,R,R,W,W,B,W,W,R,R,R,0],
    [R,R,R,R,R,W,W,W,R,R,R,R,R],
    [R,R,R,R,R,R,R,R,R,R,R,R,R],
    [R,R,Y,R,R,R,R,R,R,R,Y,R,R],
    [R,Y,Y,Y,R,R,R,R,R,Y,Y,Y,R],
    [Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconClients({ size = 20, color = BRIGHT_GOLD }) {
  // Trzy postacie
  const G = BRIGHT_GOLD, S = '#A0D0FF', D = '#8B6914'
  const pixels = [
    [0,G,G,G,0,0,S,S,S,0,0,G,G,G,0],
    [0,G,G,G,0,0,S,S,S,0,0,G,G,G,0],
    [0,G,G,G,0,0,S,S,S,0,0,G,G,G,0],
    [G,G,G,G,G,S,S,S,S,S,G,G,G,G,G],
    [G,G,G,G,G,S,S,S,S,S,G,G,G,G,G],
    [G,G,G,G,G,S,S,S,S,S,G,G,G,G,G],
    [0,G,G,G,0,S,S,S,S,S,0,G,G,G,0],
    [0,G,G,G,0,S,S,S,S,S,0,G,G,G,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconAdd({ size = 20, color = GREEN }) {
  const G = GREEN, D = '#206040'
  const pixels = [
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [G,G,G,G,G,G,G,G,G,G,G,G,G,G],
    [G,G,G,G,G,G,G,G,G,G,G,G,G,G],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,0,0,0,G,G,0,0,0,0,0,0],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconLogout({ size = 20, color = '#8F9AAF' }) {
  const C = color, R = RED
  const pixels = [
    [C,C,C,C,C,C,C,C,0,0,0,0,0],
    [C,C,0,0,0,0,C,C,0,0,0,0,0],
    [C,C,0,0,0,0,C,C,0,0,0,0,0],
    [C,C,0,0,0,0,C,C,0,R,R,R,0],
    [C,C,0,0,0,0,C,C,R,R,R,R,R],
    [C,C,0,0,0,0,C,C,R,R,R,R,R],
    [C,C,0,0,0,0,0,0,R,R,0,R,R],
    [C,C,0,0,0,0,0,0,0,R,0,R,0],
    [C,C,0,0,0,0,C,C,R,R,R,R,R],
    [C,C,0,0,0,0,C,C,R,R,R,R,R],
    [C,C,0,0,0,0,C,C,0,R,R,R,0],
    [C,C,C,C,C,C,C,C,0,0,0,0,0],
    [C,C,C,C,C,C,C,C,0,0,0,0,0],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconSwap({ size = 20, color = CYAN }) {
  const C = CYAN
  const pixels = [
    [0,C,C,C,C,C,C,C,C,0,0,0,0],
    [C,C,0,0,0,0,0,0,C,C,0,0,0],
    [C,0,0,0,0,0,0,0,0,C,0,0,0],
    [C,0,0,0,0,0,0,0,0,0,C,C,C],
    [C,0,0,0,0,0,0,0,0,C,C,0,0],
    [C,C,0,0,0,0,0,0,C,C,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,C,C,0,0,0,0,C,C,0,0],
    [0,0,C,C,0,0,0,0,0,0,C,C,0],
    [0,C,C,0,0,0,0,0,0,0,0,C,C],
    [C,C,0,0,0,0,0,0,0,0,0,0,C],
    [C,0,0,0,0,0,0,0,0,0,0,0,C],
    [0,C,C,C,C,C,C,C,C,C,C,C,0],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconSuccess({ size = 20, color = GREEN }) {
  const G = GREEN, Y = BRIGHT_GOLD
  const pixels = [
    [0,0,0,0,0,0,0,0,0,0,G,G,0],
    [0,0,0,0,0,0,0,0,0,G,G,G,0],
    [0,0,0,0,0,0,0,0,G,G,G,0,0],
    [0,G,0,0,0,0,0,G,G,G,0,0,0],
    [0,G,G,0,0,0,G,G,G,0,0,0,0],
    [0,G,G,G,0,G,G,G,0,0,0,0,0],
    [0,0,G,G,G,G,G,0,0,0,0,0,0],
    [0,0,0,G,G,G,0,0,0,0,0,0,0],
    [0,0,0,0,G,0,0,0,0,0,0,0,0],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconNutrition({ size = 20, color = '#E8A020' }) {
  // Amfora
  const A = '#E8A020', W = '#FFF0C0', D = '#8B5010'
  const pixels = [
    [0,0,D,D,D,D,D,D,D,D,D,0,0],
    [0,D,W,W,W,W,W,W,W,W,D,0,0],
    [D,A,W,A,A,A,A,A,W,A,A,D,0],
    [D,A,W,A,0,0,0,A,W,A,A,D,0],
    [0,D,A,A,0,A,0,A,A,D,0,0,0],
    [0,0,D,A,A,A,A,A,D,0,0,0,0],
    [0,0,D,A,A,A,A,A,D,0,0,0,0],
    [0,0,D,A,0,A,0,A,D,0,0,0,0],
    [0,D,A,A,A,A,A,A,A,D,0,0,0],
    [0,D,A,A,A,A,A,A,A,D,0,0,0],
    [0,0,D,A,A,A,A,A,D,0,0,0,0],
    [0,0,0,D,D,A,A,D,D,0,0,0,0],
    [0,0,0,D,D,D,D,D,D,0,0,0,0],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconProgress({ size = 20, color = PURPLE }) {
  const P = PURPLE, G = BRIGHT_GOLD
  const pixels = [
    [0,0,0,0,0,0,0,0,0,0,0,P,P],
    [0,0,0,0,0,0,0,0,0,0,P,P,P],
    [0,0,0,0,0,0,0,0,0,P,P,P,0],
    [0,0,0,0,0,0,0,0,P,P,P,0,0],
    [0,0,0,0,0,P,P,P,P,P,0,0,0],
    [0,0,0,0,P,P,P,P,P,0,0,0,0],
    [0,0,P,P,P,P,P,0,0,0,0,0,0],
    [P,P,P,P,P,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [G,G,0,0,G,G,0,0,G,G,0,0,G],
    [G,G,0,0,G,G,0,0,G,G,0,0,G],
    [G,G,G,G,G,G,G,G,G,G,G,G,G],
    [G,G,G,G,G,G,G,G,G,G,G,G,G],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}

export function IconKnowledge({ size = 20, color = '#A0C8FF' }) {
  // Otwarta księga z greckim wzorem
  const B = '#A0C8FF', G = BRIGHT_GOLD, W = '#FFFFFF', D = '#4060A0'
  const pixels = [
    [0,0,G,G,G,G,0,0,G,G,G,G,0,0],
    [0,G,B,B,B,B,G,G,B,B,B,B,G,0],
    [G,B,W,W,W,B,B,B,B,W,W,W,B,G],
    [G,B,W,D,W,B,G,G,B,W,D,W,B,G],
    [G,B,W,W,W,B,G,G,B,W,W,W,B,G],
    [G,B,W,D,W,B,G,G,B,W,D,W,B,G],
    [G,B,W,W,W,B,G,G,B,W,W,W,B,G],
    [G,B,B,B,B,B,G,G,B,B,B,B,B,G],
    [0,G,B,B,B,G,G,G,G,B,B,B,G,0],
    [0,0,G,G,G,G,0,0,G,G,G,G,0,0],
    [0,0,0,G,G,0,0,0,0,G,G,0,0,0],
    [0,0,G,G,G,G,G,G,G,G,G,G,0,0],
  ]
  return <PixelGrid pixels={pixels} size={size} color={color}/>
}
