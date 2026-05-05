import './globals.css'
import { Cormorant_Garamond, Outfit } from 'next/font/google'

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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#140900" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Areté" />
      </head>
      <body>
        {children}
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