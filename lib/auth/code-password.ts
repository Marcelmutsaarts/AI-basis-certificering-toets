/**
 * Gedeelde helper voor het omzetten van een 4-cijferige inlogcode naar het
 * Supabase-wachtwoord. Een code van 4 cijfers is korter dan de minimale
 * wachtwoordlengte die GoTrue eist, daarom plakken we er een vaste prefix voor.
 * Zo wordt "1234" het wachtwoord "avd-1234" (8 tekens), lang genoeg voor GoTrue.
 *
 * Belangrijk: het seed-script en de login gebruiken allebei deze functie. Ze
 * moeten identiek zijn, anders kan een deelnemer niet inloggen met zijn code.
 * Daarom woont deze logica in een gedeeld bestand zonder secrets.
 */

/**
 * Zet een genormaliseerde 4-cijferige code om naar het GoTrue-wachtwoord.
 * Deterministisch en puur, geen secrets.
 */
export function codeToPassword(code: string): string {
  return `avd-${code.trim()}`;
}

/**
 * Strip alle spaties en niet-cijfers uit ruwe invoer en geeft alleen de
 * cijfers terug. Gebruikt door de login om gebruikersinvoer te normaliseren
 * voordat die naar codeToPassword gaat.
 */
export function normalizeCode(raw: string): string {
  return raw.replace(/\D/g, '');
}
