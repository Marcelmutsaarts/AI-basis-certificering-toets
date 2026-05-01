/**
 * Stack van vijf domein-badges in vaste volgorde:
 * mindset, ethiek, kennis, pedagogiek, agency.
 *
 * Vertical op alle breedtes (de onderbouwingen zijn vaak meer dan een
 * paar regels, een grid wordt dan rommelig).
 */
import { FRAMEWORK_DOMAINS } from '@/lib/domains/framework';
import type { Domeinen } from '@/lib/evaluator/schema';
import { DomainBadge } from './DomainBadge';

export interface DomainListProps {
  domeinen: Domeinen;
}

export function DomainList({ domeinen }: DomainListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {FRAMEWORK_DOMAINS.map((d) => (
        <li key={d.id}>
          <DomainBadge label={d.label} result={domeinen[d.id]} />
        </li>
      ))}
    </ul>
  );
}
