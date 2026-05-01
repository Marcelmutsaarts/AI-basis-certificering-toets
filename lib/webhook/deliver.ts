/**
 * Doet een POST naar de n8n-webhook URL en update de delivery row.
 *
 * Op 2xx: status='sent', sent_at=now(), increment attempts.
 * Op niet-2xx of error/timeout: increment attempts, status='pending'
 * tot we MAX_ATTEMPTS bereiken, daarna 'failed'. last_error wordt altijd
 * gevuld bij failure.
 *
 * Timeout: 10 seconden via AbortController.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { MAX_ATTEMPTS } from './schedule';

const TIMEOUT_MS = 10_000;

export interface DeliverArgs {
  deliveryId: string;
  url: string;
  bodyString: string;
  signature: string;
  supabase: SupabaseClient<Database>;
  currentAttempts: number;
}

export interface DeliverResult {
  status: 'sent' | 'pending' | 'failed' | 'skipped';
  attempts: number;
  error?: string;
  httpStatus?: number;
}

async function doPost(
  url: string,
  bodyString: string,
  signature: string
): Promise<{ ok: boolean; status: number; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AVD-Signature': signature,
      },
      body: bodyString,
      signal: controller.signal,
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown fetch error';
    return { ok: false, status: 0, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

async function applyResult(
  supabase: SupabaseClient<Database>,
  deliveryId: string,
  attempts: number,
  ok: boolean,
  errorString: string | null
): Promise<DeliverResult> {
  if (ok) {
    await supabase
      .from('webhook_deliveries')
      .update({
        status: 'sent',
        attempts,
        sent_at: new Date().toISOString(),
        last_error: null,
      })
      .eq('id', deliveryId);
    return { status: 'sent', attempts };
  }
  const finalStatus = attempts >= MAX_ATTEMPTS ? 'failed' : 'pending';
  await supabase
    .from('webhook_deliveries')
    .update({
      status: finalStatus,
      attempts,
      last_error: errorString,
    })
    .eq('id', deliveryId);
  return { status: finalStatus, attempts, error: errorString ?? undefined };
}

export async function deliverWebhook(args: DeliverArgs): Promise<DeliverResult> {
  const nextAttempts = args.currentAttempts + 1;
  if (!args.url) {
    const errorString = 'N8N_RESULT_WEBHOOK_URL ontbreekt.';
    return applyResult(
      args.supabase,
      args.deliveryId,
      nextAttempts,
      false,
      errorString
    );
  }
  const res = await doPost(args.url, args.bodyString, args.signature);
  const errorString = res.ok
    ? null
    : `HTTP ${res.status}${res.error ? `: ${res.error}` : ''}`;
  const applied = await applyResult(
    args.supabase,
    args.deliveryId,
    nextAttempts,
    res.ok,
    errorString
  );
  return { ...applied, httpStatus: res.status };
}
