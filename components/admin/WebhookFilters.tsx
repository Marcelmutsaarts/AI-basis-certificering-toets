'use client';

/**
 * Filter-bar voor de webhooks-tab. Status-dropdown.
 */
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const STATUS_OPTIONS = [
  { value: '', label: 'Alle' },
  { value: 'sent', label: 'Verzonden' },
  { value: 'pending', label: 'In wacht' },
  { value: 'failed', label: 'Mislukt' },
  { value: 'skipped', label: 'Geskipt' },
] as const;

export function WebhookFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const status = params.get('status') ?? '';

  function update(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set('status', value);
    else next.delete('status');
    startTransition(() => {
      router.replace(`?${next.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap gap-3 items-end mb-4">
      <label className="flex flex-col text-xs text-text-body">
        <span className="mb-1 font-semibold uppercase tracking-wide">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => update(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-purple-light-bg bg-white"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      {pending ? (
        <span className="text-xs text-text-body/60 self-center">
          Bezig...
        </span>
      ) : null}
    </div>
  );
}
