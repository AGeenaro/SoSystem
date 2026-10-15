# API de usuários — SoSystem

API REST em Node.js, Express e TypeScript. O banco SQL é a tabela `public.users` no Supabase. A autenticação é JWT próprio da API (Bearer), não a sessão do Supabase Auth.

Base local: `http://localhost:3000`  
Swagger: `http://localhost:3000/docs`  
OpenAPI: `http://localhost:3000/openapi.json`

## Autenticação

Rotas protegidas exigem o cabeçalho:

```http
Authorization: Bearer <accessToken>
```

O token é emitido em `POST /api/auth/register` e `POST /api/auth/login`. O payload contém `sub` (id do usuário), `email`, `role` e `sv` (versão da sessão). Um segundo login da mesma conta invalida o token anterior com `401` e `SESSION_REPLACED`. A validade padrão é `8h` (`JWT_EXPIRES_IN`).

A primeira conta criada por `/api/auth/register` recebe `role: administrador_suporte` e o cadastro público fecha. Os perfis seguintes são `visualizador`, `operador`, `administrador` e `administrador_suporte`. O administrador suporte cria qualquer perfil. O administrador cria os demais e não altera contas de suporte. O visualizador não grava produção. `GET /api/auth/status` responde `{ "data": { "needsSetup": true } }` quando ainda não existe conta.

A senha nunca volta nas respostas. Ela é guardada como hash bcrypt.

## Formato

Sucesso:

```json
{ "data": {} }
```

