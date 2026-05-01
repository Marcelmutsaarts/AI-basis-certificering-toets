'use client';

/**
 * Retry-knop voor een specifieke webhook delivery.
 * Doet een POST naar /api/admin/retry-delivery met deliveryId in de body
 * en triggert een router refresh op succes zodat de tabel updatet.
 */
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export interface RetryButtonProps {
  deliveryId: string;
  size?: 'sm' | 'md';
}

export function RetryButton({ deliveryId, size = 'sm' }: RetryButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sizeClass =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : 'px-4 py-2 text-sm';

  async function onClick() {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/admin/retry-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? 'Retry mislukt.');
        setBusy(false);
        return;
      }
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'onbekende fout');
    } finally {
      setBusy(false);
    }
  }

  const disabled = busy || pending;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${sizeClass} font-semibold rounded-md bg-purple-primary text-white hover:bg-purple-dark disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {disabled ? 'Bezig...' : 'Retry'}
      </button>
      {error ? (
        <span className="text-[11px] text-red-700">{error}</span>
      ) : null}
    </div>
  );
}
