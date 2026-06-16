/**
 * Layout voor het ingelogde examen-gedeelte.
 * Server component: redirect naar /login als er geen user is. Daarna een
 * onboarding-gate: iedereen zonder school of niveau gaat eerst naar /welkom om
 * die in te vullen, ook admins. De route /welkom valt buiten deze layout, dus
 * er ontstaat geen redirect-loop.
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/ui/Header';

export default async function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (!profile?.school || !profile?.niveau) {
    redirect('/welkom');
  }

  return (
    <div className="min-h-screen flex flex-col bg-purple-light-bg">
      <Header />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
