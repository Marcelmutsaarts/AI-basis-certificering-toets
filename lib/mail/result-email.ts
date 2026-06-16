/**
 * Mailtemplate voor de toetsuitslag richting het AVD-team. Server-only,
 * geen React. Alle dynamische waarden worden via esc() ge-escaped om
 * HTML-injectie te voorkomen, inclusief naam en app-feedback.
 *
 * De payload spiegelt onze eigen data: docentgegevens plus het
 * rubric-oordeel per framework-domein in GROEN, ORANJE of ROOD.
 */
import type { Score } from '@/lib/evaluator/schema';

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function esc(s: unknown): string {
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"']/g, (m) => ESC[m]);
}

export interface ResultEmailPayload {
  docent: {
    naam: string;
    email: string;
    school: string | null;
    niveau: string | null;
    vakgebied: string | null;
  };
  uitslag: {
    passed: boolean;
    domeinen: {
      mindset: Score;
      ethiek: Score;
      kennis: Score;
      pedagogiek: Score;
      agency: Score;
    };
    samenvatting: string;
    ontwikkeladvies: string;
  };
  appFeedback: string | null;
  voltooidOp: string;
  sessionId: string;
}

const DOMEIN_LABELS: ReadonlyArray<[keyof ResultEmailPayload['uitslag']['domeinen'], string]> = [
  ['mindset', 'Mindset'],
  ['ethiek', 'Ethiek'],
  ['kennis', 'Kennis'],
  ['pedagogiek', 'Pedagogiek'],
  ['agency', 'Agency'],
];

const SCORE_KLEUR: Record<Score, string> = {
  GROEN: '#059669',
  ORANJE: '#d97706',
  ROOD: '#dc2626',
};

function formatDatumNL(iso: string): string {
  return new Date(iso).toLocaleString('nl-NL', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export function buildSubject(p: ResultEmailPayload): string {
  const status = p.uitslag.passed ? 'geslaagd' : 'niet geslaagd';
  return `Toetsuitslag ${p.docent.naam}, ${status}`;
}

function rij(label: string, waarde: string): string {
  return `<tr><td style="padding:6px 8px;color:#6a6a7c;width:150px">${esc(label)}</td><td style="padding:6px 8px">${waarde}</td></tr>`;
}

function buildDomeinenHtml(d: ResultEmailPayload['uitslag']['domeinen']): string {
  return DOMEIN_LABELS.map(([key, label]) => {
    const score = d[key];
    return rij(
      label,
      `<strong style="color:${SCORE_KLEUR[score]}">${esc(score)}</strong>`
    );
  }).join('');
}

function buildGegevensHtml(p: ResultEmailPayload): string {
  return [
    rij('Naam', `<strong>${esc(p.docent.naam)}</strong>`),
    rij(
      'E-mailadres',
      `<a href="mailto:${esc(p.docent.email)}" style="color:#7947ba">${esc(p.docent.email)}</a>`
    ),
    rij('School', esc(p.docent.school ?? 'onbekend')),
    rij('Niveau', esc(p.docent.niveau ?? 'onbekend')),
    rij('Vakgebied', esc(p.docent.vakgebied ?? 'onbekend')),
    rij('Voltooid op', esc(formatDatumNL(p.voltooidOp))),
  ].join('');
}

function buildBlok(titel: string, tekst: string): string {
  return `<h3 style="font-size:14px;color:#7947ba;margin:22px 0 6px">${esc(titel)}</h3>
      <p style="margin:0;font-size:14px;white-space:pre-wrap">${esc(tekst)}</p>`;
}

function buildFeedbackHtml(feedback: string | null): string {
  if (!feedback || feedback.trim().length === 0) {
    return buildBlok('Feedback over de app', 'Geen feedback gegeven.');
  }
  return buildBlok('Feedback over de app', feedback);
}

export function buildHtml(p: ResultEmailPayload): string {
  const kop = p.uitslag.passed
    ? `<strong style="color:#059669">geslaagd</strong>`
    : `<strong style="color:#dc2626">niet geslaagd</strong>`;
  return `<!doctype html>
<html lang="nl">
<head><meta charset="utf-8"></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f8f8f9;color:#1f1f29;line-height:1.5">
  <div style="max-width:600px;margin:0 auto;padding:30px 20px">
    <div style="background:#a15df5;color:white;padding:18px 22px;border-radius:8px 8px 0 0">
      <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;opacity:0.85">AI voor Docenten</div>
      <div style="font-size:18px;font-weight:600;margin-top:2px">Toetsuitslag mondeling examen</div>
    </div>
    <div style="background:white;border:1px solid #ebdfff;border-top:none;padding:24px;border-radius:0 0 8px 8px">
      <p style="margin-top:0">${esc(p.docent.naam)} is ${kop} voor het mondeling examen.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px">${buildGegevensHtml(p)}</table>
      <h3 style="font-size:14px;color:#7947ba;margin:22px 0 6px">Scores per domein</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${buildDomeinenHtml(p.uitslag.domeinen)}</table>
      ${buildBlok('Samenvatting', p.uitslag.samenvatting)}
      ${buildBlok('Ontwikkeladvies', p.uitslag.ontwikkeladvies)}
      ${buildFeedbackHtml(p.appFeedback)}
      <p style="font-size:11px;color:#898998;margin-top:24px;margin-bottom:0">Sessie ${esc(p.sessionId)}. Automatisch verstuurd vanaf de AVD toets-app.</p>
    </div>
  </div>
</body>
</html>`;
}

function domeinenText(d: ResultEmailPayload['uitslag']['domeinen']): string {
  return DOMEIN_LABELS.map(([key, label]) => `  ${label}: ${d[key]}`).join('\n');
}

export function buildText(p: ResultEmailPayload): string {
  const feedback =
    p.appFeedback && p.appFeedback.trim().length > 0
      ? p.appFeedback
      : 'Geen feedback gegeven.';
  return `Toetsuitslag mondeling examen, AI voor Docenten

Naam:        ${p.docent.naam}
E-mail:      ${p.docent.email}
School:      ${p.docent.school ?? 'onbekend'}
Niveau:      ${p.docent.niveau ?? 'onbekend'}
Vakgebied:   ${p.docent.vakgebied ?? 'onbekend'}
Voltooid op: ${formatDatumNL(p.voltooidOp)}
Resultaat:   ${p.uitslag.passed ? 'GESLAAGD' : 'NIET GESLAAGD'}

Scores per domein:
${domeinenText(p.uitslag.domeinen)}

Samenvatting:
${p.uitslag.samenvatting}

Ontwikkeladvies:
${p.uitslag.ontwikkeladvies}

Feedback over de app:
${feedback}

Sessie ${p.sessionId}. Automatisch verstuurd vanaf de AVD toets-app.`;
}
