export function IconHome({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Kolumna dorycka */}
      <rect x="10" y="3" width="4" height="1" fill={color} opacity="0.9"/>
      <rect x="9" y="4" width="6" height="1" fill={color} opacity="0.7"/>
      <rect x="10.5" y="5" width="3" height="10" fill={color} opacity="0.6"/>
      <rect x="10" y="5" width="1" height="10" fill={color} opacity="0.9"/>
      <rect x="13" y="5" width="1" height="10" fill={color} opacity="0.9"/>
      <rect x="9" y="15" width="6" height="1" fill={color} opacity="0.7"/>
      <rect x="8" y="16" width="8" height="1.5" fill={color} opacity="0.9"/>
      {/* Meander base */}
      <path d="M5 19 L8 19 L8 18 L10 18 L10 20 L6 20 L6 21 L19 21 L19 20 L14 20 L14 18 L16 18 L16 19 L19 19" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5"/>
    </svg>
  )
}

export function IconTraining({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Piorun Zeusa w okręgu */}
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.2" opacity="0.4"/>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="0.5" opacity="0.6" strokeDasharray="2 3"/>
      <path d="M13 4 L9 13 L12 13 L11 20 L15 11 L12 11 Z" fill={color} opacity="0.9"/>
      <path d="M13 4 L9 13 L12 13 L11 20 L15 11 L12 11 Z" stroke={color} strokeWidth="0.3" fill="none" opacity="0.4"/>
    </svg>
  )
}

export function IconPlan({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Siatka z meandrem */}
      <rect x="3" y="3" width="18" height="18" rx="1" stroke={color} strokeWidth="1" opacity="0.4"/>
      {/* Grid lines */}
      <line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="0.6" opacity="0.3"/>
      <line x1="3" y1="15" x2="21" y2="15" stroke={color} strokeWidth="0.6" opacity="0.3"/>
      <line x1="9" y1="3" x2="9" y2="21" stroke={color} strokeWidth="0.6" opacity="0.3"/>
      <line x1="15" y1="3" x2="15" y2="21" stroke={color} strokeWidth="0.6" opacity="0.3"/>
      {/* Meander w rogu */}
      <path d="M5 5 L7 5 L7 7 L5 7 L5 5" stroke={color} strokeWidth="1" fill="none" opacity="0.8"/>
      {/* Data bars */}
      <rect x="11" y="11" width="2" height="4" fill={color} opacity="0.7"/>
      <rect x="14" y="10" width="2" height="5" fill={color} opacity="0.5"/>
      <rect x="17" y="12" width="1.5" height="3" fill={color} opacity="0.4"/>
    </svg>
  )
}

export function IconReport({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Zwój papirusu */}
      <path d="M6 4 C6 4 5 4 5 5 L5 19 C5 19 5 20 6 20 L18 20 C19 20 19 19 19 19 L19 5 C19 5 19 4 18 4 Z" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M6 4 C6 3 7 3 7 4 L7 20 C7 21 6 21 6 20 C5 20 5 19 5 19 L5 5 C5 5 5 4 6 4Z" fill={color} opacity="0.3"/>
      {/* Linie tekstu */}
      <line x1="9" y1="8" x2="17" y2="8" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="9" y1="11" x2="17" y2="11" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="9" y1="14" x2="14" y2="14" stroke={color} strokeWidth="1" opacity="0.4"/>
      {/* Delta symbol */}
      <path d="M9 17 L12 14 L15 17 Z" stroke={color} strokeWidth="0.8" fill="none" opacity="0.6"/>
    </svg>
  )
}

export function IconAttention({ size = 20, color = '#EF6B73' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trójkąt z okiem */}
      <path d="M12 3 L21 19 L3 19 Z" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M12 3 L21 19 L3 19 Z" fill={color} opacity="0.08"/>
      {/* Meander na podstawie */}
      <path d="M6 19 L6 17 L8 17 L8 19" stroke={color} strokeWidth="0.7" fill="none" opacity="0.5"/>
      <path d="M16 19 L16 17 L18 17 L18 19" stroke={color} strokeWidth="0.7" fill="none" opacity="0.5"/>
      {/* Wykrzyknik */}
      <line x1="12" y1="9" x2="12" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
      <circle cx="12" cy="16.5" r="0.8" fill={color} opacity="0.9"/>
    </svg>
  )
}

