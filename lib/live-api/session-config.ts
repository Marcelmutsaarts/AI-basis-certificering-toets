/**
 * Bouwt de Live API session config. Wordt zowel server-side gebruikt voor
 * ephemeral-token-creatie (lockt de config) als client-side meegegeven aan
 * `ai.live.connect`. Houd de waardes hetzelfde aan beide kanten.
 */
import {
  PERSONA_LANGUAGE_CODE,
  RESPONSE_MODALITY,
  resolveVoiceName,
} from '@/lib/bot/persona';

export interface LiveConfig {
  responseModalities: string[];
  speechConfig: {
    voiceConfig: { prebuiltVoiceConfig: { voiceName: string } };
    languageCode: string;
  };
  systemInstruction: { parts: Array<{ text: string }> };
  inputAudioTranscription: Record<string, never>;
  outputAudioTranscription: Record<string, never>;
}

export function buildLiveConfig(systemPrompt: string): LiveConfig {
  return {
    responseModalities: [RESPONSE_MODALITY],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: resolveVoiceName() },
      },
      languageCode: PERSONA_LANGUAGE_CODE,
    },
    systemInstruction: { parts: [{ text: systemPrompt }] },
    inputAudioTranscription: {},
    outputAudioTranscription: {},
  };
}
