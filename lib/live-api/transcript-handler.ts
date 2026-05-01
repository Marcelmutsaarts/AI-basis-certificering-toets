/**
 * Server-side helper om een transcript-bubble in Supabase op te slaan.
 * Wordt gebruikt door /api/live-session/transcript. Vertrouwt op RLS:
 * de client moet de eigenaar zijn van de exam_session.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

export interface SaveTranscriptInput {
  supabase: SupabaseClient<Database>;
  examSessionId: string;
  speaker: 'bot' | 'docent';
  text: string;
  startedAt: string;
  endedAt?: string | null;
  sequence: number;
}

export interface SaveTranscriptResult {
  id: string;
}

export async function saveTranscript(
  input: SaveTranscriptInput
): Promise<SaveTranscriptResult> {
  const { supabase, examSessionId, speaker, text, startedAt, endedAt, sequence } =
    input;

  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Lege transcript-tekst, niet opgeslagen');
  }

  const { data, error } = await supabase
    .from('transcripts')
    .insert({
      exam_session_id: examSessionId,
      speaker,
      text: trimmed,
      started_at: startedAt,
      ended_at: endedAt ?? null,
      sequence,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Transcript niet opgeslagen: ${error.message}`);
  }
  return { id: data.id };
}
