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
  model: string;
}

const SETUP_TIMEOUT_MS = 10_000;
const INITIAL_GREETING_PROMPT =
  'De docent is aanwezig. Begin het examen met je welkomstwoord.';

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
    async ({ token, model }: StartParams) => {
      if (sessionRef.current) return;
      setStatus('connecting');
      setErrorMessage(null);

      try {
        const ai = new GoogleGenAI({
          apiKey: token,
          apiVersion: 'v1alpha',
          httpOptions: { apiVersion: 'v1alpha' },
        } as ConstructorParameters<typeof GoogleGenAI>[0]);

        const player = new LivePlayer();
        playerRef.current = player;
        await player.init();

        let setupComplete = false;
        let resolveSetup: () => void = () => undefined;
        let rejectSetup: (reason: Error) => void = () => undefined;
        const setupReady = new Promise<void>((resolve, reject) => {
          resolveSetup = resolve;
          rejectSetup = reject;
        });
        const setupTimer = window.setTimeout(() => {
          rejectSetup(new Error('Live API setup duurde te lang.'));
        }, SETUP_TIMEOUT_MS);

        console.info('[live] connecting model=', model);
        const session = await ai.live.connect({
          model,
          callbacks: {
            onopen: () => {
              console.info('[live] websocket open');
            },
            onmessage: (message) => {
              if (message.setupComplete && !setupComplete) {
                setupComplete = true;
                window.clearTimeout(setupTimer);
                console.info('[live] setup complete');
                resolveSetup();
              }
              handleMessage(message);
            },
            onerror: (event) => {
              const evt = event as ErrorEvent;
              const msg = evt.message ?? 'Live API verbinding mislukt';
              console.error('[live] onerror', { message: msg, event });
              setErrorMessage(msg);
              setStatus('error');
              rejectSetup(new Error(msg));
            },
            onclose: (event) => {
              const ce = event as CloseEvent;
              window.clearTimeout(setupTimer);
              recorderRef.current?.stop();
              recorderRef.current = null;
              sessionRef.current = null;
              callbacksRef.current.onSpeaker?.(null);
              console.warn(
                `[live] onclose code=${ce?.code} clean=${ce?.wasClean} reason=${JSON.stringify(ce?.reason)}`
              );
              const reason = ce?.reason
                ? `Live API sloot de sessie: ${ce.reason}`
                : 'Live API verbinding gesloten.';
              if (!setupComplete) {
                setErrorMessage(reason);
                setStatus('error');
                rejectSetup(new Error(reason));
                return;
              }
              setStatus((prev) => (prev === 'error' ? prev : 'ended'));
            },
          },
        });
        sessionRef.current = session;
        await setupReady;
        setStatus('connected');

        // Realtime tekst hoort bij dezelfde VAD/realtime-input stroom als audio.
        // `clientContent` vóór microfoon-audio blijkt op deze preview endpoint
        // niet betrouwbaar een audio-turn te starten.
        try {
          session.sendRealtimeInput({ text: INITIAL_GREETING_PROMPT });
        } catch (triggerErr) {
          console.warn('[live] kon initial trigger niet sturen', triggerErr);
        }

        const recorder = new LiveRecorder({
          onChunk: (pcm) => {
            if (!sessionRef.current) return;
            const encoded = encodePcmChunk(pcm);
            try {
              sessionRef.current.sendRealtimeInput({
                audio: { data: encoded, mimeType: 'audio/pcm;rate=16000' },
              });
            } catch (sendErr) {
              // WS dicht: stop de recorder zodat we niet eindeloos blijven loggen.
              recorderRef.current?.stop();
              recorderRef.current = null;
              console.warn('[live] sendRealtimeInput faalde, recorder gestopt', sendErr);
            }
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
