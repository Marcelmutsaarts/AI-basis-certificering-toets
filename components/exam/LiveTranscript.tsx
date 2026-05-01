'use client';

/**
 * Chat-stream van transcript-bubbles met auto-scroll.
 * Auto-scroll alleen als de gebruiker al onderaan zat (anders niet
 * onderbreken bij teruglezen).
 */
import { useEffect, useRef } from 'react';
import type { TranscriptBubble as Bubble } from '@/hooks/useTranscript';
import { TranscriptBubble } from './TranscriptBubble';

export interface LiveTranscriptProps {
  bubbles: Bubble[];
}

const BOTTOM_TOLERANCE = 80;

export function LiveTranscript({ bubbles }: LiveTranscriptProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!stickToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [bubbles]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - (el.scrollTop + el.clientHeight);
    stickToBottomRef.current = distance < BOTTOM_TOLERANCE;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex flex-col gap-3 h-full overflow-y-auto px-1 py-2"
    >
      {bubbles.length === 0 ? (
        <p className="text-sm text-text-body/70 text-center">
          Het gesprek verschijnt hier zodra Lieke begint.
        </p>
      ) : (
        bubbles.map((b) => (
          <TranscriptBubble
            key={b.id}
            speaker={b.speaker}
            text={b.text}
            finished={b.finished}
          />
        ))
      )}
    </div>
  );
}
