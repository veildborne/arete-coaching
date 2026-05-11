'use client'
import { useEffect, useRef } from 'react'

export default function OceanBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base deep ocean gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #020810 0%, #040d1a 30%, #060f20 60%, #030810 100%)',
      }} />

      {/* Caustic light rays from above */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
        xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="ray1" cx="30%" cy="0%" r="70%">
            <stop offset="0%" stopColor="#D4B570" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#D4B570" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ray2" cx="70%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#5B8DB8" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#5B8DB8" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ray3" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#D4B570" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#D4B570" stopOpacity="0"/>
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="40"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#ray1)" filter="url(#blur)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="8s" repeatCount="indefinite"/>
        </rect>
        <rect width="100%" height="100%" fill="url(#ray2)" filter="url(#blur)">
          <animate attributeName="opacity" values="1;0.4;1" dur="11s" repeatCount="indefinite"/>
        </rect>
        <rect width="100%" height="100%" fill="url(#ray3)" filter="url(#blur)">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="7s" repeatCount="indefinite"/>
        </rect>
      </svg>

      {/* Floating particles — plankton/dust */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}
        xmlns="http://www.w3.org/2000/svg">
        {[
          { cx: '15%', cy: '20%', r: 1.5, dur: '12s', dy: '-80' },
          { cx: '85%', cy: '60%', r: 1,   dur: '9s',  dy: '-60' },
          { cx: '45%', cy: '80%', r: 2,   dur: '15s', dy: '-120' },
          { cx: '70%', cy: '40%', r: 1,   dur: '10s', dy: '-70' },
          { cx: '25%', cy: '70%', r: 1.5, dur: '13s', dy: '-90' },
          { cx: '60%', cy: '15%', r: 1,   dur: '8s',  dy: '-50' },
          { cx: '90%', cy: '85%', r: 2,   dur: '16s', dy: '-130' },
          { cx: '35%', cy: '45%', r: 1,   dur: '11s', dy: '-75' },
          { cx: '55%', cy: '90%', r: 1.5, dur: '14s', dy: '-100' },
          { cx: '10%', cy: '55%', r: 1,   dur: '9s',  dy: '-65' },
          { cx: '78%', cy: '25%', r: 2,   dur: '12s', dy: '-85' },
          { cx: '42%', cy: '35%', r: 1,   dur: '10s', dy: '-55' },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#D4B570" opacity="0.6">
            <animateTransform attributeName="transform" type="translate"
              values={`0,0; ${(i % 3 - 1) * 20},${p.dy}; 0,0`}
              dur={p.dur} repeatCount="indefinite" calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0;0.6;0" dur={p.dur} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      {/* Wave ripples — surface light */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', opacity: 0.06 }}
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4B570" stopOpacity="1"/>
            <stop offset="100%" stopColor="#D4B570" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path fill="url(#waveGrad)">
          <animate attributeName="d"
            values="
              M0,80 C360,40 720,120 1080,60 C1260,30 1380,90 1440,70 L1440,0 L0,0 Z;
              M0,60 C300,100 660,20 1020,80 C1200,110 1360,40 1440,60 L1440,0 L0,0 Z;
              M0,80 C360,40 720,120 1080,60 C1260,30 1380,90 1440,70 L1440,0 L0,0 Z
            "
            dur="6s" repeatCount="indefinite" calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
        </path>
        <path fill="url(#waveGrad)" opacity="0.5">
          <animate attributeName="d"
            values="
              M0,100 C400,60 800,140 1200,80 C1340,50 1400,100 1440,90 L1440,0 L0,0 Z;
              M0,70 C350,110 750,30 1150,90 C1300,120 1400,60 1440,80 L1440,0 L0,0 Z;
              M0,100 C400,60 800,140 1200,80 C1340,50 1400,100 1440,90 L1440,0 L0,0 Z
            "
            dur="9s" repeatCount="indefinite" calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
        </path>
      </svg>

      {/* Deep glow orbs */}
      <div style={{
        position: 'absolute', width: '600px', height: '600px',
        borderRadius: '50%', top: '-100px', left: '10%',
        background: 'radial-gradient(circle, rgba(212,181,112,0.04) 0%, transparent 70%)',
        animation: 'floatOrb1 15s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute', width: '800px', height: '800px',
        borderRadius: '50%', top: '20%', right: '-200px',
        background: 'radial-gradient(circle, rgba(91,141,184,0.05) 0%, transparent 70%)',
        animation: 'floatOrb2 20s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        borderRadius: '50%', bottom: '10%', left: '30%',
        background: 'radial-gradient(circle, rgba(212,181,112,0.03) 0%, transparent 70%)',
        animation: 'floatOrb1 18s ease-in-out infinite reverse',
      }}/>

      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.03); }
          66% { transform: translate(20px, -30px) scale(0.98); }
        }
      `}</style>
    </div>
  )
}
