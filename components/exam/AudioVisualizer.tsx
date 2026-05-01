'use client';

/**
 * Pulserende cirkel die kleurt naar wie spreekt:
 *  - bot: paars (purple-primary).
 *  - docent: lichtpaars (purple-light-bg, donkerder rand).
 *  - stilte: zacht paars met langzame pulse.
 *
 * Animatie via globale keyframes in globals.css (avd-pulse-fast / avd-pulse-slow).
 */

export type SpeakerState = 'bot' | 'docent' | null;

export interface AudioVisualizerProps {
  speaker: SpeakerState;
}

export function AudioVisualizer({ speaker }: AudioVisualizerProps) {
  const inner = innerClass(speaker);
  const outer = outerClass(speaker);
  const label =
    speaker === 'bot'
      ? 'Lieke spreekt'
      : speaker === 'docent'
        ? 'Jij spreekt'
        : 'Wachten';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="relative flex items-center justify-center w-32 h-32"
    >
      <span className={outer} aria-hidden="true" />
      <span className={inner} aria-hidden="true" />
    </div>
  );
}

function innerClass(speaker: SpeakerState): string {
  const base =
    'relative w-20 h-20 rounded-full transition-colors duration-300';
  if (speaker === 'bot') return `${base} bg-purple-primary`;
  if (speaker === 'docent') return `${base} bg-purple-light-bg border-2 border-purple-primary`;
  return `${base} bg-purple-primary/30`;
}

function outerClass(speaker: SpeakerState): string {
  const base =
    'absolute inset-0 rounded-full pointer-events-none transition-colors duration-300';
  if (speaker === 'bot') return `${base} bg-purple-primary/30 avd-pulse-fast`;
  if (speaker === 'docent') return `${base} bg-purple-primary/15 avd-pulse-fast`;
  return `${base} bg-purple-primary/10 avd-pulse-slow`;
}
