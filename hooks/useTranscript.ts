'use client';

/**
 * Houdt een lokale lijst transcript-bubbles bij. Per spreker is er
 * maximaal een actieve (streaming) bubble waaraan tekst wordt aangevuld.
 * Zodra een bubble afsluit (finished:true) wordt deze gepusht naar
 * /api/live-session/transcript voor persistentie.
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
  parts: string[];
  sequence: number;
}

export interface UseTranscriptOptions {
  examSessionId: string;
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

  const upsert = useCallback(
    (event: TranscriptEvent) => {
      const active = activeRef.current[event.speaker];
      if (!active) {
        const id = `${event.speaker}-${sequenceRef.current}`;
        const sequence = sequenceRef.current;
        sequenceRef.current += 1;
        const newActive: ActiveBubble = {
          id,
          startedAt: event.at,
          parts: [event.text],
          sequence,
        };
        activeRef.current[event.speaker] = newActive;
        setBubbles((prev) => [
          ...prev,
          {
            id,
            speaker: event.speaker,
            text: event.text,
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
            text: event.text,
            startedAt: event.at,
            finished: true,
            sequence,
          });
        }
        return;
      }

      active.parts.push(event.text);
      const fullText = active.parts.join('');
      updateBubble(active.id, (b) => ({ ...b, text: fullText }));
      if (event.finished) {
        const finishedBubble: TranscriptBubble = {
          id: active.id,
          speaker: event.speaker,
          text: fullText,
          startedAt: active.startedAt,
          finished: true,
          sequence: active.sequence,
        };
        activeRef.current[event.speaker] = null;
        updateBubble(active.id, () => finishedBubble);
        void persistBubble(finishedBubble);
      }
    },
    [persistBubble, updateBubble]
  );

  const flushAll = useCallback(() => {
    for (const speaker of ['bot', 'docent'] as const) {
      const active = activeRef.current[speaker];
      if (!active) continue;
      const bubble: TranscriptBubble = {
        id: active.id,
        speaker,
        text: active.parts.join(''),
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
