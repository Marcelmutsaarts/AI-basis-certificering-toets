'use client';

/**
 * Pulserende cirkel die kleurt naar wie spreekt:
 *  - bot: paars (purple-primary).
 *  - docent: lichtpaars (purple-light-bg, donkerder rand).
 *  - stilte: zacht paars met langzame pulse.
 *
 * Animatie via CSS keyframes, geen extra dependencies.
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
      className="relative flex items-center justify-center w-48 h-48"
    >
      <span className={outer} aria-hidden="true" />
      <span className={inner} aria-hidden="true" />
      <style>{ANIMATION_CSS}</style>
    </div>
  );
}

function innerClass(speaker: SpeakerState): string {
  const base =
    'relative w-32 h-32 rounded-full transition-colors duration-300';
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

const ANIMATION_CSS = `
@keyframes avd-pulse-fast {
  0%, 100% { transform: scale(1); opacity: 0.55; }
  50% { transform: scale(1.12); opacity: 0.85; }
}
@keyframes avd-pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.05); opacity: 0.6; }
}
.avd-pulse-fast { animation: avd-pulse-fast 1.4s ease-in-out infinite; }
.avd-pulse-slow { animation: avd-pulse-slow 3s ease-in-out infinite; }
`;
