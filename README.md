# AVD Basiscertificatie Toetsing

## 1. Project overview

Voice-to-voice mondeling examen voor docenten die het basiscertificaat AI-Geletterd van AI voor Docenten willen behalen. Docenten voeren een gesprek van 15 tot 18 minuten met AI-examinator Lieke, krijgen direct een rubric-uitkomst per framework-domein (groen, oranje, rood), en de uitslag wordt via webhook naar n8n gestuurd voor verdere verwerking. Architectuur: Next.js 15 (App Router, TypeScript, Tailwind 4) op Vercel, Supabase voor auth en database, Google Gemini 3.1 Flash Live via Google AI Studio voor het gesprek, en Google Gemini 3.1 Pro Preview via OpenRouter voor de evaluatie achteraf.

## 2. Setup

**Vereisten:**
- Node 20 of hoger
- Een Supabase project (gratis tier voldoende voor dev)
- Google AI Studio API key
- OpenRouter API key
- Optioneel: n8n webhook endpoint voor productie

**Stappen:**

1. `git clone <repo>` of werkdir overnemen.
2. `npm install`.
3. Kopieer `.env.local.example` naar `.env.local` en vul de keys (zie sectie 3).
4. Lokaal Supabase draaien is niet nodig. Migraties worden gedeployed via de Supabase MCP of via de Supabase CLI tegen het remote project.
5. `npm run dev` om te starten op `http://localhost:3000`.

## 3. Env vars overzicht

| Variabele | Waar vind je 'm | Wanneer nodig |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Dashboard > Settings > API | Altijd |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard > Settings > API | Altijd (client-side public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard > Settings > API | Server-side: evaluator persist, admin pages, webhook trigger |
| `GOOGLE_AI_STUDIO_API_KEY` | aistudio.google.com > Get API key | Voice-to-voice (Gemini Live) |
| `OPENROUTER_API_KEY` | openrouter.ai > Keys | Evaluator (gemini-3.1-pro-preview) |
| `MODEL_LIVE` | n.v.t. | Default: `gemini-3.1-flash-live` |
| `MODEL_EVALUATOR` | n.v.t. | Default: `google/gemini-3.1-pro-preview` |
| `N8N_RESULT_WEBHOOK_URL` | Krijg je van Thijs (n8n setup) | Webhook delivery |
| `N8N_WEBHOOK_SECRET` | Genereer en deel met Thijs | HMAC SHA256 voor `X-AVD-Signature` |
| `TEST_ACCOUNT_PASSWORD` | Zelf kiezen | Seed test accounts |
| `CRON_SECRET` | Zelf kiezen | Manual cron trigger (Vercel Cron self-auths via `x-vercel-cron`) |
| `NEXT_PUBLIC_APP_URL` | n.v.t. | Voor `transcript_admin_url` in webhook payload |

## 4. Database schema kort

- 6 tabellen: `profiles`, `exam_sessions`, `transcripts`, `evaluations`, `casuses`, `webhook_deliveries`.
- 6 enums: `user_role`, `onderwijsniveau`, `exam_status`, `speaker_type`, `score_type`, `delivery_status`.
- RLS aan op alle tabellen, plus GRANTS in migratie `004`.
- Migraties staan in `supabase/migrations/` (`001_schema.sql` t/m `004_grants.sql`).

## 5. Account-creatie via n8n

n8n maakt accounts direct via de Supabase Auth admin API. De app heeft geen create-user endpoints. Voorbeeld:

```bash
curl -X POST 'https://nivzzfiqyajhebdyweic.supabase.co/auth/v1/admin/users' \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "docent@school.nl",
    "password": "<gegenereerd>",
    "email_confirm": true,
    "user_metadata": { "full_name": "Naam Achternaam" }
  }'
```

Daarna een `profiles` row insert:

```bash
curl -X POST 'https://nivzzfiqyajhebdyweic.supabase.co/rest/v1/profiles' \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<uuid van auth.users>",
    "full_name": "Naam Achternaam",
    "role": "docent",
    "school": "Schoolnaam",
    "niveau": "VO",
    "vakgebied": "Wiskunde"
  }'
```

## 6. Webhook delivery aan n8n

- **Endpoint**: `N8N_RESULT_WEBHOOK_URL` (vul zelf in vanuit Thijs).
- **Method**: POST.
- **Headers**: `Content-Type: application/json`, `X-AVD-Signature: <SHA256 hex van body met N8N_WEBHOOK_SECRET>`.
- **Body**: zie `lib/webhook/payload.ts` voor het exacte format. Sample:

```json
{
  "event": "exam_completed",
  "exam_session_id": "...",
  "completed_at": "ISO string",
  "docent": {
    "user_id": "...",
    "full_name": "...",
    "email": "...",
    "school": "...",
    "niveau": "VO",
    "vakgebied": "..."
  },
  "result": {
    "passed": true,
    "domain_scores": {
      "mindset": "GROEN",
      "ethiek": "ORANJE",
      "kennis": "GROEN",
      "pedagogiek": "GROEN",
      "agency": "ORANJE"
    },
    "samenvatting": "...",
    "ontwikkeladvies": "..."
  },
  "transcript_admin_url": "https://exam.aivoordocenten.nl/admin/sessions/<id>"
}
```

n8n moet de signature verifieren door zelf SHA256 over de body string te berekenen met dezelfde secret en die hex te vergelijken met de `X-AVD-Signature` header. Bij mismatch: payload weigeren.

## 7. Wat Marcel moet doen voor productie

1. Vul `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (en in Vercel env vars).
2. Vraag bij Thijs de `N8N_RESULT_WEBHOOK_URL` op.
3. Genereer een sterk `N8N_WEBHOOK_SECRET` en deel die met Thijs (zelfde waarde aan beide kanten).
4. Zet `NEXT_PUBLIC_APP_URL` op de productie URL.
5. Deploy naar Vercel met alle env vars.
6. Vercel Cron is automatisch actief via `vercel.json` (retry-job elke 5 minuten).

## 8. Testaccounts (dev only)

- `admin@avd-test.nl` (admin)
- `marcelentom1@avd-test.nl` t/m `marcelentom10@avd-test.nl` (tester)
- Wachtwoord: `AVDtest2026!`

Tester accounts skippen de webhook out (status `skipped`, `skipped_reason = 'test_account'`). Ze worden zichtbaar als gele "TEST" rij in het admin dashboard onder de tab Testruns.

## 9. Architectuur in 1 minuut

**Docent routes:**
- `/login`, `/start`, `/examen`, `/resultaat/[id]`, `/transcript/[id]`.

**Admin routes:**
- `/admin`, `/admin/testruns`, `/admin/webhooks`, `/admin/sessions/[id]`.

**API routes:**
- `/api/live-session/token` voor een ephemeral Gemini Live token.
- `/api/evaluate/[id]` roept OpenRouter en persisteert de evaluatie.
- `/api/webhook-out/[id]` om manueel een webhook-delivery te triggeren.
- `/api/webhook-retry` voor de Vercel Cron retry-job.

## 10. Bekende beperkingen

- Voice-to-voice vereist mic-permissie van de browser.
- De Live API gebruikt `ScriptProcessorNode` voor audio-capture; deze is deprecated maar werkt prima in alle moderne browsers. Migratie naar `AudioWorklet` is een toekomstige optimalisatie.
- Wave 7 E2E tests stonden BLOCKED zonder `SUPABASE_SERVICE_ROLE_KEY`. Vul de key in en draai de tests opnieuw om dat te ontblokken.
