-- BikeMesh core schema: bikes (one tag = one owner), sightings, alerts.
-- The rider's username lives in auth user metadata, so there is no profiles table.
-- Safe to run once in the Supabase SQL editor on a fresh project.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.bikes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- 16-byte iBeacon proximity UUID as 32 lowercase hex chars. Unique = first claim wins.
  tag_uuid text not null unique check (tag_uuid ~ '^[0-9a-f]{32}$'),
  name text not null check (char_length(name) between 1 and 40),
  emoji text not null default '🚲' check (char_length(emoji) <= 16),
  is_lost boolean not null default false,
  lost_at timestamptz,
  -- Cache of the newest sighting, written only by report_sighting().
  last_lat double precision,
  last_lng double precision,
  last_accuracy real,
  last_seen_at timestamptz,
  last_source text check (last_source in ('owner', 'crowd')),
  created_at timestamptz not null default now()
);
create index bikes_owner_id_idx on public.bikes (owner_id);
create index bikes_lost_idx on public.bikes (tag_uuid) where is_lost;

create table public.sightings (
  id bigint generated always as identity primary key,
  bike_id uuid not null references public.bikes (id) on delete cascade,
  reporter_id uuid references auth.users (id) on delete set null,
  source text not null check (source in ('owner', 'crowd')),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  accuracy real,
  rssi smallint,
  seen_at timestamptz not null default now()
);
create index sightings_bike_seen_idx on public.sightings (bike_id, seen_at desc);
create index sightings_reporter_idx on public.sightings (reporter_id);

create table public.alerts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  bike_id uuid not null references public.bikes (id) on delete cascade,
  type text not null check (type in ('crowd_sighting')),
  title text not null,
  body text not null,
  lat double precision,
  lng double precision,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
create index alerts_user_created_idx on public.alerts (user_id, created_at desc);
create index alerts_bike_idx on public.alerts (bike_id);

-- ---------------------------------------------------------------------------
-- Privileges: start from nothing, grant only what the app uses.
-- ---------------------------------------------------------------------------

revoke all on public.bikes, public.sightings, public.alerts
  from anon, authenticated;

grant select, delete on public.bikes to authenticated;
grant insert (tag_uuid, name, emoji) on public.bikes to authenticated;
grant update (name, emoji, is_lost) on public.bikes to authenticated;

-- reporter_id is deliberately not readable: a finder stays anonymous to the owner.
grant select (id, bike_id, source, lat, lng, accuracy, rssi, seen_at)
  on public.sightings to authenticated;

grant select, delete on public.alerts to authenticated;
grant update (resolved) on public.alerts to authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.bikes enable row level security;
alter table public.sightings enable row level security;
alter table public.alerts enable row level security;

create policy "own bikes: read" on public.bikes
  for select to authenticated using (owner_id = (select auth.uid()));
create policy "own bikes: claim" on public.bikes
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "own bikes: update" on public.bikes
  for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "own bikes: remove" on public.bikes
  for delete to authenticated using (owner_id = (select auth.uid()));

create policy "sightings of own bikes: read" on public.sightings
  for select to authenticated
  using (exists (
    select 1 from public.bikes b
    where b.id = sightings.bike_id and b.owner_id = (select auth.uid())
  ));

create policy "own alerts: read" on public.alerts
  for select to authenticated using (user_id = (select auth.uid()));
create policy "own alerts: update" on public.alerts
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own alerts: delete" on public.alerts
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Stamp lost_at when a bike is marked lost, clear it when found.
create function public.bikes_stamp_lost_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_lost and not old.is_lost then
    new.lost_at := now();
  elsif not new.is_lost then
    new.lost_at := null;
  end if;
  return new;
end;
$$;

create trigger bikes_stamp_lost_at
  before update of is_lost on public.bikes
  for each row execute function public.bikes_stamp_lost_at();

-- ---------------------------------------------------------------------------
-- RPCs (the only way the mesh touches other people's bikes)
-- ---------------------------------------------------------------------------

-- Pairing: of the tags my phone can see, which are still free to claim?
create function public.unclaimed_tags(p_tags text[])
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  select t
  from unnest(p_tags[1:50]) as t
  where (select auth.uid()) is not null
    and not exists (select 1 from public.bikes b where b.tag_uuid = t);
$$;

-- Crowd finding: tags of bikes currently marked lost by someone else.
create function public.lost_tags()
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  select b.tag_uuid
  from public.bikes b
  where b.is_lost
    and (select auth.uid()) is not null
    and b.owner_id <> (select auth.uid());
$$;

-- A phone saw a tag at a place. Records it if the caller owns the bike
-- ('owner') or the bike is marked lost ('crowd'); otherwise does nothing.
create function public.report_sighting(
  p_tag text,
  p_lat double precision,
  p_lng double precision,
  p_accuracy real default null,
  p_rssi integer default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_bike public.bikes%rowtype;
  v_source text;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_bike from public.bikes where tag_uuid = lower(p_tag);
  if not found then
    return 'ignored';
  end if;

  if v_bike.owner_id = v_uid then
    v_source := 'owner';
  elsif v_bike.is_lost then
    v_source := 'crowd';
  else
    return 'ignored';
  end if;

  -- One sighting per reporter per bike every 30 seconds is plenty.
  if exists (
    select 1 from public.sightings s
    where s.bike_id = v_bike.id
      and s.reporter_id = v_uid
      and s.seen_at > now() - interval '30 seconds'
  ) then
    return 'throttled';
  end if;

  insert into public.sightings (bike_id, reporter_id, source, lat, lng, accuracy, rssi)
  values (v_bike.id, v_uid, v_source, p_lat, p_lng, p_accuracy,
          greatest(least(p_rssi, 127), -127)::smallint);

  update public.bikes
  set last_lat = p_lat,
      last_lng = p_lng,
      last_accuracy = p_accuracy,
      last_seen_at = now(),
      last_source = v_source
  where id = v_bike.id;

  -- Tell the owner, at most once every 10 minutes per bike.
  if v_source = 'crowd' and not exists (
    select 1 from public.alerts a
    where a.bike_id = v_bike.id
      and a.type = 'crowd_sighting'
      and a.created_at > now() - interval '10 minutes'
  ) then
    insert into public.alerts (user_id, bike_id, type, title, body, lat, lng)
    values (
      v_bike.owner_id, v_bike.id, 'crowd_sighting',
      v_bike.name || ' was spotted',
      'Another BikeMesh rider just passed your lost bike. Open it to see where.',
      p_lat, p_lng
    );
  end if;

  return v_source;
end;
$$;

revoke execute on function public.unclaimed_tags(text[]) from public, anon;
revoke execute on function public.lost_tags() from public, anon;
revoke execute on function public.report_sighting(text, double precision, double precision, real, integer)
  from public, anon;
grant execute on function public.unclaimed_tags(text[]) to authenticated;
grant execute on function public.lost_tags() to authenticated;
grant execute on function public.report_sighting(text, double precision, double precision, real, integer)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Realtime: the app refetches when these change.
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table public.bikes, public.alerts;
