-- 010_feedback_goed_nietgoed.sql
-- Feedback-vragen vereenvoudigd: van start/stop/doorgaan naar twee helderdere
-- vragen, "wat vond je goed aan deze toetsvorm" en "wat vond je niet goed".
-- De smiley-rating blijft. Er is nog geen echte feedback-data (feature net
-- live, geen examens gedaan), dus we hernoemen twee kolommen en laten de derde
-- vervallen. Alleen AVD-tabel public.exam_sessions.

alter table public.exam_sessions rename column feedback_start to feedback_positief;
alter table public.exam_sessions rename column feedback_stop to feedback_negatief;
alter table public.exam_sessions drop column feedback_continue;
