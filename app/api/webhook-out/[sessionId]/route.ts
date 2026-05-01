/**
 * POST /api/webhook-out/[sessionId]
 *
 * Manuele trigger vanuit het admin dashboard. Vereist een admin user.
 * In de happy path wordt de webhook al getriggerd vanuit de evaluate
 * route (via lib/webhook/trigger). Deze route is voor handmatige (re)trigger.
 *
 * Cron-pad: /api/webhook-retry. Daar staat de batch logica.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { triggerWebhookForSession } from '@/lib/webhook/trigger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const ParamsSchema = z.object({ sessionId: z.string().uuid() });

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

async function isCallerAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();
  return data?.role === 'admin';
}

export async function POST(_req: NextRequest, context: RouteContext) {
  let sessionId: string;
  try {
    const raw = await context.params;
    sessionId = ParamsSchema.parse(raw).sessionId;
  } catch {
    return NextResponse.json({ error: 'Ongeldige sessie-id.' }, { status: 400 });
  }
  const ok = await isCallerAdmin();
  if (!ok) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }
  const writer = createServiceRoleClient();
  try {
    const outcome = await triggerWebhookForSession(writer, sessionId);
    return NextResponse.json({ ok: true, outcome }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'onbekend';
    console.error('[api/webhook-out] trigger failure', { sessionId, msg });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
