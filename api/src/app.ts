import bcrypt from "bcryptjs";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { defaultPermissions, isManager, sanitizePermissions, type UserRole } from "./access.js";
import { requireAuth, signToken } from "./auth.js";
import { HttpError, asyncHandler, errorHandler } from "./http.js";
import { openApiSpec } from "./openapi.js";
import { generateProvisionalPassword } from "./passwordPolicy.js";
import { changeOrderStatus } from "./production/orders.js";
import type { ProductionRecord } from "./production/merge.js";
import { buildLimiter } from "./rateLimit.js";
import { createMemoryPlatformRepository } from "./repositories/memoryPlatformRepository.js";
import { applyProductionSync, createMemoryProductionRepository, snapshotOf } from "./repositories/memoryProductionRepository.js";
import type { CompanyRecord, PlatformRepository } from "./repositories/platformRepository.js";
import type { ProductionRepository } from "./repositories/productionRepository.js";
import { toPublicUser, type UserPatch, type UserRecord, type UserRepository } from "./repositories/userRepository.js";
import {
  blockUserSchema,
  companyCreateSchema,
  companyUpdateSchema,
  createUserSchema,
  idParamSchema,
  loginSchema,
  passwordRequestSchema,
  productionSyncSchema,
  registerSchema,
  resolvePasswordRequestSchema,
  updateUserSchema
} from "./schemas.js";
import { APP_VERSION } from "./version.js";

export type AppOptions = {
  users: UserRepository;
  production?: ProductionRepository;
  platform?: PlatformRepository;
  jwtSecret: string;
  jwtExpiresIn?: string;
  bcryptRounds?: number;
  corsOrigin?: string | string[] | boolean;
  rateLimit?: {
    windowMs: number;
    limit: number;
    authLimit: number;
  };
};

