/**
 * Welkomstpagina voor de eerste login. Eigen route-segment (NIET onder de
 * (exam)-group) zodat de onboarding-gate in de exam-layout geen redirect-loop
 * maakt. Server component: stuurt door op basis van de profielstatus en toont
 * anders het onboarding-formulier.
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { DotsPattern } from '@/components/ui/DotsPattern';
import { OnboardingForm } from '@/components/exam/OnboardingForm';

export default async function WelkomPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school, niveau')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profile?.role === 'admin') {
    redirect('/admin');
  }

  if (profile?.school && profile?.niveau) {
    redirect('/start');
  }

  return (
    <main className="relative min-h-screen flex items-start justify-center px-4 md:px-12 py-8 md:py-12 overflow-hidden bg-purple-light-bg">
      <DotsPattern position="top-right" />
      <div className="relative z-10 w-full max-w-2xl">
        <Card>
          <div className="flex flex-col gap-5 md:gap-6">
            <header>
              <h1 className="text-xl md:text-2xl font-semibold text-purple-dark">
                Welkom bij het examen
              </h1>
              <p className="text-sm md:text-base leading-relaxed text-text-body mt-2">
                Voordat je begint, vragen we kort om je school en je
                onderwijsniveau. Daarna ga je verder naar de startpagina.
              </p>
            </header>

            <OnboardingForm />
          </div>
        </Card>
      </div>
    </main>
  );
}
