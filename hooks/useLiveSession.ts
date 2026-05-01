'use client';

/**
 * Verbinding met de Gemini Live API. Levert verbindingsstatus, transcript-events
 * en spreker-status (bot/docent) aan de UI. Audio in/uit gaat direct
 * browser <-> Google via WebSocket; we slaan geen audio op.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GoogleGenAI,
  type LiveServerMessage,
  type Session as LiveSession,
} from '@google/genai';
import { encodePcmChunk } from '@/lib/live-api/audio/encode';
import { LivePlayer } from '@/lib/live-api/audio/player';
import { LiveRecorder } from '@/lib/live-api/audio/recorder';
import type { LiveConfig } from '@/lib/live-api/session-config';

export type LiveStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'ended'
  | 'error';

export interface TranscriptEvent {
  speaker: 'bot' | 'docent';
  text: string;
  finished: boolean;
  at: string;
}

export interface UseLiveSessionOptions {
  onTranscript?: (event: TranscriptEvent) => void;
  onSpeaker?: (speaker: 'bot' | 'docent' | null) => void;
}

export interface StartParams {
  token: string;
  config: LiveConfig;
  model: string;
}

export function useLiveSession(options: UseLiveSessionOptions = {}) {
  const [status, setStatus] = useState<LiveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sessionRef = useRef<LiveSession | null>(null);
  const recorderRef = useRef<LiveRecorder | null>(null);
  const playerRef = useRef<LivePlayer | null>(null);
  const callbacksRef = useRef(options);
  useEffect(() => {
    callbacksRef.current = options;
  }, [options]);

  const cleanup = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    playerRef.current?.stop();
    playerRef.current = null;
    sessionRef.current?.close();
    sessionRef.current = null;
    callbacksRef.current.onSpeaker?.(null);
  }, []);

  const handleMessage = useCallback((message: LiveServerMessage) => {
    const sc = message.serverContent;
    if (!sc) return;
    const onTranscript = callbacksRef.current.onTranscript;
    const onSpeaker = callbacksRef.current.onSpeaker;

    if (sc.inputTranscription?.text) {
      onSpeaker?.('docent');
      onTranscript?.({
        speaker: 'docent',
        text: sc.inputTranscription.text,
        finished: Boolean(sc.inputTranscription.finished),
        at: new Date().toISOString(),
      });
    }
    if (sc.outputTranscription?.text) {
      onSpeaker?.('bot');
      onTranscript?.({
        speaker: 'bot',
        text: sc.outputTranscription.text,
        finished: Boolean(sc.outputTranscription.finished),
        at: new Date().toISOString(),
      });
    }

    const audioPart = sc.modelTurn?.parts?.find(
      (p) => p.inlineData?.mimeType?.startsWith('audio/')
    );
    if (audioPart?.inlineData?.data) {
      playerRef.current?.enqueueBase64(audioPart.inlineData.data);
    }
    if (sc.turnComplete || sc.generationComplete) {
      onSpeaker?.(null);
    }
  }, []);

  const start = useCallback(
    async ({ token, config, model }: StartParams) => {
      if (sessionRef.current) return;
      setStatus('connecting');
      setErrorMessage(null);

      try {
        const ai = new GoogleGenAI({
          apiKey: token,
          apiVersion: 'v1alpha',
        } as ConstructorParameters<typeof GoogleGenAI>[0]);

        const player = new LivePlayer();
        playerRef.current = player;
        await player.init();

        const session = await ai.live.connect({
          model,
          config: config as never,
          callbacks: {
            onopen: () => setStatus('connected'),
            onmessage: handleMessage,
            onerror: (event) => {
              const msg =
                (event as ErrorEvent).message ?? 'Live API verbinding mislukt';
              setErrorMessage(msg);
              setStatus('error');
            },
            onclose: () => setStatus((prev) => (prev === 'error' ? prev : 'ended')),
          },
        });
        sessionRef.current = session;

        const recorder = new LiveRecorder({
          onChunk: (pcm) => {
            const encoded = encodePcmChunk(pcm);
            session.sendRealtimeInput({
              audio: { data: encoded, mimeType: 'audio/pcm;rate=16000' },
            });
          },
        });
        recorderRef.current = recorder;
        await recorder.start();
      } catch (err) {
        cleanup();
        const msg = err instanceof Error ? err.message : 'Onbekende fout';
        setErrorMessage(msg);
        setStatus('error');
      }
    },
    [cleanup, handleMessage]
  );

  const stop = useCallback(() => {
    cleanup();
    setStatus((prev) => (prev === 'error' ? prev : 'ended'));
  }, [cleanup]);

  const setMuted = useCallback((muted: boolean) => {
    recorderRef.current?.setMuted(muted);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  return { status, errorMessage, start, stop, setMuted };
}
