import { LayoutDashboard, Users, Dumbbell, ClipboardList, ClipboardCheck, TrendingUp, TriangleAlert, Settings, ScrollText, Trophy, ShieldCheck, Moon, Flame, Target, ChartNoAxesCombined, LogOut, Plus, ArrowLeftRight, BookOpen, Apple } from 'lucide-react'

const GOLD = '#D4B570'
const MUTED = '#8F9AAF'

// Lucide wrapper z gold/muted styling
export function IconHome({ size = 20, active = false }) {
  return <LayoutDashboard size={size} color={active ? GOLD : MUTED} strokeWidth={1.75}/>
}
export function IconClients({ size = 20, active = false, color }) {
  return <Users size={size} color={color || (active ? GOLD : MUTED)} strokeWidth={1.75}/>
}
export function IconTraining({ size = 20, active = false }) {
  return <Dumbbell size={size} color={active ? GOLD : MUTED} strokeWidth={1.75}/>
}
export function IconPlan({ size = 20, active = false }) {
  return <ClipboardList size={size} color={active ? GOLD : MUTED} strokeWidth={1.75}/>
}
export function IconReport({ size = 20, active = false, color }) {
  return <ClipboardCheck size={size} color={color || (active ? GOLD : MUTED)} strokeWidth={1.75}/>
}
export function IconProgress({ size = 20, active = false }) {
  return <TrendingUp size={size} color={active ? GOLD : MUTED} strokeWidth={1.75}/>
}
export function IconAttention({ size = 20, color }) {
  return <TriangleAlert size={size} color={color || '#EF6B73'} strokeWidth={1.75}/>
}
export function IconKnowledge({ size = 20, active = false }) {
  return <ScrollText size={size} color={active ? GOLD : MUTED} strokeWidth={1.75}/>
}
export function IconAchievement({ size = 20 }) {
  return <Trophy size={size} color={GOLD} strokeWidth={1.75}/>
}
export function IconLogout({ size = 20 }) {
  return <LogOut size={size} color='#EF6B73' strokeWidth={1.75}/>
}
export function IconAdd({ size = 20 }) {
  return <Plus size={size} color={GOLD} strokeWidth={2}/>
}
export function IconSwap({ size = 20 }) {
  return <ArrowLeftRight size={size} color='#5B8DB8' strokeWidth={1.75}/>
}
export function IconNutrition({ size = 20, active = false }) {
  return <Apple size={size} color={active ? GOLD : MUTED} strokeWidth={1.75}/>
}
export function IconSettings({ size = 20 }) {
  return <Settings size={size} color={MUTED} strokeWidth={1.75}/>
}
export function IconTarget({ size = 20 }) {
  return <Target size={size} color={GOLD} strokeWidth={1.75}/>
}

// ─── CUSTOM GREEK SVG (brand layer) ──────────────────────────────────────────

export function GreekMeander({ width = 200, opacity = 0.3 }) {
  return (
    <svg width={width} height="12" viewBox={`0 0 ${width} 12`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity}}>
      <path d={`M0,6 ${Array.from({length:Math.floor(width/20)},(_,i)=>{
        const x=i*20
        return `L${x},6 L${x},2 L${x+4},2 L${x+4},10 L${x+8},10 L${x+8},6 L${x+12},6 L${x+12},2 L${x+16},2 L${x+16},6`
      }).join(' ')}`} stroke="#D4B570" strokeWidth="1.2" fill="none"/>
    </svg>
  )
}

export function GreekLaurel({ size = 24, color = '#D4B570' }) {
  return (
    <svg width={size * 2} height={size} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12 C4 8 6 5 9 4 C7 7 7 10 8 12" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8"/>
      <path d="M4 12 C2 10 2 7 4 5 C5 8 5 10 6 12" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M4 12 C4 14 5 17 8 18 C7 15 7 13 8 12" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8"/>
      <path d="M4 12 C2 13 2 16 4 18 C5 15 5 13 6 12" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M44 12 C44 8 42 5 39 4 C41 7 41 10 40 12" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8"/>
      <path d="M44 12 C46 10 46 7 44 5 C43 8 43 10 42 12" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M44 12 C44 14 43 17 40 18 C41 15 41 13 40 12" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8"/>
      <path d="M44 12 C46 13 46 16 44 18 C43 15 43 13 42 12" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6"/>
      <line x1="4" y1="12" x2="44" y2="12" stroke={color} strokeWidth="0.5" opacity="0.2"/>
      <circle cx="24" cy="12" r="2" fill={color} opacity="0.6"/>
    </svg>
  )
}

export function GreekTemple({ size = 20, color = '#D4B570' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 22,7 2,7" fill={color} opacity="0.8"/>
      <rect x="2" y="17" width="20" height="2" fill={color} opacity="0.7"/>
      <rect x="1" y="19" width="22" height="2" fill={color} opacity="0.9"/>
      <rect x="4" y="7" width="2" height="10" fill={color} opacity="0.7"/>
      <rect x="8" y="7" width="2" height="10" fill={color} opacity="0.7"/>
      <rect x="12" y="7" width="2" height="10" fill={color} opacity="0.7"/>
      <rect x="16" y="7" width="2" height="10" fill={color} opacity="0.7"/>
      <rect x="20" y="7" width="2" height="10" fill={color} opacity="0.7"/>
    </svg>
  )
}
