-- ============================================================================
-- RSVP Database Schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- ============================================================================

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Tables
-- ----------------------------------------------------------------------------

create table if not exists wedding_parties (
  id uuid primary key default gen_random_uuid(),
  party_name text not null,
  song_suggestions text
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references wedding_parties (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  is_attending boolean default null,
  will_join_games boolean not null default false,
  email text,
  updated_at timestamptz not null default now()
);

-- If this schema already ran against your project before the dietary field
-- was replaced with email, this brings an existing table up to date.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'guests' and column_name = 'dietary_restrictions'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'guests' and column_name = 'email'
  ) then
    alter table guests rename column dietary_restrictions to email;
  end if;
end $$;

create index if not exists guests_party_id_idx on guests (party_id);
create index if not exists guests_name_idx on guests (last_name, first_name);

-- Keep updated_at current on every edit.
create or replace function set_guests_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists guests_set_updated_at on guests;
create trigger guests_set_updated_at
  before update on guests
  for each row
  execute function set_guests_updated_at();

-- ----------------------------------------------------------------------------
-- 2. Row Level Security
-- ----------------------------------------------------------------------------
-- The RSVP page is public and unauthenticated, so access is granted to the
-- `anon` role. Reads are open (needed to search by name); writes are scoped
-- to only the columns the RSVP form is allowed to change, via column-level
-- GRANTs, so guests can't rewrite their own name or move to another party.

alter table wedding_parties enable row level security;
alter table guests enable row level security;

-- --- Read policies: anyone can search guests and load their party info. ---

drop policy if exists "Public can read guests" on guests;
create policy "Public can read guests"
  on guests
  for select
  to anon
  using (true);

drop policy if exists "Public can read wedding parties" on wedding_parties;
create policy "Public can read wedding parties"
  on wedding_parties
  for select
  to anon
  using (true);

-- --- Update policies: anyone can update RSVP fields once they've found their
--     invitation. Row-level policy allows the update; column-level GRANTs
--     (below) restrict which columns can actually change. ---

drop policy if exists "Public can update guest RSVP fields" on guests;
create policy "Public can update guest RSVP fields"
  on guests
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Public can update party song suggestions" on wedding_parties;
create policy "Public can update party song suggestions"
  on wedding_parties
  for update
  to anon
  using (true)
  with check (true);

-- ----------------------------------------------------------------------------
-- 3. Column-level privileges
-- ----------------------------------------------------------------------------
-- RLS policies control *which rows* are visible/writable; these GRANTs
-- control *which columns* the anon role may write to, so the RSVP form
-- can't be used to tamper with names, party assignment, or ids.

grant usage on schema public to anon;

grant select on wedding_parties to anon;
grant select on guests to anon;

grant update (song_suggestions) on wedding_parties to anon;
grant update (is_attending, will_join_games, email) on guests to anon;
