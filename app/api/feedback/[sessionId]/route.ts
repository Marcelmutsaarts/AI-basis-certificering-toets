/**
 * POST /api/feedback/[sessionId]
 *
 * Slaat de gestructureerde docent-feedback over de toetsvorm op bij de
 * exam_session. Wordt aangeroepen vanaf de nakijk-flow vlak voordat de
 * docent de uitslag onthult. Feedback is optioneel, dus alle velden mogen
 * leeg zijn.
 *
 * Statuscodes:
 *  401 niet geauthenticeerd
 *  400 ongeldige sessie-id of body
 *  404 sessie niet gevonden
 *  403 sessie is niet van deze gebruiker
 *  500 opslaan mislukt
 *  200 { ok: true }
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const ParamsSchema = z.object({ sessionId: z.string().uuid() });

const BodySchema = z.object({
  rating: z.number().int().min(1).max(5).nullable(),
  positief: z.string().max(2000).nullable(),
  negatief: z.string().max(2000).nullable(),
});

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

// Trimt tekst en maakt een lege string null, zodat we geen lege strings opslaan.
function schoon(value: string | null): string | null {
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: NextRequest, context: RouteContext) {
  let sessionId: string;
  try {
    sessionId = ParamsSchema.parse(await context.params).sessionId;
  } catch {
    return NextResponse.json({ error: 'Ongeldige sessie-id.' }, { status: 400 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Ongeldige feedback.' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  const { data: session } = await supabase
    .from('exam_sessions')
    .select('id, user_id')
    .eq('id', sessionId)
    .maybeSingle();
  if (!session) {
    return NextResponse.json({ error: 'Sessie niet gevonden.' }, { status: 404 });
  }
  if (session.user_id !== user.id) {
    return NextResponse.json({ error: 'Geen toegang tot deze sessie.' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('exam_sessions')
    .update({
      feedback_rating: body.rating,
      feedback_positief: schoon(body.positief),
      feedback_negatief: schoon(body.negatief),
      feedback_submitted_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    console.error('[api/feedback] opslaan mislukt', { sessionId, error: error?.message });
    return NextResponse.json({ error: 'Feedback opslaan mislukt.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
