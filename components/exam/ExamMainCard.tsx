'use client';

/**
 * Hoofd-card op het examen-scherm met de audio-visualizer, mic-knop en
 * actie-knoppen. Wordt alleen gerenderd wanneer de Live API verbonden is.
 *
 * Op smartphone-breedte verticaal gecenterd binnen het scherm.
 */
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MicButton } from './MicButton';
import { MicLevelMeter } from './MicLevelMeter';

export interface ExamMainCardProps {
  muted: boolean;
  ending: boolean;
  connected: boolean;
  micLevel: number;
  onToggleMute: () => void;
  onStop: () => void;
  onAbort: () => void;
}

export function ExamMainCard({
  muted,
  ending,
  connected,
  micLevel,
  onToggleMute,
  onStop,
  onAbort,
}: ExamMainCardProps) {
  return (
    <Card padding="md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <MicButton
            muted={muted}
            onToggle={onToggleMute}
            disabled={!connected}
          />
          <MicLevelMeter level={micLevel} muted={muted} />
          <button
            type="button"
            onClick={onAbort}
            disabled={ending}
            className="text-sm text-text-body/70 hover:text-purple-dark hover:underline transition-colors disabled:opacity-50 disabled:hover:no-underline"
          >
            Sessie afbreken
          </button>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button
            variant="secondary"
            size="md"
            onClick={onStop}
            disabled={ending}
            className="min-h-[44px]"
          >
            {ending ? 'Bezig met afronden' : 'Examen afronden'}
          </Button>
          <p className="text-xs text-text-body/70 max-w-[16rem] text-right">
            Klik hierop zodra Lieke het gesprek heeft afgerond.
          </p>
        </div>
      </div>
    </Card>
  );
}