function parseBody<T>(schema: { parse: (value: unknown) => T }, value: unknown): T {
  return schema.parse(value);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function companyHeader(req: { header(name: string): string | undefined }): string | undefined {
  const value = req.header("x-company-id");
  return value && value.trim() ? value.trim() : undefined;
}

export function createApp(options: AppOptions): Express {
  const jwtExpiresIn = options.jwtExpiresIn ?? "8h";
  const bcryptRounds = options.bcryptRounds ?? 10;
  const limits = options.rateLimit ?? { windowMs: 15 * 60 * 1000, limit: 100, authLimit: 10 };
  const platform = options.platform ?? createMemoryPlatformRepository();
  const production = options.production ?? createMemoryProductionRepository();
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: options.corsOrigin ?? true }));
  app.use(express.json({ limit: "2mb" }));

  app.get("/", (_req, res) => {
    res.json({
      data: {
        name: "SoSystem API",
        version: APP_VERSION,
        health: "/health",
        docs: "/docs",
        openapi: "/openapi.json"
      }
    });
  });

  app.get("/health", (_req, res) => {
    res.json({ data: { status: "ok", service: "sosystem-api", version: APP_VERSION } });
  });

  app.get("/openapi.json", (_req, res) => {
    res.json(openApiSpec);
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec, { customSiteTitle: "SoSystem API" }));

  const apiLimiter = buildLimiter(limits.windowMs, limits.limit);
  const authLimiter = buildLimiter(limits.windowMs, limits.authLimit);
  app.use("/api", apiLimiter);

  const auth = requireAuth(options.jwtSecret);

  async function issueSession(user: UserRecord) {
    const accessToken = signToken(
      { sub: user.id, email: user.email, role: user.role },
      options.jwtSecret,
      jwtExpiresIn
    );
    return {
      accessToken,
      tokenType: "Bearer" as const,
      expiresIn: jwtExpiresIn,
      user: toPublicUser(user)
    };
  }

  async function writeLog(actor: { id: string | null; email: string }, action: string, entityKind: string, entityId: string, valorAnterior: unknown, valorAtual: unknown, companyId: string | null) {
    await platform.addLog({
      companyId,
      actorId: actor.id,
      actorEmail: actor.email,
      action,
      entityKind,
      entityId,
      valorAnterior,
      valorAtual
    });
  }

  async function assertCompanyOpen(user: UserRecord) {
    if (user.role === "administrador_suporte") return;
    if (!user.companyId) throw new HttpError(403, "NO_COMPANY", "Sua conta não está vinculada a uma empresa.");
    const company = await platform.findCompany(user.companyId);
    if (!company) throw new HttpError(403, "NO_COMPANY", "Sua conta não está vinculada a uma empresa.");
    if (company.blocked) throw new HttpError(403, "COMPANY_BLOCKED", "O acesso desta empresa está bloqueado.");
    if (company.usageUntil && company.usageUntil < todayISO()) {
      throw new HttpError(403, "COMPANY_EXPIRED", "A data limite de uso desta empresa passou.");
    }
  }

  async function actorFrom(req: { auth?: { sub: string } }) {
    const user = await options.users.findById(req.auth!.sub);
    if (!user) throw new HttpError(401, "UNAUTHORIZED", "Usuário do token não existe mais.");
    if (user.blocked) throw new HttpError(403, "USER_BLOCKED", "Esta conta está bloqueada.");
    await assertCompanyOpen(user);
    return user;
  }

  function assertPasswordReady(user: UserRecord) {
    if (user.mustChangePassword) {
      throw new HttpError(403, "PASSWORD_CHANGE_REQUIRED", "Troque a senha provisória antes de continuar.");
    }
  }

  function assertCanManage(actor: UserRecord, target: UserRecord | null, nextRole?: UserRole) {
    if (!isManager(actor.role)) {
      throw new HttpError(403, "FORBIDDEN", "Seu perfil não gerencia usuários.");
    }
    if (target?.role === "administrador_suporte" && actor.role !== "administrador_suporte") {
      throw new HttpError(403, "FORBIDDEN", "Somente o administrador suporte altera esta conta.");
    }
    if (nextRole === "administrador_suporte" && actor.role !== "administrador_suporte") {
      throw new HttpError(403, "FORBIDDEN", "Somente o administrador suporte cria este perfil.");
    }
    if (actor.role === "administrador" && target && target.companyId !== actor.companyId) {
      throw new HttpError(403, "FORBIDDEN", "Você só gerencia usuários da sua empresa.");
    }
  }

  async function resolveCompanyId(actor: UserRecord, requested?: string) {
    if (actor.role === "administrador_suporte") {
      if (!requested) throw new HttpError(422, "COMPANY_REQUIRED", "Escolha a empresa.");
      const company = await platform.findCompany(requested);
      if (!company) throw new HttpError(404, "NOT_FOUND", "Empresa não encontrada.");
      return company;
    }
    if (!actor.companyId) throw new HttpError(403, "NO_COMPANY", "Sua conta não está vinculada a uma empresa.");
    const company = await platform.findCompany(actor.companyId);
    if (!company) throw new HttpError(403, "NO_COMPANY", "Sua conta não está vinculada a uma empresa.");
    return company;
  }

  function assertWithinLimits(snapshot: ReturnType<typeof snapshotOf>, company: CompanyRecord) {
    if (snapshot.resources.length > company.maxMachines) {
      throw new HttpError(403, "LIMIT_MACHINES", "A empresa atingiu o limite de máquinas.");
    }
    const registrations = snapshot.employees.length + snapshot.products.length + snapshot.groups.length + snapshot.families.length;
    if (registrations > company.maxRegistrations) {
      throw new HttpError(403, "LIMIT_REGISTRATIONS", "A empresa atingiu o limite de cadastros.");
    }
  }

  function prepareRecords(records: ProductionRecord[]): ProductionRecord[] {
    return records.map((record) => {
      if (record.kind === "group" || record.kind === "family") {
        const payload = { ...record.payload };
        delete payload.imagem;
        return { ...record, payload };
      }
      if (record.kind !== "order") return record;
      try {
        const changed = changeOrderStatus(record.payload.status, record.payload.status, {
          setor: record.payload.setor ?? record.payload.setorParada,
          motivo: record.payload.motivo ?? record.payload.motivoParada
        });
        return {
          ...record,
          payload: { ...record.payload, status: changed.status, setor: changed.setor, motivo: changed.motivo }
        };
      } catch (error) {
        throw new HttpError(422, "ORDER_STATUS", error instanceof Error ? error.message : "Status inválido.");
      }
    });
  }

  app.get("/api/auth/status", asyncHandler(async (_req, res) => {
    const count = await options.users.count();
    res.json({ data: { needsSetup: count === 0, version: APP_VERSION } });
  }));

  app.post("/api/auth/register", authLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(registerSchema, req.body);
    const email = input.email.toLowerCase();
    const existing = await options.users.findByEmail(email);
    if (existing) throw new HttpError(409, "EMAIL_IN_USE", "Já existe um usuário com este e-mail.");
    const count = await options.users.count();
    if (count > 0) {
      throw new HttpError(403, "REGISTRATION_CLOSED", "O cadastro público está fechado. Peça a um administrador.");
    }
    const role: UserRole = "administrador_suporte";
    const user = await options.users.create({
      name: input.name,
      email,
      passwordHash: await bcrypt.hash(input.password, bcryptRounds),
      role,
      permissions: defaultPermissions(role)
    });
    await writeLog(user, "conta_criada", "user", user.id, null, toPublicUser(user), null);
    res.status(201).json({ data: await issueSession(user) });
  }));

  app.post("/api/auth/login", authLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(loginSchema, req.body);
    const user = await options.users.findByEmail(input.email);
    const valid = user ? await bcrypt.compare(input.password, user.passwordHash) : false;
    if (!user || !valid) throw new HttpError(401, "INVALID_CREDENTIALS", "E-mail ou senha inválidos.");
    if (user.blocked) throw new HttpError(403, "USER_BLOCKED", "Esta conta está bloqueada.");
    await assertCompanyOpen(user);
    await writeLog(user, "login", "user", user.id, null, { email: user.email, role: user.role }, user.companyId);
    res.json({ data: await issueSession(user) });
  }));

  app.post("/api/auth/password-requests", authLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(passwordRequestSchema, req.body);
    const user = await options.users.findByEmail(input.email.toLowerCase());
    if (user && user.role !== "administrador_suporte") {
      await platform.createPasswordRequest({
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      });
      await writeLog(user, "pedido_senha", "user", user.id, null, { email: user.email, role: user.role }, user.companyId);
    }
    res.status(202).json({
      data: { message: "Se a conta existir, o responsável vê o pedido em Configurações." }
    });
  }));

  app.get("/api/auth/me", auth, asyncHandler(async (req, res) => {
    const user = await actorFrom(req);
    res.json({ data: toPublicUser(user) });
  }));

  app.get("/api/companies", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    const companies = await platform.listCompanies();
    const visible = actor.role === "administrador_suporte"
      ? companies
      : companies.filter((company) => company.id === actor.companyId);
    res.json({ data: visible });
  }));

  app.post("/api/companies", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    if (actor.role !== "administrador_suporte") {
      throw new HttpError(403, "FORBIDDEN", "Somente o administrador suporte cria empresas.");
    }
    const input = parseBody(companyCreateSchema, req.body);
    const company = await platform.createCompany({ name: input.name });
    await writeLog(actor, "empresa_criada", "company", company.id, null, company, company.id);
    res.status(201).json({ data: company });
  }));

  app.put("/api/companies/:id", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    const { id } = parseBody(idParamSchema, req.params);
    const input = parseBody(companyUpdateSchema, req.body);
    const current = await platform.findCompany(id);
    if (!current) throw new HttpError(404, "NOT_FOUND", "Empresa não encontrada.");
    const suporte = actor.role === "administrador_suporte";
    const sameAdmin = actor.role === "administrador" && actor.companyId === id;
    if (!suporte && !sameAdmin) throw new HttpError(403, "FORBIDDEN", "Você não altera esta empresa.");
    if (!suporte && (input.maxUsers !== undefined || input.maxMachines !== undefined || input.maxRegistrations !== undefined || input.usageUntil !== undefined || input.blocked !== undefined)) {
      throw new HttpError(403, "FORBIDDEN", "Limites e bloqueio da empresa ficam com o administrador suporte.");
    }
    const updated = await platform.updateCompany(id, input);
    if (!updated) throw new HttpError(404, "NOT_FOUND", "Empresa não encontrada.");
    await writeLog(actor, "empresa_atualizada", "company", id, current, updated, id);
    res.json({ data: updated });
  }));

  app.get("/api/password-requests", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    if (!isManager(actor.role)) throw new HttpError(403, "FORBIDDEN", "Seu perfil não vê pedidos de senha.");
    const requests = await platform.listPasswordRequests();
    const visible = requests.filter((item) => {
      if (item.status !== "pendente") return false;
      if (actor.role === "administrador_suporte") return item.role === "administrador" || item.companyId !== null;
      return item.companyId === actor.companyId && item.role !== "administrador" && item.role !== "administrador_suporte";
    });
    res.json({ data: visible });
  }));

  app.post("/api/password-requests/:id/resolve", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    const { id } = parseBody(idParamSchema, req.params);
    const input = parseBody(resolvePasswordRequestSchema, req.body);
    const request = await platform.findPasswordRequest(id);
    if (!request || request.status !== "pendente") throw new HttpError(404, "NOT_FOUND", "Pedido de senha não encontrado.");
    const suporte = actor.role === "administrador_suporte";
    const companyAdmin = actor.role === "administrador" && actor.companyId === request.companyId;
    if (request.role === "administrador" && !suporte) {
      throw new HttpError(403, "FORBIDDEN", "A senha do administrador é liberada pelo administrador suporte.");
    }
    if (!suporte && !(companyAdmin && request.role !== "administrador")) {
      throw new HttpError(403, "FORBIDDEN", "Você não libera este pedido.");
    }
    if (input.action === "reject") {
      const updated = await platform.updatePasswordRequest(id, {
        status: "recusada",
        resolvedAt: new Date().toISOString(),
        resolvedBy: actor.id
      });
      await writeLog(actor, "pedido_senha_recusado", "password_request", id, { status: "pendente" }, { status: "recusada" }, request.companyId);
      res.json({ data: updated });
      return;
    }
    const target = await options.users.findById(request.userId);
    if (!target) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    const provisionalPassword = generateProvisionalPassword();
    await options.users.update(target.id, {
      passwordHash: await bcrypt.hash(provisionalPassword, bcryptRounds),
      mustChangePassword: true
    });
    await platform.updatePasswordRequest(id, {
      status: "atendida",
      resolvedAt: new Date().toISOString(),
      resolvedBy: actor.id
    });
    await writeLog(actor, "senha_redefinida", "user", target.id, { mustChangePassword: target.mustChangePassword }, { mustChangePassword: true }, target.companyId);
    res.json({ data: { provisionalPassword } });
  }));

  app.get("/api/logs", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    const logs = await platform.listLogs();
    const visible = actor.role === "administrador_suporte"
      ? logs
      : logs.filter((entry) => entry.actorId === actor.id);
    res.json({ data: visible.slice(0, 200) });
  }));

  app.get("/api/users", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    if (!isManager(actor.role)) throw new HttpError(403, "FORBIDDEN", "Seu perfil não gerencia usuários.");
    const users = await options.users.list();
    const visible = users.filter((user) => {
      if (actor.role === "administrador_suporte") return true;
      return user.role !== "administrador_suporte" && user.companyId === actor.companyId;
    });
    res.json({ data: visible.map(toPublicUser) });
  }));

  app.post("/api/users", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    const input = parseBody(createUserSchema, req.body);
    const role = input.role ?? "operador";
    assertCanManage(actor, null, role);
    const email = input.email.toLowerCase();
    if (await options.users.findByEmail(email)) {
      throw new HttpError(409, "EMAIL_IN_USE", "Já existe um usuário com este e-mail.");
    }
    let companyId: string | null = null;
    if (role !== "administrador_suporte") {
      companyId = actor.role === "administrador_suporte" ? (input.companyId ?? null) : actor.companyId;
      if (!companyId) throw new HttpError(422, "COMPANY_REQUIRED", "Escolha a empresa do usuário.");
      const company = await platform.findCompany(companyId);
      if (!company) throw new HttpError(404, "NOT_FOUND", "Empresa não encontrada.");
      if (actor.role === "administrador" && actor.companyId !== companyId) {
        throw new HttpError(403, "FORBIDDEN", "Você só cria usuários da sua empresa.");
      }
      const occupied = (await options.users.list()).filter((user) => user.companyId === companyId).length;
      if (occupied >= company.maxUsers) {
        throw new HttpError(403, "LIMIT_USERS", "A empresa atingiu o limite de usuários.");
      }
    }
    const provisionalPassword = input.password ?? generateProvisionalPassword();
    const user = await options.users.create({
      name: input.name,
      email,
      passwordHash: await bcrypt.hash(provisionalPassword, bcryptRounds),
      role,
      permissions: sanitizePermissions(role, input.permissions),
      companyId,
      mustChangePassword: true
    });
    await writeLog(actor, "usuario_criado", "user", user.id, null, toPublicUser(user), companyId);
    res.status(201).json({ data: { ...toPublicUser(user), provisionalPassword } });
  }));

  app.get("/api/users/:id", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    const { id } = parseBody(idParamSchema, req.params);
    if (actor.id !== id) assertPasswordReady(actor);
    if (!isManager(actor.role) && actor.id !== id) {
      throw new HttpError(403, "FORBIDDEN", "Você só pode consultar a própria conta.");
    }
    const user = await options.users.findById(id);
    if (!user) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    if (actor.id !== id) assertCanManage(actor, user);
    res.json({ data: toPublicUser(user) });
  }));

  app.put("/api/users/:id", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    const { id } = parseBody(idParamSchema, req.params);
    const input = parseBody(updateUserSchema, req.body);
    const target = await options.users.findById(id);
    if (!target) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    const self = actor.id === id;
    if (actor.mustChangePassword && !(self && input.password)) assertPasswordReady(actor);
    if (!self) assertCanManage(actor, target, input.role);
    if (self && input.role) {
      throw new HttpError(403, "FORBIDDEN", "Você não altera o próprio perfil de acesso.");
    }
    if (self && input.permissions && !isManager(actor.role)) {
      throw new HttpError(403, "FORBIDDEN", "Você não altera o próprio perfil de acesso.");
    }
    if (!self && !isManager(actor.role)) {
      throw new HttpError(403, "FORBIDDEN", "Você só pode atualizar a própria conta.");
    }
    if (input.email) {
      const existing = await options.users.findByEmail(input.email);
      if (existing && existing.id !== id) {
        throw new HttpError(409, "EMAIL_IN_USE", "Já existe um usuário com este e-mail.");
      }
    }
    const patch: UserPatch = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.email !== undefined) patch.email = input.email.toLowerCase();
    if (input.password) {
      patch.passwordHash = await bcrypt.hash(input.password, bcryptRounds);
      patch.mustChangePassword = !self;
    }
    const nextRole = input.role ?? target.role;
    if (!self && input.role !== undefined) patch.role = input.role;
    if ((!self && (input.permissions !== undefined || input.role !== undefined)) || (self && input.permissions !== undefined && isManager(actor.role))) {
      patch.permissions = sanitizePermissions(nextRole, input.permissions ?? target.permissions);
    }
    if (!self) {
      if (nextRole === "administrador_suporte") {
        patch.companyId = null;
      } else {
        const companyId = input.companyId !== undefined ? input.companyId : target.companyId;
        if (!companyId) throw new HttpError(422, "COMPANY_REQUIRED", "Escolha a empresa do usuário.");
        if (actor.role === "administrador" && companyId !== actor.companyId) {
          throw new HttpError(403, "FORBIDDEN", "Você só vincula usuários da sua empresa.");
        }
        const company = await platform.findCompany(companyId);
        if (!company) throw new HttpError(404, "NOT_FOUND", "Empresa não encontrada.");
        if (companyId !== target.companyId) {
          const occupied = (await options.users.list()).filter((user) => user.companyId === companyId).length;
          if (occupied >= company.maxUsers) {
            throw new HttpError(403, "LIMIT_USERS", "A empresa atingiu o limite de usuários.");
          }
        }
        patch.companyId = companyId;
      }
    }
    const updated = await options.users.update(id, patch);
    if (!updated) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    if (input.password) {
      await writeLog(actor, "senha_alterada", "user", id, { mustChangePassword: target.mustChangePassword }, { mustChangePassword: false }, target.companyId);
    } else {
      await writeLog(actor, "usuario_atualizado", "user", id, toPublicUser(target), toPublicUser(updated), target.companyId);
    }
    res.json({ data: toPublicUser(updated) });
  }));

  app.post("/api/users/:id/block", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    const { id } = parseBody(idParamSchema, req.params);
    const input = parseBody(blockUserSchema, req.body);
    if (actor.id === id) throw new HttpError(403, "FORBIDDEN", "Você não bloqueia a própria conta.");
    const target = await options.users.findById(id);
    if (!target) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    assertCanManage(actor, target);
    if (!input.blocked && target.blocked && target.blockedByRole === "administrador_suporte" && actor.role !== "administrador_suporte") {
      throw new HttpError(403, "UNBLOCK_FORBIDDEN", "O bloqueio feito pelo administrador suporte só ele desfaz.");
    }
    const updated = await options.users.update(id, {
      blocked: input.blocked,
      blockedByRole: input.blocked ? actor.role : null
    });
    if (!updated) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    await writeLog(
      actor,
      input.blocked ? "usuario_bloqueado" : "usuario_desbloqueado",
      "user",
      id,
      { blocked: target.blocked, blockedByRole: target.blockedByRole },
      { blocked: updated.blocked, blockedByRole: updated.blockedByRole },
      target.companyId
    );
    res.json({ data: toPublicUser(updated) });
  }));

  app.get("/api/production", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    const company = await resolveCompanyId(actor, companyHeader(req));
    res.json({ data: snapshotOf(await production.load(company.id)) });
  }));

  app.post("/api/production/sync", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    if (actor.role === "visualizador" && !(actor.permissions.edit || []).length) {
      throw new HttpError(403, "FORBIDDEN", "O visualizador não altera a produção.");
    }
    const company = await resolveCompanyId(actor, companyHeader(req));
    const input = parseBody(productionSyncSchema, req.body);
    const incoming = prepareRecords(input.records.map((record) => ({
      kind: record.kind,
      id: record.id,
      payload: record.payload,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt ?? null
    })));
    const current = await production.load(company.id);
    const next = applyProductionSync(current, { ...input, records: incoming });
    const snapshot = snapshotOf(next);
    assertWithinLimits(snapshot, company);
    await production.save(company.id, next);
    const before = new Map(current.records.map((record) => [`${record.kind}:${record.id}`, record]));
    const changed = incoming.filter((record) => {
      const winner = next.records.find((item) => item.kind === record.kind && item.id === record.id);
      return winner?.updatedAt === record.updatedAt;
    }).slice(0, 100);
    for (const record of changed) {
      const previous = before.get(`${record.kind}:${record.id}`);
      await writeLog(actor, "producao_alterada", record.kind, record.id, previous ? previous.payload : null, record.payload, company.id);
    }
    res.json({ data: snapshot });
  }));

  app.delete("/api/users/:id", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    assertPasswordReady(actor);
    const { id } = parseBody(idParamSchema, req.params);
    if (actor.id === id) {
      throw new HttpError(403, "FORBIDDEN", "Você não pode excluir a própria conta.");
    }
    const target = await options.users.findById(id);
    if (!target) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    assertCanManage(actor, target);
    const removed = await options.users.delete(id);
    if (!removed) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    await writeLog(actor, "usuario_excluido", "user", id, toPublicUser(target), null, target.companyId);
    res.status(204).send();
  }));

  app.use((_req, _res, next) => {
    next(new HttpError(404, "NOT_FOUND", "Recurso não encontrado."));
  });
  app.use(errorHandler);
  return app;
}
