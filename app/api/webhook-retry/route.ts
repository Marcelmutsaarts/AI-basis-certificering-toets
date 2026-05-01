/**
 * GET /api/webhook-retry
 *
 * Vercel Cron route. Loopt elke 5 minuten en doet een retry-batch op
 * webhook_deliveries die status pending of failed hebben en waarvan de
 * delay-window verstreken is. Authenticatie via Vercel Cron header
 * (`x-vercel-cron`) of `Authorization: Bearer <CRON_SECRET>`.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { runRetryBatch } from '@/lib/webhook/retry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  if (req.headers.get('x-vercel-cron')) return true;
  const auth = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (auth && secret && auth === `Bearer ${secret}`) return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }
  try {
    const writer = createServiceRoleClient();
    const summary = await runRetryBatch(writer);
    return NextResponse.json({ ok: true, ...summary }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'onbekend';
    console.error('[api/webhook-retry] batch failure', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
