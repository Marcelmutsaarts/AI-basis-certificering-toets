/**
 * Alle 20 casuskaartjes (1A t/m 5D), samengevoegd uit casus-cards-1 (webinar
 * 1 t/m 3) en casus-cards-2 (webinar 4 en 5). Gesplitst om elk bestand onder
 * de regellimiet te houden.
 */
import type { CasusCard } from './types';
import { CASUS_CARDS_1 } from './casus-cards-1';
import { CASUS_CARDS_2 } from './casus-cards-2';

export const CASUS_CARDS: Record<string, CasusCard> = {
  ...CASUS_CARDS_1,
  ...CASUS_CARDS_2,
};
