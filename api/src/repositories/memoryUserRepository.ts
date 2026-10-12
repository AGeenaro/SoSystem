import { randomUUID } from "node:crypto";
import { defaultPermissions } from "../access.js";
import type { NewUser, UserPatch, UserRecord, UserRepository } from "./userRepository.js";

export function createMemoryUserRepository(): UserRepository {
  const users = new Map<string, UserRecord>();

  return {
    async count() {
      return users.size;
    },
    async list() {
      return [...users.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },
    async findById(id) {
      return users.get(id) ?? null;
    },
    async findByEmail(email) {
      const normalized = email.toLowerCase();
      return [...users.values()].find((user) => user.email.toLowerCase() === normalized) ?? null;
    },
    async create(input: NewUser) {
      const now = new Date().toISOString();
      const user: UserRecord = {
        id: input.id ?? randomUUID(),
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        role: input.role,
        permissions: input.permissions ?? defaultPermissions(input.role),
        createdAt: now,
        updatedAt: now
      };
      users.set(user.id, user);
      return user;
    },
    async update(id, patch: UserPatch) {
      const current = users.get(id);
      if (!current) return null;
      const next: UserRecord = {
        ...current,
        ...patch,
        email: patch.email ? patch.email.toLowerCase() : current.email,
        updatedAt: new Date().toISOString()
      };
      users.set(id, next);
      return next;
    },
    async delete(id) {
      return users.delete(id);
    }
  };
}
