'use client';

/**
 * Nakijk-plus-feedback flow op het resultaatscherm. Bij mount wordt de
 * evaluator op de achtergrond getriggerd (POST /api/evaluate). Ondertussen
 * doorloopt de docent een optionele feedback-flow over de toetsvorm. Pas
 * als de docent zelf op de eindknop klikt wordt de uitslag onthuld
 * (router.refresh), zonder bias door Lieke's output. Een mislukte
 * feedback-save blokkeert de onthulling niet.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  useNakijkCopy,
  EvaluatingErrorView,
} from './EvaluatingCopy';
import {
  FeedbackStepContent,
  STAP_TITELS,
  type FeedbackState,
} from './FeedbackSteps';

type EvalStatus = 'pending' | 'done' | 'error';

const LEEG: FeedbackState = { rating: null, start: '', stop: '', continue: '' };

export function EvaluatingFeedback({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [evalStatus, setEvalStatus] = useState<EvalStatus>('pending');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FeedbackState>(LEEG);
  const [revealing, setRevealing] = useState(false);
  const triggeredRef = useRef(false);
  const wantRevealRef = useRef(false);

  const runEval = useCallback(async () => {
    setEvalStatus('pending');
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
      setEvalStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Onbekende fout.';
      console.error('[EvaluatingFeedback] eval mislukt', msg);
      setErrorMsg(msg);
      setEvalStatus('error');
    }
  }, [sessionId]);

  useEffect(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    void runEval();
  }, [runEval]);

  // Als de docent al wilde onthullen terwijl de eval nog liep: doe het nu.
  useEffect(() => {
    if (wantRevealRef.current && evalStatus === 'done') {
      router.refresh();
    }
  }, [evalStatus, router]);

  async function saveFeedback() {
    try {
      await fetch(`/api/feedback/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: state.rating,
          start: state.start,
          stop: state.stop,
          continue: state.continue,
        }),
      });
    } catch (err) {
      console.error('[EvaluatingFeedback] feedback save mislukt', err);
    }
  }

  async function onReveal() {
    setRevealing(true);
    await saveFeedback();
    wantRevealRef.current = true;
    if (evalStatus === 'done') router.refresh();
  }

  const update = (patch: Partial<FeedbackState>) =>
    setState((prev) => ({ ...prev, ...patch }));
  const laatsteStap = step === STAP_TITELS.length - 1;

  if (evalStatus === 'error' && !revealing) {
    return (
      <Card padding="lg">
        <EvaluatingErrorView errorMsg={errorMsg} onRetry={runEval} />
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <NakijkBanner actief={evalStatus === 'pending'} />
      <p className="text-sm text-text-body mb-5">
        Terwijl Lieke je antwoorden nakijkt, horen we graag wat je van deze
        toetsvorm vond.
      </p>
      <div className="flex flex-col gap-4">
        <div className="text-xs font-medium text-purple-medium">
          Stap {step + 1} van {STAP_TITELS.length}
        </div>
        <h3 className="text-base md:text-lg font-semibold text-purple-dark">
          {STAP_TITELS[step]}
        </h3>
        <FeedbackStepContent step={step} state={state} update={update} />
        {laatsteStap ? (
          <RevealButton
            revealing={revealing}
            evalError={evalStatus === 'error'}
            onClick={onReveal}
            onRetry={runEval}
          />
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setStep((s) => s + 1)}
            className="min-h-[44px] self-end"
          >
            Volgende
          </Button>
        )}
      </div>
    </Card>
  );
}

function NakijkBanner({ actief }: { actief: boolean }) {
  const copy = useNakijkCopy(actief);
  return (
    <div className="mb-4 rounded-xl bg-purple-light-bg/60 px-4 py-3">
      <p className="text-sm font-medium text-purple-dark">
        {actief ? copy : 'Lieke is klaar met nakijken.'}
      </p>
    </div>
  );
}

function RevealButton({
  revealing,
  evalError,
  onClick,
  onRetry,
}: {
  revealing: boolean;
  evalError: boolean;
  onClick: () => void;
  onRetry: () => void;
}) {
  if (revealing && evalError) {
    return (
      <EvaluatingErrorView
        errorMsg="De beoordeling is niet gelukt."
        onRetry={onRetry}
      />
    );
  }
  return (
    <div className="flex flex-col items-stretch gap-2 pt-2">
      <Button
        variant="primary"
        size="lg"
        onClick={onClick}
        disabled={revealing}
        className="min-h-[44px] w-full text-base font-bold uppercase tracking-wide"
      >
        {revealing ? 'Lieke is bijna klaar...' : 'Laat me de resultaten zien!'}
      </Button>
    </div>
  );
}
