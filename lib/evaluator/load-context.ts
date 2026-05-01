/**
 * Verzamelt alle data die de evaluator nodig heeft: exam_session,
 * profiel van de docent, casuses op basis van casus_ids, transcripts
 * gesorteerd op sequence, en eventueel bestaande evaluation row.
 *
 * Doet ook de ownership check: alleen de eigenaar (of admin via RLS)
 * kan de gegevens lezen.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import type {
  EvaluatorCasus,
  EvaluatorDocent,
  EvaluatorTranscriptLine,
} from './prompt';

type EvaluationRow = Database['public']['Tables']['evaluations']['Row'];
type SessionRow = Database['public']['Tables']['exam_sessions']['Row'];

export interface EvaluationContext {
  session: SessionRow;
  docent: EvaluatorDocent;
  casuses: EvaluatorCasus[];
  transcript: EvaluatorTranscriptLine[];
  alreadyEvaluated: boolean;
  existingEvaluation: EvaluationRow | null;
}

async function loadSession(
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string
): Promise<SessionRow> {
  const { data, error } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();
  if (error || !data) {
    throw new Error('Sessie niet gevonden.');
  }
  if (data.user_id !== userId) {
    throw new Error('Geen toegang tot deze sessie.');
  }
  return data;
}

async function loadDocent(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<EvaluatorDocent> {
  const { data } = await supabase
    .from('profiles')
    .select('full_name, niveau, vakgebied, school')
    .eq('user_id', userId)
    .maybeSingle();
  if (!data) {
    throw new Error('Profiel niet gevonden.');
  }
  return {
    fullName: data.full_name,
    niveau: data.niveau,
    vakgebied: data.vakgebied,
    school: data.school,
  };
}

async function loadCasuses(
  supabase: SupabaseClient<Database>,
  ids: string[] | null
): Promise<EvaluatorCasus[]> {
  if (!ids || ids.length === 0) return [];
  const { data, error } = await supabase
    .from('casuses')
    .select('webinar, code, prompt, domains, bloom_category')
    .in('id', ids);
  if (error || !data) return [];
  return data.map((row) => ({
    webinar: row.webinar,
    code: row.code,
    prompt: row.prompt,
    domains: row.domains ?? [],
    bloomCategory: row.bloom_category,
  }));
}

async function loadTranscript(
  supabase: SupabaseClient<Database>,
  sessionId: string
): Promise<EvaluatorTranscriptLine[]> {
  const { data, error } = await supabase
    .from('transcripts')
    .select('speaker, text, sequence')
    .eq('exam_session_id', sessionId)
    .order('sequence', { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({ speaker: row.speaker, text: row.text }));
}

async function loadExistingEvaluation(
  supabase: SupabaseClient<Database>,
  sessionId: string
): Promise<EvaluationRow | null> {
  const { data } = await supabase
    .from('evaluations')
    .select('*')
    .eq('exam_session_id', sessionId)
    .maybeSingle();
  return data ?? null;
}

export async function loadEvaluationContext(
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string
): Promise<EvaluationContext> {
  const session = await loadSession(supabase, sessionId, userId);
  const existing = await loadExistingEvaluation(supabase, sessionId);
  const [docent, casuses, transcript] = await Promise.all([
    loadDocent(supabase, userId),
    loadCasuses(supabase, session.casus_ids),
    loadTranscript(supabase, sessionId),
  ]);
  return {
    session,
    docent,
    casuses,
    transcript,
    alreadyEvaluated: existing !== null,
    existingEvaluation: existing,
  };
}
