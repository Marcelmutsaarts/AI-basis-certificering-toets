/**
 * Admin queries: koppelt exam_sessions, profiles en evaluations en past
 * server-side filters toe (niveau, pass/fail, search, role-include).
 *
 * Gebruikt de service-role client zodat we geen RLS-fouten krijgen op
 * de joins. De caller is al admin-geverifieerd via app/admin/layout.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import type { SessionRowData } from '@/components/admin/SessionRow';

type Role = Database['public']['Enums']['user_role'];
type Niveau = Database['public']['Enums']['onderwijsniveau'];

export interface AdminSessionsArgs {
  roleFilter: 'real' | 'tester';
  niveau?: Niveau | '';
  pass?: 'pass' | 'fail' | '';
  search?: string;
}

interface JoinedRow {
  id: string;
  started_at: string;
  status: Database['public']['Enums']['exam_status'];
  user_id: string;
  full_name: string;
  school: string;
  niveau: Niveau;
  role: Role;
  passed: boolean | null;
}

async function fetchProfiles(
  supabase: SupabaseClient<Database>,
  rolesIn: Role[]
) {
  const { data } = await supabase
    .from('profiles')
    .select('user_id, full_name, school, niveau, role')
    .in('role', rolesIn);
  return data ?? [];
}

async function fetchSessions(supabase: SupabaseClient<Database>) {
  const { data } = await supabase
    .from('exam_sessions')
    .select('id, user_id, started_at, status')
    .order('started_at', { ascending: false })
    .limit(500);
  return data ?? [];
}

async function fetchEvaluations(
  supabase: SupabaseClient<Database>,
  sessionIds: string[]
) {
  if (sessionIds.length === 0) return new Map<string, boolean>();
  const { data } = await supabase
    .from('evaluations')
    .select('exam_session_id, passed')
    .in('exam_session_id', sessionIds);
  return new Map((data ?? []).map((row) => [row.exam_session_id, row.passed]));
}

function applyFilters(rows: JoinedRow[], args: AdminSessionsArgs): JoinedRow[] {
  return rows.filter((row) => {
    if (args.niveau && row.niveau !== args.niveau) return false;
    if (args.pass === 'pass' && row.passed !== true) return false;
    if (args.pass === 'fail' && row.passed !== false) return false;
    if (args.search) {
      const q = args.search.toLowerCase();
      const hay = `${row.full_name} ${row.school}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export async function loadAdminSessions(
  supabase: SupabaseClient<Database>,
  args: AdminSessionsArgs
): Promise<SessionRowData[]> {
  const rolesIn: Role[] =
    args.roleFilter === 'tester' ? ['tester'] : ['docent', 'admin'];
  const [profiles, sessions] = await Promise.all([
    fetchProfiles(supabase, rolesIn),
    fetchSessions(supabase),
  ]);
  const profileByUser = new Map(profiles.map((p) => [p.user_id, p]));
  const filteredSessions = sessions.filter((s) => profileByUser.has(s.user_id));
  const passedMap = await fetchEvaluations(
    supabase,
    filteredSessions.map((s) => s.id)
  );
  const joined: JoinedRow[] = filteredSessions.map((s) => {
    const p = profileByUser.get(s.user_id)!;
    return {
      id: s.id,
      started_at: s.started_at,
      status: s.status,
      user_id: s.user_id,
      full_name: p.full_name,
      school: p.school,
      niveau: p.niveau,
      role: p.role,
      passed: passedMap.has(s.id) ? passedMap.get(s.id)! : null,
    };
  });
  return applyFilters(joined, args).map((r) => ({
    id: r.id,
    startedAt: r.started_at,
    status: r.status,
    fullName: r.full_name,
    school: r.school,
    niveau: r.niveau,
    passed: r.passed,
  }));
}
