/**
 * Admin examens-tab.
 * Server component: leest filter-params uit searchParams, laadt sessies
 * via lib/admin/queries en rendert SessionRow's in een tabel.
 */
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { loadAdminSessions } from '@/lib/admin/queries';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { SessionRow } from '@/components/admin/SessionRow';
import { SessionFilters } from '@/components/admin/SessionFilters';
import type { Database } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

type Niveau = Database['public']['Enums']['onderwijsniveau'];

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function pickString(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
}

function asNiveau(s: string): Niveau | '' {
  const all: Niveau[] = ['PO', 'VO', 'MBO', 'HBO', 'WO'];
  return all.includes(s as Niveau) ? (s as Niveau) : '';
}

function asPass(s: string): 'pass' | 'fail' | '' {
  if (s === 'pass' || s === 'fail') return s;
  return '';
}

export default async function AdminPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const niveau = asNiveau(pickString(sp.niveau));
  const pass = asPass(pickString(sp.pass));
  const search = pickString(sp.q);

  const writer = createServiceRoleClient();
  const rows = await loadAdminSessions(writer, {
    roleFilter: 'real',
    niveau,
    pass,
    search,
  });

  return (
    <>
      <AdminTabs active="examens" />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-2xl font-semibold text-purple-dark mb-4">
            Examens
          </h1>
          <SessionFilters />
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-purple-light-bg/40">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Datum
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Docent
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Niveau
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Status
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Resultaat
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-sm text-text-body/70"
                    >
                      Geen examens gevonden.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => <SessionRow key={r.id} data={r} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
