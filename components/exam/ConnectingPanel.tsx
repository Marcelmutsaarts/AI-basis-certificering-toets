'use client';

/**
 * Wacht-paneel dat getoond wordt na klik op Start tot de Live API
 * verbonden is en Lieke begint te spreken. Voorkomt dat de gebruiker
 * de mic-knop indrukt voordat de sessie staat.
 */
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export interface ConnectingPanelProps {
  message?: string;
}

export function ConnectingPanel({
  message = 'Verbinden met Lieke...',
}: ConnectingPanelProps) {
  return (
    <Card padding="md">
      <div className="flex flex-col items-center gap-4 text-center py-6">
        <Spinner size="md" label="Verbinden met Lieke" />
        <p className="text-sm md:text-base font-medium text-purple-dark">
          {message}
        </p>
        <p className="text-xs text-text-body/70 max-w-md">
          We zetten de spraakverbinding klaar en geven je microfoon de juiste
          rechten. Dit duurt meestal een paar seconden.
        </p>
      </div>
    </Card>
  );
}
