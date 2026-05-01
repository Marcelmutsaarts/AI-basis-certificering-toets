/**
 * Grote pass/fail-kop boven de domein-uitslag.
 *
 * Geslaagd: vinkje + felicitatie (mail volgt).
 * Gezakt:   wachtsymbool + nuchtere boodschap (herkansing volgt).
 *
 * Tekst letterlijk volgens coder.md sectie "Resultaatscherm".
 */

export interface PassFailHeaderProps {
  passed: boolean;
}

const PASSED_TEXT =
  'Gefeliciteerd, je hebt het basiscertificaat behaald. Je ontvangt het certificaat zo snel mogelijk per e-mail.';

const FAILED_TEXT =
  'Helaas, dit keer nog niet. Je kunt je opnieuw inschrijven voor een herkansing. Je ontvangt zo een mail met de uitslag en de inschrijflink.';

function PassedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="w-10 h-10 text-green-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function WaitingIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="w-10 h-10 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PassFailHeader({ passed }: PassFailHeaderProps) {
  const wrapperClass = passed
    ? 'bg-green-50 border-green-200'
    : 'bg-amber-50 border-amber-200';
  const titleClass = passed ? 'text-green-900' : 'text-amber-900';
  const title = passed ? 'Geslaagd' : 'Nog niet geslaagd';
  const body = passed ? PASSED_TEXT : FAILED_TEXT;
  return (
    <div
      role="status"
      className={`rounded-xl border p-6 flex items-start gap-4 ${wrapperClass}`}
    >
      <div className="shrink-0 mt-1">{passed ? <PassedIcon /> : <WaitingIcon />}</div>
      <div className="flex flex-col gap-2">
        <h1 className={`text-2xl font-semibold ${titleClass}`}>{title}</h1>
        <p className="text-base leading-relaxed text-text-body">{body}</p>
      </div>
    </div>
  );
}
