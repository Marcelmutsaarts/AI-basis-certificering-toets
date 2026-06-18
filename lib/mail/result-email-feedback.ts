/**
 * Bouwt het feedback-blok voor de toetsuitslag-mail, zowel als HTML als
 * platte tekst. Gescheiden van de hoofdtemplate zodat result-email.ts
 * onder de regel-limiet blijft. Alle waarden worden ge-escaped.
 */
import { esc } from './escape';

export interface DocentFeedback {
  rating: number | null;
  positief: string | null;
  negatief: string | null;
}

// True als de docent niets heeft ingevuld (rating noch teksten).
export function feedbackLeeg(f: DocentFeedback): boolean {
  const tekstLeeg = [f.positief, f.negatief].every(
    (t) => !t || t.trim().length === 0
  );
  return f.rating === null && tekstLeeg;
}

function feedbackRegelHtml(label: string, waarde: string | null): string {
  if (!waarde || waarde.trim().length === 0) return '';
  return `<p style="margin:0 0 6px;font-size:14px"><strong>${esc(
    label
  )}:</strong> <span style="white-space:pre-wrap">${esc(waarde)}</span></p>`;
}

export function buildFeedbackHtml(f: DocentFeedback): string {
  const titel = `<h3 style="font-size:14px;color:#7947ba;margin:22px 0 6px">Feedback van de docent</h3>`;
  if (feedbackLeeg(f)) {
    return `${titel}<p style="margin:0;font-size:14px">Geen feedback gegeven.</p>`;
  }
  const rating =
    f.rating !== null
      ? `<p style="margin:0 0 6px;font-size:14px"><strong>Waardering:</strong> ${esc(
          `${f.rating} van 5`
        )}</p>`
      : '';
  const body = [
    rating,
    feedbackRegelHtml('Wat ging goed', f.positief),
    feedbackRegelHtml('Wat kan beter', f.negatief),
  ].join('');
  return `${titel}${body}`;
}

export function feedbackText(f: DocentFeedback): string {
  if (feedbackLeeg(f)) return 'Geen feedback gegeven.';
  const regels: string[] = [];
  if (f.rating !== null) regels.push(`Waardering: ${f.rating} van 5`);
  if (f.positief && f.positief.trim().length > 0) {
    regels.push(`Wat ging goed: ${f.positief}`);
  }
  if (f.negatief && f.negatief.trim().length > 0) {
    regels.push(`Wat kan beter: ${f.negatief}`);
  }
  return regels.join('\n');
}
