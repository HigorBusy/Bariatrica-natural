create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  goal text not null,
  difficulty_moment text not null,
  satiety_level text not null,
  main_obstacle text not null,
  routine_level text not null,
  preferred_plan text not null,
  quiz_result text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

create index if not exists leads_email_idx
  on public.leads (email);

create index if not exists quiz_answers_lead_id_idx
  on public.quiz_answers (lead_id);

alter table public.leads enable row level security;
alter table public.quiz_answers enable row level security;

drop policy if exists "Allow public lead capture inserts" on public.leads;
create policy "Allow public lead capture inserts"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public quiz answer inserts" on public.quiz_answers;
create policy "Allow public quiz answer inserts"
  on public.quiz_answers
  for insert
  to anon, authenticated
  with check (true);

grant usage on schema public to anon, authenticated;
grant insert on table public.leads to anon, authenticated;
grant insert on table public.quiz_answers to anon, authenticated;
