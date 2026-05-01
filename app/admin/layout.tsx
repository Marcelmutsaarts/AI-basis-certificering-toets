/**
 * Admin layout.
 * Server component: redirect niet-ingelogde gebruikers naar /login,
 * niet-admins (docent/tester) naar /start.
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/ui/Header';

export default async function AdminLayout({
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
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') {
    redirect('/start');
  }

  return (
    <div className="min-h-screen flex flex-col bg-purple-light-bg">
      <Header />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
