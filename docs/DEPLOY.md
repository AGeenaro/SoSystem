# Publicação

## 1. Banco no Supabase

1. Abra o [SQL Editor](https://supabase.com/dashboard/project/tmqyymurvkgjmejyhzdx/sql/new) do projeto `tmqyymurvkgjmejyhzdx`.
2. Cole e execute `supabase/schema.sql`. Pode rodar de novo: o script cria o que falta, inclusive as tabelas de produção, e não apaga usuários já cadastrados.
3. Em Project Settings → API, copie a **service_role**. Ela não vai para o Git. Também não use essa chave no frontend.

URL do projeto, já usada pela API:

`https://tmqyymurvkgjmejyhzdx.supabase.co`

## 2. API no Render

O arquivo `render.yaml` descreve o serviço `sosystem-api`.

1. No Render, use **New → Blueprint** e aponte para este repositório GitHub, ou crie um Web Service manual com:
   - Root Directory: `api`
   - Build: `npm install --include=dev && npm run build`
   - Start: `npm start`
   - Health check: `/health`
2. Preencha no painel:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CORS_ORIGIN` com a URL da Vercel, por exemplo `https://seu-projeto.vercel.app`
3. O `JWT_SECRET` pode ser gerado pelo Render. Se criar o serviço na mão, gere uma string longa.
4. Depois do deploy, confira `https://sosystem-api.onrender.com/health` e `/docs`. Se o nome do serviço mudar, atualize `web/js/config.js` e `api/src/openapi.ts`.

No plano gratuito o serviço dorme após inatividade. A primeira chamada pode levar cerca de um minuto.

## 3. Frontend na Vercel

1. Importe o repositório.
2. Framework: Other.
3. Root Directory: `web`.
4. Não há comando de build. A saída é a própria pasta.
5. Publique. A raiz abre o Prodfy. `/conta.html` fala com a API.

Se a URL do Render não for `https://sosystem-api.onrender.com`, altere `apiUrl` de produção em `web/js/config.js` antes de publicar.

## 4. Desenvolvimento local

```bash
cd api
copy .env.example .env
npm install
npm test
npm run dev
```

Em outro terminal, na pasta `web`:

```bash
npx serve -p 4173
```

Abra `http://localhost:4173`. A página de conta usa `http://localhost:3000`. O `.env` precisa da service role e do `JWT_SECRET` para `npm run dev` subir de verdade. Os testes não precisam do Supabase.
