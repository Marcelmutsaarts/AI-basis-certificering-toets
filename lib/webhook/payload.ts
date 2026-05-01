/**
 * Bouw en serialiseer de outgoing webhook payload.
 *
 * Spec: zie coder.md sectie "Webhook out". Output is een vast object
 * met event, exam_session_id, completed_at, docent, result en een
 * transcript_admin_url. We sorteren keys deterministisch zodat de
 * HMAC reproduceerbaar is bij retries.
 */
import type { EvaluatorOutput, Score } from '@/lib/evaluator/schema';

export interface PayloadDocent {
  user_id: string;
  full_name: string;
  email: string;
  school: string;
  niveau: 'PO' | 'VO' | 'MBO' | 'HBO' | 'WO';
  vakgebied: string | null;
}

export interface PayloadSession {
  id: string;
  ended_at: string | null;
  started_at: string;
}

export interface BuildPayloadArgs {
  session: PayloadSession;
  profile: PayloadDocent;
  evaluation: EvaluatorOutput;
  appUrl: string;
}

export interface WebhookPayload {
  event: 'exam_completed';
  exam_session_id: string;
  completed_at: string;
  docent: PayloadDocent;
  result: {
    passed: boolean;
    domain_scores: Record<string, Score>;
    samenvatting: string;
    ontwikkeladvies: string;
  };
  transcript_admin_url: string;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function sortObjectKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sortObjectKeys(item)) as unknown as T;
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
    }
    return out as unknown as T;
  }
  return value;
}

export function buildPayload(args: BuildPayloadArgs): WebhookPayload {
  const completedAt = args.session.ended_at ?? new Date().toISOString();
  return {
    event: 'exam_completed',
    exam_session_id: args.session.id,
    completed_at: completedAt,
    docent: args.profile,
    result: {
      passed: args.evaluation.passed,
      domain_scores: {
        mindset: args.evaluation.domeinen.mindset.score,
        ethiek: args.evaluation.domeinen.ethiek.score,
        kennis: args.evaluation.domeinen.kennis.score,
        pedagogiek: args.evaluation.domeinen.pedagogiek.score,
        agency: args.evaluation.domeinen.agency.score,
      },
      samenvatting: args.evaluation.samenvatting,
      ontwikkeladvies: args.evaluation.ontwikkeladvies,
    },
    transcript_admin_url: `${args.appUrl.replace(/\/$/, '')}/admin/sessions/${args.session.id}`,
  };
}

export function stableStringify(payload: WebhookPayload): string {
  return JSON.stringify(sortObjectKeys(payload));
}
