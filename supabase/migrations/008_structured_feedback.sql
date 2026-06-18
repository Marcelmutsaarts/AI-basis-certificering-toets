-- 008_structured_feedback.sql
-- Gestructureerde feedback die de docent geeft TIJDENS het nakijken, in een
-- modal voor de uitslag verschijnt (geen bias door Lieke's output).
--  - feedback_rating: smiley-score 1 tot 5 op "Wat vond je van deze toetsvorm?"
--  - feedback_start / _stop / _continue: start, stop, doorgaan (vrije tekst).
--  - feedback_submitted_at: wanneer de feedback is ingestuurd.
-- Vervangt het oude vrije veld app_feedback (dat blijft als deprecated kolom
-- staan, niet meer gebruikt door de app). Alleen AVD-tabel exam_sessions.

alter table public.exam_sessions
  add column feedback_rating smallint check (feedback_rating between 1 and 5),
  add column feedback_start text,
  add column feedback_stop text,
  add column feedback_continue text,
  add column feedback_submitted_at timestamptz;
