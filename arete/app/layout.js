import './globals.css'

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
    <html lang="pl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#140900" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Areté" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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