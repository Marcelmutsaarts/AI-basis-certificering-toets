/**
 * Zod-schema voor de output van de evaluator.
 *
 * Bron: coder.md sectie "Evaluator-prompt". Vijf framework-domeinen, elk
 * met score, onderbouwing en citaten. Aangevuld met passed-flag,
 * samenvatting en ontwikkeladvies.
 */
import { z } from 'zod';

export const ScoreSchema = z.enum(['GROEN', 'ORANJE', 'ROOD']);

export const DomainResultSchema = z.object({
  score: ScoreSchema,
  onderbouwing: z.string().min(1),
  citaten: z.array(z.string()),
});

export const DomeinenSchema = z.object({
  mindset: DomainResultSchema,
  ethiek: DomainResultSchema,
  kennis: DomainResultSchema,
  pedagogiek: DomainResultSchema,
  agency: DomainResultSchema,
});

export const EvaluatorOutputSchema = z.object({
  domeinen: DomeinenSchema,
  passed: z.boolean(),
  samenvatting: z.string().min(1),
  ontwikkeladvies: z.string().min(1),
});

export type Score = z.infer<typeof ScoreSchema>;
export type DomainResult = z.infer<typeof DomainResultSchema>;
export type Domeinen = z.infer<typeof DomeinenSchema>;
export type EvaluatorOutput = z.infer<typeof EvaluatorOutputSchema>;
