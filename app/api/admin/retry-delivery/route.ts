/**
 * POST /api/admin/retry-delivery
 *
 * Body: { deliveryId: uuid }
 * Auth: ingelogde admin user. Doet een directe retry op de delivery
 * zonder attempts te resetten. Webhook-secret en URL komen uit env.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { retryDelivery } from '@/lib/webhook/retry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const BodySchema = z.object({ deliveryId: z.string().uuid() });

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

export async function POST(req: NextRequest) {
  const ok = await isCallerAdmin();
  if (!ok) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }
  let deliveryId: string;
  try {
    const json = await req.json();
    deliveryId = BodySchema.parse(json).deliveryId;
  } catch {
    return NextResponse.json({ error: 'Ongeldige body.' }, { status: 400 });
  }

  const writer = createServiceRoleClient();
  const { data: delivery, error } = await writer
    .from('webhook_deliveries')
    .select('*')
    .eq('id', deliveryId)
    .maybeSingle();
  if (error || !delivery) {
    return NextResponse.json(
      { error: 'Delivery niet gevonden.' },
      { status: 404 }
    );
  }
  try {
    const result = await retryDelivery({ supabase: writer, delivery });
    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'onbekend';
    console.error('[api/admin/retry-delivery] failure', { deliveryId, msg });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
