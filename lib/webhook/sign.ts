/**
 * HMAC-SHA256 signing helper voor de outgoing webhook.
 *
 * De caller MOET dezelfde body-string gebruiken voor zowel de signature
 * als de POST body, zodat n8n de signature kan verifieren met dezelfde
 * bytes. Gebruik daarom altijd het resultaat van `stableStringify` uit
 * `payload.ts` en stuur die ongewijzigd door.
 */
import { createHmac } from 'node:crypto';

export function signPayload(bodyString: string, secret: string): string {
  if (!secret) {
    throw new Error('Webhook secret ontbreekt.');
  }
  return createHmac('sha256', secret).update(bodyString).digest('hex');
}
