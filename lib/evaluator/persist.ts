/**
 * Schrijft evaluator-output naar de evaluations-tabel en zet
 * exam_sessions.status op 'evaluated'.
 *
 * Idempotent: gebruikt het uniqueness-constraint op exam_session_id om
 * dubbele inserts via concurrent triggers te voorkomen. Bij duplicate
 * key (23505) leest de functie de bestaande row en retourneert die.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '@/lib/supabase/types';
import { isPassed, type DomainScores } from './pass-criterium';
import type { EvaluatorOutput } from './schema';

export interface PersistArgs {
  supabase: SupabaseClient<Database>;
  examSessionId: string;
  output: EvaluatorOutput;
  modelUsed: string;
}

type EvaluationRow = Database['public']['Tables']['evaluations']['Row'];
type EvaluationInsert = Database['public']['Tables']['evaluations']['Insert'];

const UNIQUE_VIOLATION = '23505';

function deriveScores(output: EvaluatorOutput): DomainScores {
  return {
    mindset: output.domeinen.mindset.score,
    ethiek: output.domeinen.ethiek.score,
    kennis: output.domeinen.kennis.score,
    pedagogiek: output.domeinen.pedagogiek.score,
    agency: output.domeinen.agency.score,
  };
}

function buildInsertRow(args: PersistArgs, scores: DomainScores): EvaluationInsert {
  return {
    exam_session_id: args.examSessionId,
    model_used: args.modelUsed,
    raw_output: args.output as unknown as Json,
    mindset_score: scores.mindset,
    ethiek_score: scores.ethiek,
    kennis_score: scores.kennis,
    pedagogiek_score: scores.pedagogiek,
    agency_score: scores.agency,
    passed: isPassed(scores),
  };
}

async function fetchExisting(
  supabase: SupabaseClient<Database>,
  examSessionId: string
): Promise<EvaluationRow | null> {
  const { data } = await supabase
    .from('evaluations')
    .select('*')
    .eq('exam_session_id', examSessionId)
    .maybeSingle();
  return data ?? null;
}

async function markSessionEvaluated(
  supabase: SupabaseClient<Database>,
  examSessionId: string
): Promise<void> {
  const { error } = await supabase
    .from('exam_sessions')
    .update({ status: 'evaluated' })
    .eq('id', examSessionId);
  if (error) {
    console.error('[persist] status -> evaluated mislukt', error.message);
  }
}

export async function persistEvaluation(
  args: PersistArgs
): Promise<EvaluationRow> {
  const scores = deriveScores(args.output);
  const insert = buildInsertRow(args, scores);

  const { data, error } = await args.supabase
    .from('evaluations')
    .insert(insert)
    .select('*')
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      const existing = await fetchExisting(args.supabase, args.examSessionId);
      if (existing) {
        await markSessionEvaluated(args.supabase, args.examSessionId);
        return existing;
      }
    }
    console.error('[persist] insert evaluation mislukt', error.message);
    throw new Error(`Evaluatie opslaan mislukt: ${error.message}`);
  }

  await markSessionEvaluated(args.supabase, args.examSessionId);
  return data;
}
