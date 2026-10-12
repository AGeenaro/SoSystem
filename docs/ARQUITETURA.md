# Arquitetura

O Prodfy deixou de ser um único arquivo HTML. Python não faz parte desta entrega: o chão de fábrica continua no navegador, e a API pedida é Node.js com TypeScript.

## Frontend (`web/`)

- `index.html` — estrutura das telas e modais
- `css/app.css` — visual
- `js/app.js` — monitoramento, ordens, apontamento, recursos, engenharia, funcionários e acompanhamento
- `assets/photos/` — 15 fotos que antes estavam embutidas em base64
- `js/config.js` — URL da API
- `conta.html` e `js/conta.js` — cadastro, login e CRUD de usuários contra a API

Os dados de produção (ordens, apontamentos, recursos, produtos e funcionários de fábrica) ficam no `localStorage` do navegador, na chave `prodfy_data_v7_cracha`. Isso substitui o `window.storage` do arquivo único, que só existia no ambiente em que o HTML foi gerado. A página de conta usa outra chave, `prodfy_jwt`, só para o token.

## API (`api/`)

Express organiza as rotas em `src/app.ts`. O servidor de produção está em `src/server.ts` e só sobe com Supabase configurado.

- Validação com Zod. Campo desconhecido ou fora da regra vira `422`.
- Erros passam por um middleware único em `src/http.ts`.
- Rate limit em `src/rateLimit.ts`.
- JWT em `src/auth.ts`.
- OpenAPI em `src/openapi.ts`, publicado em `/docs` e `/openapi.json`.
- Testes usam um repositório em memória. Produção usa `src/repositories/supabaseUserRepository.ts`.

## Banco

Supabase Postgres, projeto [tmqyymurvkgjmejyhzdx](https://supabase.com/dashboard/project/tmqyymurvkgjmejyhzdx). O script está em `supabase/schema.sql`. A tabela é `public.users`. RLS fica ligado e não há política para as chaves `anon` e `authenticated`, então o navegador não lê o hash da senha. Só a service role, usada no Render, acessa a tabela.

## Hospedagem

- Frontend estático na Vercel, diretório raiz `web`.
- API no Render, serviço `sosystem-api`, definido em `render.yaml`.
