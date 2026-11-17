-- PostgreSQL setup schema for Vercel/Supabase deployments.
-- Do not apply the SQLite/D1 migration to Supabase.
create table public.learning_records (
  id text primary key,
  owner_id uuid not null references auth.users(id),
  sequence bigint generated always as identity unique,
  kind text not null check (kind in ('task','submission','quiz','study','review','approval','skill','reflection')),
  day integer not null check (day between 0 and 60),
  payload text not null check (jsonb_typeof(payload::jsonb) = 'object'),
  actor text not null,
  created_at timestamptz not null
);

create index learning_records_owner_sequence on public.learning_records(owner_id, sequence);
alter table public.learning_records enable row level security;
revoke all on public.learning_records from anon, authenticated;
grant select, insert on public.learning_records to authenticated;
grant usage on sequence public.learning_records_sequence_seq to authenticated;

create policy "Owners read their own learning records" on public.learning_records
  for select to authenticated using ((select auth.uid()) = owner_id);
create policy "Owners append their own learning records" on public.learning_records
  for insert to authenticated with check ((select auth.uid()) = owner_id and actor = (select auth.uid())::text);
