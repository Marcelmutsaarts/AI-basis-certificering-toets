/**
 * Resend-client voor server-side mailversturen. Lazy en gecachet.
 *
 * Server-only. RESEND_API_KEY wordt uitsluitend hier gelezen en mag nooit
 * naar de client lekken. MAIL_FROM en MAIL_TO_AVD komen uit env met
 * veilige defaults.
 */
import { Resend } from 'resend';

let cached: Resend | null = null;

export function getResendClient(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      'RESEND_API_KEY ontbreekt in de omgeving. Voeg de key toe aan .env.local en aan Vercel.'
    );
  }
  cached = new Resend(key);
  return cached;
}

export const MAIL_FROM =
  process.env.MAIL_FROM ?? 'AI voor Docenten <onboarding@resend.dev>';

export const MAIL_TO_AVD = process.env.MAIL_TO_AVD ?? 'info@aivoordocenten.nl';
