/**
 * Eenvoudige chronologische transcript-render voor admin-detailpagina.
 * Bot links (paars), docent rechts (lichtpaars). Geen citaat-styling.
 */
import type { Database } from '@/lib/supabase/types';

type Speaker = Database['public']['Enums']['speaker_type'];

export interface TranscriptListItem {
  id: string;
  speaker: Speaker;
  text: string;
  started_at: string;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function TranscriptList({ rows }: { rows: TranscriptListItem[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-text-body/70">Geen transcript beschikbaar.</p>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => {
        const isBot = row.speaker === 'bot';
        const align = isBot ? 'justify-start' : 'justify-end';
        const bubble = isBot
          ? 'bg-purple-primary text-white rounded-2xl rounded-bl-sm'
          : 'bg-purple-light-bg text-text-body rounded-2xl rounded-br-sm border border-purple-primary/15';
        const label = isBot ? 'Lieke' : 'Docent';
        return (
          <li key={row.id} className={`flex ${align}`}>
            <div className="max-w-[80%]">
              <span className="block text-[11px] uppercase tracking-wide text-text-body/60 mb-1">
                {label}
                <span className="mx-1.5">{'\u00b7'}</span>
                {formatTime(row.started_at)}
              </span>
              <div
                className={`px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${bubble}`}
              >
                {row.text}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
