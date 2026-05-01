/**
 * Header op de admin sessie-detailpagina: toont docent en sessie metadata.
 */
import type { Database } from '@/lib/supabase/types';

type Niveau = Database['public']['Enums']['onderwijsniveau'];
type Status = Database['public']['Enums']['exam_status'];

export interface SessionDetailHeaderProps {
  fullName: string;
  email: string;
  school: string;
  niveau: Niveau;
  vakgebied: string | null;
  role: Database['public']['Enums']['user_role'];
  startedAt: string;
  endedAt: string | null;
  status: Status;
  sessionId: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return '-';
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-text-body/60">
        {label}
      </div>
      <div className="text-sm text-text-body">{value}</div>
    </div>
  );
}

export function SessionDetailHeader(props: SessionDetailHeaderProps) {
  const isTester = props.role === 'tester';
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold text-purple-dark">
          Sessie-detail
        </h1>
        {isTester ? (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-sm bg-yellow-200 text-yellow-900 border border-yellow-300">
            TEST
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Field label="Docent" value={props.fullName} />
        <Field label="E-mail" value={props.email || '-'} />
        <Field label="School" value={props.school} />
        <Field label="Niveau" value={props.niveau} />
        <Field label="Vakgebied" value={props.vakgebied || '-'} />
        <Field label="Rol" value={props.role} />
        <Field label="Status" value={props.status.replace('_', ' ')} />
        <Field label="Gestart" value={formatDate(props.startedAt)} />
        <Field label="Afgerond" value={formatDate(props.endedAt)} />
      </div>
      <div className="text-[11px] text-text-body/60 font-mono break-all">
        {props.sessionId}
      </div>
    </div>
  );
}
