/**
 * Layout voor het ingelogde examen-gedeelte.
 * Server component: redirect naar /login als er geen user is.
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

  return (
    <div className="min-h-screen flex flex-col bg-purple-light-bg">
      <Header />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
