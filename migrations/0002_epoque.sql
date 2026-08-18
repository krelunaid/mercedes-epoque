create table if not exists favorites (
  user_id text not null,
  car_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, car_slug)
);

create table if not exists bookings (
  id text primary key,
  user_id text not null,
  car_slug text not null,
  start_date date not null,
  end_date date not null,
  atmosphere text not null,
  insurance text not null,
  total_cents integer not null,
  pickup text not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);
create index if not exists bookings_user_id_idx on bookings (user_id);

create table if not exists event_rsvps (
  user_id text not null,
  event_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_slug)
);
