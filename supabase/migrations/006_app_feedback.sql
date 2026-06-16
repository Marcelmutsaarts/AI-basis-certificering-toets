-- 006_app_feedback.sql
-- Facultatief feedbackveld over de app, ingevuld door de docent op de
-- resultaatpagina na afloop. Eén vrije tekst per sessie, zodat we de app
-- kunnen verbeteren en de feedback later met de resultaatmail mee kan.
-- De docent schrijft via de bestaande sessions_own_update policy.
-- Alleen AVD-tabel public.exam_sessions wordt geraakt.

alter table public.exam_sessions add column app_feedback text;
