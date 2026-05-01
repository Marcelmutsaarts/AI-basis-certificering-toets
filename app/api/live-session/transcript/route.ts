/**
 * POST /api/live-session/transcript
 *
 * Slaat een afgeronde transcript-bubble op in Supabase. Wordt door de client
 * aangeroepen elke keer als een input- of output-transcription afsluit.
 *
 * Body: { examSessionId, speaker, text, startedAt, sequence }
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { saveTranscript } from '@/lib/live-api/transcript-handler';

const BodySchema = z.object({
  examSessionId: z.string().uuid(),
  speaker: z.enum(['bot', 'docent']),
  text: z.string().min(1).max(20_000),
  startedAt: z.string().min(1),
  endedAt: z.string().min(1).optional(),
  sequence: z.number().int().nonnegative(),
});

export async function POST(request: NextRequest) {
  let parsed;
  try {
    const json = await request.json();
    parsed = BodySchema.parse(json);
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

  try {
    const result = await saveTranscript({
      supabase,
      examSessionId: parsed.examSessionId,
      speaker: parsed.speaker,
      text: parsed.text,
      startedAt: parsed.startedAt,
      endedAt: parsed.endedAt,
      sequence: parsed.sequence,
    });
    return NextResponse.json({ id: result.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Onbekende fout';
    console.error('Transcript opslaan mislukt', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
