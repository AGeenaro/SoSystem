import type { ProductionModule, UserPermissions } from "../access.js";

export type CompanyRecord = {
  id: string;
  code: string;
  name: string;
  maxUsers: number;
  maxMachines: number;
  maxRegistrations: number;
  usageUntil: string | null;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CompanyProfileRole = "visualizador" | "operador" | "administrador";

export type CompanyProfileRecord = {
  companyId: string;
  role: CompanyProfileRole;
  view: ProductionModule[];
  edit: ProductionModule[];
  sectors: string[];
  updatedAt: string;
};

export type NewCompany = {
  code?: string;
  name: string;
  maxUsers?: number;
  maxMachines?: number;
  maxRegistrations?: number;
  usageUntil?: string | null;
  blocked?: boolean;
};

export type CompanyPatch = Partial<Omit<CompanyRecord, "id" | "createdAt" | "updatedAt">>;

export type PasswordRequestStatus = "pendente" | "atendida" | "recusada";

export type PasswordRequestRecord = {
  id: string;
  userId: string;
  email: string;
  role: string;
  companyId: string | null;
  status: PasswordRequestStatus;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
};

export type AuditLogRecord = {
  id: string;
  companyId: string | null;
  actorId: string | null;
  actorEmail: string;
  action: string;
  entityKind: string;
  entityId: string;
  valorAnterior: unknown;
  valorAtual: unknown;
  createdAt: string;
};

export type NewAuditLog = Omit<AuditLogRecord, "id" | "createdAt">;

export type SupportStatus = "aberto" | "em_andamento" | "resolvido";

export type SupportTicketRecord = {
  id: string;
  companyId: string | null;
  authorId: string;
  authorName: string;
  authorEmail: string;
  subject: string;
  message: string;
  status: SupportStatus;
  reply: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewSupportTicket = Omit<SupportTicketRecord, "id" | "status" | "reply" | "createdAt" | "updatedAt">;

export type SupportTicketPatch = Partial<Pick<SupportTicketRecord, "status" | "reply">>;

export type NotificationRecord = {
  id: string;
  userId: string;
  title: string;
  body: string;
  kind: string;
  entityId: string | null;
  readAt: string | null;
  createdAt: string;
};

export type NewNotification = Omit<NotificationRecord, "id" | "readAt" | "createdAt">;

export interface PlatformRepository {
  listCompanies(): Promise<CompanyRecord[]>;
  findCompany(id: string): Promise<CompanyRecord | null>;
  createCompany(input: NewCompany): Promise<CompanyRecord>;
  updateCompany(id: string, patch: CompanyPatch): Promise<CompanyRecord | null>;
  listProfiles(companyId: string): Promise<CompanyProfileRecord[]>;
  saveProfile(companyId: string, role: CompanyProfileRole, permissions: UserPermissions): Promise<CompanyProfileRecord>;
  createPasswordRequest(input: Omit<PasswordRequestRecord, "id" | "status" | "createdAt" | "resolvedAt" | "resolvedBy">): Promise<PasswordRequestRecord>;
  listPasswordRequests(): Promise<PasswordRequestRecord[]>;
  findPasswordRequest(id: string): Promise<PasswordRequestRecord | null>;
  updatePasswordRequest(id: string, patch: Pick<PasswordRequestRecord, "status" | "resolvedAt" | "resolvedBy">): Promise<PasswordRequestRecord | null>;
  addLog(input: NewAuditLog): Promise<AuditLogRecord>;
  listLogs(): Promise<AuditLogRecord[]>;
  createSupportTicket(input: NewSupportTicket): Promise<SupportTicketRecord>;
  listSupportTickets(): Promise<SupportTicketRecord[]>;
  findSupportTicket(id: string): Promise<SupportTicketRecord | null>;
  updateSupportTicket(id: string, patch: SupportTicketPatch): Promise<SupportTicketRecord | null>;
  addNotification(input: NewNotification): Promise<NotificationRecord>;
  listNotifications(userId: string): Promise<NotificationRecord[]>;
  markNotificationRead(id: string, userId: string): Promise<NotificationRecord | null>;
  markAllNotificationsRead(userId: string): Promise<number>;
}
