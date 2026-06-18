'use client';

/**
 * Primaire afrond-actie op het resultaatscherm. Verstuurt het resultaat per
 * mail naar het AVD-team. Toont status: bezig, verstuurd met datum, of een
 * nette foutmelding bij een niet-200 respons. De docent-feedback wordt
 * elders verzameld (nakijk-flow), dus deze knop POST direct.
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

type SendStatus = 'idle' | 'pending' | 'sent' | 'error';

export interface SendResultButtonProps {
  sessionId: string;
  initialSentAt: string | null;
}

function formatDatumNL(iso: string): string {
  return new Date(iso).toLocaleString('nl-NL', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export function SendResultButton({
  sessionId,
  initialSentAt,
}: SendResultButtonProps) {
  const [status, setStatus] = useState<SendStatus>('idle');
  const [sentAt, setSentAt] = useState<string | null>(initialSentAt);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSend() {
    setStatus('pending');
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/send-result/${sessionId}`, { method: 'POST' });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMsg(body?.error ?? 'Het versturen is mislukt. Probeer het opnieuw.');
        setStatus('error');
        return;
      }
      setSentAt(body?.sentAt ?? new Date().toISOString());
      setStatus('sent');
    } catch {
      setErrorMsg('Het versturen is mislukt. Controleer je verbinding en probeer het opnieuw.');
      setStatus('error');
    }
  }

  const alVerstuurd = sentAt !== null;
  const knopLabel = status === 'pending'
    ? 'Bezig met versturen'
    : alVerstuurd
      ? 'Opnieuw versturen'
      : 'Verstuur resultaat naar het AVD-team';

  return (
    <div className="flex flex-col gap-3">
      {alVerstuurd ? (
        <p className="text-sm text-purple-dark font-medium">
          Resultaat verstuurd op {formatDatumNL(sentAt)}.
        </p>
      ) : null}
      {status === 'error' && errorMsg ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {errorMsg}
        </p>
      ) : null}
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={handleSend}
        disabled={status === 'pending'}
        className="min-h-[44px] self-start"
      >
        {knopLabel}
      </Button>
    </div>
  );
}
