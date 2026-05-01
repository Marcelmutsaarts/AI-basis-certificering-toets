/**
 * POST /api/live-session/token
 *
 * Genereert een ephemeral auth token voor de Gemini Live API. De client
 * gebruikt dit token om direct met Google te WebSocketten zodat de
 * GOOGLE_AI_STUDIO_API_KEY nooit naar de browser hoeft.
 *
 * Body: { examSessionId: string }
 * Auth: Supabase server client. RLS dwingt af dat de exam_session bij de
 * ingelogde user hoort.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { buildSystemPrompt } from '@/lib/bot/system-prompt';
import { buildLiveConfig } from '@/lib/live-api/session-config';
import { resolveLiveModel } from '@/lib/bot/persona';

const BodySchema = z.object({
  examSessionId: z.string().uuid(),
});

const TOKEN_USES = 1;
const TOKEN_TTL_SECONDS = 30 * 60; // 30 minuten max sessie

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server is niet geconfigureerd voor Gemini Live.' },
      { status: 500 }
    );
  }

  let parsed;
  try {
    const json = await request.json();
    parsed = BodySchema.parse(json);
  } catch {
    return NextResponse.json({ error: 'Ongeldige body.' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  const { data: session, error: sessionError } = await supabase
    .from('exam_sessions')
    .select('id, user_id, casus_ids, status')
    .eq('id', parsed.examSessionId)
    .maybeSingle();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Sessie niet gevonden.' }, { status: 404 });
  }
  if (session.user_id !== user.id) {
    return NextResponse.json({ error: 'Geen toegang.' }, { status: 403 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, niveau, vakgebied')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json(
      { error: 'Profiel ontbreekt.' },
      { status: 400 }
    );
  }

  const { data: casusRows, error: casusError } = await supabase
    .from('casuses')
    .select('id, code, prompt, domains, bloom_category, webinar')
    .in('id', session.casus_ids ?? []);
  if (casusError || !casusRows || casusRows.length === 0) {
    return NextResponse.json(
      { error: 'Casussen niet gevonden voor sessie.' },
      { status: 400 }
    );
  }

  const systemPrompt = buildSystemPrompt({
    docent: {
      fullName: profile.full_name,
      niveau: profile.niveau,
      vakgebied: profile.vakgebied,
    },
    casussen: casusRows.map((row) => ({
      webinar: row.webinar,
      code: row.code,
      prompt: row.prompt,
      domains: row.domains ?? [],
      bloomCategory: row.bloom_category,
    })),
  });

  const liveConfig = buildLiveConfig(systemPrompt);
  const model = resolveLiveModel();

  try {
    const ai = new GoogleGenAI({
      apiKey,
      apiVersion: 'v1alpha',
    } as ConstructorParameters<typeof GoogleGenAI>[0]);
    const expireTime = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString();
    const newSessionExpireTime = new Date(Date.now() + 60 * 1000).toISOString();

    const token = await ai.authTokens.create({
      config: {
        uses: TOKEN_USES,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints: {
          model,
          config: liveConfig as never,
        },
        lockAdditionalFields: [],
      },
    });

    if (!token.name) {
      throw new Error('Geen tokennaam terug van Gemini.');
    }

    return NextResponse.json({
      token: token.name,
      expiresAt: expireTime,
      model,
      config: liveConfig,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Onbekende fout';
    console.error('Ephemeral token error', message);
    return NextResponse.json(
      { error: 'Kon ephemeral token niet aanmaken.' },
      { status: 502 }
    );
  }
}
