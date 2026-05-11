'use client'

export default function OceanLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(180deg, #020810 0%, #040d1a 50%, #030810 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Ripple rings */}
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 40 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1px solid rgba(212,181,112,0.4)',
            animation: `ripple 2.4s ease-out infinite`,
            animationDelay: `${i * 0.6}s`,
          }}/>
        ))}
        {/* Center logo */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'Georgia, serif', fontSize: 28, color: '#D4B570',
            letterSpacing: '0.3em', animation: 'pulse 2.4s ease-in-out infinite',
          }}>
            Ω
          </span>
        </div>
      </div>

      {/* Floating particles */}
      <svg width="200" height="60" style={{ position: 'absolute', bottom: '30%', opacity: 0.5 }}>
        {[20, 60, 100, 140, 180].map((x, i) => (
          <circle key={i} cx={x} cy={30} r={1.5} fill="#D4B570">
            <animate attributeName="cy" values={`30;${10 + i * 3};30`}
              dur={`${2 + i * 0.4}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.8;0"
              dur={`${2 + i * 0.4}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      <span style={{
        fontFamily: 'Georgia, serif', fontSize: 13, color: 'rgba(212,181,112,0.5)',
        letterSpacing: '0.4em', textTransform: 'uppercase',
      }}>
        ARETÉ
      </span>

      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
