import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match alle paden BEHALVE:
     * - _next/static (statische assets)
     * - _next/image (image-optimalisatie)
     * - favicon.ico, robots.txt, sitemap.xml
     * - publieke API routes voor webhook/cron (geen sessie nodig)
     * - bestanden met extensies (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/webhook-out|api/webhook-retry|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
