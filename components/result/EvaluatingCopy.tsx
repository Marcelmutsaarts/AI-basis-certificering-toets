'use client';

/**
 * Overdreven nakijk-zinnen die roteren terwijl Lieke de antwoorden
 * beoordeelt, plus de hook die ze om de paar seconden laat wisselen, en
 * de foutweergave als de beoordeling mislukt. Apart gehouden zodat
 * EvaluatingFeedback onder de 200 regels blijft.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const NAKIJK_COPY: ReadonlyArray<string> = [
  'Even het raamwerk dubbelchecken.',
  'Goed kijken of er niet gesjoemeld is.',
  'Mijn 320 ogen principe activeren.',
  'Wat extra bomen planten, voor het milieu.',
  'De puntjes op de i aan het tellen.',
  'Nog een laatste blik door de leesbril.',
];

// Roteert door de nakijk-zinnen zolang actief is.
export function useNakijkCopy(actief: boolean): string {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!actief) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % NAKIJK_COPY.length);
    }, 4_000);
    return () => window.clearInterval(id);
  }, [actief]);
  return NAKIJK_COPY[index];
}

export function EvaluatingErrorView({
  errorMsg,
  onRetry,
}: {
  errorMsg: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-base md:text-lg font-semibold text-red-700">
        Beoordelen niet gelukt
      </h2>
      <p className="text-sm text-text-body max-w-md">
        {errorMsg ?? 'Er ging iets mis bij het beoordelen.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="primary"
          size="md"
          onClick={onRetry}
          className="min-h-[44px]"
        >
          Klik om opnieuw te proberen
        </Button>
        <Link
          href="/start"
          className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 text-base text-purple-dark hover:bg-purple-light-bg transition-colors min-h-[44px]"
        >
          Terug naar startscherm
        </Link>
      </div>
    </div>
  );
}
