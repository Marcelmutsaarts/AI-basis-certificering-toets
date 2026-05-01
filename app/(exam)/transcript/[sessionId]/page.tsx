/**
 * Transcript-pagina. Server component:
 *  - auth + ownership check
 *  - leest transcripts (ASC op sequence) en casuses
 *  - rendert chronologisch: bot links (paars), docent rechts (lichtpaars)
 *  - print-friendly basis-styling
 */
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

interface TranscriptRow {
  id: string;
  speaker: 'bot' | 'docent';
  text: string;
  started_at: string;
  sequence: number;
}

interface CasusRow {
  webinar: number;
  code: string;
  prompt: string;
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default async function TranscriptPage({ params }: PageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: session } = await supabase
    .from('exam_sessions')
    .select('id, user_id, started_at, casus_ids')
    .eq('id', sessionId)
    .maybeSingle();
  if (!session) notFound();
  if (session.user_id !== user.id) {
    return <NoAccessView />;
  }

  const [{ data: rows }, { data: casuses }] = await Promise.all([
    supabase
      .from('transcripts')
      .select('id, speaker, text, started_at, sequence')
      .eq('exam_session_id', sessionId)
      .order('sequence', { ascending: true }),
    loadCasuses(supabase, session.casus_ids),
  ]);

  return (
    <TranscriptBody
      sessionId={sessionId}
      startedAt={session.started_at}
      rows={(rows ?? []) as TranscriptRow[]}
      casuses={casuses}
    />
  );
}

async function loadCasuses(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: string[] | null
): Promise<{ data: CasusRow[] }> {
  if (!ids || ids.length === 0) return { data: [] };
  const { data } = await supabase
    .from('casuses')
    .select('webinar, code, prompt')
    .in('id', ids);
  const sorted = (data ?? []).slice().sort((a, b) => a.webinar - b.webinar);
  return { data: sorted };
}

function TranscriptBody({
  sessionId,
  startedAt,
  rows,
  casuses,
}: {
  sessionId: string;
  startedAt: string;
  rows: TranscriptRow[];
  casuses: CasusRow[];
}) {
  return (
    <main className="flex-1 px-4 py-10 print:py-2">
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 print:gap-3">
        <header className="flex items-start justify-between gap-3 print:gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-purple-dark">
              Transcript
            </h1>
            <p className="text-sm text-text-body/80">
              Examen gestart op {formatDateTime(startedAt)}
            </p>
          </div>
          <Link
            href={`/resultaat/${sessionId}`}
            className="text-sm text-purple-dark underline print:hidden"
          >
            Terug naar uitslag
          </Link>
        </header>

        {casuses.length > 0 ? (
          <Card padding="md">
            <h2 className="text-sm font-semibold text-purple-dark mb-2">
              Gestelde casussen
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-text-body">
              {casuses.map((c) => (
                <li key={c.code}>
                  <span className="font-mono text-xs mr-2 text-purple-dark/70">
                    W{c.webinar}.{c.code}
                  </span>
                  {c.prompt}
                </li>
              ))}
            </ol>
          </Card>
        ) : null}

        <Card padding="md">
          <h2 className="text-sm font-semibold text-purple-dark mb-3 print:mb-1">
            Volledig gesprek
          </h2>
          <ul className="flex flex-col gap-3">
            {rows.length === 0 ? (
              <li className="text-sm text-text-body/70">
                Geen transcript beschikbaar.
              </li>
            ) : (
              rows.map((row) => <Bubble key={row.id} row={row} />)
            )}
          </ul>
        </Card>
      </div>
    </main>
  );
}

function Bubble({ row }: { row: TranscriptRow }) {
  const isBot = row.speaker === 'bot';
  const align = isBot ? 'justify-start' : 'justify-end';
  const bubbleClass = isBot
    ? 'bg-purple-primary text-white rounded-2xl rounded-bl-sm'
    : 'bg-purple-light-bg text-text-body rounded-2xl rounded-br-sm border border-purple-primary/15';
  const label = isBot ? 'Lieke' : 'Docent';
  return (
    <li className={`flex ${align} print:justify-start print:bg-white`}>
      <div className="max-w-[80%] print:max-w-full">
        <span className="block text-[11px] uppercase tracking-wide text-text-body/60 mb-1 print:text-black">
          {label}
          <span className="mx-1.5">{'\u00b7'}</span>
          {formatDateTime(row.started_at)}
        </span>
        <div
          className={`px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${bubbleClass} print:bg-white print:text-black print:border print:shadow-none`}
        >
          {row.text}
        </div>
      </div>
    </li>
  );
}

function NoAccessView() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <Card>
        <p className="text-text-body">Geen toegang tot deze sessie.</p>
      </Card>
    </main>
  );
}
