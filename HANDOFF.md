# HANDOFF, overdracht van dit project

Je neemt een **bestaand, in productie draaiend** project over. Lees eerst `CLAUDE.md` (ingecheckte projectinstructies, grotendeels actueel) en `README.md`, en daarna dit document. De code en `git log` zijn leidend; de secties "open issues" en "wave-status" in CLAUDE.md dateren van vóór de recente fixes.

## Wat het is
Een **mondeling AI-examen** voor docenten die de 5 basiswebinars van "AI voor Docenten" volgden. De deelnemer voert een voice-to-voice gesprek (~15-18 min) met AI-examinator **Lieke**, die vijf onderwerpen behandelt (één casus per webinar). Direct erna wordt het transcript automatisch beoordeeld door een tweede AI-model en ziet de docent per AI-domein een rubric in groen/oranje/rood, plus geslaagd/niet-geslaagd. De uitkomst bepaalt of iemand het basiscertificaat krijgt. **De app is live en er hebben al echte deelnemers examen gedaan.**

## Tech stack
- Next.js 16.2.4 (App Router, NIET 15), TypeScript, Tailwind 4, React 19.
- Supabase (`@supabase/ssr` + `supabase-js`) voor auth + database.
- `@google/genai` voor Gemini Live (voice-to-voice, ephemeral tokens, apiVersion v1alpha).
- OpenRouter (via `fetch`) voor het beoordelaar-model.
- Resend voor uitgaande resultaatmail.
- Vercel hosting (repo github.com/Marcelmutsaarts/AI-basis-certificering-toets, branch master, auto-deploy).
- Windows-werkomgeving, paden met spaties.

## De end-to-end flow
1. **Login** (`app/(auth)/login`): e-mail + een persoonlijke **4-cijferige inlogcode**. De code is te kort voor GoTrue, dus `lib/auth/code-password.ts` padt hem naar het wachtwoord `avd-<code>`. Login en het seed-script gebruiken diezelfde helper. Geen self-signup.
2. **Onboarding** (`app/welkom` + `components/exam/OnboardingForm.tsx`): bij eerste login vult iedereen (ook admins) school + onderwijsniveau in. Een server-side gate in `app/(exam)/layout.tsx` stuurt iemand met lege school/niveau daarheen vóór het examen. Nodig omdat het niveau Lieke's vragen kleurt en de beoordelaar kalibreert.
3. **Examen** (`app/(exam)/examen` + `components/exam/ExamScreen.tsx`): maakt/hergebruikt een `exam_sessions`-rij, kiest 1 casus per webinar (`lib/bot/casuspool.ts`), haalt een ephemeral token op (`app/api/live-session/token`), en verbindt de browser direct met Gemini Live. Lieke's system-prompt wordt opgebouwd in `lib/bot/system-prompt.ts` uit `lib/bot/lieke-instructions.ts` plus per casus een privé-aanwijzing uit `lib/knowledge`. Live transcript via `inputTranscription`/`outputTranscription`. Audio wordt NOOIT bewaard, transcript wel.
4. **Afronden**: knop "Examen afronden" zet status `completed` en navigeert naar de resultaatpagina.
5. **Beoordeling** (`app/api/evaluate/[sessionId]`): laadt transcript + casussen + profiel (`lib/evaluator/load-context.ts`), bouwt de prompt (`lib/evaluator/prompt.ts` + `system-prompt-text.ts`), roept OpenRouter aan (`lib/evaluator/call-openrouter.ts`), valideert tegen een Zod-schema (`lib/evaluator/schema.ts`) en persisteert (`lib/evaluator/persist.ts`, idempotent via unique constraint). Zet status op `evaluated`.
6. **Resultaat + feedback** (`app/(exam)/resultaat/[sessionId]`): mist de evaluatie, dan draait `components/result/EvaluatingFeedback.tsx`: het triggert de beoordelaar op de achtergrond en laat de docent ondertussen een OPTIONELE feedback-flow doorlopen (roterende nakijk-zinnen, smiley-rating 1-5, twee open vragen "wat vond je goed / niet goed"), met knop "Laat me de resultaten zien". Feedback wordt opgeslagen via `app/api/feedback/[sessionId]` in `exam_sessions.feedback_rating/positief/negatief`. Bestaat de evaluatie, dan rendert de rubric plus een knop "Verstuur resultaat naar het AVD-team".
7. **Resultaatmail** (`app/api/send-result/[sessionId]` + `lib/mail/*`): stuurt via Resend de uitslag + docentgegevens + feedback naar info@aivoordocenten.nl.
8. **Admin** (`app/admin`, alleen role admin): dashboard met Examens-tab (echte deelnemers, geslaagd/niet), Testruns-tab (testers), Webhooks-tab, en per sessie een detailpagina met rubric + transcript + feedback.
9. **Webhook out** (`app/api/webhook-out`, `lib/webhook/*`): HMAC-getekende POST naar n8n na afloop (env-URL nu leeg, gaat naar `pending`). Testers worden geskipt.

