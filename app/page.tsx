/**
 * Root-pagina. Server component die alleen redirect.
 * Ingelogd: /start. Anders: /login.
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/start');
  }
  redirect('/login');
}
