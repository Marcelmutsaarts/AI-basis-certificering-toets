'use client';

/**
 * Client component op het resultaatscherm dat bij eerste mount POST naar
 * /api/evaluate/[sessionId] doet en daarna router.refresh() draait om de
 * server component opnieuw te laten renderen met de nieuwe evaluatie.
 *
 * Toont een vriendelijke wachttekst die om de 10 seconden roteert,
 * plus spinner. Bij falen: knop "Klik om opnieuw te proberen" en
 * recovery-pad terug naar /start.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export interface EvaluatorTriggerProps {
  sessionId: string;
}

type Status = 'idle' | 'pending' | 'error';

const COPY_ROTATION = [
  'We beoordelen je antwoorden, dit duurt ongeveer 30 seconden.',
  'Even geduld, we wegen je domeinen.',
  'Bijna klaar, we schrijven je samenvatting.',
];

export function EvaluatorTrigger({ sessionId }: EvaluatorTriggerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copyIndex, setCopyIndex] = useState(0);
  const triggeredRef = useRef(false);

  const trigger = useCallback(async () => {
    setStatus('pending');
    setErrorMsg(null);
    setCopyIndex(0);
    try {
      const res = await fetch(`/api/evaluate/${sessionId}`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data && typeof data.error === 'string' && data.error) ||
            `Beoordelen mislukt (status ${res.status}).`
        );
      }
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Onbekende fout.';
      console.error('[EvaluatorTrigger] mislukt', msg);
      setErrorMsg(msg);
      setStatus('error');
    }
  }, [router, sessionId]);

  useEffect(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    void trigger();
  }, [trigger]);

  useEffect(() => {
    if (status !== 'pending') return;
    const id = window.setInterval(() => {
      setCopyIndex((prev) => Math.min(prev + 1, COPY_ROTATION.length - 1));
    }, 10_000);
    return () => window.clearInterval(id);
  }, [status]);

  return (
    <Card padding="lg">
      <div className="flex flex-col items-center gap-4 text-center">
        {status === 'error' ? (
          <ErrorView errorMsg={errorMsg} onRetry={trigger} />
        ) : (
          <PendingView copy={COPY_ROTATION[copyIndex]} />
        )}
      </div>
    </Card>
  );
}

function PendingView({ copy }: { copy: string }) {
  return (
    <>
      <Spinner size="md" label="Bezig met beoordelen" />
      <h2 className="text-base md:text-lg font-semibold text-purple-dark">
        Bezig met beoordelen
      </h2>
      <p className="text-sm text-text-body max-w-md transition-opacity duration-300">
        {copy}
      </p>
      <p className="text-xs text-text-body/70 max-w-md">
        Sluit dit scherm niet.
      </p>
    </>
  );
}

function ErrorView({
  errorMsg,
  onRetry,
}: {
  errorMsg: string | null;
  onRetry: () => void;
}) {
  return (
    <>
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
    </>
  );
}
