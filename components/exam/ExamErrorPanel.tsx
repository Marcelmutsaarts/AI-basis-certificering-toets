'use client';

/**
 * Foutkaart voor het examen-scherm. Toont een kop, uitlegtekst, en
 * recovery-knoppen die afhankelijk zijn van het soort fout.
 *
 * Soorten:
 *  - mic-denied:   browser-permissie geweigerd. Geen retry-knop, alleen
 *                  uitleg over slotje en herladen, plus Terug-knop.
 *  - live-lost:    verbinding kwijt. Retry-knop (handmatig) en Terug-knop.
 *  - generic:      algemene fout. Retry-knop en Terug-knop.
 */
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export type ExamErrorKind = 'mic-denied' | 'live-lost' | 'generic';

export interface ExamErrorPanelProps {
  kind: ExamErrorKind;
  message?: string | null;
  onRetry?: () => void;
  onAbort?: () => void;
  retrying?: boolean;
}

const TITLES: Record<ExamErrorKind, string> = {
  'mic-denied': 'Microfoon-toegang geweigerd',
  'live-lost': 'Verbinding met Lieke verloren',
  generic: 'Er ging iets mis',
};

const BODIES: Record<ExamErrorKind, string> = {
  'mic-denied':
    'Microfoon is nodig om het examen te doen. Klik op het slotje in je browser om toegang te geven, en herlaad de pagina.',
  'live-lost':
    'De verbinding met Lieke is verbroken. We proberen automatisch opnieuw te verbinden. Lukt dat niet, klik dan hieronder op Opnieuw verbinden.',
  generic:
    'Er ging iets onverwachts mis. Probeer het opnieuw of ga terug naar het startscherm.',
};

export function ExamErrorPanel({
  kind,
  message,
  onRetry,
  onAbort,
  retrying = false,
}: ExamErrorPanelProps) {
  return (
    <Card padding="md">
      <div role="alert" className="flex flex-col gap-3">
        <h2 className="text-base md:text-lg font-semibold text-red-700">
          {TITLES[kind]}
        </h2>
        <p className="text-sm leading-relaxed text-text-body">{BODIES[kind]}</p>
        {message ? (
          <p className="text-xs text-text-body/70 break-words">
            Technische melding: {message}
          </p>
        ) : null}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
          {kind !== 'mic-denied' && onRetry ? (
            <Button
              variant="primary"
              size="md"
              onClick={onRetry}
              disabled={retrying}
              className="min-h-[44px]"
            >
              {retrying ? 'Bezig met opnieuw verbinden' : 'Opnieuw verbinden'}
            </Button>
          ) : null}
          {kind === 'mic-denied' ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => window.location.reload()}
              className="min-h-[44px]"
            >
              Pagina herladen
            </Button>
          ) : null}
          {onAbort ? (
            <Button
              variant="secondary"
              size="md"
              onClick={onAbort}
              className="min-h-[44px]"
            >
              Sessie afbreken
            </Button>
          ) : null}
          <Link
            href="/start"
            className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 text-base text-purple-dark hover:bg-purple-light-bg transition-colors min-h-[44px]"
          >
            Terug naar startscherm
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function classifyExamError(message: string | null): ExamErrorKind {
  if (!message) return 'generic';
  const lower = message.toLowerCase();
  if (
    lower.includes('permission') ||
    lower.includes('notallowed') ||
    lower.includes('not allowed') ||
    lower.includes('denied') ||
    lower.includes('microfoon')
  ) {
    return 'mic-denied';
  }
  if (
    lower.includes('verbinding') ||
    lower.includes('websocket') ||
    lower.includes('live api') ||
    lower.includes('disconnect')
  ) {
    return 'live-lost';
  }
  return 'generic';
}