export function IconClients({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trzy kolumny greckie */}
      {[5, 11, 17].map((x, i) => (
        <g key={i} opacity={i === 1 ? 1 : 0.6}>
          <rect x={x} y="4" width="2" height="0.8" fill={color}/>
          <rect x={x - 0.5} y="4.8" width="3" height="0.6" fill={color} opacity="0.7"/>
          <rect x={x + 0.2} y="5.4" width="1.6" height="10" fill={color} opacity="0.5"/>
          <rect x={x} y="5.4" width="0.5" height="10" fill={color}/>
          <rect x={x + 1.5} y="5.4" width="0.5" height="10" fill={color}/>
          <rect x={x - 0.5} y="15.4" width="3" height="0.6" fill={color} opacity="0.7"/>
        </g>
      ))}
      {/* Stylobat */}
      <rect x="3" y="16" width="18" height="1" fill={color} opacity="0.6"/>
      <rect x="2" y="17" width="20" height="1.2" fill={color} opacity="0.4"/>
      {/* Meander */}
      <path d="M3 19 L5 19 L5 18.5 L7 18.5 L7 19.5 L9 19.5 L9 19 L11 19 L11 18.5 L13 18.5 L13 19.5 L15 19.5 L15 19 L17 19 L17 18.5 L19 18.5 L19 19 L21 19" stroke={color} strokeWidth="0.6" fill="none" opacity="0.5"/>
    </svg>
  )
}

export function IconAdd({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Okrąg z greckim krzyżem */}
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="0.4" strokeDasharray="1.5 2" opacity="0.3"/>
      {/* Krzyż */}
      <line x1="12" y1="7" x2="12" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
      {/* Narożne zdobienia */}
      <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.3"/>
    </svg>
  )
}

export function IconLogout({ size = 20, color = '#8F9AAF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Drzwi ze świątyni */}
      <path d="M5 3 L5 21 L14 21 L14 3 Z" stroke={color} strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M5 3 L14 3 L14 21 L5 21" fill={color} opacity="0.06"/>
      {/* Kolumny drzwi */}
      <line x1="5" y1="3" x2="5" y2="21" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <line x1="14" y1="3" x2="14" y2="21" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      {/* Strzałka wyjścia */}
      <path d="M17 12 L21 12 M19 9 L22 12 L19 15" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      {/* Klamka */}
      <circle cx="12" cy="12" r="1" fill={color} opacity="0.6"/>
    </svg>
  )
}

export function IconSwap({ size = 20, color = '#64B5F6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dwie strzałki cykliczne z greckim ornamentem */}
      <path d="M4 8 C4 5 7 3 12 3 C17 3 20 6 20 8" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M20 16 C20 19 17 21 12 21 C7 21 4 18 4 16" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M17 5 L20 8 L17 11" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      <path d="M7 19 L4 16 L7 13" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      {/* Środkowy ornament */}
      <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="0.8" opacity="0.4"/>
      <circle cx="12" cy="12" r="0.8" fill={color} opacity="0.5"/>
    </svg>
  )
}

export function IconSuccess({ size = 20, color = '#47D18C' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="0.4" strokeDasharray="1.5 2" opacity="0.25"/>
      <path d="M7 12 L10.5 15.5 L17 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      <circle cx="12" cy="12" r="1" fill={color} opacity="0.2"/>
    </svg>
  )
}

export function IconProgress({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lambda — wzrost */}
      <path d="M3 20 L12 4 L21 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" fill="none"/>
      {/* Słupki postępu */}
      <rect x="5" y="16" width="2.5" height="4" fill={color} opacity="0.4" rx="0.5"/>
      <rect x="9" y="12" width="2.5" height="8" fill={color} opacity="0.6" rx="0.5"/>
      <rect x="13" y="8" width="2.5" height="12" fill={color} opacity="0.8" rx="0.5"/>
      <rect x="17" y="5" width="2.5" height="15" fill={color} opacity="0.9" rx="0.5"/>
      {/* Meander na dole */}
      <path d="M3 21 L5 21 L5 20 L7 20 L7 21 L9 21" stroke={color} strokeWidth="0.6" fill="none" opacity="0.4"/>
    </svg>
  )
}

export function IconNutrition({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Amfora */}
      <path d="M9 3 L15 3 L16 6 C18 8 18 10 17 13 C16 16 14 18 12 19 C10 18 8 16 7 13 C6 10 6 8 8 6 Z" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M9 3 L15 3 L16 6 C18 8 18 10 17 13 C16 16 14 18 12 19 C10 18 8 16 7 13 C6 10 6 8 8 6 Z" fill={color} opacity="0.08"/>
      {/* Uszy amfory */}
      <path d="M8 6 C6 6 5 8 5 9 C5 10 6 10 7 9" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5"/>
      <path d="M16 6 C18 6 19 8 19 9 C19 10 18 10 17 9" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5"/>
      {/* Wzór na amforze */}
      <path d="M9 9 L11 9 L11 7 L13 7 L13 9 L15 9" stroke={color} strokeWidth="0.6" fill="none" opacity="0.5"/>
      {/* Podstawa */}
      <rect x="10" y="19" width="4" height="1" fill={color} opacity="0.6"/>
      <rect x="9" y="20" width="6" height="1" fill={color} opacity="0.4"/>
    </svg>
  )
}
