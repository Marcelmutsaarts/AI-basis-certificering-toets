/**
 * Server-entry voor het examen-scherm.
 *  1. Hergebruikt een lopende exam_session als die er is, anders maakt nieuwe.
 *  2. Kiest casussen via lib/bot/casuspool en slaat casus_ids op bij de sessie.
 *  3. Render ExamScreen client component met de benodigde data.
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { pickCasussen, type PickedCasus } from '@/lib/bot/casuspool';
import { ExamScreen } from '@/components/exam/ExamScreen';
import type { ExamCasus } from '@/hooks/useExamProgress';

interface PreparedSession {
  examSessionId: string;
  casussen: ExamCasus[];
}

async function ensureSession(): Promise<PreparedSession> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: existing } = await supabase
    .from('exam_sessions')
    .select('id, casus_ids')
    .eq('user_id', user.id)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing && existing.casus_ids && existing.casus_ids.length === 5) {
    const casussen = await loadCasussenByIds(supabase, existing.casus_ids);
    return { examSessionId: existing.id, casussen };
  }

  const picked = await pickCasussen(supabase);
  const casusIds = picked.map((c) => c.id);

  let sessionId: string | null = existing?.id ?? null;
  if (sessionId) {
    const { error } = await supabase
      .from('exam_sessions')
      .update({ casus_ids: casusIds })
      .eq('id', sessionId);
    if (error) throw new Error(`Sessie updaten mislukt: ${error.message}`);
  } else {
    const { data: created, error } = await supabase
      .from('exam_sessions')
      .insert({ user_id: user.id, casus_ids: casusIds, status: 'in_progress' })
      .select('id')
      .single();
    if (error || !created) {
      throw new Error(`Sessie aanmaken mislukt: ${error?.message ?? 'onbekend'}`);
    }
    sessionId = created.id;
  }

  return {
    examSessionId: sessionId,
    casussen: picked.map(toExamCasus),
  };
}

function toExamCasus(c: PickedCasus): ExamCasus {
  return { id: c.id, webinar: c.webinar, prompt: c.prompt };
}

async function loadCasussenByIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: string[]
): Promise<ExamCasus[]> {
  const { data, error } = await supabase
    .from('casuses')
    .select('id, webinar, prompt')
    .in('id', ids);
  if (error || !data) {
    throw new Error(`Casussen ophalen mislukt: ${error?.message ?? 'onbekend'}`);
  }
  return data
    .slice()
    .sort((a, b) => a.webinar - b.webinar)
    .map((row) => ({ id: row.id, webinar: row.webinar, prompt: row.prompt }));
}

export default async function ExamenPage() {
  const { examSessionId, casussen } = await ensureSession();
  return <ExamScreen examSessionId={examSessionId} casussen={casussen} />;
}
