'use client';

/**
 * Client-wrapper voor de Start-knop op /start.
 * Navigeert naar /examen via de Next router.
 */
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function StartButton() {
  const router = useRouter();

  return (
    <Button size="lg" onClick={() => router.push('/examen')}>
      Start het examen
    </Button>
  );
}
