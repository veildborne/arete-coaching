'use client'
import { useEffect, useRef } from 'react'

export default function OceanBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // 120 particles — złote i niebieskie
    for (let i = 0; i < 120; i++) {
      const isGold = Math.random() > 0.35
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -(Math.random() * 0.3 + 0.05),
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.012 + 0.006,
        color: isGold ? [212, 181, 112] : [91, 141, 184],
        glowSize: Math.random() * 8 + 4,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += p.pulseSpeed

        // Wrap around
        if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width }
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20

        const pulseFactor = 0.5 + 0.5 * Math.abs(Math.sin(p.pulse))
        const op = p.opacity * pulseFactor
        const [r, g, b] = p.color

        // Outer glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize * pulseFactor)
        grad.addColorStop(0, `rgba(${r},${g},${b},${op * 0.5})`)
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${op * 0.15})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.glowSize * pulseFactor, 0, Math.PI * 2)
        ctx.fill()

        // Bright core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${op})`
        ctx.fill()
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {/* Deep base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #020c18 0%, #030e1f 50%, #020a15 100%)',
      }}/>
      {/* Canvas particles */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}/>
    </div>
  )
}
