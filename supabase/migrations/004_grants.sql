-- 004_grants.sql
-- Fix BUG-W3-001: missing base table grants for authenticated role
-- Self-update policy voor profiles voor last_login_at.

grant usage on schema public to authenticated, anon;

grant select on table public.casuses to authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update on table public.exam_sessions to authenticated;
grant select, insert on table public.transcripts to authenticated;
grant select on table public.evaluations to authenticated;
grant select on table public.webhook_deliveries to authenticated;

grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated;
grant usage, select on all sequences in schema public to service_role;

alter default privileges in schema public grant select, insert, update on tables to authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to authenticated;
alter default privileges in schema public grant all on sequences to service_role;

drop policy if exists "profiles_admin_write" on profiles;

create policy "profiles_admin_all" on profiles
  for all using (is_admin()) with check (is_admin());

create policy "profiles_own_update" on profiles
  for update
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and role = (select role from profiles p2 where p2.user_id = auth.uid())
  );
