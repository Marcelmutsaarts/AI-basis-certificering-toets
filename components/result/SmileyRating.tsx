'use client';

/**
 * Vijf smiley-knoppen voor de tevredenheidsvraag over de toetsvorm.
 * Waarde 1 (zeer ontevreden) tot 5 (zeer tevreden). De geselecteerde
 * smiley wordt duidelijk gemarkeerd met een paarse rand en lichte
 * achtergrond. Optioneel: niets geselecteerd betekent geen rating.
 */
export interface SmileyRatingProps {
  value: number | null;
  onChange: (value: number) => void;
}

const SMILEYS: ReadonlyArray<{ score: number; glyph: string; label: string }> = [
  { score: 1, glyph: '😞', label: 'Zeer ontevreden' },
  { score: 2, glyph: '🙁', label: 'Ontevreden' },
  { score: 3, glyph: '😐', label: 'Neutraal' },
  { score: 4, glyph: '🙂', label: 'Tevreden' },
  { score: 5, glyph: '😄', label: 'Zeer tevreden' },
];

export function SmileyRating({ value, onChange }: SmileyRatingProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Tevredenheid over de toetsvorm"
      className="flex justify-between gap-2"
    >
      {SMILEYS.map(({ score, glyph, label }) => {
        const selected = value === score;
        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${label}, ${score} van 5`}
            onClick={() => onChange(score)}
            className={[
              'flex flex-1 items-center justify-center rounded-xl border-2',
              'min-h-[56px] text-3xl transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-primary',
              selected
                ? 'border-purple-primary bg-purple-light-bg scale-105'
                : 'border-purple-primary/20 bg-white hover:bg-purple-light-bg/50',
            ].join(' ')}
          >
            <span aria-hidden="true">{glyph}</span>
          </button>
        );
      })}
    </div>
  );
}
