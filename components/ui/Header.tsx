/**
 * Top-bar met AVD-branding, optionele docent-naam en log-uit-knop.
 * Server component: haalt profile via Supabase server client.
 */
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './LogoutButton';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .maybeSingle();
    fullName = profile?.full_name ?? null;
  }

  return (
    <header className="w-full bg-white border-b border-purple-light-bg">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block w-3 h-3 rounded-full bg-purple-primary"
          />
          <span className="font-semibold text-purple-dark text-lg">
            AI voor Docenten
          </span>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            {fullName ? (
              <span className="text-sm text-text-body hidden sm:inline">
                {fullName}
              </span>
            ) : null}
            <LogoutButton />
          </div>
        ) : null}
      </div>
    </header>
  );
}
