/**
 * Logout endpoint. POST roept supabase.auth.signOut() aan en
 * redirect naar /login. Cookies worden opgeruimd via @supabase/ssr.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('signOut fout', error);
  }

  const url = new URL('/login', request.url);
  return NextResponse.redirect(url, { status: 303 });
}
