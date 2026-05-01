'use client';

/**
 * Hoofd-card op het examen-scherm met de audio-visualizer, mic-knop en
 * actie-knoppen. Wordt alleen gerenderd wanneer de Live API verbonden is.
 *
 * Op smartphone-breedte verticaal gecenterd binnen het scherm.
 */
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AudioVisualizer, type SpeakerState } from './AudioVisualizer';
import { MicButton } from './MicButton';

export interface ExamMainCardProps {
  speaker: SpeakerState;
  muted: boolean;
  ending: boolean;
  connected: boolean;
  onToggleMute: () => void;
  onStop: () => void;
  onAbort: () => void;
}

export function ExamMainCard({
  speaker,
  muted,
  ending,
  connected,
  onToggleMute,
  onStop,
  onAbort,
}: ExamMainCardProps) {
  return (
    <Card padding="md">
      <div className="flex flex-col items-center justify-center gap-5 md:gap-6 min-h-[18rem] md:min-h-0">
        <AudioVisualizer speaker={speaker} />
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <MicButton
            muted={muted}
            onToggle={onToggleMute}
            disabled={!connected}
          />
          <Button
            variant="secondary"
            size="md"
            onClick={onStop}
            disabled={ending}
            className="min-h-[44px]"
          >
            {ending ? 'Bezig met afronden' : 'Examen afronden'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onAbort}
            disabled={ending}
            className="min-h-[44px] text-text-body border-text-body/30 hover:bg-purple-light-bg/60"
          >
            Sessie afbreken
          </Button>
        </div>
      </div>
    </Card>
  );
}
