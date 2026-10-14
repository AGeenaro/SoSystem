import { randomUUID } from "node:crypto";
import type { UserPermissions } from "../access.js";
import type {
  AuditLogRecord,
  CompanyPatch,
  CompanyProfileRecord,
  CompanyProfileRole,
  CompanyRecord,
  NewAuditLog,
  NewCompany,
  NewNotification,
  NewSupportTicket,
  NotificationRecord,
  PasswordRequestRecord,
  PlatformRepository,
  SupportTicketPatch,
  SupportTicketRecord
} from "./platformRepository.js";

function now() {
  return new Date().toISOString();
}

export function createMemoryPlatformRepository(): PlatformRepository {
  const companies = new Map<string, CompanyRecord>();
  const profiles = new Map<string, CompanyProfileRecord>();
  const requests = new Map<string, PasswordRequestRecord>();
  const logs: AuditLogRecord[] = [];
  const tickets = new Map<string, SupportTicketRecord>();
  const notifications = new Map<string, NotificationRecord>();

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
        code: (input.code ?? "").trim().toUpperCase(),
        name: input.name,
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
    async listProfiles(companyId) {
      return [...profiles.values()]
        .filter((profile) => profile.companyId === companyId)
        .sort((a, b) => a.role.localeCompare(b.role));
    },
    async saveProfile(companyId, role: CompanyProfileRole, permissions: UserPermissions) {
      const profile: CompanyProfileRecord = {
        companyId,
        role,
        view: permissions.view,
        edit: permissions.edit,
        sectors: permissions.sectors,
        updatedAt: now()
      };
      profiles.set(`${companyId}:${role}`, profile);
      return profile;
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
    },
    async createSupportTicket(input: NewSupportTicket) {
      const stamp = now();
      const ticket: SupportTicketRecord = {
        ...input,
        id: randomUUID(),
        status: "aberto",
        reply: null,
        createdAt: stamp,
        updatedAt: stamp
      };
      tickets.set(ticket.id, ticket);
      return ticket;
    },
    async listSupportTickets() {
      return [...tickets.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async findSupportTicket(id) {
      return tickets.get(id) ?? null;
    },
    async updateSupportTicket(id, patch: SupportTicketPatch) {
      const current = tickets.get(id);
      if (!current) return null;
      const next = { ...current, ...patch, updatedAt: now() };
      tickets.set(id, next);
      return next;
    },
    async addNotification(input: NewNotification) {
      const entry: NotificationRecord = { ...input, id: randomUUID(), readAt: null, createdAt: now() };
      notifications.set(entry.id, entry);
      return entry;
    },
    async listNotifications(userId) {
      return [...notifications.values()]
        .filter((entry) => entry.userId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 40);
    },
    async markNotificationRead(id, userId) {
      const current = notifications.get(id);
      if (!current || current.userId !== userId) return null;
      const next = { ...current, readAt: current.readAt ?? now() };
      notifications.set(id, next);
      return next;
    },
    async markAllNotificationsRead(userId) {
      let count = 0;
      for (const entry of notifications.values()) {
        if (entry.userId !== userId || entry.readAt) continue;
        notifications.set(entry.id, { ...entry, readAt: now() });
        count += 1;
      }
      return count;
    }
  };
}
