/**
 * POST /api/evaluate/[sessionId]
 *
 * Triggert de evaluator voor een afgeronde exam_session. Auth + ownership
 * check, leest transcripts/casuses/profiel, bouwt prompt, roept OpenRouter
 * aan, persistert. Idempotent via unique constraint op
 * evaluations.exam_session_id (zie lib/evaluator/persist.ts).
 *
 * runtime nodejs ivm 60s timeout en grote response.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { buildEvaluatorPrompt, type EvaluatorCasus } from '@/lib/evaluator/prompt';
import {
  callEvaluator,
  resolveEvaluatorModel,
} from '@/lib/evaluator/call-openrouter';
import { persistEvaluation } from '@/lib/evaluator/persist';
import { loadEvaluationContext } from '@/lib/evaluator/load-context';
import { triggerWebhookForSession } from '@/lib/webhook/trigger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ParamsSchema = z.object({ sessionId: z.string().uuid() });

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
  let sessionId: string;
  try {
    const raw = await context.params;
    sessionId = ParamsSchema.parse(raw).sessionId;
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

  let ctx;
  try {
    ctx = await loadEvaluationContext(supabase, sessionId, user.id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'onbekend';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (ctx.alreadyEvaluated) {
    return NextResponse.json(
      { ok: true, evaluation: ctx.existingEvaluation },
      { status: 200 }
    );
  }

  if (ctx.session.status !== 'completed') {
    return NextResponse.json(
      { error: `Sessie heeft status '${ctx.session.status}', kan niet evalueren.` },
      { status: 409 }
    );
  }

  const model = resolveEvaluatorModel();
  const { system, user: userPrompt } = buildEvaluatorPrompt({
    transcript: ctx.transcript,
    docent: ctx.docent,
    casuses: ctx.casuses as EvaluatorCasus[],
  });

  try {
    const output = await callEvaluator({ system, user: userPrompt, model });
    const writer = createServiceRoleClient();
    const row = await persistEvaluation({
      supabase: writer,
      examSessionId: sessionId,
      output,
      modelUsed: model,
    });
    // Fire-and-forget: webhook fails mogen evaluator-response niet breken.
    triggerWebhookForSession(writer, sessionId).catch((err) => {
      const msg = err instanceof Error ? err.message : 'unknown';
      console.error('[api/evaluate] webhook trigger failed', { sessionId, msg });
    });
    return NextResponse.json({ ok: true, evaluation: row }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'onbekende fout';
    console.error('[api/evaluate] evaluator failure', { sessionId, msg });
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
