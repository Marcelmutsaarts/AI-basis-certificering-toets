/**
 * AVD Voice-to-Voice Toets-app: seed-participants
 *
 * Maakt de echte deelnemer- en team-accounts aan vanuit een gitignored
 * JSON-bestand. Wachtwoorden komen uit de 4-cijferige inlogcodes via
 * codeToPassword, dezelfde helper die de login gebruikt.
 * Idempotent: bestaande users en profielen worden niet overschreven.
 *
 * Vereist env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Optioneel:
 *   PARTICIPANTS_FILE (pad naar JSON, default supabase/participants.local.json)
 *
 * JSON-vorm: array van { email, full_name, code, role }.
 *
 * Run: npx tsx supabase/seed-participants.ts
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { codeToPassword, normalizeCode } from '../lib/auth/code-password';

type Role = 'docent' | 'admin' | 'tester';

interface Participant {
  email: string;
  full_name: string;
  code: string;
  role: Role;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FILE = process.env.PARTICIPANTS_FILE ?? 'supabase/participants.local.json';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Ontbrekende env vars. Vereist: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function loadParticipants(path: string): Participant[] {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    console.error(`Kan deelnemerbestand niet lezen: ${path}`);
    process.exit(1);
  }
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    console.error(`Deelnemerbestand moet een array zijn: ${path}`);
    process.exit(1);
  }
  return parsed as Participant[];
}

async function buildEmailToIdMap(): Promise<Map<string, string>> {
  // Een keer ophalen, dan per deelnemer opzoeken in de Map. per_page max 1000
  // is ruim genoeg voor onze groep, dus geen paginatie nodig.
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(`listUsers: ${error.message}`);
  const map = new Map<string, string>();
  for (const u of data.users) {
    if (u.email) map.set(u.email.toLowerCase(), u.id);
  }
  return map;
}

async function ensureProfile(userId: string, p: Participant): Promise<void> {
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  // Bestaat de rij al, dan laten we school en niveau met rust (idempotent).
  if (existing) return;
  const { error } = await admin.from('profiles').insert({
    user_id: userId,
    full_name: p.full_name,
    role: p.role,
    school: null,
    niveau: null,
    vakgebied: null,
  });
  if (error) throw new Error(`insert profile ${p.email}: ${error.message}`);
}

async function seedOne(
  p: Participant,
  emailToId: Map<string, string>
): Promise<void> {
  // Normaliseer de code identiek aan de login. Een vieze code (te kort of met
  // letters) mag niet halverwege de batch op een onduidelijke GoTrue-fout
  // stranden, dus we vangen dat hier af met het e-mailadres erbij.
  const code = normalizeCode(p.code);
  if (code.length !== 4) {
    throw new Error(
      `ongeldige code voor ${p.email}: verwacht 4 cijfers, kreeg "${p.code}"`
    );
  }
  const existingId = emailToId.get(p.email.toLowerCase());
  if (existingId) {
    console.log(`skip ${p.email} (bestaat al)`);
    await ensureProfile(existingId, p);
    return;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email: p.email,
    password: codeToPassword(code),
    email_confirm: true,
    user_metadata: { full_name: p.full_name },
  });
  if (error || !data.user) throw new Error(`create ${p.email}: ${error?.message}`);
  await ensureProfile(data.user.id, p);
  console.log(`created ${p.email} (${p.role})`);
}

async function main(): Promise<void> {
  const participants = loadParticipants(FILE);
  console.log(`Inlezen: ${participants.length} deelnemers uit ${FILE}`);
  const emailToId = await buildEmailToIdMap();
  for (const p of participants) {
    await seedOne(p, emailToId);
  }
  console.log('seed deelnemers klaar');
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
