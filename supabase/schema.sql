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

-- Empresas, limites, bloqueio, pedidos de senha e logs.
-- Pode rodar de novo: cria o que falta e não apaga usuários nem produção.

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  max_users integer not null default 50 check (max_users > 0),
  max_machines integer not null default 50 check (max_machines > 0),
  max_registrations integer not null default 500 check (max_registrations > 0),
  usage_until date,
  blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies drop column if exists logo;

alter table public.companies enable row level security;
revoke all on table public.companies from anon, authenticated;

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
before update on public.companies
for each row
execute function public.set_updated_at();

alter table public.users add column if not exists company_id uuid;
alter table public.users add column if not exists must_change_password boolean not null default false;
alter table public.users add column if not exists blocked boolean not null default false;
alter table public.users add column if not exists blocked_by_role text;

do $$
begin
  alter table public.users
    add constraint users_company_id_fkey foreign key (company_id) references public.companies(id);
exception
  when duplicate_object then null;
end $$;

create table if not exists public.password_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  email text not null,
  role text not null,
  company_id uuid,
  status text not null default 'pendente' check (status in ('pendente', 'atendida', 'recusada')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  actor_id uuid,
  actor_email text not null,
  action text not null,
  entity_kind text not null,
  entity_id text not null,
  valor_anterior jsonb,
  valor_atual jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_actor_idx on public.audit_logs (actor_id, created_at desc);
create index if not exists password_requests_status_idx on public.password_requests (status, created_at desc);

alter table public.password_requests enable row level security;
alter table public.audit_logs enable row level security;
revoke all on table public.password_requests from anon, authenticated;
revoke all on table public.audit_logs from anon, authenticated;

alter table public.production_records add column if not exists company_id uuid;

do $$
declare chosen_company uuid;
begin
  if exists (select 1 from public.production_records where company_id is null)
     or exists (select 1 from public.users where role <> 'administrador_suporte' and company_id is null) then
    select id into chosen_company from public.companies where name = 'Empresa principal' limit 1;
    if chosen_company is null then
      insert into public.companies (name) values ('Empresa principal') returning id into chosen_company;
    end if;
    update public.production_records set company_id = chosen_company where company_id is null;
    update public.users set company_id = chosen_company where company_id is null and role <> 'administrador_suporte';
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'production_records_pkey'
      and pg_get_constraintdef(oid) not ilike '%company_id%'
  ) then
    delete from public.production_records where company_id is null;
    alter table public.production_records drop constraint production_records_pkey;
    alter table public.production_records alter column company_id set not null;
    alter table public.production_records add primary key (company_id, kind, id);
  end if;
end $$;

do $$
declare constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'production_records'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%kind%'
  loop
    execute format('alter table public.production_records drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.production_records drop constraint if exists production_records_kind_check;
alter table public.production_records
  add constraint production_records_kind_check
  check (kind in ('employee', 'product', 'order', 'punch', 'resource', 'group', 'family', 'equipment'));

create table if not exists public.production_counters (
  company_id uuid primary key references public.companies(id),
  next_order_num integer not null default 1,
  next_employee_num integer not null default 1,
  updated_at timestamptz not null default now()
);

insert into public.production_counters (company_id, next_order_num, next_employee_num)
select records.company_id, meta.next_order_num, meta.next_employee_num
from (select distinct company_id from public.production_records where company_id is not null) records
join public.production_meta meta on meta.id = 1
on conflict (company_id) do nothing;

alter table public.production_counters enable row level security;
revoke all on table public.production_counters from anon, authenticated;

-- Sessão única, chamados de suporte e notificações.
alter table public.users add column if not exists session_version integer not null default 0;

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  author_id uuid not null references public.users(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  subject text not null,
  message text not null,
  status text not null default 'aberto' check (status in ('aberto', 'em_andamento', 'resolvido')),
  reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_tickets_status_idx on public.support_tickets (status, updated_at desc);

drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
create trigger support_tickets_set_updated_at
before update on public.support_tickets
for each row
execute function public.set_updated_at();

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text not null,
  kind text not null,
  entity_id text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.support_tickets enable row level security;
alter table public.notifications enable row level security;
revoke all on table public.support_tickets from anon, authenticated;
revoke all on table public.notifications from anon, authenticated;
