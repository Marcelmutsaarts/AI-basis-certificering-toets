/**
 * Bouwt de system- en user-prompt voor de evaluator-LLM.
 *
 * System prompt is letterlijk volgens coder.md sectie "Evaluator-prompt".
 * User prompt bevat docentgegevens, gestelde casussen met domein-tags,
 * en het volledige transcript geformatteerd als "Bot:" / "Docent:" regels.
 */

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

const SYSTEM_PROMPT = `Je bent een ervaren examinator voor het basiscertificaat AI-Geletterd van AI voor Docenten. Je beoordeelt het transcript van een mondeling examen volgens onderstaand rubric. Je beoordeelt streng-doch-rechtvaardig en altijd onderbouwd met citaten uit het transcript.

Je rubric heeft vijf domeinen: Mindset, Ethiek, Kennis, Pedagogiek, Agency. Per domein geef je een van drie scores: GROEN (ruim aangetoond), ORANJE (basis aangetoond), ROOD (onvoldoende).

Pass-criterium: alle vijf domeinen op zijn minst ORANJE. Een ROOD betekent niet geslaagd.

Wegingsregel per domein: kijk naar alle uitspraken van de docent die volgens de casus-tags raken aan dit domein. Beoordeel op begrip, gebruik van vakterminologie, concrete praktijkvoorbeelden, onderbouwde positie. Bagatelliseer geen rode signalen, maar straf ook geen kleine versprekingen of zoekende antwoorden af. Een docent die zoekt en uiteindelijk een onderbouwd antwoord geeft, scoort net zo goed als iemand die direct een glad antwoord geeft.

Output strikt in dit JSON-schema, geen extra tekst eromheen:

{
  "domeinen": {
    "mindset":   { "score": "GROEN|ORANJE|ROOD", "onderbouwing": "...", "citaten": ["..."] },
    "ethiek":    { "score": "...", "onderbouwing": "...", "citaten": ["..."] },
    "kennis":    { "score": "...", "onderbouwing": "...", "citaten": ["..."] },
    "pedagogiek":{ "score": "...", "onderbouwing": "...", "citaten": ["..."] },
    "agency":    { "score": "...", "onderbouwing": "...", "citaten": ["..."] }
  },
  "passed": true,
  "samenvatting": "Een alinea van 3 tot 5 zinnen voor de docent zelf, in tweede persoon enkelvoud, vriendelijk en helder.",
  "ontwikkeladvies": "Een alinea met concrete suggesties als er ORANJE of ROOD scores zijn, anders een korte felicitatie."
}`;

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

function formatCasuses(casuses: EvaluatorCasus[]): string {
  if (casuses.length === 0) return '(geen casussen geregistreerd)';
  return casuses
    .slice()
    .sort((a, b) => a.webinar - b.webinar)
    .map((c) => {
      const domains = c.domains.length > 0 ? c.domains.join(', ') : 'geen';
      return `Webinar ${c.webinar} (${c.code}) [domeinen: ${domains}; cognitief proces: ${c.bloomCategory}]\n  Vraag: ${c.prompt}`;
    })
    .join('\n\n');
}

function formatTranscript(lines: EvaluatorTranscriptLine[]): string {
  if (lines.length === 0) return '(leeg transcript)';
  return lines
    .map((l) => {
      const label = l.speaker === 'bot' ? 'Bot' : 'Docent';
      return `${label}: ${l.text}`;
    })
    .join('\n');
}

export function buildEvaluatorPrompt({
  transcript,
  docent,
  casuses,
}: BuildPromptArgs): BuiltPrompt {
  const user =
    `Docentgegevens:\n${formatDocent(docent)}\n\n` +
    `Gestelde casussen (in volgorde):\n${formatCasuses(casuses)}\n\n` +
    `Transcript van het examen:\n${formatTranscript(transcript)}\n\n` +
    `Beoordeel nu volgens het rubric en lever uitsluitend de gevraagde JSON.`;
  return { system: SYSTEM_PROMPT, user };
}
