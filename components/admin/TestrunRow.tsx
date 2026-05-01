/**
 * Eén rij in de admin testruns-tab.
 * Zelfde data als SessionRow maar met geel "TEST" label naast de naam.
 */
import Link from 'next/link';
import type { SessionRowData } from './SessionRow';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function PassFailPill({ passed }: { passed: boolean | null }) {
  if (passed === null) {
    return <span className="text-[11px] text-text-body/60">-</span>;
  }
  const cls = passed
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase rounded-full ${cls}`}
    >
      {passed ? 'Geslaagd' : 'Gezakt'}
    </span>
  );
}

export function TestrunRow({ data }: { data: SessionRowData }) {
  return (
    <tr className="border-b border-purple-light-bg/60 hover:bg-purple-light-bg/30">
      <td className="px-3 py-3 text-sm text-text-body whitespace-nowrap">
        {formatDate(data.startedAt)}
      </td>
      <td className="px-3 py-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-sm bg-yellow-200 text-yellow-900 border border-yellow-300">
            TEST
          </span>
          <Link
            href={`/admin/sessions/${data.id}`}
            className="font-medium text-purple-dark underline"
          >
            {data.fullName}
          </Link>
        </div>
        <div className="text-xs text-text-body/70">{data.school}</div>
      </td>
      <td className="px-3 py-3 text-sm text-text-body">{data.niveau}</td>
      <td className="px-3 py-3 text-sm text-text-body capitalize">
        {data.status.replace('_', ' ')}
      </td>
      <td className="px-3 py-3">
        <PassFailPill passed={data.passed} />
      </td>
    </tr>
  );
}
