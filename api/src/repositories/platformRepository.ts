export type CompanyRecord = {
  id: string;
  name: string;
  maxUsers: number;
  maxMachines: number;
  maxRegistrations: number;
  usageUntil: string | null;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewCompany = {
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

export interface PlatformRepository {
  listCompanies(): Promise<CompanyRecord[]>;
  findCompany(id: string): Promise<CompanyRecord | null>;
  createCompany(input: NewCompany): Promise<CompanyRecord>;
  updateCompany(id: string, patch: CompanyPatch): Promise<CompanyRecord | null>;
  createPasswordRequest(input: Omit<PasswordRequestRecord, "id" | "status" | "createdAt" | "resolvedAt" | "resolvedBy">): Promise<PasswordRequestRecord>;
  listPasswordRequests(): Promise<PasswordRequestRecord[]>;
  findPasswordRequest(id: string): Promise<PasswordRequestRecord | null>;
  updatePasswordRequest(id: string, patch: Pick<PasswordRequestRecord, "status" | "resolvedAt" | "resolvedBy">): Promise<PasswordRequestRecord | null>;
  addLog(input: NewAuditLog): Promise<AuditLogRecord>;
  listLogs(): Promise<AuditLogRecord[]>;
}
