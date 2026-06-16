-- 005_nullable_profile_school_niveau.sql
-- Onboarding na login: deelnemers vullen school en niveau zelf in.
-- De deelnemerslijst bevat alleen naam + e-mail, dus profiles wordt
-- pre-aangemaakt met school/niveau leeg. Daarom NOT NULL eraf.
-- De gating in de app dwingt af dat een docent beide invult voor /start,
-- zodat Lieke's system-prompt en de beoordelaar altijd een echt niveau zien.
-- Alleen AVD-tabel public.profiles wordt geraakt.

alter table public.profiles alter column school drop not null;
alter table public.profiles alter column niveau drop not null;
