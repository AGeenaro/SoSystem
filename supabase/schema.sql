-- Banco da API de usuários no projeto Supabase tmqyymurvkgjmejyhzdx.
-- Execute este script no SQL Editor do painel.
-- A API usa a service role e ignora RLS. As chaves anon/authenticated não leem esta tabela.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'operador',
  permissions jsonb not null default '{"view":["monitoramento","ordens","apontamento","recursos","engenharia","funcionarios","acompanhamento"],"edit":["monitoramento","ordens","apontamento","recursos","engenharia","funcionarios","acompanhamento"]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);

alter table public.users enable row level security;

revoke all on table public.users from anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

-- Produção compartilhada. O navegador só guarda uma fila local para trabalhar sem internet.

create table if not exists public.production_records (
  kind text not null check (kind in ('employee', 'product', 'order', 'punch', 'resource')),
  id text not null,
  payload jsonb not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  primary key (kind, id)
);

create table if not exists public.production_meta (
  id integer primary key check (id = 1),
  next_order_num integer not null default 1,
  next_employee_num integer not null default 1,
  updated_at timestamptz not null default now()
);

insert into public.production_meta (id)
values (1)
on conflict (id) do nothing;

alter table public.production_records enable row level security;
alter table public.production_meta enable row level security;

revoke all on table public.production_records from anon, authenticated;
revoke all on table public.production_meta from anon, authenticated;

alter table public.users add column if not exists permissions jsonb not null default '{"view":["monitoramento","ordens","apontamento","recursos","engenharia","funcionarios","acompanhamento"],"edit":["monitoramento","ordens","apontamento","recursos","engenharia","funcionarios","acompanhamento"]}'::jsonb;

do $$
declare constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'users'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%role%'
  loop
    execute format('alter table public.users drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.users drop constraint if exists users_role_check;
update public.users set role = 'administrador_suporte' where role = 'admin';
update public.users set role = 'operador' where role = 'user';
alter table public.users add constraint users_role_check check (role in ('visualizador', 'operador', 'administrador', 'administrador_suporte'));
