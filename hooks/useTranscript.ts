'use client';

/**
 * Houdt een lokale lijst transcript-bubbles bij. Per spreker is er
 * maximaal een actieve (streaming) bubble waaraan tekst wordt aangevuld.
 * Zodra een bubble afsluit (finished:true) wordt deze gepusht naar
 * /api/live-session/transcript voor persistentie.
 *
 * BUG-W3-002: De Live API kan transcript-events soms cumulatief sturen
 * (text = volledige string tot nu toe) en soms incrementeel (text = delta).
 * mergeTranscriptText pakt beide gevallen correct af, plus dedup.
 */
import { useCallback, useRef, useState } from 'react';
import type { TranscriptEvent } from './useLiveSession';

export interface TranscriptBubble {
  id: string;
  speaker: 'bot' | 'docent';
  text: string;
  startedAt: string;
  finished: boolean;
  sequence: number;
}

interface ActiveBubble {
  id: string;
  startedAt: string;
  fullText: string;
  sequence: number;
}

export interface UseTranscriptOptions {
  examSessionId: string;
}

export function mergeTranscriptText(prev: string, incoming: string): string {
  if (!incoming) return prev;
  if (!prev) return incoming;
  if (incoming.startsWith(prev)) return incoming;
  if (prev.endsWith(incoming)) return prev;
  return prev + incoming;
}

export function useTranscript({ examSessionId }: UseTranscriptOptions) {
  const [bubbles, setBubbles] = useState<TranscriptBubble[]>([]);
  const activeRef = useRef<{ bot: ActiveBubble | null; docent: ActiveBubble | null }>(
    { bot: null, docent: null }
  );
  const sequenceRef = useRef(0);

  const persistBubble = useCallback(
    async (bubble: TranscriptBubble) => {
      try {
        await fetch('/api/live-session/transcript', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examSessionId,
            speaker: bubble.speaker,
            text: bubble.text,
            startedAt: bubble.startedAt,
            sequence: bubble.sequence,
          }),
          keepalive: true,
        });
      } catch (err) {
        console.error('Transcript-push mislukt', err);
      }
    },
    [examSessionId]
  );

  const updateBubble = useCallback(
    (id: string, mutate: (b: TranscriptBubble) => TranscriptBubble) => {
      setBubbles((prev) => prev.map((b) => (b.id === id ? mutate(b) : b)));
    },
    []
  );

  const finalizeOther = useCallback(
    (currentSpeaker: 'bot' | 'docent') => {
      const otherSpeaker: 'bot' | 'docent' =
        currentSpeaker === 'bot' ? 'docent' : 'bot';
      const otherActive = activeRef.current[otherSpeaker];
      if (!otherActive) return;
      const finishedBubble: TranscriptBubble = {
        id: otherActive.id,
        speaker: otherSpeaker,
        text: otherActive.fullText,
        startedAt: otherActive.startedAt,
        finished: true,
        sequence: otherActive.sequence,
      };
      activeRef.current[otherSpeaker] = null;
      updateBubble(otherActive.id, () => finishedBubble);
      void persistBubble(finishedBubble);
    },
    [persistBubble, updateBubble]
  );

  const upsert = useCallback(
    (event: TranscriptEvent) => {
      // Speaker-wissel: sluit vorige bubble van de andere spreker af zodat
      // de chat alterneert in plaats van twee groeiende blokken te tonen.
      finalizeOther(event.speaker);
      const active = activeRef.current[event.speaker];
      if (!active) {
        const id = `${event.speaker}-${sequenceRef.current}`;
        const sequence = sequenceRef.current;
        sequenceRef.current += 1;
        const initialText = event.text ?? '';
        const newActive: ActiveBubble = {
          id,
          startedAt: event.at,
          fullText: initialText,
          sequence,
        };
        activeRef.current[event.speaker] = newActive;
        setBubbles((prev) => [
          ...prev,
          {
            id,
            speaker: event.speaker,
            text: initialText,
            startedAt: event.at,
            finished: false,
            sequence,
          },
        ]);
        if (event.finished) {
          activeRef.current[event.speaker] = null;
          updateBubble(id, (b) => ({ ...b, finished: true }));
          void persistBubble({
            id,
            speaker: event.speaker,
            text: initialText,
            startedAt: event.at,
            finished: true,
            sequence,
          });
        }
        return;
      }

      const merged = mergeTranscriptText(active.fullText, event.text ?? '');
      active.fullText = merged;
      updateBubble(active.id, (b) => ({ ...b, text: merged }));
      if (event.finished) {
        const finishedBubble: TranscriptBubble = {
          id: active.id,
          speaker: event.speaker,
          text: merged,
          startedAt: active.startedAt,
          finished: true,
          sequence: active.sequence,
        };
        activeRef.current[event.speaker] = null;
        updateBubble(active.id, () => finishedBubble);
        void persistBubble(finishedBubble);
      }
    },
    [finalizeOther, persistBubble, updateBubble]
  );

  const flushAll = useCallback(() => {
    for (const speaker of ['bot', 'docent'] as const) {
      const active = activeRef.current[speaker];
      if (!active) continue;
      const bubble: TranscriptBubble = {
        id: active.id,
        speaker,
        text: active.fullText,
        startedAt: active.startedAt,
        finished: true,
        sequence: active.sequence,
      };
      activeRef.current[speaker] = null;
      updateBubble(active.id, () => bubble);
      void persistBubble(bubble);
    }
  }, [persistBubble, updateBubble]);

  return { bubbles, ingestEvent: upsert, flushAll };
}
