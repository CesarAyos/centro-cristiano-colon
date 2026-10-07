create table if not exists public.testimonios (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  asunto text not null,
  testimonio text not null,
  estado text not null default 'pendiente',
  created_at timestamptz default now()
);

create index if not exists testimonios_estado_idx on public.testimonios (estado);

alter table public.testimonios enable row level security;

drop policy if exists "Solo se pueden leer los testimonios aprobados" on public.testimonios;
create policy "Solo se pueden leer los testimonios aprobados"
  on public.testimonios for select
  using (estado = 'aprobado' or auth.uid() is not null);

drop policy if exists "Cualquiera puede enviar un testimonio pendiente" on public.testimonios;
create policy "Cualquiera puede enviar un testimonio pendiente"
  on public.testimonios for insert
  with check (estado = 'pendiente');

drop policy if exists "Solo usuarios autenticados pueden aprobar o rechazar" on public.testimonios;
create policy "Solo usuarios autenticados pueden aprobar o rechazar"
  on public.testimonios for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Solo usuarios autenticados pueden eliminar" on public.testimonios;
create policy "Solo usuarios autenticados pueden eliminar"
  on public.testimonios for delete
  using (auth.uid() is not null);
