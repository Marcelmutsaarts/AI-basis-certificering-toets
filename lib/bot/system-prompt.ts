/**
 * System prompt voor Lieke (examinator).
 * Wordt vooraf compleet opgebouwd, omdat Live 3.1 geen mid-session updates van
 * de system instruction toestaat. De gekozen casussen en de docentcontext
 * worden hier ingevoegd. Per onderwerp wordt een prive examinatoraanwijzing
 * uit de kennismodule gerenderd, die Lieke nooit voorleest.
 */
import { getCasusCard } from '@/lib/knowledge';
import {
  INTRO,
  GESPREKSVERLOOP,
  DOORVRAGEN,
  GENOEG_GEHOORD,
  NIET_DOEN,
  WEL_DOEN,
  STUREN,
  ONDERWERPEN_HEADING,
} from './lieke-instructions';

export interface DocentContext {
  fullName: string;
  niveau: 'PO' | 'VO' | 'MBO' | 'HBO' | 'WO' | string;
  vakgebied: string | null;
}

export interface CasusForPrompt {
  webinar: number;
  code: string;
  prompt: string;
  domains: string[];
  bloomCategory: string;
}

export interface BuildSystemPromptInput {
  docent: DocentContext;
  casussen: CasusForPrompt[];
  niveau?: DocentContext['niveau'];
}

function describeNiveau(code: string): string {
  switch (code) {
    case 'PO':
      return 'primair onderwijs';
    case 'VO':
      return 'voortgezet onderwijs';
    case 'MBO':
      return 'middelbaar beroepsonderwijs';
    case 'HBO':
      return 'hoger beroepsonderwijs';
    case 'WO':
      return 'wetenschappelijk onderwijs';
    default:
      return code;
  }
}

function buildDocentBlok(docent: DocentContext): string {
  const niveauLabel = describeNiveau(docent.niveau);
  const vakLine = docent.vakgebied
    ? `Vakgebied: ${docent.vakgebied}.`
    : 'Vakgebied: niet opgegeven, vraag dit kort uit.';
  return `DOCENTCONTEXT:
Naam: ${docent.fullName}.
Onderwijsniveau: ${docent.niveau} (${niveauLabel}).
${vakLine}`;
}

function formatOnderwerp(c: CasusForPrompt, index: number): string {
  const n = index + 1;
  const vraag = `Onderwerp ${n}: ${c.prompt}`;
  const card = getCasusCard(c.code);
  if (!card) {
    return vraag;
  }
  return `${vraag}
  Prive aanwijzing, niet voorlezen of prijsgeven. Let op of de docent dit laat zien: ${card.waarOpLetten} Een sterk antwoord raakt ongeveer: ${card.goedAntwoord} Misverstand om op door te vragen: ${card.misvatting}`;
}

function buildOnderwerpenBlok(casussen: CasusForPrompt[]): string {
  const lines = casussen
    .slice()
    .sort((a, b) => a.webinar - b.webinar)
    .map(formatOnderwerp);
  return `${ONDERWERPEN_HEADING}\n${lines.join('\n')}`;
}

export function buildSystemPrompt(input: BuildSystemPromptInput): string {
  const { docent, casussen } = input;
  return [
    INTRO,
    buildDocentBlok(docent),
    GESPREKSVERLOOP,
    DOORVRAGEN,
    GENOEG_GEHOORD,
    NIET_DOEN,
    WEL_DOEN,
    STUREN,
    buildOnderwerpenBlok(casussen),
  ].join('\n\n');
}
