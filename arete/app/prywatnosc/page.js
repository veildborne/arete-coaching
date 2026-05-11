export const metadata = { title: 'Polityka Prywatności — ARETÉ' }

export default function PrywatnoscPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#020c18',
      color: '#e8e8e8',
      fontFamily: 'Outfit, sans-serif',
      padding: '4rem 1.5rem',
    }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <a href="/" style={{ color: 'rgba(212,181,112,0.6)', fontSize: '0.8rem', letterSpacing: '0.1em', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>← Wróć</a>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#D4B570', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>POLITYKA PRYWATNOŚCI</h1>
        <p style={{ color: 'rgba(212,181,112,0.5)', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '3rem' }}>ARETÉ COACHING · Obowiązuje od 1 maja 2026</p>

        {[
          {
            title: '1. Administrator danych',
            content: `Administratorem Twoich danych osobowych jest Alexander Panorios, prowadzący działalność pod marką ARETÉ.

Kontakt: alexander.panorios@gmail.com | +48 730 198 366
Adres: Częstochowa, Polska`,
          },
          {
            title: '2. Jakie dane zbieramy',
            content: `Zbieramy następujące dane:

- Dane kontaktowe: imię, nazwisko, adres email, numer telefonu
- Dane zdrowotne i treningowe: waga, wzrost, wiek, cele treningowe, historia kontuzji, stan zdrowia — podawane dobrowolnie w ankiecie onboardingowej
- Dane treningowe: logi treningów, pomiary, raporty tygodniowe
- Dane techniczne: adres IP, typ przeglądarki, pliki cookies niezbędne do działania platformy`,
          },
          {
            title: '3. Cel i podstawa przetwarzania',
            content: `Twoje dane przetwarzamy w celu:

- Realizacji umowy o świadczenie usług coachingowych (art. 6 ust. 1 lit. b RODO)
- Kontaktu i obsługi zapytań (art. 6 ust. 1 lit. b RODO)
- Spełnienia obowiązków prawnych — np. wystawienie faktury (art. 6 ust. 1 lit. c RODO)
- Naszego prawnie uzasadnionego interesu — bezpieczeństwo platformy (art. 6 ust. 1 lit. f RODO)

Dane zdrowotne przetwarzamy wyłącznie na podstawie Twojej wyraźnej zgody (art. 9 ust. 2 lit. a RODO).`,
          },
          {
            title: '4. Przechowywanie danych',
            content: `• Dane klientów aktywnych: przez cały czas trwania współpracy
- Dane po zakończeniu współpracy: do 3 lat (roszczenia)
- Dane z formularza kontaktowego bez zawarcia umowy: do 12 miesięcy
- Dane księgowe: 5 lat zgodnie z przepisami podatkowymi

Masz prawo zażądać wcześniejszego usunięcia danych — skontaktuj się z nami.`,
          },
          {
            title: '5. Udostępnianie danych',
            content: `Nie sprzedajemy Twoich danych. Dane mogą być przekazane wyłącznie:

- Supabase (baza danych) — serwery w strefie EU (Frankfurt)
- Vercel (hosting) — infrastruktura EU
- Resend (wysyłka emaili) — wyłącznie adres email do wysyłki powiadomień
- Organy państwowe — wyłącznie na podstawie prawnego obowiązku`,
          },
          {
            title: '6. Twoje prawa',
            content: `Masz prawo do:

- Dostępu do swoich danych
- Sprostowania nieprawidłowych danych
- Usunięcia danych ("prawo do bycia zapomnianym")
- Ograniczenia przetwarzania
- Przenoszenia danych
- Sprzeciwu wobec przetwarzania
- Cofnięcia zgody w dowolnym momencie

Aby skorzystać z praw, skontaktuj się: alexander.panorios@gmail.com
Masz też prawo złożyć skargę do UODO (uodo.gov.pl).`,
          },
          {
            title: '7. Pliki cookies',
            content: `Używamy wyłącznie niezbędnych plików cookies do:

- Utrzymania sesji zalogowanego użytkownika
- Zapewnienia bezpieczeństwa (CSRF)

Nie używamy cookies reklamowych ani analitycznych. Nie korzystamy z Google Analytics.`,
          },
          {
            title: '8. Bezpieczeństwo',
            content: `Stosujemy następujące środki ochrony danych:

- Szyfrowanie połączeń (HTTPS/TLS)
- Baza danych w strefie EU z kontrolą dostępu (Row Level Security)
- Hasła przechowywane w formie zaszyfrowanej (bcrypt)
- Dostęp do danych klientów tylko dla administratora systemu`,
          },
          {
            title: '9. Kontakt i zmiany',
            content: `W sprawach dotyczących prywatności: alexander.panorios@gmail.com

Polityka może być aktualizowana. O istotnych zmianach poinformujemy emailem z 14-dniowym wyprzedzeniem. Aktualna wersja zawsze dostępna pod adresem arete-system.pl/prywatnosc.`,
          },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#D4B570', marginBottom: '1rem', letterSpacing: '0.05em' }}>{title}</h2>
            <p style={{ color: '#a0a0a0', lineHeight: 1.8, fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{content}</p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid rgba(212,181,112,0.15)', paddingTop: '2rem', marginTop: '3rem', color: 'rgba(212,181,112,0.4)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          © 2025–2026 Alexander Panorios · ARETÉ · Wszelkie prawa zastrzeżone
        </div>
      </div>
    </div>
  )
}
