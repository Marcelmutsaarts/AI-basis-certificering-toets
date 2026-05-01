/**
 * Retry-schedule voor de outgoing webhook.
 *
 * Per attempt-counter (1..5) leveren we een delay in seconden vanaf het
 * `created_at` moment van de delivery. Na vijf mislukte pogingen wordt
 * de delivery definitief op 'failed' gezet.
 */

export const MAX_ATTEMPTS = 5;

const DELAYS_SECONDS: number[] = [60, 300, 1800, 7200, 43200];

export function nextAttemptDelay(attempts: number): number {
  if (attempts < 1) return DELAYS_SECONDS[0];
  if (attempts > DELAYS_SECONDS.length) {
    return DELAYS_SECONDS[DELAYS_SECONDS.length - 1];
  }
  return DELAYS_SECONDS[attempts - 1];
}

/**
 * Bepaal of een delivery nu (her)opgevoerd mag worden, gegeven de
 * `created_at` en het aantal eerdere pogingen. Vergelijking is in
 * milliseconden om timezone-afwijkingen te vermijden.
 */
export function isDueNow(args: {
  createdAtIso: string;
  attempts: number;
  now?: Date;
}): boolean {
  const now = args.now ?? new Date();
  const created = new Date(args.createdAtIso);
  const delaySec = nextAttemptDelay(Math.max(args.attempts, 1));
  const dueAt = created.getTime() + delaySec * 1000;
  return now.getTime() >= dueAt;
}
