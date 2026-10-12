import { randomUUID } from "node:crypto";
import type {
  AuditLogRecord,
  CompanyPatch,
  CompanyRecord,
  NewAuditLog,
  NewCompany,
  PasswordRequestRecord,
  PlatformRepository
} from "./platformRepository.js";

function now() {
  return new Date().toISOString();
}

export function createMemoryPlatformRepository(): PlatformRepository {
  const companies = new Map<string, CompanyRecord>();
  const requests = new Map<string, PasswordRequestRecord>();
  const logs: AuditLogRecord[] = [];

  return {
    async listCompanies() {
      return [...companies.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },
    async findCompany(id) {
      return companies.get(id) ?? null;
    },
    async createCompany(input: NewCompany) {
      const stamp = now();
      const company: CompanyRecord = {
        id: randomUUID(),
        name: input.name,
        logo: input.logo ?? "",
        maxUsers: input.maxUsers ?? 50,
        maxMachines: input.maxMachines ?? 50,
        maxRegistrations: input.maxRegistrations ?? 500,
        usageUntil: input.usageUntil ?? null,
        blocked: input.blocked ?? false,
        createdAt: stamp,
        updatedAt: stamp
      };
      companies.set(company.id, company);
      return company;
    },
    async updateCompany(id, patch: CompanyPatch) {
      const current = companies.get(id);
      if (!current) return null;
      const next = { ...current, ...patch, updatedAt: now() };
      companies.set(id, next);
      return next;
    },
    async createPasswordRequest(input) {
      const pending = [...requests.values()].find((item) => item.userId === input.userId && item.status === "pendente");
      if (pending) return pending;
      const request: PasswordRequestRecord = {
        id: randomUUID(),
        userId: input.userId,
        email: input.email,
        role: input.role,
        companyId: input.companyId,
        status: "pendente",
        createdAt: now(),
        resolvedAt: null,
        resolvedBy: null
      };
      requests.set(request.id, request);
      return request;
    },
    async listPasswordRequests() {
      return [...requests.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async findPasswordRequest(id) {
      return requests.get(id) ?? null;
    },
    async updatePasswordRequest(id, patch) {
      const current = requests.get(id);
      if (!current) return null;
      const next = { ...current, ...patch };
      requests.set(id, next);
      return next;
    },
    async addLog(input: NewAuditLog) {
      const entry: AuditLogRecord = { ...input, id: randomUUID(), createdAt: now() };
      logs.push(entry);
      return entry;
    },
    async listLogs() {
      return [...logs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  };
}
