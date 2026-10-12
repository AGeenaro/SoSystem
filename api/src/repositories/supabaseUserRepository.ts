import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { defaultPermissions, normalizeRole, type UserPermissions } from "../access.js";
import { HttpError } from "../http.js";
import type { NewUser, UserPatch, UserRecord, UserRepository, UserRole } from "./userRepository.js";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  permissions?: UserPermissions | null;
  created_at: string;
  updated_at: string;
};

function toRecord(row: UserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: normalizeRole(row.role),
    permissions: row.permissions?.view ? row.permissions : defaultPermissions(normalizeRole(row.role)),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function raise(error: { code?: string; message: string }): never {
  if (error.code === "23505") {
    throw new HttpError(409, "EMAIL_IN_USE", "Já existe um usuário com este e-mail.");
  }
  throw new HttpError(500, "DATABASE_ERROR", "Falha ao acessar o banco de dados.");
}

export function createSupabaseUserRepository(url: string, serviceRoleKey: string): UserRepository {
  const supabase: SupabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return {
    async count() {
      const { count, error } = await supabase.from("users").select("id", { count: "exact", head: true });
      if (error) raise(error);
      return count ?? 0;
    },
    async list() {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: true });
      if (error) raise(error);
      return ((data ?? []) as UserRow[]).map(toRecord);
    },
    async findById(id) {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
      if (error) raise(error);
      return data ? toRecord(data as UserRow) : null;
    },
    async findByEmail(email) {
      const { data, error } = await supabase.from("users").select("*").eq("email", email.toLowerCase()).maybeSingle();
      if (error) raise(error);
      return data ? toRecord(data as UserRow) : null;
    },
    async create(input: NewUser) {
      const payload: Record<string, unknown> = {
        name: input.name,
        email: input.email.toLowerCase(),
        password_hash: input.passwordHash,
        role: input.role,
        permissions: input.permissions ?? defaultPermissions(input.role)
      };
      if (input.id) payload.id = input.id;
      const { data, error } = await supabase.from("users").insert(payload).select("*").single();
      if (error) raise(error);
      return toRecord(data as UserRow);
    },
    async update(id, patch: UserPatch) {
      const payload: Record<string, unknown> = {};
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.email !== undefined) payload.email = patch.email.toLowerCase();
      if (patch.passwordHash !== undefined) payload.password_hash = patch.passwordHash;
      if (patch.role !== undefined) payload.role = patch.role;
      if (patch.permissions !== undefined) payload.permissions = patch.permissions;
      const { data, error } = await supabase.from("users").update(payload).eq("id", id).select("*").maybeSingle();
      if (error) raise(error);
      return data ? toRecord(data as UserRow) : null;
    },
    async delete(id) {
      const { data, error } = await supabase.from("users").delete().eq("id", id).select("id");
      if (error) raise(error);
      return Boolean(data && data.length > 0);
    }
  };
}