## Supabase, LET OP (kritiek)
- Project id `nivzzfiqyajhebdyweic`. In dit ENE project draaien **TWEE apps**. Deze app gebruikt: `profiles`, `casuses`, `exam_sessions`, `transcripts`, `evaluations`, `webhook_deliveries`. De andere app gebruikt `scan_voltooiingen`, `schoolbeleid_rapporten`, **NIET AANRAKEN**. `auth.users` is gedeeld. Nooit brede DB-operaties (geen `drop schema`, geen ongefilterde deletes); target altijd expliciet de AVD-tabellen.
- RLS staat aan; migraties in `supabase/migrations/001..010`. Rollen: `docent` (echte deelnemer), `tester` (webhook geskipt, aparte tab), `admin`.

## Modellen (STRIKT, niet zomaar wijzigen)
- Lieke (voice-to-voice): `gemini-3.1-flash-live-preview` via Google AI Studio direct, env `MODEL_LIVE` (default in `lib/bot/persona.ts`). De `-preview`-suffix is nodig.
- Beoordelaar: `google/gemini-3.1-pro-preview` via OpenRouter, env `MODEL_EVALUATOR`.
- Deze namen zijn bewust gekozen en werken. Vervang ze NIET door bekendere/oudere namen zonder overleg met de eigenaar (Marcel).

## Geheimen en env (nooit committen)
- `.env.local` bevat alle keys (Supabase anon + service-role, `GOOGLE_AI_STUDIO_API_KEY`, `OPENROUTER_API_KEY`, `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO_AVD`). Deze moeten ook in Vercel staan.
- `supabase/participants.local.json` (gitignored): de deelnemerslijst MET inlogcodes; input voor `supabase/seed-participants.ts`.
- `INSTRUCTIE_RESEND_OPZETTEN.md` (gitignored): bevat een echte Resend-key.
- Service-role client alleen server-side (`lib/supabase/service-role.ts`).

## Operationele valkuilen / recente staat
- **OpenRouter-credits:** de beoordelaar kost echt geld per examen. Raakte een keer op (402) en blokkeerde alle uitslagen; check het saldo vóór drukke dagen. Zonder `max_tokens` reserveert elke call het volledige modelbudget (~65k), wat 402 kan geven bij laag saldo (bewust NIET gecapt op verzoek van de eigenaar).
- **Gemini Live free tier:** de Google-key staat mogelijk nog op free tier; dat geeft lage limieten en instabiele verbindingen bij veel gelijktijdige deelnemers. Billing aanzetten verhoogt limieten en houdt data uit training.
- **Recente fix (commit 1e58ee9):** een afgerond examen kon per ongeluk als `abandoned` bevriezen (herlaad-beacon) en dan niet beoordeeld worden. Nu beoordeelt de evaluator op het transcript, niet op het status-label, en mag "afronden" een strooi-`abandoned` herstellen. Zelfherstellend: een gedupeerde kan zijn resultaatpagina heropenen.
- **Tijdelijke beoordelaar-fouten** (rate limit/time-out) geven een 502 "Beoordelen niet gelukt"; "opnieuw proberen" lost dat meestal op. Handmatig doorzetten kan via `loadEvaluationContext` + `callEvaluator` + `persistEvaluation` met de service-role client (transcript blijft altijd bewaard).

## Conventies
- Geen em-dashes in copy/comments/prompts (komma's of nieuwe zinnen).
- Bestanden < 200 regels (uitzondering `lib/supabase/types.ts`), functies < 30 regels.
- Server/client-componenten correct markeren; `cookies()` is async (Next 16); geen `<form action=>`, gebruik `onSubmit` + `preventDefault`.
- Bloom: "categorieen van cognitieve processen", nooit "niveaus/hogere-lagere orde".
- AVD-branding via `@theme` in `app/globals.css` (paars: `--color-purple-primary: #a15df5`, etc.).

## Aan de slag
- `npm install`, `npm run dev`. Verifieer met `npx tsc --noEmit` en `npm run build`. `npm run lint` voor eslint.
- Migraties toepassen via de Supabase-tooling; target alleen AVD-tabellen.
- Deploy = push naar `master` (Vercel).
