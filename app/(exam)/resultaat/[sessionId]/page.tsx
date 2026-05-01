/**
 * Resultaatscherm. Server component:
 *  - auth + ownership check
 *  - leest evaluations row. Bestaat -> render rubric.
 *  - Bestaat niet -> render EvaluatorTrigger (client) die /api/evaluate
 *    aanroept en bij succes router.refresh() draait. Server route is
 *    idempotent, dus dubbele triggers leveren niet dubbele rows op.
 */
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { DotsPattern } from '@/components/ui/DotsPattern';
import { PassFailHeader } from '@/components/result/PassFailHeader';
import { DomainList } from '@/components/result/DomainList';
import { EvaluatorTrigger } from '@/components/result/EvaluatorTrigger';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  EvaluatorOutputSchema,
  type EvaluatorOutput,
} from '@/lib/evaluator/schema';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ResultaatPage({ params }: PageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: session } = await supabase
    .from('exam_sessions')
    .select('id, user_id, status')
    .eq('id', sessionId)
    .maybeSingle();
  if (!session) notFound();
  if (session.user_id !== user.id) {
    return <NoAccessView />;
  }

  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('*')
    .eq('exam_session_id', sessionId)
    .maybeSingle();

  if (!evaluation) {
    return (
      <main className="relative flex-1 flex items-start justify-center px-4 md:px-12 py-8 md:py-12 overflow-hidden">
        <DotsPattern position="right" />
        <div className="relative z-10 w-full max-w-2xl">
          <ErrorBoundary>
            <EvaluatorTrigger sessionId={sessionId} />
          </ErrorBoundary>
        </div>
      </main>
    );
  }

  const parsed = EvaluatorOutputSchema.safeParse(evaluation.raw_output);
  if (!parsed.success) {
    console.error('[resultaat] raw_output invalid', parsed.error.issues);
    return <RenderFallbackError />;
  }

  return <ResultBody output={parsed.data} sessionId={sessionId} />;
}

function ResultBody({
  output,
  sessionId,
}: {
  output: EvaluatorOutput;
  sessionId: string;
}) {
  return (
    <main className="relative flex-1 px-4 md:px-12 py-8 md:py-12 overflow-hidden">
      <DotsPattern position="right" />
      <div className="relative z-10 mx-auto w-full max-w-2xl flex flex-col gap-5 md:gap-6">
        <PassFailHeader passed={output.passed} />
        <Card padding="md">
          <h2 className="text-base md:text-lg font-semibold text-purple-dark mb-3">
            Samenvatting
          </h2>
          <p className="text-sm leading-relaxed text-text-body whitespace-pre-wrap">
            {output.samenvatting}
          </p>
        </Card>
        <section aria-label="Rubric per domein">
          <h2 className="sr-only">Beoordeling per domein</h2>
          <DomainList domeinen={output.domeinen} />
        </section>
        <Card padding="md">
          <h2 className="text-base md:text-lg font-semibold text-purple-dark mb-3">
            Ontwikkeladvies
          </h2>
          <p className="text-sm leading-relaxed text-text-body whitespace-pre-wrap">
            {output.ontwikkeladvies}
          </p>
        </Card>
        <div className="flex flex-col sm:flex-row sm:justify-center gap-3 pt-2">
          <Link
            href={`/transcript/${sessionId}`}
            className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 text-base bg-white text-purple-dark border border-purple-primary hover:bg-purple-light-bg transition-colors min-h-[44px]"
          >
            Bekijk volledig transcript
          </Link>
          <Link
            href="/start"
            className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 text-base text-purple-dark hover:bg-white transition-colors min-h-[44px]"
          >
            Terug naar startscherm
          </Link>
        </div>
      </div>
    </main>
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

function RenderFallbackError() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <Card>
        <div className="flex flex-col gap-3">
          <p className="text-text-body">
            Er ging iets mis met de beoordeling. Neem contact op met de
            examencommissie.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 text-base bg-purple-primary text-white hover:bg-purple-dark transition-colors min-h-[44px] self-start"
          >
            Terug naar startscherm
          </Link>
        </div>
      </Card>
    </main>
  );
}
