/**
 * HTML-escape voor mailtemplates. Server-only. Voorkomt HTML-injectie van
 * dynamische waarden in de uitgaande mail.
 */
const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function esc(s: unknown): string {
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"']/g, (m) => ESC[m]);
}
