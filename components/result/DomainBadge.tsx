/**
 * Badge per framework-domein op het resultaatscherm.
 *
 * Toont domeinnaam, score-tint (groen/oranje/rood), onderbouwing en
 * een citaat uit het transcript. Bij ROOD prominenter randje en label.
 *
 * Kleuren via Tailwind utility-classes (bg/text/border-*-100/800), niet
 * via theme-tokens, omdat de theme paars is.
 */
import type { DomainResult, Score } from '@/lib/evaluator/schema';

export interface DomainBadgeProps {
  label: string;
  result: DomainResult;
}

interface ScoreStyle {
  badge: string;
  card: string;
  label: string;
}

const STYLES: Record<Score, ScoreStyle> = {
  GROEN: {
    badge: 'bg-green-100 text-green-800 border-green-200',
    card: 'bg-white border-green-200',
    label: 'Ruim aangetoond',
  },
  ORANJE: {
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    card: 'bg-white border-orange-200',
    label: 'Basis aangetoond',
  },
  ROOD: {
    badge: 'bg-red-100 text-red-800 border-red-300',
    card: 'bg-red-50 border-red-300 ring-1 ring-red-200',
    label: 'Onvoldoende',
  },
};

function Citaat({ text }: { text: string }) {
  return (
    <blockquote className="mt-3 border-l-2 border-purple-primary/40 pl-3 italic text-sm text-text-body/90">
      &ldquo;{text}&rdquo;
    </blockquote>
  );
}

export function DomainBadge({ label, result }: DomainBadgeProps) {
  const style = STYLES[result.score];
  const firstCitaat = result.citaten.find((c) => c.trim().length > 0);
  return (
    <article className={`rounded-xl border p-5 ${style.card}`}>
      <header className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-purple-dark">{label}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-full border ${style.badge}`}
        >
          <span className="sr-only">Score </span>
          {result.score}
          <span className="mx-1.5 opacity-50" aria-hidden="true">
            {'\u00b7'}
          </span>
          <span className="font-medium normal-case tracking-normal">
            {style.label}
          </span>
        </span>
      </header>
      <p className="text-sm leading-relaxed text-text-body whitespace-pre-wrap">
        {result.onderbouwing}
      </p>
      {firstCitaat ? <Citaat text={firstCitaat} /> : null}
    </article>
  );
}
