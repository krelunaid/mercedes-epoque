create table if not exists official_events (
  slug text primary key,
  title text not null,
  date_label text not null,
  place text not null,
  city text not null,
  image text not null,
  url text not null,
  source text not null,
  blurb text not null,
  start_date date not null,
  end_date date not null,
  updated_at timestamptz not null default now()
);
create index if not exists official_events_start_idx on official_events (start_date);

create table if not exists event_sync_meta (
  id integer primary key,
  last_synced_at timestamptz,
  last_ai_at timestamptz,
  last_error text
);
insert into event_sync_meta (id) values (1) on conflict (id) do nothing;
