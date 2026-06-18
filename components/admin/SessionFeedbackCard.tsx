/**
 * Admin-card met de gestructureerde feedback van de docent over de
 * toetsvorm: waardering plus start, stop en doorgaan. Toont "Geen feedback
 * gegeven." als alle velden leeg zijn.
 */
import { Card } from '@/components/ui/Card';

function FeedbackRegel({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-purple-medium">{label}</span>
      <p className="text-sm leading-relaxed text-text-body whitespace-pre-wrap">
        {waarde}
      </p>
    </div>
  );
}

export function SessionFeedbackCard({
  rating,
  start,
  stop,
  doorgaan,
}: {
  rating: number | null;
  start: string | null;
  stop: string | null;
  doorgaan: string | null;
}) {
  const leeg = rating === null && !start && !stop && !doorgaan;
  return (
    <Card padding="md">
      <h2 className="text-lg font-semibold text-purple-dark mb-3">
        Feedback van docent
      </h2>
      {leeg ? (
        <p className="text-sm text-text-body/70">Geen feedback gegeven.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rating !== null ? (
            <FeedbackRegel label="Waardering" waarde={`${rating} van 5`} />
          ) : null}
          {start ? <FeedbackRegel label="Starten met" waarde={start} /> : null}
          {stop ? <FeedbackRegel label="Stoppen met" waarde={stop} /> : null}
          {doorgaan ? (
            <FeedbackRegel label="Doorgaan met" waarde={doorgaan} />
          ) : null}
        </div>
      )}
    </Card>
  );
}
