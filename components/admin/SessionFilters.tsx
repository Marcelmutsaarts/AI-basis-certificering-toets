'use client';

/**
 * Filter-bar voor de examens-tab. Gebruikt searchParams via Next.js
 * router. Server-component leest de params zelf, deze client-component
 * stuurt alleen updates door via router.replace.
 */
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const NIVEAUS = ['', 'PO', 'VO', 'MBO', 'HBO', 'WO'] as const;
const PASS_OPTIONS = [
  { value: '', label: 'Alle' },
  { value: 'pass', label: 'Geslaagd' },
  { value: 'fail', label: 'Gezakt' },
] as const;

export function SessionFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const niveau = params.get('niveau') ?? '';
  const passFilter = params.get('pass') ?? '';
  const search = params.get('q') ?? '';

  function update(name: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    startTransition(() => {
      router.replace(`?${next.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap gap-3 items-end mb-4">
      <label className="flex flex-col text-xs text-text-body">
        <span className="mb-1 font-semibold uppercase tracking-wide">
          Zoek naam
        </span>
        <input
          type="search"
          defaultValue={search}
          placeholder="Naam of school"
          onChange={(e) => update('q', e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-purple-light-bg bg-white"
        />
      </label>
      <label className="flex flex-col text-xs text-text-body">
        <span className="mb-1 font-semibold uppercase tracking-wide">
          Niveau
        </span>
        <select
          value={niveau}
          onChange={(e) => update('niveau', e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-purple-light-bg bg-white"
        >
          {NIVEAUS.map((n) => (
            <option key={n} value={n}>
              {n || 'Alle'}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-xs text-text-body">
        <span className="mb-1 font-semibold uppercase tracking-wide">
          Pass/fail
        </span>
        <select
          value={passFilter}
          onChange={(e) => update('pass', e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-purple-light-bg bg-white"
        >
          {PASS_OPTIONS.map((opt) => (
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
