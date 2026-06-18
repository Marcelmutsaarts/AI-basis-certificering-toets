/**
 * POST /api/send-result/[sessionId]
 *
 * Verstuurt de toetsuitslag per mail naar het AVD-team via Resend. Dit is
 * een expliciete gebruikersactie vanaf het resultaatscherm, dus fouten
 * worden teruggegeven aan de client en niet stil geslikt.
 *
 * Statuscodes:
 *  401 niet geauthenticeerd
 *  404 sessie niet gevonden
 *  403 sessie is niet van deze gebruiker
 *  400 ongeldige sessie-id, geen evaluatie, of ongeldige raw_output
 *  429 te snel opnieuw versturen (binnen 60 seconden na vorige verzending)
 *  502 mail versturen mislukt
 *  200 { ok: true, sentAt }
 *
 * runtime nodejs ivm Resend-call.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import { EvaluatorOutputSchema } from '@/lib/evaluator/schema';
import { verstuurResultaat } from '@/lib/mail/send-result';
import type {
  ResultEmailPayload,
  DocentFeedback,
} from '@/lib/mail/result-email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ParamsSchema = z.object({ sessionId: z.string().uuid() });

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

type Supa = SupabaseClient<Database>;

async function loadSession(supabase: Supa, sessionId: string) {
  return supabase
    .from('exam_sessions')
    .select(
      'id, user_id, started_at, ended_at, result_email_sent_at, feedback_rating, feedback_positief, feedback_negatief'
    )
    .eq('id', sessionId)
    .maybeSingle();
}

// True als de vorige verzending minder dan 60 seconden geleden was.
function recentlySent(sentAt: string | null): boolean {
  if (!sentAt) return false;
  const verschilMs = Date.now() - new Date(sentAt).getTime();
  return verschilMs < 60_000;
}

function buildPayload(args: {
  sessionId: string;
  email: string;
  profile: { full_name: string; school: string | null; niveau: string | null; vakgebied: string | null } | null;
  output: z.infer<typeof EvaluatorOutputSchema>;
  feedback: DocentFeedback;
  voltooidOp: string;
}): ResultEmailPayload {
  const { output, profile } = args;
  const d = output.domeinen;
  return {
    docent: {
      naam: profile?.full_name ?? 'Onbekende docent',
      email: args.email,
      school: profile?.school ?? null,
      niveau: profile?.niveau ?? null,
      vakgebied: profile?.vakgebied ?? null,
    },
    uitslag: {
      passed: output.passed,
      domeinen: {
        mindset: d.mindset.score,
        ethiek: d.ethiek.score,
        kennis: d.kennis.score,
        pedagogiek: d.pedagogiek.score,
        agency: d.agency.score,
      },
      samenvatting: output.samenvatting,
      ontwikkeladvies: output.ontwikkeladvies,
    },
    feedback: args.feedback,
    voltooidOp: args.voltooidOp,
    sessionId: args.sessionId,
  };
}

export async function POST(_request: NextRequest, context: RouteContext) {
  let sessionId: string;
  try {
    sessionId = ParamsSchema.parse(await context.params).sessionId;
  } catch {
    return NextResponse.json({ error: 'Ongeldige sessie-id.' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  const { data: session } = await loadSession(supabase, sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Sessie niet gevonden.' }, { status: 404 });
  }
  if (session.user_id !== user.id) {
    return NextResponse.json({ error: 'Geen toegang tot deze sessie.' }, { status: 403 });
  }

  if (recentlySent(session.result_email_sent_at)) {
    return NextResponse.json(
      {
        error:
          'Je hebt het resultaat zojuist verstuurd. Wacht een minuut voordat je het opnieuw verstuurt.',
      },
      { status: 429 }
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, school, niveau, vakgebied')
    .eq('user_id', user.id)
    .maybeSingle();

  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('passed, raw_output')
    .eq('exam_session_id', sessionId)
    .maybeSingle();
  if (!evaluation) {
    return NextResponse.json(
      { error: 'Er is nog geen resultaat om te versturen.' },
      { status: 400 }
    );
  }

  const parsed = EvaluatorOutputSchema.safeParse(evaluation.raw_output);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Het beoordelingsresultaat is ongeldig en kan niet worden verstuurd.' },
      { status: 400 }
    );
  }

  const payload = buildPayload({
    sessionId,
    email: user.email ?? '',
    profile,
    output: parsed.data,
    feedback: {
      rating: session.feedback_rating,
      positief: session.feedback_positief,
      negatief: session.feedback_negatief,
    },
    voltooidOp: session.ended_at ?? session.started_at,
  });

  try {
    await verstuurResultaat(payload);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'onbekende fout';
    console.error('[send-result] mail versturen mislukt:', msg);
    return NextResponse.json(
      { error: 'De mail kon niet worden verstuurd. Probeer het later opnieuw.' },
      { status: 502 }
    );
  }

  const sentAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('exam_sessions')
    .update({ result_email_sent_at: sentAt })
    .eq('id', sessionId);
  if (updateError) {
    console.error('[send-result] bijwerken result_email_sent_at mislukt:', updateError.message);
  }

  return NextResponse.json({ ok: true, sentAt }, { status: 200 });
}
