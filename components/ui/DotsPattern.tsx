/**
 * Decoratief paars stippenpatroon. SVG met repetitieve dots, absolute
 * gepositioneerd zodat het achter de content valt. Wordt gebruikt op het
 * start- en resultaatscherm rechts(boven) in beeld.
 *
 * `aria-hidden` want puur decoratief. Geen pointer-events.
 */
import type { CSSProperties } from 'react';

type Position = 'top-right' | 'right';

export interface DotsPatternProps {
  position?: Position;
  className?: string;
}

const POSITION_CLASSES: Record<Position, string> = {
  'top-right': 'top-0 right-0',
  right: 'top-1/4 right-0',
};

export function DotsPattern({
  position = 'top-right',
  className = '',
}: DotsPatternProps) {
  const wrapperStyle: CSSProperties = {
    width: 'min(420px, 55vw)',
    height: 'min(420px, 55vw)',
  };

  return (
    <div
      aria-hidden="true"
      style={wrapperStyle}
      className={[
        'pointer-events-none absolute z-0 select-none',
        'opacity-60 hidden sm:block',
        POSITION_CLASSES[position],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMaxYMin meet"
      >
        <defs>
          <pattern
            id="avd-dots"
            x="0"
            y="0"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.6" fill="#a15df5" fillOpacity="0.18" />
          </pattern>
          <radialGradient id="avd-dots-fade" cx="100%" cy="0%" r="100%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.7" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="avd-dots-mask">
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill="url(#avd-dots-fade)"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="200"
          height="200"
          fill="url(#avd-dots)"
          mask="url(#avd-dots-mask)"
        />
      </svg>
    </div>
  );
}
