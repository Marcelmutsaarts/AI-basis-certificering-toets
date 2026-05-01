/**
 * AVD Voice-to-Voice Toets-app: seed-test-accounts
 *
 * Maakt admin- en testeraccounts via Supabase Auth admin API.
 * Idempotent: als email al bestaat, skip die user.
 *
 * Vereist env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   TEST_ACCOUNT_PASSWORD
 *
 * Run: npx tsx supabase/seed-test-accounts.ts
 */
import { createClient } from '@supabase/supabase-js';

type Niveau = 'PO' | 'VO' | 'MBO' | 'HBO' | 'WO';
type Role = 'docent' | 'admin' | 'tester';

interface SeedAccount {
  email: string;
  fullName: string;
  role: Role;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PASSWORD = process.env.TEST_ACCOUNT_PASSWORD;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !PASSWORD) {
  console.error(
    'Ontbrekende env vars. Vereist: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TEST_ACCOUNT_PASSWORD'
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ACCOUNTS: SeedAccount[] = [
  { email: 'admin@avd-test.nl', fullName: 'Marcel Mutsaarts', role: 'admin' },
  ...Array.from({ length: 10 }, (_, i) => ({
    email: `marcelentom${i + 1}@avd-test.nl`,
    fullName: `Marcel en Tom Test ${i + 1}`,
    role: 'tester' as Role,
  })),
];

async function findExistingUserId(email: string): Promise<string | null> {
  // listUsers paginates; per_page max 1000 is genoeg voor onze setup.
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(`listUsers: ${error.message}`);
  const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return match?.id ?? null;
}

async function ensureProfile(userId: string, account: SeedAccount): Promise<void> {
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (existing) return;
  const { error } = await admin.from('profiles').insert({
    user_id: userId,
    full_name: account.fullName,
    role: account.role,
    school: 'AVD Test',
    niveau: 'VO' satisfies Niveau,
    vakgebied: 'Test',
  });
  if (error) throw new Error(`insert profile ${account.email}: ${error.message}`);
}

async function seedOne(account: SeedAccount): Promise<void> {
  const existingId = await findExistingUserId(account.email);
  if (existingId) {
    console.log(`skip ${account.email} (bestaat al)`);
    await ensureProfile(existingId, account);
    return;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email: account.email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: account.fullName },
  });
  if (error || !data.user) throw new Error(`create ${account.email}: ${error?.message}`);
  await ensureProfile(data.user.id, account);
  console.log(`created ${account.email} (${account.role})`);
}

async function main(): Promise<void> {
  for (const account of ACCOUNTS) {
    await seedOne(account);
  }
  console.log('seed klaar');
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
