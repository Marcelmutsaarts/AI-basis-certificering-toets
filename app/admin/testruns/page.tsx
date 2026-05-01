/**
 * Admin testruns-tab. Filter op profiles.role='tester'.
 * Zelfde layout als de examens-tab maar met TestrunRow (geel TEST label).
 */
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { loadAdminSessions } from '@/lib/admin/queries';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { TestrunRow } from '@/components/admin/TestrunRow';
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

export default async function AdminTestrunsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const niveau = asNiveau(pickString(sp.niveau));
  const pass = asPass(pickString(sp.pass));
  const search = pickString(sp.q);

  const writer = createServiceRoleClient();
  const rows = await loadAdminSessions(writer, {
    roleFilter: 'tester',
    niveau,
    pass,
    search,
  });

  return (
    <>
      <AdminTabs active="testruns" />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-2xl font-semibold text-purple-dark mb-1">
            Testruns
          </h1>
          <p className="text-sm text-text-body/80 mb-4">
            Examens van tester-accounts. Webhook wordt voor deze sessies
            geskipt.
          </p>
          <SessionFilters />
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-purple-light-bg/40">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Datum
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Tester
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
                      Geen testruns gevonden.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => <TestrunRow key={r.id} data={r} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
