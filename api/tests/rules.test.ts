import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { changeOrderStatus } from "../src/production/orders.js";
import { buildProductionStudy } from "../src/production/study.js";
import { createMemoryUserRepository } from "../src/repositories/memoryUserRepository.js";

function app() {
  return createApp({
    users: createMemoryUserRepository(),
    jwtSecret: "test-secret",
    jwtExpiresIn: "1h",
    bcryptRounds: 4,
    rateLimit: { windowMs: 60_000, limit: 100, authLimit: 30 }
  });
}

async function suporte(api = app()) {
  const response = await request(api).post("/api/auth/register").send({
    name: "Ana Souza",
    email: "ana@fabrica.com",
    password: "Senha-segura1"
  });
  return { api, token: response.body.data.accessToken as string };
}

describe("pedidos, bloqueios e empresas", () => {
  it("exige motivo para parada e bloqueio", () => {
    expect(() => changeOrderStatus("Não iniciado", "Bloqueado", {})).toThrow(/motivo/);
    const stopped = changeOrderStatus("Não iniciado", "Iniciado/Parado", { motivo: "Falta tinta" });
    expect(stopped).toEqual({ status: "Iniciado/Parado", setor: "", motivo: "Falta tinta" });
    expect(changeOrderStatus("Aberta", "Concluída", {}).status).toBe("Finalizado");
    expect(() => changeOrderStatus("Não iniciado", "Inventado", {})).toThrow(/desconhecido/);
  });

  it("separa a produção de cada empresa e respeita o bloqueio", async () => {
    const { api, token } = await suporte();
    const auth = { Authorization: `Bearer ${token}` };
    const north = await request(api).post("/api/companies").set(auth).send({ name: "Norte" });
    const south = await request(api).post("/api/companies").set(auth).send({ name: "Sul" });
    const record = {
      kind: "employee",
      id: "emp-1",
      payload: { nome: "Marina" },
      updatedAt: "2026-10-12T12:00:00.000Z",
      deletedAt: null
    };
    const saved = await request(api).post("/api/production/sync").set(auth).set("x-company-id", north.body.data.id).send({ records: [record] });
    expect(saved.status).toBe(200);
    const other = await request(api).get("/api/production").set(auth).set("x-company-id", south.body.data.id);
    expect(other.body.data.employees).toEqual([]);

    const operator = await request(api).post("/api/users").set(auth).send({
      name: "Bruno Lima",
      email: "bruno@fabrica.com",
      role: "operador",
      companyId: north.body.data.id
    });
    const provisional = operator.body.data.provisionalPassword as string;
    const login = await request(api).post("/api/auth/login").send({ email: "bruno@fabrica.com", password: provisional });
    const operatorToken = login.body.data.accessToken as string;
    await request(api).put(`/api/users/${operator.body.data.id}`).set("Authorization", `Bearer ${operatorToken}`).send({ password: "Senha-nova1!" });

    const blocked = await request(api).post(`/api/users/${operator.body.data.id}/block`).set(auth).send({ blocked: true });
    expect(blocked.body.data.blockedByRole).toBe("administrador_suporte");
    const denied = await request(api).post("/api/auth/login").send({ email: "bruno@fabrica.com", password: "Senha-nova1!" });
    expect(denied.status).toBe(403);
    expect(denied.body.error.code).toBe("USER_BLOCKED");

    const admin = await request(api).post("/api/users").set(auth).send({
      name: "Carla Dias",
      email: "carla@fabrica.com",
      role: "administrador",
      companyId: north.body.data.id
    });
    const adminLogin = await request(api).post("/api/auth/login").send({
      email: "carla@fabrica.com",
      password: admin.body.data.provisionalPassword
    });
    const adminToken = adminLogin.body.data.accessToken as string;
    await request(api).put(`/api/users/${admin.body.data.id}`).set("Authorization", `Bearer ${adminToken}`).send({ password: "Senha-admin1!" });
    const unblock = await request(api)
      .post(`/api/users/${operator.body.data.id}/block`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ blocked: false });
    expect(unblock.status).toBe(403);
    expect(unblock.body.error.code).toBe("UNBLOCK_FORBIDDEN");

    await request(api).put(`/api/companies/${north.body.data.id}`).set(auth).send({ blocked: true });
    const companyLogin = await request(api).post("/api/auth/login").send({ email: "carla@fabrica.com", password: "Senha-admin1!" });
    expect(companyLogin.status).toBe(403);
    expect(companyLogin.body.error.code).toBe("COMPANY_BLOCKED");
    const frozen = await request(api).post("/api/production/sync").set({
      Authorization: `Bearer ${token}`,
      "x-company-id": north.body.data.id
    }).send({ records: [] });
    expect(frozen.status).toBe(403);
    expect(frozen.body.error.code).toBe("COMPANY_BLOCKED");
    await request(api).put(`/api/companies/${north.body.data.id}`).set(auth).send({ blocked: false });
    const reopened = await request(api).post("/api/production/sync").set({
      Authorization: `Bearer ${token}`,
      "x-company-id": north.body.data.id
    }).send({ records: [] });
    expect(reopened.status).toBe(200);
  });

  it("entrega o pedido de senha ao administrador da empresa e o do administrador ao suporte", async () => {
    const { api, token } = await suporte();
    const auth = { Authorization: `Bearer ${token}` };
    const company = await request(api).post("/api/companies").set(auth).send({ name: "Norte" });
    const admin = await request(api).post("/api/users").set(auth).send({
      name: "Carla Dias",
      email: "carla@fabrica.com",
      role: "administrador",
      companyId: company.body.data.id
    });
    const operator = await request(api).post("/api/users").set(auth).send({
      name: "Bruno Lima",
      email: "bruno@fabrica.com",
      role: "operador",
      companyId: company.body.data.id
    });
    await request(api).post("/api/auth/password-requests").send({ email: "bruno@fabrica.com" });
    await request(api).post("/api/auth/password-requests").send({ email: "carla@fabrica.com" });
    const unknown = await request(api).post("/api/auth/password-requests").send({ email: "ninguem@fabrica.com" });
    expect(unknown.status).toBe(202);

    const adminLogin = await request(api).post("/api/auth/login").send({
      email: "carla@fabrica.com",
      password: admin.body.data.provisionalPassword
    });
    await request(api).put(`/api/users/${admin.body.data.id}`).set("Authorization", `Bearer ${adminLogin.body.data.accessToken}`).send({ password: "Senha-admin1!" });
    const queue = await request(api).get("/api/password-requests").set("Authorization", `Bearer ${adminLogin.body.data.accessToken}`);
    expect(queue.body.data.map((item: { email: string }) => item.email)).toEqual(["bruno@fabrica.com"]);

    const supportQueue = await request(api).get("/api/password-requests").set(auth);
    expect(supportQueue.body.data.some((item: { email: string }) => item.email === "carla@fabrica.com")).toBe(true);
    const adminRequest = supportQueue.body.data.find((item: { email: string }) => item.email === "carla@fabrica.com");
    const reset = await request(api).post(`/api/password-requests/${adminRequest.id}/resolve`).set(auth).send({ action: "reset" });
    expect(reset.body.data.provisionalPassword).toMatch(/[^A-Za-z0-9]/);
    expect(operator.body.data.companyId).toBe(company.body.data.id);
  });

  it("prioriza o pedido pedido e o residual sem gravar sozinho", () => {
    const orders = [
      {
        id: "op-alvo",
        numero: "000.010",
        status: "Não iniciado",
        itens: [{ id: "ponteira", descricao: "Ponteira", grupoId: "usinagem", quantidade: 10, produzida: 0 }]
      },
      {
        id: "op-quase",
        numero: "000.002",
        status: "Iniciado/Parado",
        itens: [{ id: "chapa", descricao: "Chapa", grupoId: "chaparia", quantidade: 100, produzida: 99 }]
      }
    ];
    const before = JSON.stringify(orders);
    const study = buildProductionStudy({
      targetOrderId: "000.010",
      orders,
      employees: [
        { id: "e1", nome: "Ana", sobrenome: "Souza", funcao: "Torneira" },
        { id: "e2", nome: "Bruno", sobrenome: "Lima", funcao: "Soldador" }
      ],
      resources: [
        { id: "m1", nome: "Torno", status: "Parada", funcionarios: ["e1"], grupos: ["usinagem"] },
        { id: "m2", nome: "Prensa", status: "Parada", funcionarios: ["e2"], grupos: ["chaparia"] }
      ],
      today: "2026-10-12"
    });
    expect(JSON.stringify(orders)).toBe(before);
    expect(study.gargalos[0].itemLabel).toBe("Chapa");
    expect(study.suggestions[0].orderLabel).toBe("000.010");
    expect(study.suggestions.map((item) => item.recursoNome).sort()).toEqual(["Prensa", "Torno"]);
  });
});
