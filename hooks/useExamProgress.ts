'use client';

/**
 * Bepaalt aan welke casus we momenteel toe zijn op basis van het transcript.
 * Heuristiek: voor elke casus bouwen we een set significante woorden uit de
 * vraag (genormaliseerd, stopwoorden eruit) en zoeken in nieuwe bot-bubbles
 * naar overlap. Bij een match progresseren we naar die casus en alle
 * eerdere worden afgevinkt.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TranscriptBubble } from './useTranscript';

export interface ExamCasus {
  id: string;
  webinar: number;
  prompt: string;
}

const STOPWORDS = new Set([
  'de', 'het', 'een', 'en', 'of', 'als', 'dat', 'dit', 'die', 'dus', 'want',
  'maar', 'is', 'zijn', 'was', 'waren', 'wordt', 'worden', 'voor', 'naar',
  'aan', 'op', 'in', 'uit', 'over', 'met', 'tot', 'door', 'bij', 'tegen',
  'om', 'tussen', 'zonder', 'wat', 'wie', 'hoe', 'waarom', 'wanneer', 'welke',
  'wel', 'niet', 'ook', 'meer', 'minder', 'veel', 'weinig', 'eigen', 'zo',
  'jij', 'je', 'jou', 'jouw', 'ik', 'mij', 'mijn', 'wij', 'wij', 'we', 'ons',
  'hun', 'er', 'daar', 'hier', 'al', 'nog', 'even', 'echt',
]);

const MATCH_THRESHOLD = 3;

function tokenize(text: string): Set<string> {
  const lower = text.toLowerCase();
  const tokens = new Set<string>();
  for (const raw of lower.split(/[^a-z0-9-]+/)) {
    if (!raw) continue;
    if (raw.length < 4) continue;
    if (STOPWORDS.has(raw)) continue;
    tokens.add(raw);
  }
  return tokens;
}

interface CasusFingerprint {
  id: string;
  webinar: number;
  tokens: Set<string>;
}

function buildFingerprints(casussen: ExamCasus[]): CasusFingerprint[] {
  return casussen
    .slice()
    .sort((a, b) => a.webinar - b.webinar)
    .map((c) => ({ id: c.id, webinar: c.webinar, tokens: tokenize(c.prompt) }));
}

function intersectSize(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const v of a) if (b.has(v)) count += 1;
  return count;
}

export function useExamProgress(
  casussen: ExamCasus[],
  bubbles: TranscriptBubble[]
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fingerprints = useMemo(() => buildFingerprints(casussen), [casussen]);
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (fingerprints.length === 0) return;
    for (const bubble of bubbles) {
      if (bubble.speaker !== 'bot') continue;
      if (!bubble.finished) continue;
      if (seenIdsRef.current.has(bubble.id)) continue;
      seenIdsRef.current.add(bubble.id);
      const tokens = tokenize(bubble.text);
      let bestIdx = -1;
      let bestScore = MATCH_THRESHOLD;
      for (let i = 0; i < fingerprints.length; i += 1) {
        const score = intersectSize(tokens, fingerprints[i].tokens);
        if (score >= bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }
      if (bestIdx >= 0) {
        setCurrentIndex((prev) => Math.max(prev, bestIdx));
      }
    }
  }, [bubbles, fingerprints]);

  const total = fingerprints.length;
  const completedCount = currentIndex;
  const isOnLast = currentIndex === Math.max(0, total - 1);
  return { currentIndex, total, completedCount, isOnLast };
}
