'use client';

/**
 * De vier optionele feedback-stappen, plus de losse textarea-stap. Houdt
 * de presentatie van een enkele stap bij elkaar zodat EvaluatingFeedback
 * alleen de flow-logica hoeft te dragen.
 */
import { SmileyRating } from './SmileyRating';

export interface FeedbackState {
  rating: number | null;
  start: string;
  stop: string;
  continue: string;
}

export const STAP_TITELS: ReadonlyArray<string> = [
  'Wat vond je van deze toetsvorm?',
  'Waar moeten we mee starten?',
  'Waar moeten we mee stoppen?',
  'Waar moeten we mee doorgaan?',
];

function FeedbackTextarea({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={4}
      placeholder={placeholder}
      className="w-full rounded-xl border border-purple-primary/20 px-4 py-3 text-base text-text-body focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/30"
    />
  );
}

export function FeedbackStepContent({
  step,
  state,
  update,
}: {
  step: number;
  state: FeedbackState;
  update: (patch: Partial<FeedbackState>) => void;
}) {
  if (step === 0) {
    return (
      <SmileyRating
        value={state.rating}
        onChange={(rating) => update({ rating })}
      />
    );
  }
  if (step === 1) {
    return (
      <FeedbackTextarea
        id="feedback-start"
        value={state.start}
        placeholder="Waar moeten we mee starten?"
        onChange={(start) => update({ start })}
      />
    );
  }
  if (step === 2) {
    return (
      <FeedbackTextarea
        id="feedback-stop"
        value={state.stop}
        placeholder="Waar moeten we mee stoppen?"
        onChange={(stop) => update({ stop })}
      />
    );
  }
  return (
    <FeedbackTextarea
      id="feedback-continue"
      value={state.continue}
      placeholder="Waar moeten we mee doorgaan?"
      onChange={(value) => update({ continue: value })}
    />
  );
}
