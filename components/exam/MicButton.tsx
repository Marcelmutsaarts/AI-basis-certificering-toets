'use client';

/**
 * Ronde paarse mic-knop. Default unmuted bij sessie-start.
 * Bij muted: outline-styling, mic-icoon doorgestreept.
 */

export interface MicButtonProps {
  muted: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function MicButton({ muted, onToggle, disabled }: MicButtonProps) {
  const label = muted ? 'Microfoon aanzetten' : 'Microfoon uitzetten';
  const base =
    'inline-flex items-center justify-center w-16 h-16 rounded-full ' +
    'transition-colors duration-150 focus:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-purple-primary focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';
  const variant = muted
    ? 'bg-white border-2 border-purple-primary text-purple-primary'
    : 'bg-purple-primary text-white hover:bg-purple-dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      disabled={disabled}
      className={`${base} ${variant}`}
    >
      <MicIcon muted={muted} />
    </button>
  );
}

function MicIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
      {muted ? <line x1="3" y1="3" x2="21" y2="21" /> : null}
    </svg>
  );
}
