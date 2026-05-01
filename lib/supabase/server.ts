/**
 * Server-side Supabase client voor RSC, Server Actions en Route Handlers.
 * Next.js 15+/16 vereist `await cookies()`.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll wordt aangeroepen vanuit een Server Component,
            // wat geen cookies kan schrijven. Middleware vangt refresh op.
          }
        },
      },
    }
  );
}
