'use client';

/**
 * Client component op het resultaatscherm dat bij eerste mount POST naar
 * /api/evaluate/[sessionId] doet en daarna router.refresh() draait om de
 * server component opnieuw te laten renderen met de nieuwe evaluatie.
 *
 * Toont een vriendelijke wachttekst en bij falen een retry-knop. De
 * server-route is idempotent dus retry is veilig.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface EvaluatorTriggerProps {
  sessionId: string;
}

type Status = 'idle' | 'pending' | 'error';

export function EvaluatorTrigger({ sessionId }: EvaluatorTriggerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const triggeredRef = useRef(false);

  const trigger = useCallback(async () => {
    setStatus('pending');
    setErrorMsg(null);
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

  return (
    <Card padding="lg">
      <div className="flex flex-col items-center gap-4 text-center">
        {status === 'error' ? (
          <ErrorView errorMsg={errorMsg} onRetry={trigger} />
        ) : (
          <PendingView />
        )}
      </div>
    </Card>
  );
}

function PendingView() {
  return (
    <>
      <Spinner />
      <h2 className="text-lg font-semibold text-purple-dark">
        Bezig met beoordelen
      </h2>
      <p className="text-sm text-text-body max-w-md">
        Lieke neemt je antwoorden door en stelt je rubric samen. Dit duurt
        ongeveer 30 seconden. Sluit dit scherm niet.
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
      <h2 className="text-lg font-semibold text-red-700">
        Beoordelen niet gelukt
      </h2>
      <p className="text-sm text-text-body max-w-md">
        {errorMsg ?? 'Er ging iets mis bij het beoordelen.'}
      </p>
      <Button variant="primary" size="md" onClick={onRetry}>
        Opnieuw proberen
      </Button>
    </>
  );
}

function Spinner() {
  return (
    <span
      role="status"
      aria-label="Bezig"
      className="inline-block w-10 h-10 rounded-full border-4 border-purple-light-bg border-t-purple-primary animate-spin"
    />
  );
}
