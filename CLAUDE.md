# AVD Voice-to-Voice Toets-app

## Wat doet deze app

Mondeling examen voor docenten die de 5 basiswebinars van AI voor Docenten hebben gevolgd. Voice-to-voice gesprek met AI-examinator Lieke (~15-18 min, max 25). Direct na afloop: rubric-uitkomst per framework-domein in groen/oranje/rood. Audio NOOIT bewaard, transcripten 24 maanden. Webhook na afloop naar n8n.

## Werkdir
`C:\Users\Gebruiker\vibecoding\AVD basis certificatie toetsing` (Windows, bash shell, paden met spaties).

## Tech stack
- Next.js 16.2.4 (NIET 15) met App Router, TypeScript, Tailwind 4
- React 19.2
- @supabase/ssr + @supabase/supabase-js
- @google/genai (Gemini Live, ephemeral tokens, apiVersion v1alpha)
- Zod
- Vercel hosting (vercel.json met cron op /api/webhook-retry elke 5 min)

## Supabase: TWEE apps in EEN project

Project ID: `nivzzfiqyajhebdyweic` (naam in dashboard: "AI-interviewer")

**AVD tabellen (deze app):** `profiles`, `casuses`, `exam_sessions`, `transcripts`, `evaluations`, `webhook_deliveries`

**Andere app (NIET AANRAKEN):** `scan_voltooiingen`, `schoolbeleid_rapporten`

`auth.users` is gedeeld tussen beide apps. Bij migraties altijd alleen AVD-tabellen targeten. NOOIT meer `drop schema public cascade` of vergelijkbare brede operaties — die wissen de andere app ook.

Migraties: 001_schema, 002_rls, 003_seed_casuses, 004_grants. Toegepast via Supabase MCP `apply_migration`.

## Model identifiers (STRIKT)

- Live (voice-to-voice): `gemini-3.1-flash-live` via Google AI Studio direct (NIET via OpenRouter), env `MODEL_LIVE`. **Open issue: WebSocket sluit direct na opening — modelnaam kan ongeldig zijn op Google's eind, debug pending.**
- Evaluator: `google/gemini-3.1-pro-preview` via OpenRouter, env `MODEL_EVALUATOR`. Werkt (getest in Wave 7).

NIET vervangen door bekendere modellen (`gemini-2.5-flash-native-audio-dialog` etc) zonder bevestiging van Marcel — het assistant-model neigt naar oudere namen, dat is fout.

## Env vars (.env.local, niet gecommit)

Gevuld:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon JWT, role=anon)
- `SUPABASE_SERVICE_ROLE_KEY` (service_role JWT, bypass RLS, server-only)
- `GOOGLE_AI_STUDIO_API_KEY`
- `OPENROUTER_API_KEY`

Leeg (komen later van Thijs / productie):
- `N8N_RESULT_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`
- `TEST_ACCOUNT_PASSWORD` (accounts staan al in DB met `AVDtest2026!`)
- `MODEL_LIVE`, `MODEL_EVALUATOR` (defaults in code)
- `NEXT_PUBLIC_APP_URL`

## Testaccounts (in DB)

Wachtwoord: `AVDtest2026!`
- `admin@avd-test.nl` (role admin, naam Marcel Mutsaarts)
- `marcelentom1@avd-test.nl` t/m `marcelentom10@avd-test.nl` (role tester, naam "Marcel en Tom Test {n}", school "AVD Test", niveau VO)

Tester-rol: webhook out wordt geskipt (status `skipped`, reason `test_account`).

## .claude/agents/

