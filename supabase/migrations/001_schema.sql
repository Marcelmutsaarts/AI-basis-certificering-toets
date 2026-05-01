-- AVD Voice-to-Voice Toets-app: schema v1
-- 6 enums + 6 tabellen + indexen.

-- Custom types
create type user_role as enum ('docent', 'admin', 'tester');
create type onderwijsniveau as enum ('PO', 'VO', 'MBO', 'HBO', 'WO');
create type exam_status as enum ('in_progress', 'completed', 'abandoned', 'evaluated');
create type speaker_type as enum ('bot', 'docent');
create type score_type as enum ('GROEN', 'ORANJE', 'ROOD');
create type delivery_status as enum ('pending', 'sent', 'failed', 'skipped');

-- profiles
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  full_name text not null,
  role user_role not null default 'docent',
  school text not null,
  niveau onderwijsniveau not null,
  vakgebied text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- exam_sessions
create table exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  status exam_status not null default 'in_progress',
  live_session_id text,
  casus_ids uuid[]
);
create index exam_sessions_user_idx on exam_sessions(user_id, started_at desc);

-- transcripts
create table transcripts (
  id uuid primary key default gen_random_uuid(),
  exam_session_id uuid not null references exam_sessions(id) on delete cascade,
  speaker speaker_type not null,
  text text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  sequence int not null
);
create index transcripts_session_seq_idx on transcripts(exam_session_id, sequence);

-- evaluations
create table evaluations (
  id uuid primary key default gen_random_uuid(),
  exam_session_id uuid not null references exam_sessions(id) on delete cascade unique,
  model_used text not null,
  raw_output jsonb not null,
  mindset_score score_type not null,
  ethiek_score score_type not null,
  kennis_score score_type not null,
  pedagogiek_score score_type not null,
  agency_score score_type not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);

-- casuses
create table casuses (
  id uuid primary key default gen_random_uuid(),
  webinar int not null check (webinar between 1 and 5),
  code text not null unique,
  prompt text not null,
  domains text[] not null,
  bloom_category text not null,
  active boolean not null default true
);
create index casuses_webinar_active_idx on casuses(webinar, active);

-- webhook_deliveries
create table webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  exam_session_id uuid not null references exam_sessions(id) on delete cascade,
  status delivery_status not null default 'pending',
  attempts int not null default 0,
  last_error text,
  skipped_reason text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index webhook_deliveries_status_idx on webhook_deliveries(status, created_at);
