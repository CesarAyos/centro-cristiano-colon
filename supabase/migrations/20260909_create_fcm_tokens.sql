create table if not exists public.fcm_tokens (
  id uuid default gen_random_uuid() primary key,
  device_id text not null unique,
  token text not null,
  created_at timestamptz default now()
);

alter table public.fcm_tokens enable row level security;

create policy "Anyone can insert or update own device token"
  on public.fcm_tokens for all
  using (true)
  with check (true);

create table if not exists public.fcm_logs (
  id uuid default gen_random_uuid() primary key,
  device_id text,
  message text not null,
  created_at timestamptz default now()
);

alter table public.fcm_logs enable row level security;

create policy "Anyone can insert logs"
  on public.fcm_logs for insert
  with check (true);

create policy "Anyone can read logs"
  on public.fcm_logs for select
  using (true);
