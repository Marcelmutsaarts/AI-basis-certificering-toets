/**
 * Hoofd-trigger voor outgoing webhook na een succesvolle evaluatie.
 *
 * Voor testers (profiles.role='tester') wordt een webhook_deliveries
 * row met status 'skipped' aangemaakt en de POST overgeslagen.
 * Voor reguliere docenten bouwt deze functie de payload, signt
 * de body en doet de eerste delivery-poging fire-and-forget.
 *
 * Service-role client is verplicht omdat webhook_deliveries onder RLS
 * alleen voor admin schrijfbaar is en deze trigger vanuit een server
 * route loopt zonder admin-context.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { EvaluatorOutputSchema } from '@/lib/evaluator/schema';
import { buildPayload, stableStringify } from './payload';
import { signPayload } from './sign';
import { deliverWebhook, type DeliverResult } from './deliver';

export interface TriggerOutcome {
  deliveryId: string;
  status: 'sent' | 'pending' | 'failed' | 'skipped';
  reason?: string;
}

async function loadJoined(
  supabase: SupabaseClient<Database>,
  examSessionId: string
) {
  const { data: session, error: sErr } = await supabase
    .from('exam_sessions')
    .select('id, user_id, started_at, ended_at, status')
    .eq('id', examSessionId)
    .maybeSingle();
  if (sErr || !session) {
    throw new Error('Sessie niet gevonden voor webhook trigger.');
  }
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('user_id, full_name, role, school, niveau, vakgebied')
    .eq('user_id', session.user_id)
    .maybeSingle();
  if (pErr || !profile) {
    throw new Error('Profiel niet gevonden voor webhook trigger.');
  }
  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('raw_output')
    .eq('exam_session_id', examSessionId)
    .maybeSingle();
  const { data: authUser } = await supabase.auth.admin.getUserById(
    session.user_id
  );
  return {
    session,
    profile,
    evaluation,
    email: authUser?.user?.email ?? '',
  };
}

async function insertSkipped(
  supabase: SupabaseClient<Database>,
  examSessionId: string,
  reason: string
): Promise<TriggerOutcome> {
  const { data, error } = await supabase
    .from('webhook_deliveries')
    .insert({
      exam_session_id: examSessionId,
      status: 'skipped',
      attempts: 0,
      skipped_reason: reason,
    })
    .select('id')
    .single();
  if (error || !data) {
    throw new Error(`Kon skipped delivery niet inserten: ${error?.message}`);
  }
  return { deliveryId: data.id, status: 'skipped', reason };
}

async function insertPending(
  supabase: SupabaseClient<Database>,
  examSessionId: string
): Promise<string> {
  const { data, error } = await supabase
    .from('webhook_deliveries')
    .insert({
      exam_session_id: examSessionId,
      status: 'pending',
      attempts: 0,
    })
    .select('id')
    .single();
  if (error || !data) {
    throw new Error(`Kon pending delivery niet inserten: ${error?.message}`);
  }
  return data.id;
}

export async function triggerWebhookForSession(
  supabase: SupabaseClient<Database>,
  examSessionId: string
): Promise<TriggerOutcome> {
  const ctx = await loadJoined(supabase, examSessionId);
  if (ctx.profile.role === 'tester') {
    return insertSkipped(supabase, examSessionId, 'test_account');
  }
  if (!ctx.evaluation) {
    throw new Error('Evaluatie ontbreekt; webhook overgeslagen.');
  }
  const parsed = EvaluatorOutputSchema.safeParse(ctx.evaluation.raw_output);
  if (!parsed.success) {
    throw new Error('Evaluation raw_output niet valid.');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const payload = buildPayload({
    session: ctx.session,
    profile: {
      user_id: ctx.profile.user_id,
      full_name: ctx.profile.full_name,
      email: ctx.email,
      school: ctx.profile.school,
      niveau: ctx.profile.niveau,
      vakgebied: ctx.profile.vakgebied,
    },
    evaluation: parsed.data,
    appUrl,
  });
  const bodyString = stableStringify(payload);
  const secret = process.env.N8N_WEBHOOK_SECRET ?? '';
  const signature = secret ? signPayload(bodyString, secret) : '';
  const url = process.env.N8N_RESULT_WEBHOOK_URL ?? '';

  const deliveryId = await insertPending(supabase, examSessionId);
  const result: DeliverResult = await deliverWebhook({
    deliveryId,
    url,
    bodyString,
    signature,
    supabase,
    currentAttempts: 0,
  });
  return { deliveryId, status: result.status, reason: result.error };
}
