/**
 * Service-role Supabase client.
 *
 * Alleen server-side gebruiken (route handlers met `runtime = 'nodejs'`).
 * Bypasses RLS, dus auth + ownership check moet expliciet bij de
 * caller gebeuren voordat deze client wordt aangeroepen.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Service role client niet beschikbaar: SUPABASE_SERVICE_ROLE_KEY of NEXT_PUBLIC_SUPABASE_URL ontbreekt.'
    );
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
