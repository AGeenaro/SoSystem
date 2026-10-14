import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { normalizeRole, sanitizePermissions, type UserPermissions } from "../access.js";
import { HttpError } from "../http.js";
import type { NewUser, UserPatch, UserRecord, UserRepository, UserRole } from "./userRepository.js";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  permissions?: UserPermissions | null;
  company_id?: string | null;
  must_change_password?: boolean | null;
  blocked?: boolean | null;
  blocked_by_role?: string | null;
  session_version?: number | null;
  code?: string | null;
  last_access_at?: string | null;
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
    permissions: sanitizePermissions(normalizeRole(row.role), row.permissions),
    companyId: row.company_id ?? null,
    mustChangePassword: Boolean(row.must_change_password),
    blocked: Boolean(row.blocked),
    blockedByRole: row.blocked_by_role ? normalizeRole(row.blocked_by_role) : null,
    sessionVersion: Number(row.session_version ?? 0),
    code: String(row.code ?? "").trim().toUpperCase(),
    lastAccessAt: row.last_access_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function raise(error: { code?: string; message: string }): never {
  if (error.code === "23505") {
    if (/code/i.test(error.message)) {
      throw new HttpError(409, "CODE_IN_USE", "Já existe um usuário com este código nesta empresa.");
    }
    throw new HttpError(409, "EMAIL_IN_USE", "Já existe um usuário com este e-mail.");
  }
  throw new HttpError(500, "DATABASE_ERROR", "Falha ao acessar o banco de dados.");
}

const OPTIONAL_USER_COLUMNS = ["code", "last_access_at", "session_version"] as const;

async function persistUser(
  supabase: SupabaseClient,
  mode: "insert" | "update",
  id: string | undefined,
  payload: Record<string, unknown>
): Promise<UserRecord | null> {
  let body = { ...payload };
  for (let attempt = 0; attempt < 4; attempt++) {
    const result = mode === "insert"
      ? await supabase.from("users").insert(body).select("*").single()
      : await supabase.from("users").update(body).eq("id", id!).select("*").maybeSingle();
    if (!result.error) return result.data ? toRecord(result.data as UserRow) : null;
    const missing = result.error.message.match(/"(code|last_access_at|session_version)"/i);
    const column = missing?.[1]?.toLowerCase();
    if (!column || !OPTIONAL_USER_COLUMNS.includes(column as (typeof OPTIONAL_USER_COLUMNS)[number]) || !(column in body)) {
      raise(result.error);
    }
    delete body[column];
    body = { ...body };
    if (!Object.keys(body).length && mode === "update") {
      const existing = await supabase.from("users").select("*").eq("id", id!).maybeSingle();
      if (existing.error) raise(existing.error);
      return existing.data ? toRecord(existing.data as UserRow) : null;
    }
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
        permissions: input.permissions ?? sanitizePermissions(input.role, null),
        company_id: input.companyId ?? null,
        must_change_password: input.mustChangePassword ?? false,
        blocked: input.blocked ?? false,
        blocked_by_role: input.blockedByRole ?? null,
        session_version: input.sessionVersion ?? 0,
        code: (input.code ?? "").trim().toUpperCase(),
        last_access_at: input.lastAccessAt ?? null
      };
      if (input.id) payload.id = input.id;
      const created = await persistUser(supabase, "insert", undefined, payload);
      if (!created) throw new HttpError(500, "DATABASE_ERROR", "Falha ao acessar o banco de dados.");
      return created;
    },
    async update(id, patch: UserPatch) {
      const payload: Record<string, unknown> = {};
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.email !== undefined) payload.email = patch.email.toLowerCase();
      if (patch.passwordHash !== undefined) payload.password_hash = patch.passwordHash;
      if (patch.role !== undefined) payload.role = patch.role;
      if (patch.permissions !== undefined) payload.permissions = patch.permissions;
      if (patch.companyId !== undefined) payload.company_id = patch.companyId;
      if (patch.mustChangePassword !== undefined) payload.must_change_password = patch.mustChangePassword;
      if (patch.blocked !== undefined) payload.blocked = patch.blocked;
      if (patch.blockedByRole !== undefined) payload.blocked_by_role = patch.blockedByRole;
      if (patch.sessionVersion !== undefined) payload.session_version = patch.sessionVersion;
      if (patch.code !== undefined) payload.code = patch.code.trim().toUpperCase();
      if (patch.lastAccessAt !== undefined) payload.last_access_at = patch.lastAccessAt;
      return persistUser(supabase, "update", id, payload);
    },
    async delete(id) {
      const { data, error } = await supabase.from("users").delete().eq("id", id).select("id");
      if (error) raise(error);
      return Boolean(data && data.length > 0);
    }
  };
}
