'use client';

/**
 * Login-scherm. Email plus wachtwoord, onSubmit met preventDefault.
 * Bij succes: update profiles.last_login_at, dan replace naar /start.
 * Bij fout: error-state boven het formulier.
 */
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Vul je e-mailadres en wachtwoord in.');
      return;
    }

    setPending(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email: email.trim(), password }
    );

    if (signInError || !data.user) {
      setPending(false);
      setError('Inloggen mislukt. Controleer je e-mailadres en wachtwoord.');
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_id', data.user.id);
    if (updateError) {
      console.error('Kon last_login_at niet bijwerken', updateError);
    }

    router.replace('/start');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 md:px-12 py-8 md:py-12 bg-purple-light-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-purple-dark">
            AI voor Docenten
          </h1>
          <p className="text-sm text-text-body mt-1">
            Mondeling examen, basiscertificaat AI-Geletterd
          </p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <h2 className="text-base md:text-lg font-semibold text-text-body">
              Inloggen
            </h2>

            {error ? (
              <div
                role="alert"
                className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            ) : null}

            <label className="flex flex-col gap-1 text-sm text-text-body">
              <span className="font-medium">E-mailadres</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-purple-light-bg px-4 py-3 text-base focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/30"
                placeholder="naam@school.nl"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-text-body">
              <span className="font-medium">Wachtwoord</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl border border-purple-light-bg px-4 py-3 text-base focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/30"
              />
            </label>

            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="mt-2 min-h-[44px]"
            >
              {pending ? 'Bezig met inloggen' : 'Inloggen'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
