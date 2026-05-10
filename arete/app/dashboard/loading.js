'use client'
import { useEffect, useState } from 'react'

const PHRASES = [
  'Ἄσκησις — dyscyplina przynosi rezultaty',
  'Ἀρετή — doskonałość jest procesem',
  'Σωφροσύνη — umiar to fundament siły',
  'Φρόνησις — mądrość prowadzi działanie',
]

export default function Loading() {
  const [phrase] = useState(() => PHRASES[Math.floor(Math.random() * PHRASES.length)])
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setDots(d => (d + 1) % 4), 400)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center">
      <div className="text-center px-8">
        {/* Logo */}
        <div className="relative inline-block mb-8">
          <div className="font-display text-5xl text-gold tracking-[0.4em] mb-1">ARETÉ</div>
          <div className="text-[11px] text-muted/60 tracking-[0.3em] uppercase">ἀρετή</div>
          {/* Animated underline */}
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent animate-pulse" />
        </div>

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>

        {/* Greek phrase */}
        <p className="text-sm text-muted/60 italic tracking-wide max-w-xs mx-auto leading-relaxed">
          {phrase}
        </p>

        {/* Dots */}
        <p className="text-gold/40 mt-4 text-lg tracking-widest">
          {'·'.repeat(dots + 1)}{'　'.repeat(3 - dots)}
        </p>
      </div>
    </div>
  )
}
