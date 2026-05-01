/**
 * Pass-criterium voor het AVD basiscertificaat.
 *
 * Geslaagd als alle vijf framework-domeinen op zijn minst ORANJE scoren.
 * Een ROOD op een willekeurig domein betekent niet geslaagd.
 *
 * Zie coder.md sectie "Pass-criterium (mild)".
 */
import type { FrameworkDomainId } from '@/lib/domains/framework';

export type ScoreValue = 'GROEN' | 'ORANJE' | 'ROOD';

export type DomainScores = Record<FrameworkDomainId, ScoreValue>;

const PASSING_SCORES: ScoreValue[] = ['GROEN', 'ORANJE'];

const REQUIRED_DOMAINS: FrameworkDomainId[] = [
  'mindset',
  'ethiek',
  'kennis',
  'pedagogiek',
  'agency',
];

export function isPassed(scores: DomainScores): boolean {
  return REQUIRED_DOMAINS.every((domain) =>
    PASSING_SCORES.includes(scores[domain])
  );
}
