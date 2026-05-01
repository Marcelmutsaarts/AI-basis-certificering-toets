'use client';

/**
 * Orkestreert het examen-scherm. Verbindings- en retry-logica zit in
 * useExamConnection. Dit bestand levert de UI-states:
 *  - Connecting / retrying paneel.
 *  - Error-paneel met onderscheid mic-denied / live-lost / generic.
 *  - Hoofd-card met visualizer + mic-knop zodra verbonden.
 *  - Live transcript onderaan.
 *  - Recovery: Sessie afbreken (status `abandoned`), terug naar /start.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { useTranscript } from '@/hooks/useTranscript';
import { useExamProgress, type ExamCasus } from '@/hooks/useExamProgress';
import { useExamConnection } from '@/hooks/useExamConnection';
import { type SpeakerState } from './AudioVisualizer';
import { LiveTranscript } from './LiveTranscript';
import { ProgressDots } from './ProgressDots';
import { ConnectingPanel } from './ConnectingPanel';
import { ExamErrorPanel, classifyExamError } from './ExamErrorPanel';
import { ExamMainCard } from './ExamMainCard';

export interface ExamScreenProps {
  examSessionId: string;
  casussen: ExamCasus[];
}

export function ExamScreen({ examSessionId, casussen }: ExamScreenProps) {
  const router = useRouter();
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState<SpeakerState>(null);
  const [ending, setEnding] = useState(false);

  const transcript = useTranscript({ examSessionId });
  const progress = useExamProgress(casussen, transcript.bubbles);

  const conn = useExamConnection({
    examSessionId,
    onTranscript: transcript.ingestEvent,
    onSpeaker: setSpeaker,
  });

  const finishExam = useCallback(
    async (status: 'completed' | 'abandoned') => {
      transcript.flushAll();
      conn.stop();
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
    [examSessionId, conn, transcript]
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

  async function handleAbort() {
    setEnding(true);
    await finishExam('abandoned');
    router.push('/start');
  }

  const errKind = classifyExamError(conn.errorMessage);
  const showError =
    Boolean(conn.errorMessage) && conn.status === 'error' && !conn.retrying;
  const showConnecting =
    !showError &&
    (conn.retrying || conn.status === 'idle' || conn.status === 'connecting');

  const totalDots = useMemo(() => casussen.length, [casussen.length]);

  const showMain =
    !showError && !showConnecting;

  return (
    <main className="flex-1 flex flex-col px-4 md:px-12 pt-3 pb-3 md:pt-4 md:pb-4 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-3 md:gap-4 flex-1 min-h-0">
        <ProgressDots total={totalDots} currentIndex={progress.currentIndex} />

        {showError ? (
          <ExamErrorPanel
            kind={errKind}
            message={conn.errorMessage}
            onRetry={conn.manualRetry}
            onAbort={handleAbort}
            retrying={conn.retrying}
          />
        ) : showConnecting ? (
          <ConnectingPanel
            message={
              conn.retrying
                ? 'Opnieuw verbinden met Lieke...'
                : 'Verbinden met Lieke...'
            }
          />
        ) : null}

        {showMain ? (
          <Card padding="md" className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-purple-dark">
                Live transcript
              </h2>
              <SpeakerDot speaker={speaker} />
            </div>
            <div className="flex-1 min-h-0">
              <LiveTranscript bubbles={transcript.bubbles} />
            </div>
          </Card>
        ) : null}

        {showMain ? (
          <ExamMainCard
            muted={muted}
            ending={ending}
            connected={conn.status === 'connected'}
            onToggleMute={() => {
              const next = !muted;
              setMuted(next);
              conn.setMuted(next);
            }}
            onStop={handleStop}
            onAbort={handleAbort}
          />
        ) : null}
      </div>
    </main>
  );
}

function SpeakerDot({ speaker }: { speaker: SpeakerState }) {
  const label =
    speaker === 'bot'
      ? 'Lieke spreekt'
      : speaker === 'docent'
        ? 'Jij spreekt'
        : 'Stilte';
  const color =
    speaker === 'bot'
      ? 'bg-purple-primary avd-pulse-fast'
      : speaker === 'docent'
        ? 'bg-purple-medium avd-pulse-fast'
        : 'bg-purple-primary/30';
  return (
    <span className="flex items-center gap-2 text-xs text-text-body/70">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} aria-hidden="true" />
      {label}
    </span>
  );
}