Erro:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos.",
    "details": [{ "path": "email", "message": "E-mail inválido." }]
  }
}
```

`DELETE` bem-sucedido responde `204` sem corpo.

## Códigos de erro

| HTTP | code | Quando |
| --- | --- | --- |
| 400 | `INVALID_JSON` | Corpo não é JSON |
| 401 | `UNAUTHORIZED` | Token ausente, expirado, inválido, ou usuário removido |
| 401 | `SESSION_REPLACED` | A mesma conta entrou em outro computador |
| 409 | `CODE_IN_USE` | Código de usuário ou empresa já existe |
| 503 | `SCHEMA_PENDING` | Falta rodar `supabase/schema.sql` |
| 401 | `INVALID_CREDENTIALS` | E-mail ou senha incorretos no login |
| 403 | `FORBIDDEN` | Papel insuficiente, consulta de outra conta, ou autoexclusão |
| 404 | `NOT_FOUND` | Rota ou usuário inexistente |
| 409 | `EMAIL_IN_USE` | E-mail já cadastrado |
| 422 | `VALIDATION_ERROR` | Payload ou UUID fora das regras |
| 429 | `RATE_LIMITED` | Limite de requisições estourou |
| 500 | `INTERNAL_ERROR` | Falha não tratada |
| 500 | `DATABASE_ERROR` | Falha ao falar com o Supabase |

## Limites

Janela padrão de 15 minutos:

- rotas `/api`: 100 requisições por IP
- rotas `/api/auth/*`: mais 10 requisições por IP

A resposta `429` inclui os cabeçalhos padrão de rate limit. `/health` fica fora desses limites para o health check do Render.

## Endpoints

### `GET /health`

Resposta `200`:

```json
{ "data": { "status": "ok", "service": "sosystem-api", "version": "2026.10.20" } }
```

### `POST /api/auth/register`

Público. Cria a conta e devolve o JWT.

Pedido:

```json
{
  "name": "Ana Souza",
  "email": "ana@fabrica.com",
  "password": "senha-segura"
}
```

Regras: nome de 2 a 80 caracteres, e-mail válido, senha de 8 a 72 caracteres. Campos extras são rejeitados.

Resposta `201`:

```json
{
  "data": {
    "accessToken": "<jwt>",
    "tokenType": "Bearer",
    "expiresIn": "8h",
    "user": {
      "id": "5b0c1c3e-6d2a-4c1b-9a10-0d5a2f4e8c11",
      "name": "Ana Souza",
      "email": "ana@fabrica.com",
      "role": "admin",
      "createdAt": "2026-10-12T13:00:00.000Z",
      "updatedAt": "2026-10-12T13:00:00.000Z"
    }
  }
}
```

### `POST /api/auth/login`

Público.

Pedido:

```json
{
  "email": "ana@fabrica.com",
  "password": "senha-segura"
}
```

Resposta `200`: o mesmo formato do cadastro. Senha errada responde `401` com `INVALID_CREDENTIALS`.

### `GET /api/auth/me`

Autenticado. Devolve o usuário do token.

```json
{
  "data": {
    "id": "5b0c1c3e-6d2a-4c1b-9a10-0d5a2f4e8c11",
    "name": "Ana Souza",
    "email": "ana@fabrica.com",
    "role": "admin",
    "createdAt": "2026-10-12T13:00:00.000Z",
    "updatedAt": "2026-10-12T13:00:00.000Z"
  }
}
```

### `GET /api/users`

Administrador. Lista todos os usuários, sem hash de senha.

```json
{ "data": [ { "id": "...", "name": "Ana Souza", "email": "ana@fabrica.com", "role": "admin", "createdAt": "...", "updatedAt": "..." } ] }
```

### `POST /api/users`

Administrador. Cria um usuário sem iniciar sessão para ele.

Pedido:

```json
{
  "name": "Carla Dias",
  "email": "carla@fabrica.com",
  "password": "senha-segura",
  "role": "user"
}
```

`role` é opcional e vale `user` quando omitido. Resposta `201` com `{ "data": <usuário público> }`.

### `GET /api/users/{id}`

Autenticado. Administrador lê qualquer conta. Os demais só leem a própria. `id` precisa ser UUID.

### `PUT /api/users/{id}`

Autenticado. Administrador atualiza qualquer conta, inclusive `role`. Os demais atualizam só a própria conta e não podem enviar `role`.

Pedido (pelo menos um campo):

```json
{
  "name": "Ana Souza Lima",
  "email": "ana.lima@fabrica.com",
  "password": "nova-senha-segura"
}
```

Resposta `200` com o usuário público atualizado.

### `DELETE /api/users/{id}`

Administrador. Não é permitido excluir a própria conta. Resposta `204` sem corpo.

## Produção

Qualquer usuário autenticado lê e sincroniza a fábrica da própria empresa. A resposta traz `employees`, `products`, `orders`, `punches`, `resources`, `groups`, `families`, `equipments`, `setores`, `operacoes`, `tombstones`, `nextOrderNum` e `nextEmployeeNum`.

### `GET /api/production`

Estado atual, sem registros excluídos.

### `POST /api/production/sync`

Envia o que mudou neste aparelho e devolve o estado mesclado. Um registro novo com `updatedAt` mais recente substitui o antigo. `deletedAt` marca a exclusão. Uma cópia antiga não recria o que já foi excluído. `nextOrderNum` e `nextEmployeeNum` ficam com o maior valor recebido.

```json
{
  "records": [
    {
      "kind": "order",
      "id": "id-op1",
      "payload": { "numero": "000.001", "codigo": "30.2000.1000", "status": "Aberta" },
      "updatedAt": "2026-10-12T15:00:00.000Z",
      "deletedAt": null
    }
  ],
  "nextOrderNum": 2,
  "nextEmployeeNum": 1
}
```

`kind` aceita `employee`, `product`, `order`, `punch`, `resource`, `group`, `family`, `equipment`, `setor` e `operacao`. Setor é o lugar da fábrica. Grupo é a categoria acima da família. Família guarda o conjunto padrão de peças. Item é `product`, com código interno e código ERP. Operação é a etapa da rota. Máquina é `resource` e operador é `employee`. Equipamento copia as peças da família. No máximo 5000 registros por pedido. O cabeçalho `x-company-id` escolhe a empresa quando quem chama é o administrador suporte. Os demais usuários ficam na própria empresa. Um perfil sem módulos de edição só lê a produção.

Senha nova: 8 caracteres, uma maiúscula, um número e um caractere especial. Conta criada por um administrador recebe senha provisória, mostrada uma vez na resposta (`provisionalPassword`), e precisa trocá-la no primeiro acesso.

`POST /api/auth/password-requests` com `{ "email" }` registra o pedido sem dizer se o e-mail existe. Operador e visualizador aparecem para o administrador da empresa. Administrador aparece para o administrador suporte. `POST /api/password-requests/{id}/resolve` com `{ "action": "reset" }` devolve a senha provisória uma vez.

`POST /api/users/{id}/block` com `{ "blocked": true }` bloqueia. Se o administrador suporte bloqueou, o administrador da empresa não desbloqueia.

`GET /api/companies` e `PUT /api/companies/{id}` cuidam de nome, limites, data limite de uso e bloqueio da empresa. Limites e bloqueio só o administrador suporte altera.

`GET /api/logs` devolve os próprios eventos. O administrador suporte vê todos, com `valorAnterior` e `valorAtual`.

Status de pedido: `Não iniciado`, `Iniciado/Parado`, `Bloqueado`, `Finalizado/Em Pintura`, `Finalizado/Em montagem`, `Finalizado`, `Encaminhado Expedição`. Parado e bloqueado exigem setor e motivo. Prioridade do pedido: `1` alta, `2` normal, `3` baixa — usada na fila e na sugestão da IA.

## Exemplo com curl

```bash
curl -s http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ana Souza\",\"email\":\"ana@fabrica.com\",\"password\":\"Senha-segura1\"}"

curl -s http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN"
```
