/**
 * Start-scherm. Server component: laadt profile en toont welkom,
 * uitleg, privacy-tekst en Start-knop. Decoratief stippenpatroon
 * rechtsboven; achter de content via z-index.
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { DotsPattern } from '@/components/ui/DotsPattern';
import { PrivacyText } from '@/components/exam/PrivacyText';
import { StartButton } from '@/components/exam/StartButton';

export default async function StartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, niveau')
    .eq('user_id', user.id)
    .maybeSingle();

  const fullName = profile?.full_name ?? 'docent';
  const niveau = profile?.niveau ?? '';

  return (
    <main className="relative flex-1 flex items-start justify-center px-4 md:px-12 py-8 md:py-12 overflow-hidden">
      <DotsPattern position="top-right" />
      <div className="relative z-10 w-full max-w-2xl">
        <Card>
          <div className="flex flex-col gap-5 md:gap-6">
            <header>
              <h1 className="text-xl md:text-2xl font-semibold text-purple-dark">
                Welkom {fullName}
                {niveau ? `, ${niveau}` : ''}
              </h1>
            </header>

            <p className="text-sm md:text-base leading-relaxed text-text-body">
              Je gaat een mondeling examen van ongeveer 15 tot 18 minuten doen
              met AI-examinator Lieke. Ze stelt vijf casussen, een per webinar.
              Direct na afloop zie je je resultaat per AI-domein.
            </p>

            <PrivacyText />

            <div className="flex justify-center pt-2">
              <StartButton />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
