'use client';

/**
 * Orkestreert het examen-scherm. Haalt de ephemeral token op, opent de
 * Live API verbinding, voedt transcript-events naar de transcript-state
 * en de progress-tracker, en sluit de sessie netjes af.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLiveSession, type TranscriptEvent } from '@/hooks/useLiveSession';
import { useTranscript } from '@/hooks/useTranscript';
import { useExamProgress, type ExamCasus } from '@/hooks/useExamProgress';
import { AudioVisualizer, type SpeakerState } from './AudioVisualizer';
import { LiveTranscript } from './LiveTranscript';
import { ProgressDots } from './ProgressDots';
import { MicButton } from './MicButton';

export interface ExamScreenProps {
  examSessionId: string;
  casussen: ExamCasus[];
}

interface TokenResponse {
  token: string;
  model: string;
  config: import('@/lib/live-api/session-config').LiveConfig;
}

export function ExamScreen({ examSessionId, casussen }: ExamScreenProps) {
  const router = useRouter();
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState<SpeakerState>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const startedRef = useRef(false);

  const transcript = useTranscript({ examSessionId });
  const progress = useExamProgress(casussen, transcript.bubbles);

  const handleTranscript = useCallback(
    (event: TranscriptEvent) => {
      transcript.ingestEvent(event);
    },
    [transcript]
  );

  const live = useLiveSession({
    onTranscript: handleTranscript,
    onSpeaker: setSpeaker,
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void boot();

    async function boot() {
      try {
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
          config: data.config,
          model: data.model,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Onbekende fout';
        setBootError(msg);
      }
    }
  }, [examSessionId, live]);

  const finishExam = useCallback(
    async (status: 'completed' | 'abandoned') => {
      transcript.flushAll();
      live.stop();
      try {
        await fetch('/api/exam-session/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ examSessionId, status }),
        });
      } catch (err) {
        console.error('Sessie afsluiten mislukt', err);
      }
    },
    [examSessionId, live, transcript]
  );

  useEffect(() => {
    function handler() {
      const blob = new Blob(
        [JSON.stringify({ examSessionId, status: 'abandoned' })],
        { type: 'application/json' }
      );
      navigator.sendBeacon('/api/exam-session/end', blob);
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [examSessionId]);

  async function handleStop() {
    setEnding(true);
    await finishExam('completed');
    router.push(`/resultaat/${examSessionId}`);
  }

  const errorMessage = bootError ?? live.errorMessage;
  const totalDots = useMemo(() => casussen.length, [casussen.length]);

  return (
    <main className="flex-1 px-4 py-6">
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-6">
        <ProgressDots total={totalDots} currentIndex={progress.currentIndex} />

        <Card padding="md">
          <div className="flex flex-col items-center gap-5">
            <AudioVisualizer speaker={speaker} />
            <div className="flex items-center gap-4">
              <MicButton
                muted={muted}
                onToggle={() => {
                  const next = !muted;
                  setMuted(next);
                  live.setMuted(next);
                }}
                disabled={live.status !== 'connected'}
              />
              <Button
                variant="secondary"
                size="md"
                onClick={handleStop}
                disabled={ending}
              >
                {ending ? 'Bezig met afronden' : 'Examen afronden'}
              </Button>
            </div>
            <StatusLine status={live.status} bootError={bootError} />
          </div>
        </Card>

        <Card padding="md">
          <h2 className="text-sm font-semibold text-purple-dark mb-2">
            Live transcript
          </h2>
          <LiveTranscript bubbles={transcript.bubbles} />
        </Card>

        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function StatusLine({
  status,
  bootError,
}: {
  status: ReturnType<typeof useLiveSession>['status'];
  bootError: string | null;
}) {
  if (bootError) return null;
  const text = statusText(status);
  if (!text) return null;
  return <p className="text-xs text-text-body/70">{text}</p>;
}

function statusText(status: ReturnType<typeof useLiveSession>['status']): string {
  if (status === 'idle' || status === 'connecting') return 'Verbinding maken met Lieke';
  if (status === 'connected') return 'Verbonden met Lieke';
  if (status === 'ended') return 'Sessie afgerond';
  if (status === 'error') return 'Verbinding mislukt';
  return '';
}
