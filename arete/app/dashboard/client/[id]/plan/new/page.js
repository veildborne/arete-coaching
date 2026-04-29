'use client'
import { useRouter } from 'next/navigation'
import PlanViewer from '@/components/client/PlanViewer'

export default function PlanPage() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #131f36 0%, #0a0f1a 60%, #060912 100%)',
      color: '#e8e8e8',
      fontFamily: 'Outfit, sans-serif',
    }}>
      {/* TOP BAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(184,166,119,0.15)',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'transparent',
            border: '1px solid rgba(184,166,119,0.25)',
            color: 'rgba(184,166,119,0.7)',
            padding: '0.4rem 0.9rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          ← Wróć
        </button>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.3rem',
          color: '#d4c494',
          letterSpacing: '0.3em',
          fontWeight: 600,
        }}>ARETÉ</span>
        <span style={{
          fontSize: '0.65rem',
          color: 'rgba(184,166,119,0.5)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          paddingLeft: '1rem',
          borderLeft: '1px solid rgba(184,166,119,0.2)',
        }}>Plan treningowy</span>
      </nav>

      {/* CONTENT */}
      <main style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
      }}>
        <PlanViewer />
      </main>
    </div>
  )
}
