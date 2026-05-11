import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'ARETÉ <noreply@arete-system.pl>'

export async function sendPlanReadyEmail({ clientEmail, clientName, planName, coachName }) {
  return resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: `${coachName} przygotował Twój plan treningowy`,
    html: `
      <div style="background:#0f0f0f;color:#e8e8e8;font-family:'Outfit',sans-serif;max-width:560px;margin:0 auto;padding:40px 32px;">
        <p style="font-family:Georgia,serif;font-size:28px;color:#D4B570;letter-spacing:0.2em;margin:0 0 32px">ARETÉ</p>
        <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;color:#e8e8e8">Twój plan jest gotowy</h1>
        <p style="color:#8F9AAF;font-size:15px;line-height:1.6;margin:0 0 24px">
          Cześć ${clientName},<br><br>
          ${coachName} przygotował dla Ciebie nowy plan treningowy: <strong style="color:#D4B570">${planName}</strong>.
        </p>
        <a href="https://arete-system.pl/client/plan" style="display:inline-block;background:#D4B570;color:#0f0f0f;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:14px;letter-spacing:0.05em;">
          Zobacz plan →
        </a>
        <p style="color:#555;font-size:12px;margin-top:40px;">arete-system.pl · ${coachName}</p>
      </div>
    `
  })
}

export async function sendFeedbackEmail({ clientEmail, clientName, coachName, feedbackText, weekNumber }) {
  return resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: `${coachName} odpowiedział na Twój check-in`,
    html: `
      <div style="background:#0f0f0f;color:#e8e8e8;font-family:'Outfit',sans-serif;max-width:560px;margin:0 auto;padding:40px 32px;">
        <p style="font-family:Georgia,serif;font-size:28px;color:#D4B570;letter-spacing:0.2em;margin:0 0 32px">ARETÉ</p>
        <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;color:#e8e8e8">Nowa wiadomość od trenera</h1>
        <p style="color:#8F9AAF;font-size:15px;line-height:1.6;margin:0 0 20px">
          Cześć ${clientName}, ${coachName} odpowiedział na Twój check-in z tygodnia ${weekNumber}:
        </p>
        <div style="border-left:3px solid #D4B570;padding:16px 20px;background:#1a1a1a;border-radius:0 8px 8px 0;margin-bottom:28px;">
          <p style="color:#e8e8e8;font-size:15px;line-height:1.7;margin:0;">${feedbackText}</p>
        </div>
        <a href="https://arete-system.pl/client" style="display:inline-block;background:#D4B570;color:#0f0f0f;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:14px;letter-spacing:0.05em;">
          Przejdź do panelu →
        </a>
        <p style="color:#555;font-size:12px;margin-top:40px;">arete-system.pl · ${coachName}</p>
      </div>
    `
  })
}

export async function sendCheckinReminderEmail({ clientEmail, clientName, coachName, weekNumber }) {
  return resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: `Czas na check-in — tydzień ${weekNumber}`,
    html: `
      <div style="background:#0f0f0f;color:#e8e8e8;font-family:'Outfit',sans-serif;max-width:560px;margin:0 auto;padding:40px 32px;">
        <p style="font-family:Georgia,serif;font-size:28px;color:#D4B570;letter-spacing:0.2em;margin:0 0 32px">ARETÉ</p>
        <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;color:#e8e8e8">Czas na tygodniowy check-in</h1>
        <p style="color:#8F9AAF;font-size:15px;line-height:1.6;margin:0 0 24px">
          Cześć ${clientName},<br><br>
          Mija tydzień ${weekNumber} Twojego mezocyklu. ${coachName} czeka na Twój raport — waga, energia, sen, adherencja.
        </p>
        <a href="https://arete-system.pl/client/checkin" style="display:inline-block;background:#D4B570;color:#0f0f0f;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:14px;letter-spacing:0.05em;">
          Wypełnij check-in →
        </a>
        <p style="color:#555;font-size:12px;margin-top:40px;">arete-system.pl · ${coachName}</p>
      </div>
    `
  })
}
