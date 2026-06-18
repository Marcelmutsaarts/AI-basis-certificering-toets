/**
 * Admin-card met de feedback van de docent over de toetsvorm: waardering
 * plus wat goed en wat niet goed was. Toont "Geen feedback gegeven." als
 * alle velden leeg zijn.
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
  positief,
  negatief,
}: {
  rating: number | null;
  positief: string | null;
  negatief: string | null;
}) {
  const leeg = rating === null && !positief && !negatief;
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
          {positief ? (
            <FeedbackRegel label="Wat ging goed" waarde={positief} />
          ) : null}
          {negatief ? (
            <FeedbackRegel label="Wat kan beter" waarde={negatief} />
          ) : null}
        </div>
      )}
    </Card>
  );
}
