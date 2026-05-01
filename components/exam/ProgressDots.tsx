/**
 * Vijf dots boven de visualizer. Een dot is `done` als zijn index lager is
 * dan de huidige index. De huidige dot is `current`. De rest is `pending`.
 */

export interface ProgressDotsProps {
  total: number;
  currentIndex: number;
}

export function ProgressDots({ total, currentIndex }: ProgressDotsProps) {
  const items = Array.from({ length: total });
  return (
    <ol
      role="list"
      aria-label="Voortgang casussen"
      className="flex items-center justify-center gap-3"
    >
      {items.map((_, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'pending';
        return (
          <li
            key={i}
            aria-current={state === 'current' ? 'step' : undefined}
            className={dotClass(state)}
          />
        );
      })}
    </ol>
  );
}

function dotClass(state: 'done' | 'current' | 'pending'): string {
  const base = 'block w-3 h-3 rounded-full transition-colors duration-200';
  if (state === 'done') return `${base} bg-purple-primary`;
  if (state === 'current') return `${base} bg-purple-primary ring-2 ring-purple-primary/30 ring-offset-2 ring-offset-white`;
  return `${base} bg-purple-primary/25`;
}
