-- 007_result_email_sent_at.sql
-- Tijdstempel van wanneer de docent het resultaat per mail naar het AVD-team
-- heeft verstuurd (punt 2, Resend). Nullable: leeg betekent nog niet verstuurd.
-- Zo kan de resultaatpagina "verstuurd op ..." tonen en weet de admin of de
-- mail al uit is. Alleen AVD-tabel public.exam_sessions wordt geraakt.

alter table public.exam_sessions add column result_email_sent_at timestamptz;
