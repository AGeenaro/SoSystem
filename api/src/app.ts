import bcrypt from "bcryptjs";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { defaultPermissions, isManager, sanitizePermissions, type UserRole } from "./access.js";
import { requireAuth, signToken } from "./auth.js";
import { HttpError, asyncHandler, errorHandler } from "./http.js";
import { openApiSpec } from "./openapi.js";
import { buildLimiter } from "./rateLimit.js";
import type { ProductionRecord } from "./production/merge.js";
import type { ProductionRepository } from "./repositories/productionRepository.js";
import { createMemoryProductionRepository } from "./repositories/memoryProductionRepository.js";
import { toPublicUser, type UserPatch, type UserRecord, type UserRepository } from "./repositories/userRepository.js";
import { createUserSchema, idParamSchema, loginSchema, productionSyncSchema, registerSchema, updateUserSchema } from "./schemas.js";

export type AppOptions = {
  users: UserRepository;
  production?: ProductionRepository;
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

export function createApp(options: AppOptions): Express {
  const jwtExpiresIn = options.jwtExpiresIn ?? "8h";
  const bcryptRounds = options.bcryptRounds ?? 10;
  const limits = options.rateLimit ?? { windowMs: 15 * 60 * 1000, limit: 100, authLimit: 10 };
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: options.corsOrigin ?? true }));
  app.use(express.json({ limit: "2mb" }));
  const production = options.production ?? createMemoryProductionRepository();

  app.get("/", (_req, res) => {
    res.json({
      data: {
        name: "SoSystem API",
        health: "/health",
        docs: "/docs",
        openapi: "/openapi.json"
      }
    });
  });

  app.get("/health", (_req, res) => {
    res.json({ data: { status: "ok", service: "sosystem-api" } });
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
      user: toPublicUser({ ...user, passwordHash: "" })
    };
  }

  app.get("/api/auth/status", asyncHandler(async (_req, res) => {
    const count = await options.users.count();
    res.json({ data: { needsSetup: count === 0 } });
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
    res.status(201).json({ data: await issueSession(user) });
  }));

  app.post("/api/auth/login", authLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(loginSchema, req.body);
    const user = await options.users.findByEmail(input.email);
    const valid = user ? await bcrypt.compare(input.password, user.passwordHash) : false;
    if (!user || !valid) throw new HttpError(401, "INVALID_CREDENTIALS", "E-mail ou senha inválidos.");
    res.json({ data: await issueSession(user) });
  }));

  app.get("/api/auth/me", auth, asyncHandler(async (req, res) => {
    const user = await options.users.findById(req.auth!.sub);
    if (!user) throw new HttpError(401, "UNAUTHORIZED", "Usuário do token não existe mais.");
    res.json({ data: toPublicUser(user) });
  }));

  async function actorFrom(req: { auth?: { sub: string } }) {
    const user = await options.users.findById(req.auth!.sub);
    if (!user) throw new HttpError(401, "UNAUTHORIZED", "Usuário do token não existe mais.");
    return user;
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
  }

  app.get("/api/users", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    if (!isManager(actor.role)) throw new HttpError(403, "FORBIDDEN", "Seu perfil não gerencia usuários.");
    const users = await options.users.list();
    const visible = actor.role === "administrador_suporte"
      ? users
      : users.filter((user) => user.role !== "administrador_suporte");
    res.json({ data: visible.map(toPublicUser) });
  }));

  app.post("/api/users", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    const input = parseBody(createUserSchema, req.body);
    const role = input.role ?? "operador";
    assertCanManage(actor, null, role);
    const email = input.email.toLowerCase();
    if (await options.users.findByEmail(email)) {
      throw new HttpError(409, "EMAIL_IN_USE", "Já existe um usuário com este e-mail.");
    }
    const user = await options.users.create({
      name: input.name,
      email,
      passwordHash: await bcrypt.hash(input.password, bcryptRounds),
      role,
      permissions: sanitizePermissions(role, input.permissions)
    });
    res.status(201).json({ data: toPublicUser(user) });
  }));

  app.get("/api/users/:id", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    const { id } = parseBody(idParamSchema, req.params);
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
    if (!self) assertCanManage(actor, target, input.role);
    if (self && (input.role || input.permissions)) {
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
    if (input.password) patch.passwordHash = await bcrypt.hash(input.password, bcryptRounds);
    const nextRole = input.role ?? target.role;
    if (!self && input.role !== undefined) patch.role = input.role;
    if (!self && (input.permissions !== undefined || input.role !== undefined)) {
      patch.permissions = sanitizePermissions(nextRole, input.permissions ?? target.permissions);
    }
    const updated = await options.users.update(id, patch);
    if (!updated) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    res.json({ data: toPublicUser(updated) });
  }));

  app.get("/api/production", auth, asyncHandler(async (_req, res) => {
    res.json({ data: await production.snapshot() });
  }));

  app.post("/api/production/sync", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    if (actor.role === "visualizador") {
      throw new HttpError(403, "FORBIDDEN", "O visualizador não altera a produção.");
    }
    const input = parseBody(productionSyncSchema, req.body);
    const records: ProductionRecord[] = input.records.map((record) => ({
      kind: record.kind,
      id: record.id,
      payload: record.payload,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt ?? null
    }));
    const snapshot = await production.sync({
      records,
      nextOrderNum: input.nextOrderNum,
      nextEmployeeNum: input.nextEmployeeNum
    });
    res.json({ data: snapshot });
  }));

  app.delete("/api/users/:id", auth, asyncHandler(async (req, res) => {
    const actor = await actorFrom(req);
    const { id } = parseBody(idParamSchema, req.params);
    if (actor.id === id) {
      throw new HttpError(403, "FORBIDDEN", "Você não pode excluir a própria conta.");
    }
    const target = await options.users.findById(id);
    if (!target) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    assertCanManage(actor, target);
    const removed = await options.users.delete(id);
    if (!removed) throw new HttpError(404, "NOT_FOUND", "Usuário não encontrado.");
    res.status(204).send();
  }));

  app.use((_req, _res, next) => {
    next(new HttpError(404, "NOT_FOUND", "Recurso não encontrado."));
  });
  app.use(errorHandler);
  return app;
}
