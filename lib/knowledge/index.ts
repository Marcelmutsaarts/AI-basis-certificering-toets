/**
 * Publieke ingang van de kennismodule. Herexporteert de types en data en
 * biedt twee lookup-helpers voor de examinator- en beoordelaar-prompts.
 */
import { CASUS_CARDS } from './casus-cards';
import { WEBINAR_GROUND } from './webinar-ground';
import type { CasusCard, WebinarGround } from './types';

export * from './types';
export { CASUS_CARDS } from './casus-cards';
export { WEBINAR_GROUND } from './webinar-ground';

export function getCasusCard(code: string): CasusCard | undefined {
  return CASUS_CARDS[code];
}

export function getWebinarGround(
  webinar: number
): WebinarGround | undefined {
  return WEBINAR_GROUND[webinar];
}
