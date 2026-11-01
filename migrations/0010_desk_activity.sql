alter table inquiries add column if not exists source_path text not null default '';

create table if not exists store_events (
  id text primary key,
  factory_id text not null references factories(id),
  event_name text not null,
  page_path text not null,
  session_id text not null,
  anonymous_id text,
  sku text,
  referrer text,
  created_at timestamptz not null default now()
);
create index if not exists store_events_factory_time_idx on store_events (factory_id, created_at);

create table if not exists outbound_messages (
  id text primary key,
  factory_id text not null references factories(id),
  inquiry_id text,
  channel text not null,
  destination text not null,
  body text not null,
  status text not null,
  error text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists outbound_messages_factory_time_idx on outbound_messages (factory_id, created_at);
