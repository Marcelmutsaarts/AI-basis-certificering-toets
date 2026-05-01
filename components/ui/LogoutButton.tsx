'use client';

/**
 * Client-side log-uit knop. Postet naar /api/auth/logout en volgt
 * de redirect naar /login.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout fout', error);
      setPending(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleLogout}
      disabled={pending}
    >
      {pending ? 'Bezig met uitloggen' : 'Uitloggen'}
    </Button>
  );
}
