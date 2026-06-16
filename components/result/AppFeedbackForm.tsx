'use client';

/**
 * Facultatief feedbackveld op het resultaatscherm. De docent kan vrije tekst
 * achterlaten met feedback over de app. De waarde wordt opgeslagen op
 * exam_sessions.app_feedback via de browser-client. De RLS-policy
 * sessions_own_update staat de eigen sessie-update toe.
 *
 * De opslag-logica zit in saveAppFeedback zodat een latere verstuurknop
 * (Resend-mail) exact dezelfde opslag kan hergebruiken.
 */
import { useState, type FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface AppFeedbackFormProps {
  sessionId: string;
  initialFeedback: string | null;
}

/**
 * Slaat de app-feedback op exam_sessions op. Lege of whitespace-only tekst
 * wordt als null opgeslagen (wist de feedback). Geeft true bij een echte
 * geraakte rij, false bij een update-fout of 0 geraakte rijen.
 */
export async function saveAppFeedback(
  supabase: SupabaseClient<Database>,
  sessionId: string,
  value: string
): Promise<boolean> {
  const trimmed = value.trim();
  const { data, error } = await supabase
    .from('exam_sessions')
    .update({ app_feedback: trimmed.length > 0 ? trimmed : null })
    .eq('id', sessionId)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return false;
  }
  return true;
}

type Status = 'idle' | 'pending' | 'saved' | 'error';

export function AppFeedbackForm({
  sessionId,
  initialFeedback,
}: AppFeedbackFormProps) {
  const supabase = createClient();
  const [feedback, setFeedback] = useState(initialFeedback ?? '');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('pending');
    const ok = await saveAppFeedback(supabase, sessionId, feedback);
    setStatus(ok ? 'saved' : 'error');
  }

  return (
    <Card padding="md">
      <h2 className="text-base md:text-lg font-semibold text-purple-dark mb-2">
        Feedback over de app, optioneel
      </h2>
      <p className="text-sm text-text-body mb-3">
        Je mag dit veld leeg laten. Je opmerkingen helpen ons de app te
        verbeteren.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <label htmlFor="app-feedback" className="sr-only">
          Feedback over de app
        </label>
        <textarea
          id="app-feedback"
          value={feedback}
          onChange={(event) => {
            setFeedback(event.target.value);
            if (status !== 'idle') setStatus('idle');
          }}
          rows={4}
          className="rounded-xl border border-purple-primary/20 px-4 py-3 text-base text-text-body focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/30"
          placeholder="Wat ging goed, wat kan beter?"
        />
        {status === 'error' ? (
          <p
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            Je feedback kon niet worden opgeslagen. Probeer het later opnieuw.
          </p>
        ) : null}
        {status === 'saved' ? (
          <p className="text-sm text-purple-dark font-medium">
            Bedankt voor je feedback.
          </p>
        ) : null}
        <Button
          type="submit"
          variant="secondary"
          size="md"
          disabled={status === 'pending'}
          className="min-h-[44px] self-start"
        >
          {status === 'pending' ? 'Bezig met opslaan' : 'Opslaan'}
        </Button>
      </form>
    </Card>
  );
}
