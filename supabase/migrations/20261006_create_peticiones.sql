create table if not exists public.peticiones (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  tipo text not null default 'oracion',
  fecha date not null,
  mensaje text not null,
  estado text not null default 'pendiente',
  created_at timestamptz default now()
);

create index if not exists peticiones_fecha_idx on public.peticiones (fecha);
create index if not exists peticiones_estado_idx on public.peticiones (estado);

alter table public.peticiones enable row level security;

drop policy if exists "Solo se pueden leer las peticiones aprobadas" on public.peticiones;
create policy "Solo se pueden leer las peticiones aprobadas"
  on public.peticiones for select
  using (estado = 'aprobado' or auth.uid() is not null);

drop policy if exists "Cualquiera puede enviar una peticion pendiente" on public.peticiones;
create policy "Cualquiera puede enviar una peticion pendiente"
  on public.peticiones for insert
  with check (estado = 'pendiente');

drop policy if exists "Solo usuarios autenticados pueden aprobar o rechazar" on public.peticiones;
create policy "Solo usuarios autenticados pueden aprobar o rechazar"
  on public.peticiones for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Solo usuarios autenticados pueden eliminar" on public.peticiones;
create policy "Solo usuarios autenticados pueden eliminar"
  on public.peticiones for delete
  using (auth.uid() is not null);
