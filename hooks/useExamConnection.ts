'use client';

/**
 * Bundelt de boot/retry-logica voor de Live API verbinding op het
 * examen-scherm. Roept de token-endpoint aan, start de Live session,
 * houdt bootError bij en doet auto-retry (max 2x) bij verlies van
 * verbinding (niet bij microfoon-permissie weigering).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useLiveSession,
  type TranscriptEvent,
  type LiveStatus,
} from '@/hooks/useLiveSession';
import { classifyExamError } from '@/components/exam/ExamErrorPanel';

const MAX_AUTO_RETRIES = 2;

interface TokenResponse {
  token: string;
  model: string;
}

export interface UseExamConnectionOptions {
  examSessionId: string;
  onTranscript: (event: TranscriptEvent) => void;
  onSpeaker: (speaker: 'bot' | 'docent' | null) => void;
}

export interface UseExamConnectionResult {
  status: LiveStatus;
  errorMessage: string | null;
  retrying: boolean;
  setMuted: (muted: boolean) => void;
  stop: () => void;
  manualRetry: () => Promise<void>;
}

export function useExamConnection({
  examSessionId,
  onTranscript,
  onSpeaker,
}: UseExamConnectionOptions): UseExamConnectionResult {
  const [bootError, setBootError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const autoRetriesRef = useRef(0);
  const startedRef = useRef(false);

  const live = useLiveSession({ onTranscript, onSpeaker });

  const boot = useCallback(
    async ({ retry = false }: { retry?: boolean } = {}) => {
      try {
        // Bij retry kan er nog een oude session-ref aan hangen; sluit
        // hem expliciet zodat live.start niet vroegtijdig terugkeert.
        if (retry) {
          live.stop();
        }
        setBootError(null);
        const res = await fetch('/api/live-session/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ examSessionId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Token ophalen mislukt.');
        }
        const data = (await res.json()) as TokenResponse;
        await live.start({
          token: data.token,
          model: data.model,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Onbekende fout';
        setBootError(msg);
      }
    },
    [examSessionId, live]
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void boot();
  }, [boot]);

  useEffect(() => {
    if (live.status !== 'error') return;
    if (autoRetriesRef.current >= MAX_AUTO_RETRIES) return;
    const errKind = classifyExamError(live.errorMessage ?? bootError);
    if (errKind === 'mic-denied') return;
    autoRetriesRef.current += 1;
    const retryingTimer = window.setTimeout(() => setRetrying(true), 0);
    const timer = window.setTimeout(() => {
      void boot({ retry: true }).finally(() => setRetrying(false));
    }, 1500);
    return () => {
      window.clearTimeout(retryingTimer);
      window.clearTimeout(timer);
    };
  }, [live.status, live.errorMessage, bootError, boot]);

  const manualRetry = useCallback(async () => {
    autoRetriesRef.current = 0;
    setRetrying(true);
    await boot({ retry: true });
    setRetrying(false);
  }, [boot]);

  return {
    status: live.status,
    errorMessage: bootError ?? live.errorMessage,
    retrying,
    setMuted: live.setMuted,
    stop: live.stop,
    manualRetry,
  };
}
