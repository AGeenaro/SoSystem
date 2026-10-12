# SoSystem / Prodfy

Gestão de chão de fábrica no navegador, com a produção gravada no Supabase pela API.

O aplicativo não fica mais em um único HTML. A interface está em `web/` (HTML, CSS e JavaScript). A API está em `api/` (Node.js, Express e TypeScript). O banco SQL fica no Supabase. Não há serviço em Python.

## Onde está cada parte

| Parte | Pasta |
| --- | --- |
| Telas de produção | `web/` |
| API, Swagger e testes | `api/` |
| SQL | `supabase/schema.sql` |
| Contrato dos endpoints | [API.md](API.md) |
| Arquitetura | [docs/ARQUITETURA.md](docs/ARQUITETURA.md) |
| Vercel, Render e Supabase | [docs/DEPLOY.md](docs/DEPLOY.md) |
| Testes locais e pipeline | [docs/TESTES.md](docs/TESTES.md) |

## Subir localmente

```bash
cd api
npm install
npm test
```

Para a interface:

```bash
npx serve web -p 4173
```

A API de desenvolvimento precisa de `api/.env`, copiado de `api/.env.example`, com `JWT_SECRET` e `SUPABASE_SERVICE_ROLE_KEY`. O passo a passo de publicação está em `docs/DEPLOY.md`.

Swagger local: `http://localhost:3000/docs`.
