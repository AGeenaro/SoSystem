-- Códigos do sistema: auto incremento ou digitados (pedido continua sempre digitado).
alter table public.companies add column if not exists code_mode text not null default 'auto';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'companies_code_mode_check'
  ) then
    alter table public.companies
      add constraint companies_code_mode_check check (code_mode in ('auto', 'manual'));
  end if;
end $$;
