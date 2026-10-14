export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "SoSystem API",
    version: "2026.10.15",
    description: "API REST com usuários e produção de fábrica. Autenticação JWT, validação, tratamento global de erros e rate limiting. O banco SQL fica no Supabase."
  },
  servers: [
    { url: "http://localhost:3000", description: "Desenvolvimento local" },
    { url: "https://sosystem-api.onrender.com", description: "Render" }
  ],
  tags: [
    { name: "Sistema" },
    { name: "Autenticação" },
    { name: "Usuários" },
    { name: "Produção" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorBody: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message", "details"],
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string" },
              details: { nullable: true }
            }
          }
        }
      },
      PublicUser: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Ana Souza" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["visualizador", "operador", "administrador", "administrador_suporte"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      AuthResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
              tokenType: { type: "string", example: "Bearer" },
              expiresIn: { type: "string", example: "8h" },
              user: { $ref: "#/components/schemas/PublicUser" }
            }
          }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 80 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8, maxLength: 72 }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" }
        }
      },
      CreateUserRequest: {
        allOf: [
          { $ref: "#/components/schemas/RegisterRequest" },
          {
            type: "object",
            properties: {
              role: { type: "string", enum: ["visualizador", "operador", "administrador", "administrador_suporte"] }
            }
          }
        ]
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 80 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8, maxLength: 72 },
          role: { type: "string", enum: ["visualizador", "operador", "administrador", "administrador_suporte"] }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Sistema"],
        summary: "Saúde da API",
        responses: {
          "200": { description: "API no ar" }
        }
      }
    },
    "/openapi.json": {
      get: {
        tags: ["Sistema"],
        summary: "Especificação OpenAPI",
        responses: { "200": { description: "Documento OpenAPI 3" } }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Autenticação"],
        summary: "Cadastrar usuário e receber JWT",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } }
        },
        responses: {
          "201": { description: "Conta criada", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "409": { description: "E-mail já usado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorBody" } } } },
          "422": { description: "Validação", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorBody" } } } },
          "429": { description: "Rate limit", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorBody" } } } }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Entrar e receber JWT",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } }
        },
        responses: {
          "200": { description: "Autenticado", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "401": { description: "Credenciais inválidas", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorBody" } } } },
          "422": { description: "Validação", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorBody" } } } },
          "429": { description: "Rate limit", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorBody" } } } }
        }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Autenticação"],
        summary: "Usuário autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Perfil" },
          "401": { description: "Sem token ou token inválido", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorBody" } } } }
        }
      }
    },
    "/api/users": {
      get: {
        tags: ["Usuários"],
        summary: "Listar usuários",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Lista" },
          "401": { description: "Não autenticado" },
          "403": { description: "Não é administrador" }
        }
      },
      post: {
        tags: ["Usuários"],
        summary: "Criar usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } }
        },
        responses: {
          "201": { description: "Criado" },
          "401": { description: "Não autenticado" },
          "403": { description: "Não é administrador" },
          "409": { description: "E-mail já usado" },
          "422": { description: "Validação" }
        }
      }
    },
    "/api/users/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      get: {
        tags: ["Usuários"],
        summary: "Buscar usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Usuário" },
          "401": { description: "Não autenticado" },
          "403": { description: "Sem permissão" },
          "404": { description: "Não encontrado" },
          "422": { description: "UUID inválido" }
        }
      },
      put: {
        tags: ["Usuários"],
        summary: "Atualizar usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserRequest" } } }
        },
        responses: {
          "200": { description: "Atualizado" },
          "401": { description: "Não autenticado" },
          "403": { description: "Sem permissão" },
          "404": { description: "Não encontrado" },
          "409": { description: "E-mail já usado" },
          "422": { description: "Validação" }
        }
      },
      delete: {
        tags: ["Usuários"],
        summary: "Excluir usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Excluído" },
          "401": { description: "Não autenticado" },
          "403": { description: "Não é administrador ou tentativa de autoexclusão" },
          "404": { description: "Não encontrado" }
        }
      }
    },
    "/api/production": {
      get: {
        tags: ["Produção"],
        summary: "Ler ordens, apontamentos, células, produtos e funcionários",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Estado atual, sem registros excluídos" },
          "401": { description: "Não autenticado" }
        }
      }
    },
    "/api/production/sync": {
      post: {
        tags: ["Produção"],
        summary: "Enviar alterações offline e receber o estado mesclado",
        description: "Cada registro vence pelo updatedAt mais recente. Exclusões usam deletedAt. Os contadores de ordem e funcionário ficam com o maior valor.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } }
        },
        responses: {
          "200": { description: "Estado mesclado" },
          "401": { description: "Não autenticado" },
          "422": { description: "Validação" }
        }
      }
    }
  }
} as const;
