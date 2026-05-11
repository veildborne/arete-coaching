'use client'

export default function OceanBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>

      {/* Deep ocean base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #020c18 0%, #030e1f 40%, #020a15 70%, #010810 100%)',
      }}/>

      {/* PRIMARY — złote światło z góry (słońce przez wodę) */}
      <div style={{
        position: 'absolute', top: '-20%', left: '20%',
        width: '70%', height: '80%',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(180,140,60,0.18) 0%, rgba(140,100,30,0.08) 40%, transparent 70%)',
        animation: 'goldRay 8s ease-in-out infinite',
      }}/>

      {/* SECONDARY — niebieskie światło z prawej */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%',
        width: '60%', height: '70%',
        background: 'radial-gradient(ellipse at 80% 10%, rgba(40,90,160,0.15) 0%, rgba(20,60,120,0.06) 50%, transparent 70%)',
        animation: 'blueRay 12s ease-in-out infinite',
      }}/>

      {/* TERTIARY — złote odbicie z lewej */}
      <div style={{
        position: 'absolute', top: '10%', left: '-15%',
        width: '50%', height: '60%',
        background: 'radial-gradient(ellipse at 20% 20%, rgba(160,120,40,0.10) 0%, transparent 60%)',
        animation: 'goldRay 10s ease-in-out infinite reverse',
      }}/>

      {/* Caustic light beams — promienie kaustyczne */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '60%', opacity: 0.07 }}
        xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4B570" stopOpacity="1"/>
            <stop offset="100%" stopColor="#D4B570" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="beam2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B8DB8" stopOpacity="1"/>
            <stop offset="100%" stopColor="#5B8DB8" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Złote promienie */}
        {[
          { x1:'15%', x2:'25%', color:'url(#beam1)', dur:'7s', delay:'0s' },
          { x1:'35%', x2:'28%', color:'url(#beam1)', dur:'9s', delay:'2s' },
          { x1:'55%', x2:'60%', color:'url(#beam1)', dur:'8s', delay:'1s' },
          { x1:'75%', x2:'70%', color:'url(#beam1)', dur:'11s', delay:'3s' },
          { x1:'90%', x2:'85%', color:'url(#beam2)', dur:'10s', delay:'4s' },
          { x1:'45%', x2:'50%', color:'url(#beam2)', dur:'8s', delay:'5s' },
        ].map((b, i) => (
          <line key={i} x1={b.x1} y1="0%" x2={b.x2} y2="100%"
            stroke={b.color} strokeWidth="40">
            <animate attributeName="opacity"
              values="0;0.8;0.3;0.8;0"
              dur={b.dur} begin={b.delay} repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 15,0; 0,0" dur={b.dur} repeatCount="indefinite"/>
          </line>
        ))}
      </svg>

      {/* Surface waves — fale powierzchni */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '25%', opacity: 0.15 }}
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="waveG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C8A84B" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#C8A84B" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path fill="url(#waveG)">
          <animate attributeName="d" dur="5s" repeatCount="indefinite"
            values="
              M0,60 C200,30 400,90 600,50 C800,10 1000,80 1200,45 C1320,25 1400,65 1440,50 L1440,0 L0,0 Z;
              M0,40 C200,70 400,20 600,60 C800,100 1000,30 1200,65 C1320,85 1400,35 1440,55 L1440,0 L0,0 Z;
              M0,60 C200,30 400,90 600,50 C800,10 1000,80 1200,45 C1320,25 1400,65 1440,50 L1440,0 L0,0 Z
            "/>
        </path>
        <path fill="url(#waveG)" opacity="0.5">
          <animate attributeName="d" dur="7s" repeatCount="indefinite"
            values="
              M0,80 C300,50 600,110 900,70 C1100,45 1300,85 1440,65 L1440,0 L0,0 Z;
              M0,55 C300,85 600,35 900,75 C1100,100 1300,50 1440,70 L1440,0 L0,0 Z;
              M0,80 C300,50 600,110 900,70 C1100,45 1300,85 1440,65 L1440,0 L0,0 Z
            "/>
        </path>
      </svg>

      {/* Floating particles — plankton */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg">
        {[
          { cx:'12%', cy:'25%', r:1.5, dur:'14s', color:'#D4B570', delay:'0s' },
          { cx:'88%', cy:'55%', r:1,   dur:'10s', color:'#5B8DB8', delay:'2s' },
          { cx:'45%', cy:'75%', r:2,   dur:'18s', color:'#D4B570', delay:'4s' },
          { cx:'68%', cy:'35%', r:1,   dur:'12s', color:'#D4B570', delay:'1s' },
          { cx:'22%', cy:'65%', r:1.5, dur:'15s', color:'#5B8DB8', delay:'6s' },
          { cx:'58%', cy:'15%', r:1,   dur:'9s',  color:'#D4B570', delay:'3s' },
          { cx:'82%', cy:'80%', r:2,   dur:'20s', color:'#D4B570', delay:'8s' },
          { cx:'35%', cy:'45%', r:1,   dur:'13s', color:'#5B8DB8', delay:'5s' },
          { cx:'75%', cy:'20%', r:1.5, dur:'11s', color:'#D4B570', delay:'7s' },
          { cx:'8%',  cy:'88%', r:1,   dur:'16s', color:'#5B8DB8', delay:'9s' },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.color}>
            <animateTransform attributeName="transform" type="translate"
              values={`0,0; ${i%2===0?12:-12},-${60+i*8}; 0,0`}
              dur={p.dur} begin={p.delay} repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0;0.7;0"
              dur={p.dur} begin={p.delay} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      {/* Deep glow orbs */}
      <div style={{
        position:'absolute', width:'80vw', height:'80vw', maxWidth:'900px', maxHeight:'900px',
        borderRadius:'50%', top:'-30%', left:'10%',
        background:'radial-gradient(circle, rgba(180,140,50,0.07) 0%, transparent 65%)',
        animation:'floatOrb1 18s ease-in-out infinite',
      }}/>
      <div style={{
        position:'absolute', width:'70vw', height:'70vw', maxWidth:'800px', maxHeight:'800px',
        borderRadius:'50%', top:'15%', right:'-20%',
        background:'radial-gradient(circle, rgba(40,80,160,0.08) 0%, transparent 65%)',
        animation:'floatOrb2 22s ease-in-out infinite',
      }}/>
      <div style={{
        position:'absolute', width:'60vw', height:'60vw', maxWidth:'700px', maxHeight:'700px',
        borderRadius:'50%', bottom:'5%', left:'25%',
        background:'radial-gradient(circle, rgba(160,120,40,0.05) 0%, transparent 60%)',
        animation:'floatOrb1 16s ease-in-out infinite reverse',
      }}/>

      <style>{`
        @keyframes goldRay {
          0%,100% { transform: translate(0,0) scale(1); opacity: 1; }
          33% { transform: translate(3%,-2%) scale(1.04); opacity: 0.85; }
          66% { transform: translate(-2%,1%) scale(0.97); opacity: 0.95; }
        }
        @keyframes blueRay {
          0%,100% { transform: translate(0,0) scale(1); opacity: 1; }
          40% { transform: translate(-4%,2%) scale(1.06); opacity: 0.8; }
          70% { transform: translate(2%,-1%) scale(0.96); opacity: 1; }
        }
        @keyframes floatOrb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(2%,-3%) scale(1.03); }
          66% { transform: translate(-1%,2%) scale(0.98); }
        }
        @keyframes floatOrb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          40% { transform: translate(-3%,2%) scale(1.04); }
          70% { transform: translate(1%,-2%) scale(0.97); }
        }
      `}</style>
    </div>
  )
}
