/**
 * Status-badge voor een webhook_deliveries row.
 * Toont status, attempts en, op hover, last_error of skipped_reason.
 */
import type { Database } from '@/lib/supabase/types';

type DeliveryStatus = Database['public']['Enums']['delivery_status'];

export interface WebhookStatusProps {
  status: DeliveryStatus;
  attempts: number;
  lastError?: string | null;
  skippedReason?: string | null;
}

const STYLES: Record<DeliveryStatus, string> = {
  sent: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  skipped: 'bg-gray-100 text-gray-700 border-gray-200',
};

const LABELS: Record<DeliveryStatus, string> = {
  sent: 'Verzonden',
  pending: 'In wacht',
  failed: 'Mislukt',
  skipped: 'Geskipt',
};

export function WebhookStatus({
  status,
  attempts,
  lastError,
  skippedReason,
}: WebhookStatusProps) {
  const tooltip =
    status === 'skipped'
      ? skippedReason ?? ''
      : lastError ?? '';
  return (
    <div className="flex flex-col gap-1" title={tooltip}>
      <span
        className={`inline-flex w-fit items-center px-2 py-0.5 text-[11px] font-semibold uppercase rounded-full border ${STYLES[status]}`}
      >
        {LABELS[status]}
      </span>
      <span className="text-[11px] text-text-body/70">
        Pogingen: {attempts}
      </span>
      {tooltip ? (
        <span className="text-[11px] text-text-body/60 line-clamp-2 max-w-xs">
          {tooltip}
        </span>
      ) : null}
    </div>
  );
}