Subagent-definities (let op: Claude Code's Agent tool herkent ze niet als subagent_type — gebruik `general-purpose` en laat de agent het .md-bestand inlezen voor context):
- `coder.md` (volledige projectspec, branding, RLS, casuspool, system prompts)
- `reviewer.md` (review-checklist)
- `tester.md` (test-scenarios per wave)
- `ui-reviewer.md` (UI-criteria)

## Werkwijze

User wil **uitsluitend via subagents** werken voor implementatie/review/test. Hoofdgesprek doet alleen orkestratie, MCP-calls (SQL, migraties), git commits.

## Wave-status

- **Wave 1** (Foundation): schema, RLS, GRANTS, seed, types — done + getest
- **Wave 2** (Auth + Start): login, /start, basis UI — done + getest
- **Wave 3** (Voice-to-voice): Lieke system prompt, casuspool selector, Live API hook, ExamScreen — done, codepad correct, **runtime werkt niet (zie open issues)**
- **Wave 4** (Evaluator + Result): Zod schema, OpenRouter call, persist, /resultaat, /transcript — done + getest met echte OpenRouter call
- **Wave 5** (Webhook + Admin): HMAC sign, retry schedule, /admin dashboard met examens/testruns/webhooks tabs — done + getest
- **Wave 6** (Polish): DotsPattern, Spinner, ErrorBoundary, ExamErrorPanel, mobile responsive — done
- **Wave 7** (E2E): 18/18 PASS — login, exam-session creatie, evaluator, result/transcript pages, webhook skip-voor-tester, cron retry, admin dashboard, RLS isolation. Niet getest: actuele voice-to-voice via mic.

## Bug-fixes toegepast

- BUG-W2-001: `auth.users` token kolommen waren NULL na raw SQL insert, GoTrue verwacht `''`. Fixed via UPDATE.
- BUG-W3-001: GRANTS missing op public tabellen voor `authenticated` rol. Fixed via 004_grants.sql + `profiles_own_update` policy met role-pinning.
- BUG-W3-002: useTranscript merge-logica verdubbelde tekst bij cumulatieve transcript-events. Fixed met longest-prefix-replace strategie.
- BUG-W3-003: Token-route gebruikte `lockAdditionalFields: []`. Fixed naar `['systemInstruction', 'tools', 'responseModalities', 'speechConfig']`.

## Open issues

- **Lieke start niet** ([live] onclose direct na onopen). WebSocket gaat open en sluit direct, recorder blijft door audio sturen → veel "WebSocket already CLOSED" errors. Hypothese: model `gemini-3.1-flash-live` bestaat niet op Google's eind. Debug-stap: console.log toegevoegd in `hooks/useLiveSession.ts` voor onopen/onclose met code/reason. User moet de uitgeklapte close-event delen om te bevestigen.

## Conventies

- Geen em-dashes in copy, comments, system prompts. Gebruik komma's of nieuwe zinnen.
- Bestanden onder 200 regels (uitzondering: `lib/supabase/types.ts` ~234, monolithisch voor Supabase gen-types compat).
- Functies onder 30 regels.
- Server vs client components correct gemarkeerd. `cookies()` is async (Next 16).
- Service-role client alleen server-side (`lib/supabase/service-role.ts`), nooit in client/middleware.
- Geen `<form action=...>`, gebruik `onSubmit` met `preventDefault`.
- Bloom-terminologie: "categorieen van cognitieve processen", NOOIT "niveaus" of "hogere/lagere orde".
- AVD branding via `@theme` block in `app/globals.css`: `--color-purple-primary: #a15df5`, `--color-purple-light-bg: #ebdfff`, `--color-purple-dark: #7947ba`, `--color-purple-medium: #814bc6`, `--color-text-body: #4a5568`. Tailwind utilities `bg-purple-primary` etc werken hierdoor.

## Webhook out naar n8n

- Endpoint via env `N8N_RESULT_WEBHOOK_URL` (nu leeg, placeholder accepteert deliver-fail naar status `pending`).
- HMAC SHA256 hex over body string met `N8N_WEBHOOK_SECRET`, header `X-AVD-Signature`.
- Body via stable JSON.stringify met sorted keys (`lib/webhook/payload.ts`).
- Tester-skip: insert webhook_deliveries met `status='skipped'`, `skipped_reason='test_account'`, geen POST.
- Retry-schedule: 60s, 5m, 30m, 2h, 12h. Max 5 attempts. Cron via Vercel `/api/webhook-retry`.
- Manueel retry door admin via `/api/admin/retry-delivery`.

## Architectuur kernpunten

- Ephemeral token pattern voor Live API: `/api/live-session/token` genereert kortlevende token via `ai.authTokens.create({liveConnectConstraints, lockAdditionalFields:[...]})`, browser connect direct met token (Vercel-friendly, geen WS-proxy nodig).
- Audio: 16kHz PCM mono mic in (downsampling van browser samplerate), 24kHz PCM out via AudioContext.
- Live transcripts via `inputTranscription` en `outputTranscription` callback events — niet zelf reconstrueren uit audio.
- Eval idempotent via unique constraint op `evaluations.exam_session_id` (23505 fallback in persist).
- Resultaatpagina is server component, triggert client `EvaluatorTrigger` als `evaluations` row mist, doet POST naar `/api/evaluate/[id]` en `router.refresh()`.
- ExamScreen `beforeunload` -> `sendBeacon` naar `/api/exam-session/end` met `status='abandoned'` zodat browser-sluiten een schone status achterlaat.

## Git history

Alle waves gecommit met `Co-Authored-By: Claude`. Hoofdcommits in volgorde:
1. Initial commit (create-next-app)
2. wave 1: fundament
3. wave 2: auth login flow
4. wave 3: voice-to-voice examen
5. wave 3 fixes: GRANTS, transcript merge, token hardening
6. wave 4: evaluator + resultaatscherm
7. wave 5: webhook out + admin dashboard
8. wave 6: polish
9. docs: README handover
10. wave 6 polish fixes
