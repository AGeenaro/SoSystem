import type { UserPermissions, UserRole } from "../access.js";

export type { UserRole };

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  permissions: UserPermissions;
  companyId: string | null;
  mustChangePassword: boolean;
  blocked: boolean;
  blockedByRole: UserRole | null;
  createdAt: string;
  updatedAt: string;
};

export type NewUser = {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  permissions?: UserPermissions;
  companyId?: string | null;
  mustChangePassword?: boolean;
  blocked?: boolean;
  blockedByRole?: UserRole | null;
};

export type UserPatch = Partial<Pick<UserRecord, "name" | "email" | "passwordHash" | "role" | "permissions" | "companyId" | "mustChangePassword" | "blocked" | "blockedByRole">>;

export interface UserRepository {
  count(): Promise<number>;
  list(): Promise<UserRecord[]>;
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  create(input: NewUser): Promise<UserRecord>;
  update(id: string, patch: UserPatch): Promise<UserRecord | null>;
  delete(id: string): Promise<boolean>;
}

export type PublicUser = Omit<UserRecord, "passwordHash">;

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    companyId: user.companyId,
    mustChangePassword: user.mustChangePassword,
    blocked: user.blocked,
    blockedByRole: user.blockedByRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
