-- MoodLab architecture schema starter. Adapt to your backend provider.
create table profiles (
  id uuid primary key,
  display_name text,
  avatar_url text,
  subscription_tier text default 'free',
  created_at timestamptz default now()
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  bucket text not null,
  path text not null,
  mime_type text,
  checksum text,
  visibility text check (visibility in ('public','private','signed')) default 'private',
  created_at timestamptz default now()
);

create table lut_packs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles(id),
  name text not null,
  description text,
  category text,
  status text check (status in ('draft','review','approved','rejected','archived')) default 'draft',
  price_type text check (price_type in ('free','pro','one_time')) default 'free',
  product_id text,
  cover_asset_id uuid references assets(id),
  created_at timestamptz default now()
);

create table luts (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references lut_packs(id) on delete cascade,
  name text not null,
  file_asset_id uuid references assets(id),
  cube_size int not null,
  color_space text default 'sRGB-display-referred',
  default_strength numeric default 0.75,
  tags text[] default '{}',
  status text check (status in ('draft','approved','rejected')) default 'draft',
  created_at timestamptz default now()
);

create table presets (
  id uuid primary key default gen_random_uuid(),
  lut_id uuid references luts(id) on delete cascade,
  name text not null,
  category text,
  adjustment_json jsonb default '{}',
  overlay_json jsonb default '{}',
  export_ratio text,
  created_at timestamptz default now()
);

create table entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  pack_id uuid references lut_packs(id),
  source text,
  product_id text,
  active_until timestamptz,
  created_at timestamptz default now(),
  unique(user_id, pack_id, product_id)
);

create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  provider text not null,
  product_id text not null,
  transaction_id text unique,
  status text,
  created_at timestamptz default now()
);

create table edit_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  source_asset_id uuid references assets(id),
  recipe_json jsonb not null,
  updated_at timestamptz default now()
);

create table creator_profiles (
  user_id uuid primary key references profiles(id),
  display_name text not null,
  approval_status text default 'pending',
  payout_status text default 'not_connected',
  created_at timestamptz default now()
);

create table events (
  id bigserial primary key,
  user_id uuid references profiles(id),
  event_name text not null,
  properties jsonb default '{}',
  created_at timestamptz default now()
);
