/**
 * Admin sessie-detail. Toont profiel, sessie-metadata, transcript,
 * evaluation (raw_output) en webhook deliveries voor deze sessie.
 *
 * Service-role nodig om profiles van andere users te lezen en de
 * webhook_deliveries (RLS: admin-only).
 */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { Card } from '@/components/ui/Card';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { SessionDetailHeader } from '@/components/admin/SessionDetailHeader';
import { TranscriptList } from '@/components/admin/TranscriptList';
import { WebhookStatus } from '@/components/admin/WebhookStatus';
import { RetryButton } from '@/components/admin/RetryButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function AdminSessionDetailPage({ params }: PageProps) {
  const { sessionId } = await params;
  const writer = createServiceRoleClient();

  const { data: session } = await writer
    .from('exam_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();
  if (!session) notFound();

  const { data: profile } = await writer
    .from('profiles')
    .select('full_name, role, school, niveau, vakgebied')
    .eq('user_id', session.user_id)
    .maybeSingle();

  const { data: authUser } = await writer.auth.admin.getUserById(
    session.user_id
  );
  const email = authUser?.user?.email ?? '';

  const [{ data: transcripts }, { data: evaluation }, { data: deliveries }] =
    await Promise.all([
      writer
        .from('transcripts')
        .select('id, speaker, text, started_at, sequence')
        .eq('exam_session_id', sessionId)
        .order('sequence', { ascending: true }),
      writer
        .from('evaluations')
        .select('*')
        .eq('exam_session_id', sessionId)
        .maybeSingle(),
      writer
        .from('webhook_deliveries')
        .select('*')
        .eq('exam_session_id', sessionId)
        .order('created_at', { ascending: false }),
    ]);

  return (
    <>
      <AdminTabs active="examens" />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
          <Link
            href="/admin"
            className="text-sm text-purple-dark underline w-fit"
          >
            Terug naar examens
          </Link>

          <SessionDetailHeader
            fullName={profile?.full_name ?? '-'}
            email={email}
            school={profile?.school ?? '-'}
            niveau={profile?.niveau ?? 'VO'}
            vakgebied={profile?.vakgebied ?? null}
            role={profile?.role ?? 'docent'}
            startedAt={session.started_at}
            endedAt={session.ended_at}
            status={session.status}
            sessionId={session.id}
          />

          <Card padding="md">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="text-lg font-semibold text-purple-dark">
                Webhook deliveries
              </h2>
              <Link
                href={`/transcript/${sessionId}`}
                className="text-xs text-purple-dark underline"
              >
                Publieke transcript-pagina
              </Link>
            </div>
            <ul className="flex flex-col gap-3">
              {(deliveries ?? []).length === 0 ? (
                <li className="text-sm text-text-body/70">
                  Nog geen delivery aangemaakt.
                </li>
              ) : (
                (deliveries ?? []).map((d) => (
                  <li
                    key={d.id}
                    className="flex items-start justify-between gap-3 border-b border-purple-light-bg/60 pb-3"
                  >
                    <WebhookStatus
                      status={d.status}
                      attempts={d.attempts}
                      lastError={d.last_error}
                      skippedReason={d.skipped_reason}
                    />
                    {d.status === 'pending' || d.status === 'failed' ? (
                      <RetryButton deliveryId={d.id} size="md" />
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </Card>

          <Card padding="md">
            <h2 className="text-lg font-semibold text-purple-dark mb-3">
              Evaluation
            </h2>
            {evaluation ? (
              <div className="flex flex-col gap-2">
                <div className="text-xs text-text-body/70">
                  Model: {evaluation.model_used} | Passed:{' '}
                  {evaluation.passed ? 'ja' : 'nee'}
                </div>
                <pre className="text-xs whitespace-pre-wrap break-words bg-purple-light-bg/40 p-3 rounded-md max-h-96 overflow-auto">
                  {JSON.stringify(evaluation.raw_output, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-sm text-text-body/70">
                Nog geen evaluatie beschikbaar.
              </p>
            )}
          </Card>

          <Card padding="md">
            <h2 className="text-lg font-semibold text-purple-dark mb-3">
              Transcript
            </h2>
            <TranscriptList rows={transcripts ?? []} />
          </Card>
        </div>
      </main>
    </>
  );
}
