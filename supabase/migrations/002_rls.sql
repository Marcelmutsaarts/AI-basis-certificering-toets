-- AVD Voice-to-Voice Toets-app: RLS policies v1

alter table profiles enable row level security;
alter table exam_sessions enable row level security;
alter table transcripts enable row level security;
alter table evaluations enable row level security;
alter table casuses enable row level security;
alter table webhook_deliveries enable row level security;

create or replace function is_admin() returns boolean as $$
  select exists (select 1 from profiles where user_id = auth.uid() and role = 'admin');
$$ language sql security definer stable;

-- profiles
create policy "profiles_own_or_admin_read" on profiles for select using (user_id = auth.uid() or is_admin());
create policy "profiles_admin_write" on profiles for all using (is_admin()) with check (is_admin());

-- exam_sessions
create policy "sessions_own_select" on exam_sessions for select using (user_id = auth.uid() or is_admin());
create policy "sessions_own_insert" on exam_sessions for insert with check (user_id = auth.uid());
create policy "sessions_own_update" on exam_sessions for update using (user_id = auth.uid() or is_admin());

-- transcripts
create policy "transcripts_own_select" on transcripts for select using (
  exists (select 1 from exam_sessions s where s.id = transcripts.exam_session_id and (s.user_id = auth.uid() or is_admin()))
);
create policy "transcripts_own_insert" on transcripts for insert with check (
  exists (select 1 from exam_sessions s where s.id = transcripts.exam_session_id and s.user_id = auth.uid())
);

-- evaluations
create policy "evaluations_own_select" on evaluations for select using (
  exists (select 1 from exam_sessions s where s.id = evaluations.exam_session_id and (s.user_id = auth.uid() or is_admin()))
);

-- casuses
create policy "casuses_authenticated_read" on casuses for select using (auth.role() = 'authenticated');

-- webhook_deliveries
create policy "webhook_admin_only" on webhook_deliveries for all using (is_admin()) with check (is_admin());
