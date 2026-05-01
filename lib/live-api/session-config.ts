/**
 * Bouwt de Live API session config. Deze config blijft server-side en wordt
 * vastgelegd in het ephemeral token via liveConnectConstraints.
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
