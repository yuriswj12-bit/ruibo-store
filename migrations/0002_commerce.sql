create table if not exists factories (
  id text primary key,
  owner_user_id text,
  name text not null,
  slug text not null unique,
  contact_email text not null default '',
  whatsapp text not null default '',
  primary_color text not null default '#9a3412',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  factory_id text not null references factories(id),
  sku text not null,
  title text not null,
  price_range text,
  moq integer not null default 1,
  sample_price numeric(10,2) not null,
  sample_stock integer not null default 0,
  pdf_url text,
  specs jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  unique (factory_id, sku)
);

create table if not exists oe_refs (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  raw_oe text not null,
  normalized_oe text not null,
  brand text
);
create index if not exists oe_refs_norm_idx on oe_refs (normalized_oe);

create table if not exists fitments (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  year integer not null,
  make text not null,
  model text not null,
  engine text not null,
  position text
);
create index if not exists fitments_ymm_idx on fitments (make, model, year);

create table if not exists inquiries (
  id text primary key,
  factory_id text not null references factories(id),
  product_sku text,
  customer_name text not null,
  customer_email text not null,
  whatsapp text,
  quantity integer,
  country text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists sample_orders (
  id text primary key,
  factory_id text not null references factories(id),
  product_sku text not null,
  quantity integer not null,
  amount text not null,
  gateway text not null,
  status text not null default 'pending',
  buyer_name text not null,
  country text not null,
  created_at timestamptz not null default now()
);

insert into factories (id, name, slug, contact_email, whatsapp)
values ('fac_xinda', '鑫达汽车传感器', 'xinda-sensor', 'sales@xinda-sensor.com', '+8613800000000')
on conflict (id) do nothing;

insert into products (id, factory_id, sku, title, price_range, moq, sample_price, sample_stock, pdf_url, specs)
values (
  'prd_os',
  'fac_xinda',
  'OS-B0258006027',
  'Downstream Oxygen Sensor for Toyota Corolla 1.8L 2014-2019',
  '$7.80 - $11.50 / pcs',
  100,
  28.00,
  35,
  'https://pub-r2.matrix-commerce.com/specs/OS-B0258006027.pdf',
  '{"sensor_type":"Zirconia / Heated","wire_length_mm":450,"pins":4,"thread_size":"M18 x 1.5","wrench_size_mm":22,"connector_gender":"Male","warranty_years":2}'::jsonb
)
on conflict (id) do nothing;

insert into oe_refs (id, product_id, raw_oe, normalized_oe, brand) values
  ('oe1', 'prd_os', '0 258 006 027', '0258006027', 'Bosch'),
  ('oe2', 'prd_os', '89465-02130', '8946502130', 'Toyota'),
  ('oe3', 'prd_os', 'DOX-0109', 'DOX0109', 'Denso'),
  ('oe4', 'prd_os', '22690-AA007', '22690AA007', 'Subaru')
on conflict (id) do nothing;

insert into fitments (id, product_id, year, make, model, engine, position) values
  ('ft2014', 'prd_os', 2014, 'Toyota', 'Corolla', '1.8L L4', 'Downstream'),
  ('ft2015', 'prd_os', 2015, 'Toyota', 'Corolla', '1.8L L4', 'Downstream'),
  ('ft2016', 'prd_os', 2016, 'Toyota', 'Corolla', '1.8L L4', 'Downstream'),
  ('ft2017', 'prd_os', 2017, 'Toyota', 'Corolla', '1.8L L4', 'Downstream'),
  ('ft2018', 'prd_os', 2018, 'Toyota', 'Corolla', '1.8L L4', 'Downstream'),
  ('ft2019', 'prd_os', 2019, 'Toyota', 'Corolla', '1.8L L4', 'Downstream')
on conflict (id) do nothing;
