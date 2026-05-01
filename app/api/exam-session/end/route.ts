/**
 * POST /api/exam-session/end
 *
 * Sluit een examen af. Zet status naar `completed` of `abandoned`,
 * vult ended_at. Wordt aangeroepen vanuit ExamScreen op normaal einde
 * en vanuit beforeunload via navigator.sendBeacon (status `abandoned`).
 *
 * Body: { examSessionId, status?: 'completed' | 'abandoned' }
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const BodySchema = z.object({
  examSessionId: z.string().uuid(),
  status: z.enum(['completed', 'abandoned']).optional(),
});

async function readBody(request: NextRequest): Promise<unknown> {
  // sendBeacon stuurt vaak een Blob/text, fetch() stuurt JSON. We accepteren beide.
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return request.json();
  }
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  let parsed;
  try {
    const raw = await readBody(request);
    parsed = BodySchema.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Ongeldige body.' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  const targetStatus = parsed.status ?? 'completed';
  const endedAt = new Date().toISOString();

  const { error } = await supabase
    .from('exam_sessions')
    .update({ status: targetStatus, ended_at: endedAt })
    .eq('id', parsed.examSessionId)
    .eq('user_id', user.id)
    .in('status', ['in_progress']);

  if (error) {
    console.error('Sessie afsluiten mislukt', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: targetStatus, endedAt });
}
