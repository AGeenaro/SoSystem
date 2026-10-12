# Testes

Os testes rodam na máquina e também no GitHub Actions, no workflow `.github/workflows/ci.yml`, a cada push e pull request. Não é preciso escolher um dos dois: o comando local é o mesmo que a pipeline executa.

Na pasta `api`:

```bash
npm test
npm run build
```

`npm test` cobre:

- saúde, OpenAPI e rota inexistente
- JSON inválido
- validação de cadastro, login e JWT
- CRUD de usuários com papéis admin e user
- rate limit das rotas de autenticação
- separação do frontend (HTML, CSS, JS e as 15 fotos)

O banco desses testes é memória. Eles não gravam no Supabase e não exigem chave.

Para ver o chão de fábrica no navegador, sirva a pasta `web` e percorra Monitoramento, Ordens, Apontamento, Recursos, Engenharia, Funcionários e Acompanhamento. A página `conta.html` só completa o fluxo de ponta a ponta com a API no ar e a tabela criada no Supabase.
