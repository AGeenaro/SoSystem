export type UserRole = "admin" | "user";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type NewUser = {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export type UserPatch = Partial<Pick<UserRecord, "name" | "email" | "passwordHash" | "role">>;

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
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
