-- Run this in Supabase SQL editor once.
-- Stores Edenify state by app user id (for example: admin-root, usr-...).
-- Intended access pattern: backend service role key only.

create table if not exists public.edenify_user_state (
  user_id text primary key,
  state_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.edenify_user_state enable row level security;

drop policy if exists "No direct client read" on public.edenify_user_state;
drop policy if exists "No direct client insert" on public.edenify_user_state;
drop policy if exists "No direct client update" on public.edenify_user_state;

create policy "No direct client read"
on public.edenify_user_state
for select
using (false);

create policy "No direct client insert"
on public.edenify_user_state
for insert
with check (false);

create policy "No direct client update"
on public.edenify_user_state
for update
using (false)
with check (false);
