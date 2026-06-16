/**
 * Verstuurt de toetsuitslag via Resend naar het AVD-team. Server-only.
 *
 * replyTo wordt alleen gezet als de docent een plausibel e-mailadres heeft,
 * zodat het team direct kan antwoorden. Een ontbrekend of ongeldig adres
 * laat replyTo weg, anders zou Resend een 502 geven. Bij een Resend-fout of
 * ontbrekend mail-ID wordt een duidelijke fout gegooid voor de route.
 */
import { getResendClient, MAIL_FROM, MAIL_TO_AVD } from './client';
import {
  buildHtml,
  buildText,
  buildSubject,
  type ResultEmailPayload,
} from './result-email';

export async function verstuurResultaat(
  payload: ResultEmailPayload
): Promise<{ id: string }> {
  const resend = getResendClient();

  const email = payload.docent.email;
  const replyTo = email && email.includes('@') ? { replyTo: email } : {};

  const result = await resend.emails.send({
    from: MAIL_FROM,
    to: MAIL_TO_AVD,
    ...replyTo,
    subject: buildSubject(payload),
    html: buildHtml(payload),
    text: buildText(payload),
  });

  if (result.error) {
    throw new Error(`Mail versturen mislukt: ${result.error.message}`);
  }
  if (!result.data?.id) {
    throw new Error('Resend gaf geen mail-ID terug.');
  }
  return { id: result.data.id };
}
