/**
 * Bouwt de system- en user-prompt voor de beoordelaar-LLM (evaluator).
 *
 * De vaste system-prompt-tekst staat in ./system-prompt-text (te lang voor de
 * regellimiet hier). De user prompt bevat docentgegevens, gestelde casussen
 * met domein-tags, per vraag een beoordelingsaanwijzing, per onderwerp ground
 * truth en rode vlaggen, en het volledige transcript als "Bot:" / "Docent:".
 *
 * Het output-contract (JSON-schema, zie lib/evaluator/schema.ts) wijzigt niet.
 */
import { getCasusCard, getWebinarGround } from '@/lib/knowledge';
import { SYSTEM_PROMPT } from './system-prompt-text';

export interface EvaluatorTranscriptLine {
  speaker: 'bot' | 'docent';
  text: string;
}

export interface EvaluatorCasus {
  webinar: number;
  code: string;
  prompt: string;
  domains: string[];
  bloomCategory: string;
}

export interface EvaluatorDocent {
  fullName: string;
  niveau: string;
  vakgebied: string | null;
  school: string;
}

export interface BuildPromptArgs {
  transcript: EvaluatorTranscriptLine[];
  docent: EvaluatorDocent;
  casuses: EvaluatorCasus[];
}

export interface BuiltPrompt {
  system: string;
  user: string;
}

function formatDocent(docent: EvaluatorDocent): string {
  const parts = [
    `Naam: ${docent.fullName}`,
    `Onderwijsniveau: ${docent.niveau}`,
    `School: ${docent.school}`,
  ];
  if (docent.vakgebied && docent.vakgebied.trim().length > 0) {
    parts.push(`Vakgebied: ${docent.vakgebied}`);
  }
  return parts.join('\n');
}

function sortByWebinar(casuses: EvaluatorCasus[]): EvaluatorCasus[] {
  return casuses.slice().sort((a, b) => a.webinar - b.webinar);
}

function formatCasuses(casuses: EvaluatorCasus[]): string {
  if (casuses.length === 0) return '(geen casussen geregistreerd)';
  return sortByWebinar(casuses)
    .map((c) => {
      const domains = c.domains.length > 0 ? c.domains.join(', ') : 'geen';
      return `Webinar ${c.webinar} (${c.code}) [domeinen: ${domains}; cognitief proces: ${c.bloomCategory}]\n  Vraag: ${c.prompt}`;
    })
    .join('\n\n');
}

function formatBeoordelingsaanwijzingen(casuses: EvaluatorCasus[]): string {
  const regels = sortByWebinar(casuses)
    .map((c) => getCasusCard(c.code))
    .filter((card): card is NonNullable<typeof card> => card !== undefined)
    .map(
      (card) =>
        `Vraag ${card.code}. Let op: ${card.waarOpLetten} Een sterk antwoord bevat ongeveer: ${card.goedAntwoord} Veelvoorkomend misverstand: ${card.misvatting}`
    );
  if (regels.length === 0) return '';
  const kop =
    'Beoordelingsaanwijzingen per gestelde vraag (ijkpunt, geen checklist om af te vinken):';
  return `${kop}\n${regels.join('\n')}`;
}

function uniekeWebinars(casuses: EvaluatorCasus[]): number[] {
  return Array.from(new Set(casuses.map((c) => c.webinar))).sort(
    (a, b) => a - b
  );
}

function formatGroundTruth(casuses: EvaluatorCasus[]): string {
  const blokken = uniekeWebinars(casuses)
    .map((w) => getWebinarGround(w))
    .filter((g): g is NonNullable<typeof g> => g !== undefined)
    .map(
      (g) =>
        `${g.titel}.\n  Kernpunten: ${g.kernpunten.join(' ')}\n  Rode vlaggen: ${g.rodeVlaggen.join(' ')}`
    );
  if (blokken.length === 0) return '';
  const kop =
    'Ground truth per onderwerp (waar een correct antwoord op aansluit) en rode vlaggen voor oppervlakkige antwoorden:';
  return `${kop}\n${blokken.join('\n\n')}`;
}

function formatTranscript(lines: EvaluatorTranscriptLine[]): string {
  if (lines.length === 0) return '(leeg transcript)';
  return lines
    .map((l) => `${l.speaker === 'bot' ? 'Bot' : 'Docent'}: ${l.text}`)
    .join('\n');
}

export function buildEvaluatorPrompt({
  transcript,
  docent,
  casuses,
}: BuildPromptArgs): BuiltPrompt {
  const aanwijzingen = formatBeoordelingsaanwijzingen(casuses);
  const ground = formatGroundTruth(casuses);
  const secties = [
    `Docentgegevens:\n${formatDocent(docent)}`,
    `Gestelde casussen (in volgorde):\n${formatCasuses(casuses)}`,
    aanwijzingen,
    ground,
    `Transcript van het examen:\n${formatTranscript(transcript)}`,
    'Beoordeel nu volgens het rubric en lever uitsluitend de gevraagde JSON.',
  ].filter((s) => s.length > 0);
  return { system: SYSTEM_PROMPT, user: secties.join('\n\n') };
}
