import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp, type AppOptions } from "../src/app.js";
import { createMemoryUserRepository } from "../src/repositories/memoryUserRepository.js";

const SECRET = "test-secret";

function buildApp(overrides: Partial<AppOptions> = {}) {
  return createApp({
    users: createMemoryUserRepository(),
    jwtSecret: SECRET,
    jwtExpiresIn: "1h",
    bcryptRounds: 4,
    corsOrigin: true,
    rateLimit: { windowMs: 60_000, limit: 100, authLimit: 20 },
    ...overrides
  });
}

async function register(app: ReturnType<typeof buildApp>, email = "ana@fabrica.com", name = "Ana Souza") {
  const response = await request(app).post("/api/auth/register").send({
    name,
    email,
    password: "senha-segura"
  });
  return response;
}

describe("API de usuários", () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    app = buildApp();
  });

  it("responde saúde, raiz e OpenAPI", async () => {
    const health = await request(app).get("/health");
    expect(health.status).toBe(200);
    expect(health.body.data.status).toBe("ok");

    const root = await request(app).get("/");
    expect(root.body.data.docs).toBe("/docs");

    const spec = await request(app).get("/openapi.json");
    expect(spec.status).toBe(200);
    expect(spec.body.openapi).toBe("3.0.3");
    expect(spec.body.paths["/api/auth/login"]).toBeTruthy();
    expect(spec.body.paths["/api/users/{id}"].delete).toBeTruthy();
    expect(spec.body.components.securitySchemes.bearerAuth.scheme).toBe("bearer");
  });

  it("rejeita JSON inválido e rota inexistente", async () => {
    const invalid = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send("{");
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.code).toBe("INVALID_JSON");

    const missing = await request(app).get("/api/nao-existe");
    expect(missing.status).toBe(404);
    expect(missing.body.error.code).toBe("NOT_FOUND");
  });

  it("valida cadastro e impede e-mail duplicado", async () => {
    const invalid = await request(app).post("/api/auth/register").send({
      name: "A",
      email: "nao-e-email",
      password: "123"
    });
    expect(invalid.status).toBe(422);
    expect(invalid.body.error.code).toBe("VALIDATION_ERROR");
    expect(invalid.body.error.details.length).toBeGreaterThan(0);

    const created = await register(app);
    expect(created.status).toBe(201);
    expect(created.body.data.tokenType).toBe("Bearer");
    expect(created.body.data.user.role).toBe("admin");
    expect(created.body.data.user.passwordHash).toBeUndefined();
    expect(created.body.data.accessToken.split(".").length).toBe(3);

    const duplicate = await register(app);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.code).toBe("EMAIL_IN_USE");
  });

  it("faz login, lê o perfil e bloqueia credencial errada", async () => {
    await register(app);
    const bad = await request(app).post("/api/auth/login").send({
      email: "ana@fabrica.com",
      password: "senha-errada"
    });
    expect(bad.status).toBe(401);
    expect(bad.body.error.code).toBe("INVALID_CREDENTIALS");

    const login = await request(app).post("/api/auth/login").send({
      email: "ana@fabrica.com",
      password: "senha-segura"
    });
    expect(login.status).toBe(200);
    const token = login.body.data.accessToken;

    const missing = await request(app).get("/api/auth/me");
    expect(missing.status).toBe(401);

    const me = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe("ana@fabrica.com");
  });

  it("executa o CRUD com as permissões de admin e usuário", async () => {
    const adminResponse = await register(app);
    const adminToken = adminResponse.body.data.accessToken;
    const adminId = adminResponse.body.data.user.id;

    const second = await register(app, "bruno@fabrica.com", "Bruno Lima");
    expect(second.body.data.user.role).toBe("user");
    const userToken = second.body.data.accessToken;
    const userId = second.body.data.user.id;

    const forbiddenList = await request(app).get("/api/users").set("Authorization", `Bearer ${userToken}`);
    expect(forbiddenList.status).toBe(403);

    const list = await request(app).get("/api/users").set("Authorization", `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(2);

    const created = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Carla Dias", email: "carla@fabrica.com", password: "senha-segura", role: "user" });
    expect(created.status).toBe(201);
    expect(created.body.data.password).toBeUndefined();

    const selfUpdate = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Bruno Atualizado" });
    expect(selfUpdate.status).toBe(200);
    expect(selfUpdate.body.data.name).toBe("Bruno Atualizado");

    const roleDenied = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ role: "admin" });
    expect(roleDenied.status).toBe(403);

    const otherDenied = await request(app)
      .get(`/api/users/${adminId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(otherDenied.status).toBe(403);

    const promoted = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });
    expect(promoted.body.data.role).toBe("admin");

    const missingUser = await request(app)
      .get("/api/users/00000000-0000-4000-8000-000000000000")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(missingUser.status).toBe(404);

    const badId = await request(app)
      .get("/api/users/nao-uuid")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(badId.status).toBe(422);

    const selfDelete = await request(app)
      .delete(`/api/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(selfDelete.status).toBe(403);

    const removed = await request(app)
      .delete(`/api/users/${created.body.data.id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(removed.status).toBe(204);
    expect(removed.text).toBe("");
  });

  it("aplica rate limit nas rotas de autenticação", async () => {
    const limited = buildApp({
      rateLimit: { windowMs: 60_000, limit: 100, authLimit: 2 }
    });
    await request(limited).post("/api/auth/login").send({ email: "a@fabrica.com", password: "12345678" });
    await request(limited).post("/api/auth/login").send({ email: "a@fabrica.com", password: "12345678" });
    const blocked = await request(limited).post("/api/auth/login").send({ email: "a@fabrica.com", password: "12345678" });
    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe("RATE_LIMITED");
  });
});
