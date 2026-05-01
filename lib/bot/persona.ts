/**
 * Persona-config voor Lieke. Voicekeuze en modaliteit worden door
 * lib/live-api/session-config.ts in de Live API config gezet.
 *
 * Voice: Aoede is een rustige, warme Nederlands-vriendelijke prebuilt voice
 * uit de Gemini Live API. Configureerbaar via env LIVE_VOICE_NAME.
 */

export const PERSONA_NAME = 'Lieke';

export const PERSONA_LANGUAGE_CODE = 'nl-NL';

export const DEFAULT_VOICE_NAME = 'Aoede';

export function resolveVoiceName(): string {
  const env = process.env.LIVE_VOICE_NAME;
  if (env && env.trim().length > 0) {
    return env.trim();
  }
  return DEFAULT_VOICE_NAME;
}

export const RESPONSE_MODALITY = 'AUDIO' as const;

/**
 * Sample-rate vereist door de Gemini Live API voor zowel input als output PCM.
 * Input verwacht 16 kHz mono, output is 24 kHz mono. Deze waarden zijn nodig
 * voor de browser-side AudioContext en resampling.
 */
export const INPUT_SAMPLE_RATE = 16_000;
export const OUTPUT_SAMPLE_RATE = 24_000;

/**
 * Default modelnaam, configureerbaar via env MODEL_LIVE.
 *
 * De Live API preview variant vereist de `-preview` suffix. De niet-preview
 * naam `gemini-3.1-flash-live` sluit direct omdat dat model niet beschikbaar
 * is voor deze endpoint.
 */
export function resolveLiveModel(): string {
  const env = process.env.MODEL_LIVE;
  if (env && env.trim().length > 0) {
    return env.trim();
  }
  return 'gemini-3.1-flash-live-preview';
}
