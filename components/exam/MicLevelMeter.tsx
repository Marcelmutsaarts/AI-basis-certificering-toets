'use client';

/**
 * Live mic-niveaumeter naast de MicButton. Beweegt direct mee met de stem
 * van de docent (RMS uit de recorder), onafhankelijk van Google's transcript.
 * Zo ziet de docent dat de app het geluid binnenkrijgt.
 *
 * Vijf verticale balkjes in AVD-paars die oplichten op basis van micLevel.
 * Toegankelijk via role=meter met aria-valuenow.
 */

export interface MicLevelMeterProps {
  // Genormaliseerd niveau 0..1.
  level: number;
  muted: boolean;
}

const BAR_COUNT = 5;
// Boven deze drempel beschouwen we het als hoorbaar geluid.
const ACTIVE_THRESHOLD = 0.06;

export function MicLevelMeter({ level, muted }: MicLevelMeterProps) {
  const clamped = Math.max(0, Math.min(1, level));
  const active = !muted && clamped > ACTIVE_THRESHOLD;
  const label = muted
    ? 'Microfoon uit'
    : active
      ? 'We horen je'
      : 'Microfoon aan';
  const ariaLabel = `Microfoonniveau: ${label}`;

  return (
    <div className="flex items-center gap-2">
      <div
        role="meter"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={muted ? 0 : Math.round(clamped * 100)}
        className="flex items-end gap-0.5 h-6"
      >
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <MeterBar key={i} index={i} level={muted ? 0 : clamped} />
        ))}
      </div>
      <span
        className={`text-xs ${active ? 'text-purple-dark' : 'text-text-body/70'}`}
        aria-hidden="true"
      >
        {label}
      </span>
    </div>
  );
}

function MeterBar({ index, level }: { index: number; level: number }) {
  // Elk balkje heeft een eigen drempel; samen vormen ze een oploop.
  const threshold = (index + 1) / BAR_COUNT;
  const lit = level >= threshold - 1 / BAR_COUNT + 0.02;
  const height = 8 + index * 4; // oplopende hoogte, 8 tot 24 px
  return (
    <span
      style={{ height: `${height}px` }}
      className={`w-1.5 rounded-full transition-colors duration-75 ${
        lit ? 'bg-purple-primary' : 'bg-purple-light-bg'
      }`}
    />
  );
}
