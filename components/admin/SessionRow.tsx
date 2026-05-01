/**
 * Eén rij in de admin examens-tab.
 * Toont datum, docent, school, niveau, status en pass/fail.
 * Klikbaar naar de sessie-detailpagina.
 */
import Link from 'next/link';
import type { Database } from '@/lib/supabase/types';

type Status = Database['public']['Enums']['exam_status'];
type Niveau = Database['public']['Enums']['onderwijsniveau'];

export interface SessionRowData {
  id: string;
  startedAt: string;
  status: Status;
  fullName: string;
  school: string;
  niveau: Niveau;
  passed: boolean | null;
}

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

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    in_progress: 'bg-purple-light-bg text-purple-dark',
    completed: 'bg-purple-100 text-purple-800',
    abandoned: 'bg-gray-100 text-gray-700',
    evaluated: 'bg-purple-200 text-purple-900',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase rounded-full ${map[status]}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
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

export function SessionRow({ data }: { data: SessionRowData }) {
  return (
    <tr className="border-b border-purple-light-bg/60 hover:bg-purple-light-bg/30">
      <td className="px-3 py-3 text-sm text-text-body whitespace-nowrap">
        {formatDate(data.startedAt)}
      </td>
      <td className="px-3 py-3 text-sm">
        <Link
          href={`/admin/sessions/${data.id}`}
          className="font-medium text-purple-dark underline"
        >
          {data.fullName}
        </Link>
        <div className="text-xs text-text-body/70">{data.school}</div>
      </td>
      <td className="px-3 py-3 text-sm text-text-body">{data.niveau}</td>
      <td className="px-3 py-3">
        <StatusPill status={data.status} />
      </td>
      <td className="px-3 py-3">
        <PassFailPill passed={data.passed} />
      </td>
    </tr>
  );
}
