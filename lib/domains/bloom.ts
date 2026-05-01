/**
 * Bloom: categorieen van cognitieve processen.
 *
 * Regels (bewust):
 *  - Geen `onthouden`. Te googelbaar, niet relevant voor het basiscertificaat.
 *  - Geen `creeren`. Hoort bij de Kartrekker (praktijkopdracht), niet hier.
 *  - Spreek nooit over `niveaus` of `hogere/lagere orde`.
 *    Alleen over `categorieen van cognitieve processen`.
 *
 * Examen-mix indicatief: 2 begrijpen, 3 toepassen, 3 analyseren, 2 evalueren.
 */

export type BloomCategoryId =
  | 'begrijpen'
  | 'toepassen'
  | 'analyseren'
  | 'evalueren';

export interface BloomCategory {
  id: BloomCategoryId;
  label: string;
  description: string;
}

export const BLOOM_CATEGORIES: BloomCategory[] = [
  {
    id: 'begrijpen',
    label: 'Begrijpen',
    description:
      'Concepten in eigen woorden kunnen weergeven en hun betekenis voor de praktijk uitleggen.',
  },
  {
    id: 'toepassen',
    label: 'Toepassen',
    description:
      'Kennis in concrete onderwijssituaties inzetten en vertalen naar handelen.',
  },
  {
    id: 'analyseren',
    label: 'Analyseren',
    description:
      'Onderdelen onderscheiden, relaties leggen en oorzaak-gevolg of vergelijking expliciet maken.',
  },
  {
    id: 'evalueren',
    label: 'Evalueren',
    description:
      'Een onderbouwde positie innemen op basis van criteria, ook bij gespannen of ethische vraagstukken.',
  },
];
