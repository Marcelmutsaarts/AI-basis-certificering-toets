/**
 * Selecteert vijf casussen voor een examen, een per webinar 1..5.
 * Per webinar wordt random gekozen uit de actieve casussen. Daarna wordt
 * gecheckt of elk van de vijf framework-domeinen minstens twee keer geraakt
 * wordt. Als dat niet zo is, opnieuw rollen tot maximaal MAX_ROLLS keer.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

export interface PickedCasus {
  id: string;
  code: string;
  prompt: string;
  domains: string[];
  bloomCategory: string;
  webinar: number;
}

const FRAMEWORK_KEYS = ['mindset', 'ethiek', 'kennis', 'pedagogiek', 'agency'];
const MAX_ROLLS = 6;
const REQUIRED_PER_DOMAIN = 2;

type CasusRow = Database['public']['Tables']['casuses']['Row'];

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function pickOnePerWebinar(byWebinar: Map<number, CasusRow[]>): CasusRow[] {
  const picked: CasusRow[] = [];
  for (let webinar = 1; webinar <= 5; webinar += 1) {
    const pool = byWebinar.get(webinar);
    if (!pool || pool.length === 0) {
      throw new Error(`Casuspool is leeg voor webinar ${webinar}`);
    }
    const shuffled = shuffleInPlace(pool.slice());
    picked.push(shuffled[0]);
  }
  return picked;
}

function countDomainCoverage(picked: CasusRow[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const c of picked) {
    for (const domain of c.domains ?? []) {
      const key = domain.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function meetsCoverage(counts: Map<string, number>): boolean {
  return FRAMEWORK_KEYS.every(
    (key) => (counts.get(key) ?? 0) >= REQUIRED_PER_DOMAIN
  );
}

function bestEffortPick(byWebinar: Map<number, CasusRow[]>): CasusRow[] {
  let best: CasusRow[] = [];
  let bestScore = -1;
  for (let i = 0; i < MAX_ROLLS; i += 1) {
    const candidate = pickOnePerWebinar(byWebinar);
    const counts = countDomainCoverage(candidate);
    if (meetsCoverage(counts)) {
      return candidate;
    }
    const score = FRAMEWORK_KEYS.reduce(
      (sum, key) => sum + Math.min(counts.get(key) ?? 0, REQUIRED_PER_DOMAIN),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

function groupByWebinar(rows: CasusRow[]): Map<number, CasusRow[]> {
  const map = new Map<number, CasusRow[]>();
  for (const row of rows) {
    const list = map.get(row.webinar) ?? [];
    list.push(row);
    map.set(row.webinar, list);
  }
  return map;
}

function toPickedCasus(row: CasusRow): PickedCasus {
  return {
    id: row.id,
    code: row.code,
    prompt: row.prompt,
    domains: row.domains ?? [],
    bloomCategory: row.bloom_category,
    webinar: row.webinar,
  };
}

export async function pickCasussen(
  supabase: SupabaseClient<Database>
): Promise<PickedCasus[]> {
  const { data, error } = await supabase
    .from('casuses')
    .select('*')
    .eq('active', true);

  if (error) {
    throw new Error(`Kon casussen niet ophalen: ${error.message}`);
  }
  if (!data || data.length === 0) {
    throw new Error('Geen actieve casussen beschikbaar');
  }

  const byWebinar = groupByWebinar(data);
  const picked = bestEffortPick(byWebinar);
  return picked
    .slice()
    .sort((a, b) => a.webinar - b.webinar)
    .map(toPickedCasus);
}
