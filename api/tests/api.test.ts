import request from "supertest";
import bcrypt from "bcryptjs";
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
    password: "Senha-segura1"
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
    expect(spec.body.paths["/api/production/sync"].post).toBeTruthy();
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
    expect(created.body.data.user.role).toBe("administrador_suporte");
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
      password: "Senha-segura1"
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

    const closed = await register(app, "bruno@fabrica.com", "Bruno Lima");
    expect(closed.status).toBe(403);
    expect(closed.body.error.code).toBe("REGISTRATION_CLOSED");

    const company = await request(app)
      .post("/api/companies")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Fábrica Norte" });
    expect(company.status).toBe(201);
    const companyId = company.body.data.id;

    const missingCompany = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Sem Empresa", email: "sem@fabrica.com", role: "operador" });
    expect(missingCompany.status).toBe(422);
    expect(missingCompany.body.error.code).toBe("COMPANY_REQUIRED");

    const second = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Bruno Lima", email: "bruno@fabrica.com", role: "operador", companyId });
    expect(second.status).toBe(201);
    expect(second.body.data.role).toBe("operador");
    expect(second.body.data.provisionalPassword).toMatch(/[A-Z]/);
    expect(second.body.data.mustChangePassword).toBe(true);
    const loginSecond = await request(app).post("/api/auth/login").send({
      email: "bruno@fabrica.com",
      password: second.body.data.provisionalPassword
    });
    const freshToken = loginSecond.body.data.accessToken;
    const blockedUntilChange = await request(app).get("/api/users").set("Authorization", `Bearer ${freshToken}`);
    expect(blockedUntilChange.status).toBe(403);
    expect(blockedUntilChange.body.error.code).toBe("PASSWORD_CHANGE_REQUIRED");
    const changedPassword = await request(app)
      .put(`/api/users/${second.body.data.id}`)
      .set("Authorization", `Bearer ${freshToken}`)
      .send({ password: "Senha-nova1!" });
    expect(changedPassword.status).toBe(200);
    const userToken = freshToken;
    const userId = second.body.data.id;

    const forbiddenList = await request(app).get("/api/users").set("Authorization", `Bearer ${userToken}`);
    expect(forbiddenList.status).toBe(403);

    const list = await request(app).get("/api/users").set("Authorization", `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(2);

    const users = createMemoryUserRepository();
    const orphanApp = buildApp({ users });
    const suporte = await register(orphanApp, "suporte@fabrica.com", "Suporte");
    const suporteToken = suporte.body.data.accessToken;
    const orphanCompany = await request(orphanApp)
      .post("/api/companies")
      .set("Authorization", `Bearer ${suporteToken}`)
      .send({ name: "Fábrica Sul" });
    const orphan = await users.create({
      name: "Conta antiga",
      email: "antiga@fabrica.com",
      passwordHash: await bcrypt.hash("Senha-segura1", 4),
      role: "operador",
      companyId: null
    });
    const orphanLogin = await request(orphanApp).post("/api/auth/login").send({
      email: "antiga@fabrica.com",
      password: "Senha-segura1"
    });
    expect(orphanLogin.status).toBe(403);
    expect(orphanLogin.body.error.code).toBe("NO_COMPANY");
    const linked = await request(orphanApp)
      .put(`/api/users/${orphan.id}`)
      .set("Authorization", `Bearer ${suporteToken}`)
      .send({ companyId: orphanCompany.body.data.id });
    expect(linked.status).toBe(200);
    expect(linked.body.data.companyId).toBe(orphanCompany.body.data.id);

    const created = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Carla Dias", email: "carla@fabrica.com", role: "visualizador", companyId });
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
      .send({ role: "administrador" });
    expect(roleDenied.status).toBe(403);

    const otherDenied = await request(app)
      .get(`/api/users/${adminId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(otherDenied.status).toBe(403);

    const promoted = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "administrador" });
    expect(promoted.body.data.role).toBe("administrador");

    const supportDenied = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${promoted.body.data.role === "administrador" ? (await request(app).post("/api/auth/login").send({ email: "bruno@fabrica.com", password: "Senha-nova1!" })).body.data.accessToken : adminToken}`)
      .send({ name: "Suporte Extra", email: "suporte-extra@fabrica.com", role: "administrador_suporte" });
    expect(supportDenied.status).toBe(403);

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

describe("produção compartilhada", () => {
  it("mescla aparelhos diferentes e não revive exclusão antiga", async () => {
    const app = buildApp();
    const anon = await request(app).post("/api/production/sync").send({ records: [] });
    expect(anon.status).toBe(401);

    const session = await register(app, "op@fabrica.com", "Operador");
    const createdCompany = await request(app)
      .post("/api/companies")
      .set("Authorization", `Bearer ${session.body.data.accessToken}`)
      .send({ name: "Fábrica Sul" });
    const auth = {
      Authorization: `Bearer ${session.body.data.accessToken}`,
      "x-company-id": createdCompany.body.data.id
    };

    const phone = await request(app).post("/api/production/sync").set(auth).send({
      records: [{
        kind: "employee",
        id: "emp-1",
        payload: { nome: "Ana" },
        updatedAt: "2026-10-12T12:00:00.000Z",
        deletedAt: null
      }],
      nextOrderNum: 2,
      nextEmployeeNum: 3
    });
    expect(phone.status).toBe(200);
    expect(phone.body.data.employees).toEqual([
      expect.objectContaining({ nome: "Ana", updatedAt: "2026-10-12T12:00:00.000Z" })
    ]);

    const notebook = await request(app).post("/api/production/sync").set(auth).send({
      records: [{
        kind: "resource",
        id: "cel-1",
        payload: { nome: "MO01" },
        updatedAt: "2026-10-12T12:05:00.000Z",
        deletedAt: null
      }],
      nextOrderNum: 1,
      nextEmployeeNum: 1
    });
    expect(notebook.body.data.employees).toHaveLength(1);
    expect(notebook.body.data.resources).toHaveLength(1);
    expect(notebook.body.data.nextOrderNum).toBe(2);
    expect(notebook.body.data.nextEmployeeNum).toBe(3);

    const removed = await request(app).post("/api/production/sync").set(auth).send({
      records: [{
        kind: "employee",
        id: "emp-1",
        payload: {},
        updatedAt: "2026-10-12T12:10:00.000Z",
        deletedAt: "2026-10-12T12:10:00.000Z"
      }]
    });
    expect(removed.body.data.employees).toHaveLength(0);
    expect(removed.body.data.resources).toHaveLength(1);
    expect(removed.body.data.tombstones).toEqual([
      expect.objectContaining({ kind: "employee", id: "emp-1" })
    ]);

    const stale = await request(app).post("/api/production/sync").set(auth).send({
      records: [{
        kind: "employee",
        id: "emp-1",
        payload: { nome: "Ana" },
        updatedAt: "2026-10-12T12:00:00.000Z",
        deletedAt: null
      }]
    });
    expect(stale.body.data.employees).toHaveLength(0);

    const current = await request(app).get("/api/production").set(auth);
    expect(current.status).toBe(200);
    expect(current.body.data.resources[0].nome).toBe("MO01");
  });
});
