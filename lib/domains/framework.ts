/**
 * Het AI-geletterdheidsraamwerk: 5 domeinen.
 * Elke casus tagt een of meer van deze domeinen via `casuses.domains`.
 * In een examen wordt elk domein door minstens twee casussen geraakt.
 */

export type FrameworkDomainId =
  | 'mindset'
  | 'ethiek'
  | 'kennis'
  | 'pedagogiek'
  | 'agency';

export interface FrameworkDomain {
  id: FrameworkDomainId;
  label: string;
  description: string;
}

export const FRAMEWORK_DOMAINS: FrameworkDomain[] = [
  {
    id: 'mindset',
    label: 'Mindset',
    description:
      'Bewuste keuzes vanuit eigen professionele waarden. AI als gereedschap, niet als vervanging.',
  },
  {
    id: 'ethiek',
    label: 'Ethiek',
    description:
      'Privacy, bias, transparantie en verantwoordelijkheid verweven door elke AI-beslissing.',
  },
  {
    id: 'kennis',
    label: 'Kennis',
    description:
      'Begrijpen hoe AI werkt, effectief prompten, tools vergelijken, output kritisch beoordelen.',
  },
  {
    id: 'pedagogiek',
    label: 'Pedagogiek',
    description:
      'Wanneer versterkt AI het leerproces. Leerlingen begeleiden bij kritisch en bewust AI-gebruik.',
  },
  {
    id: 'agency',
    label: 'Agency',
    description:
      'Handelingsvermogen als overkoepelende houding: regie houden over hoe AI je werk raakt.',
  },
];
