import './globals.css'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import GlobalBackground from './GlobalBackground'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata = {
  title: 'ARETÉ — Evidence-Based Coaching | Alexander Panorios',
  description: 'Coaching oparty na nauce. Periodyzowane programy treningowe oparte na badaniach naukowych. Hipertrofia, siła, rekompozycja ciała.',
  keywords: 'trener personalny, coaching online, hipertrofia, periodyzacja, evidence-based, Częstochowa',
  openGraph: {
    title: 'ARETÉ — Evidence-Based Coaching',
    description: 'Trenuj z celem. Rośnij z nauką.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <link rel="apple-touch-icon" href="/favicon.svg"/>
        <meta name="theme-color" content="#020c18"/>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Areté" />
      </head>
      <body className="bg-[#020810]">
        <GlobalBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
            })
          }
        `}} />
      </body>
    </html>
  )
}