export const metadata = { title: 'Regulamin — ARETÉ' }

export default function RegulaminPage() {
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

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#D4B570', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>REGULAMIN</h1>
        <p style={{ color: 'rgba(212,181,112,0.5)', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '3rem' }}>ARETÉ COACHING · Obowiązuje od 1 maja 2026</p>

        {[
          {
            title: '§1. Postanowienia ogólne',
            content: `1. Usługodawcą jest Alexander Panorios, prowadzący działalność pod marką ARETÉ, zwany dalej "Trenerem" lub "Usługodawcą".
2. Niniejszy Regulamin określa zasady świadczenia usług coachingowych i treningowych online za pośrednictwem platformy dostępnej pod adresem arete-system.pl.
3. Korzystanie z usług oznacza akceptację niniejszego Regulaminu.
4. Kontakt: alexander.panorios@gmail.com | +48 730 198 366`,
          },
          {
            title: '§2. Zakres usług',
            content: `1. Usługodawca świadczy następujące usługi:
   a) PAIDEIA — jednorazowy plan treningowy z arkuszem śledzenia postępu
   b) ASKESIS — miesięczna opieka coachingowa z raportami co 2 tygodnie
   c) ARETÉ — pełna opieka coachingowa z tygodniowymi raportami i dostępem do platformy
   d) Treningi personalne stacjonarne w JustGYM Częstochowa
2. Szczegółowy zakres każdego pakietu dostępny jest na stronie głównej.
3. Usługodawca zastrzega prawo do modyfikacji zakresu usług przy zachowaniu poinformowania Klienta z 14-dniowym wyprzedzeniem.`,
          },
          {
            title: '§3. Zawarcie umowy i płatności',
            content: `1. Umowa zostaje zawarta z chwilą potwierdzenia zamówienia przez Usługodawcę i zaksięgowania płatności.
2. Płatności realizowane są z góry — miesięcznie lub w pakiecie 3-miesięcznym.
3. Akceptowane formy płatności: przelew bankowy, BLIK, Revolut.
4. W przypadku pakietu 3-miesięcznego Klient otrzymuje rabat zgodny z aktualnym cennikiem.
5. Faktury wystawiane są na życzenie Klienta.`,
          },
          {
            title: '§4. Realizacja usług',
            content: `1. Po zaksięgowaniu płatności Klient otrzymuje dostęp do platformy oraz ankietę onboardingową.
2. Plan treningowy przygotowywany jest w ciągu 48-72 godzin od wypełnienia ankiety.
3. Raporty tygodniowe/dwutygodniowe należy wysyłać przez platformę do uzgodnionego dnia tygodnia.
4. Trener odpowiada na raporty w ciągu 24-48 godzin w dni robocze.
5. Klient zobowiązuje się do rzetelnego wypełniania raportów i informowania o kontuzjach.`,
          },
          {
            title: '§5. Odstąpienie od umowy i rezygnacja',
            content: `1. Klient ma prawo odstąpić od umowy w ciągu 14 dni od jej zawarcia, jeśli usługa nie została jeszcze rozpoczęta.
2. Po rozpoczęciu realizacji usługi (przesłaniu planu) zwrot przysługuje proporcjonalnie do niewykorzystanego okresu.
3. Rezygnacja z subskrypcji miesięcznej wymaga powiadomienia z 7-dniowym wyprzedzeniem przed kolejnym okresem rozliczeniowym.
4. W przypadku rażącego naruszenia Regulaminu przez Klienta, Usługodawca może rozwiązać umowę bez zwrotu.`,
          },
          {
            title: '§6. Odpowiedzialność i zdrowie',
            content: `1. Klient oświadcza, że jest zdolny do wykonywania ćwiczeń fizycznych i nie ma przeciwwskazań zdrowotnych.
2. W przypadku chorób przewlekłych, kontuzji lub wątpliwości zdrowotnych, Klient powinien skonsultować się z lekarzem przed rozpoczęciem programu.
3. Usługodawca nie ponosi odpowiedzialności za szkody wynikające z wykonywania ćwiczeń niezgodnie z zaleceniami lub zatajenia stanu zdrowia.
4. Plany treningowe opierają się na aktualnej wiedzy naukowej, jednak efekty mogą różnić się w zależności od indywidualnych predyspozycji.`,
          },
          {
            title: '§7. Własność intelektualna',
            content: `1. Wszystkie materiały udostępniane przez Usługodawcę (plany treningowe, materiały edukacyjne, treści platformy) stanowią własność intelektualną Alexandra Panorios.
2. Klient może korzystać z materiałów wyłącznie na użytek własny.
3. Kopiowanie, dystrybucja lub odsprzedaż materiałów bez zgody Usługodawcy jest zabroniona.
4. Platforma arete-system.pl oraz jej kod źródłowy są chronione prawem autorskim © 2025-2026 Alexander Panorios.`,
          },
          {
            title: '§8. Postanowienia końcowe',
            content: `1. W sprawach nieuregulowanych niniejszym Regulaminem stosuje się przepisy Kodeksu Cywilnego oraz ustawy o świadczeniu usług drogą elektroniczną.
2. Wszelkie spory będą rozstrzygane przez sąd właściwy dla miejsca siedziby Usługodawcy.
3. Regulamin może być zmieniany — Klienci zostaną poinformowani o zmianach drogą mailową z 14-dniowym wyprzedzeniem.
4. Aktualna wersja Regulaminu dostępna jest zawsze pod adresem arete-system.pl/regulamin.`,
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
