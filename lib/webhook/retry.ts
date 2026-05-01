/**
 * Retry helper voor bestaande webhook_deliveries rows.
 *
 * Geeft een delivery-row + bouwt de payload opnieuw met de actuele data
 * uit de database. We bewaren geen body in de delivery row, want een
 * tussentijds gewijzigde evaluation moet meegestuurd worden bij de
 * volgende poging. Cron en admin-retry gebruiken beide deze helper.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { EvaluatorOutputSchema } from '@/lib/evaluator/schema';
import { buildPayload, stableStringify } from './payload';
import { signPayload } from './sign';
import { deliverWebhook, type DeliverResult } from './deliver';
import { isDueNow, MAX_ATTEMPTS } from './schedule';

type DeliveryRow = Database['public']['Tables']['webhook_deliveries']['Row'];

export interface RetrySingleArgs {
  supabase: SupabaseClient<Database>;
  delivery: DeliveryRow;
}

async function buildBody(
  supabase: SupabaseClient<Database>,
  examSessionId: string
): Promise<{ bodyString: string; signature: string; url: string } | null> {
  const { data: session } = await supabase
    .from('exam_sessions')
    .select('id, user_id, started_at, ended_at')
    .eq('id', examSessionId)
    .maybeSingle();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id, full_name, school, niveau, vakgebied')
    .eq('user_id', session.user_id)
    .maybeSingle();
  if (!profile) return null;

  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('raw_output')
    .eq('exam_session_id', examSessionId)
    .maybeSingle();
  if (!evaluation) return null;

  const parsed = EvaluatorOutputSchema.safeParse(evaluation.raw_output);
  if (!parsed.success) return null;

  const { data: authUser } = await supabase.auth.admin.getUserById(
    session.user_id
  );
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const payload = buildPayload({
    session,
    profile: {
      user_id: profile.user_id,
      full_name: profile.full_name,
      email: authUser?.user?.email ?? '',
      school: profile.school,
      niveau: profile.niveau,
      vakgebied: profile.vakgebied,
    },
    evaluation: parsed.data,
    appUrl,
  });
  const bodyString = stableStringify(payload);
  const secret = process.env.N8N_WEBHOOK_SECRET ?? '';
  const signature = secret ? signPayload(bodyString, secret) : '';
  const url = process.env.N8N_RESULT_WEBHOOK_URL ?? '';
  return { bodyString, signature, url };
}

export async function retryDelivery(
  args: RetrySingleArgs
): Promise<DeliverResult> {
  const built = await buildBody(args.supabase, args.delivery.exam_session_id);
  if (!built) {
    await args.supabase
      .from('webhook_deliveries')
      .update({
        status: 'failed',
        last_error: 'Kon payload niet rebuilden (data ontbreekt).',
      })
      .eq('id', args.delivery.id);
    return {
      status: 'failed',
      attempts: args.delivery.attempts,
      error: 'Kon payload niet rebuilden.',
    };
  }
  return deliverWebhook({
    deliveryId: args.delivery.id,
    url: built.url,
    bodyString: built.bodyString,
    signature: built.signature,
    supabase: args.supabase,
    currentAttempts: args.delivery.attempts,
  });
}

export interface CronSummary {
  retried: number;
  succeeded: number;
  failed: number;
  pending: number;
}

export async function runRetryBatch(
  supabase: SupabaseClient<Database>
): Promise<CronSummary> {
  const { data: rows } = await supabase
    .from('webhook_deliveries')
    .select('*')
    .in('status', ['pending', 'failed'])
    .lt('attempts', MAX_ATTEMPTS)
    .order('created_at', { ascending: true })
    .limit(50);

  const summary: CronSummary = { retried: 0, succeeded: 0, failed: 0, pending: 0 };
  if (!rows || rows.length === 0) return summary;

  for (const row of rows) {
    if (!isDueNow({ createdAtIso: row.created_at, attempts: row.attempts })) {
      continue;
    }
    summary.retried += 1;
    const result = await retryDelivery({ supabase, delivery: row });
    if (result.status === 'sent') summary.succeeded += 1;
    else if (result.status === 'failed') summary.failed += 1;
    else if (result.status === 'pending') summary.pending += 1;
  }
  return summary;
}
