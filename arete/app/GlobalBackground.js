'use client'
import OceanBackground from './client/OceanBackground'
import { usePathname } from 'next/navigation'

export default function GlobalBackground() {
  const pathname = usePathname()
  // Nie pokazuj na landing page (/)
  if (pathname === '/') return null
  return <OceanBackground />
}
