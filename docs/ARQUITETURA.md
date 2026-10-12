# Arquitetura

O Prodfy deixou de ser um único arquivo HTML. Python não faz parte desta entrega: o chão de fábrica continua no navegador, e a API pedida é Node.js com TypeScript.

## Frontend (`web/`)

- `index.html` — estrutura das telas e modais
- `css/app.css` — visual
- `js/app.js` — monitoramento, ordens, apontamento, recursos, engenharia, funcionários e acompanhamento
- `js/config.js` — URL da API
- `conta.html` e `js/conta.js` — cadastro, login e CRUD de usuários contra a API

Ordens, apontamentos, células, produtos e funcionários ficam nas tabelas `public.production_records` e `public.production_meta`. O navegador guarda só a fila `prodfy_sync_v1` para continuar sem internet. Quando a conexão volta, `POST /api/production/sync` envia as alterações. O registro com `updatedAt` mais recente vence, a exclusão fica marcada e os contadores de ordem e funcionário ficam com o maior número. A chave antiga `prodfy_data_v7_cracha` é apagada e não entra no banco. A página de conta usa `prodfy_jwt` para o token. Os funcionários aparecem pelas iniciais, sem fotos de exemplo.

## API (`api/`)

Express organiza as rotas em `src/app.ts`. O servidor de produção está em `src/server.ts` e só sobe com Supabase configurado.

- Validação com Zod. Campo desconhecido ou fora da regra vira `422`.
- Erros passam por um middleware único em `src/http.ts`.
- Rate limit em `src/rateLimit.ts`.
- JWT em `src/auth.ts`.
- OpenAPI em `src/openapi.ts`, publicado em `/docs` e `/openapi.json`.
- Testes usam um repositório em memória. Produção usa `src/repositories/supabaseUserRepository.ts`.

## Banco

Supabase Postgres, projeto [tmqyymurvkgjmejyhzdx](https://supabase.com/dashboard/project/tmqyymurvkgjmejyhzdx). O script está em `supabase/schema.sql`. As tabelas são `public.users`, `public.production_records` e `public.production_meta`. RLS fica ligado e não há política para as chaves `anon` e `authenticated`, então o navegador não lê o banco direto. Só a service role, usada no Render, acessa as tabelas.

## Hospedagem

- Frontend estático na Vercel, diretório raiz `web`.
- API no Render, serviço `sosystem-api`, definido em `render.yaml`.
