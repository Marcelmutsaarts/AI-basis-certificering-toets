-- 009_soften_casus_1c.sql
-- Casus 1C verzacht: van "wat verandert er in de onderwijspraktijk als we van
-- chatbots naar autonome agents gaan" (impact duiden) naar een zuivere
-- kennisvraag over het verschil. De bijbehorende beoordelingsaanwijzing in
-- lib/knowledge/casus-cards-1.ts is mee aangepast (gevolgen nu bonus, geen eis).
-- Alleen AVD-tabel public.casuses, alleen rij 1C.

update public.casuses
set prompt = 'Wat is het verschil tussen chatbots en autonome agents?'
where code = '1C';
