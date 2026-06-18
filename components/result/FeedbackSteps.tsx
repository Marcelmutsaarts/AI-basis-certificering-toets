'use client';

/**
 * De drie feedback-stappen: de smiley-rating plus twee open vragen over
 * de toetsvorm. Houdt de presentatie van een enkele stap bij elkaar zodat
 * EvaluatingFeedback alleen de flow-logica hoeft te dragen.
 */
import { SmileyRating } from './SmileyRating';

export interface FeedbackState {
  rating: number | null;
  positief: string;
  negatief: string;
}

export const STAP_TITELS: ReadonlyArray<string> = [
  'Wat vond je van deze toetsvorm?',
  'Wat vond je goed aan deze toetsvorm?',
  'Wat vond je niet goed aan deze toetsvorm?',
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
        id="feedback-positief"
        value={state.positief}
        placeholder="Wat vond je goed aan deze toetsvorm?"
        onChange={(positief) => update({ positief })}
      />
    );
  }
  return (
    <FeedbackTextarea
      id="feedback-negatief"
      value={state.negatief}
      placeholder="Wat vond je niet goed aan deze toetsvorm?"
      onChange={(negatief) => update({ negatief })}
    />
  );
}
