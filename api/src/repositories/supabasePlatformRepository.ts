import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { HttpError } from "../http.js";
import type {
  CompanyPatch,
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

type CompanyRow = {
  id: string;
  name: string;
  max_users: number;
  max_machines: number;
  max_registrations: number;
  usage_until: string | null;
  blocked: boolean;
  created_at: string;
  updated_at: string;
};

type RequestRow = {
  id: string;
  user_id: string;
  email: string;
  role: string;
  company_id: string | null;
  status: PasswordRequestRecord["status"];
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
};

type LogRow = {
  id: string;
  company_id: string | null;
  actor_id: string | null;
  actor_email: string;
  action: string;
  entity_kind: string;
  entity_id: string;
  valor_anterior: unknown;
  valor_atual: unknown;
  created_at: string;
};

function companyFrom(row: CompanyRow): CompanyRecord {
  return {
    id: row.id,
    name: row.name,
    maxUsers: row.max_users,
    maxMachines: row.max_machines,
    maxRegistrations: row.max_registrations,
    usageUntil: row.usage_until,
    blocked: row.blocked,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function requestFrom(row: RequestRow): PasswordRequestRecord {
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    role: row.role,
    companyId: row.company_id,
    status: row.status,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    resolvedBy: row.resolved_by
  };
}

type TicketRow = {
  id: string;
  company_id: string | null;
  author_id: string;
  author_name: string;
  author_email: string;
  subject: string;
  message: string;
  status: SupportTicketRecord["status"];
  reply: string | null;
  created_at: string;
  updated_at: string;
};

type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  kind: string;
  entity_id: string | null;
  read_at: string | null;
  created_at: string;
};

function ticketFrom(row: TicketRow): SupportTicketRecord {
  return {
    id: row.id,
    companyId: row.company_id,
    authorId: row.author_id,
    authorName: row.author_name,
    authorEmail: row.author_email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    reply: row.reply,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function notificationFrom(row: NotificationRow): NotificationRecord {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    kind: row.kind,
    entityId: row.entity_id,
    readAt: row.read_at,
    createdAt: row.created_at
  };
}

function raise(error: { code?: string; message: string }): never {
  if (error.code === "42P01" || error.code === "42703") {
    throw new HttpError(503, "SCHEMA_PENDING", "Falta atualizar o banco. Rode o script supabase/schema.sql.");
  }
  throw new HttpError(500, "DATABASE_ERROR", "Falha ao acessar o banco de dados.");
}

export function createSupabasePlatformRepository(url: string, serviceRoleKey: string): PlatformRepository {
  const supabase: SupabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return {
    async listCompanies() {
      const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: true });
      if (error) raise(error);
      return ((data ?? []) as CompanyRow[]).map(companyFrom);
    },
    async findCompany(id) {
      const { data, error } = await supabase.from("companies").select("*").eq("id", id).maybeSingle();
      if (error) raise(error);
      return data ? companyFrom(data as CompanyRow) : null;
    },
    async createCompany(input: NewCompany) {
      const payload = {
        name: input.name,
        max_users: input.maxUsers ?? 50,
        max_machines: input.maxMachines ?? 50,
        max_registrations: input.maxRegistrations ?? 500,
        usage_until: input.usageUntil ?? null,
        blocked: input.blocked ?? false
      };
      const { data, error } = await supabase.from("companies").insert(payload).select("*").single();
      if (error) raise(error);
      return companyFrom(data as CompanyRow);
    },
    async updateCompany(id, patch: CompanyPatch) {
      const payload: Record<string, unknown> = {};
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.maxUsers !== undefined) payload.max_users = patch.maxUsers;
      if (patch.maxMachines !== undefined) payload.max_machines = patch.maxMachines;
      if (patch.maxRegistrations !== undefined) payload.max_registrations = patch.maxRegistrations;
      if (patch.usageUntil !== undefined) payload.usage_until = patch.usageUntil;
      if (patch.blocked !== undefined) payload.blocked = patch.blocked;
      const { data, error } = await supabase.from("companies").update(payload).eq("id", id).select("*").maybeSingle();
      if (error) raise(error);
      return data ? companyFrom(data as CompanyRow) : null;
    },
    async createPasswordRequest(input) {
      const existing = await supabase
        .from("password_requests")
        .select("*")
        .eq("user_id", input.userId)
        .eq("status", "pendente")
        .maybeSingle();
      if (existing.error) raise(existing.error);
      if (existing.data) return requestFrom(existing.data as RequestRow);
      const { data, error } = await supabase.from("password_requests").insert({
        user_id: input.userId,
        email: input.email,
        role: input.role,
        company_id: input.companyId
      }).select("*").single();
      if (error) raise(error);
      return requestFrom(data as RequestRow);
    },
    async listPasswordRequests() {
      const { data, error } = await supabase.from("password_requests").select("*").order("created_at", { ascending: false });
      if (error) raise(error);
      return ((data ?? []) as RequestRow[]).map(requestFrom);
    },
    async findPasswordRequest(id) {
      const { data, error } = await supabase.from("password_requests").select("*").eq("id", id).maybeSingle();
      if (error) raise(error);
      return data ? requestFrom(data as RequestRow) : null;
    },
    async updatePasswordRequest(id, patch) {
      const { data, error } = await supabase.from("password_requests").update({
        status: patch.status,
        resolved_at: patch.resolvedAt,
        resolved_by: patch.resolvedBy
      }).eq("id", id).select("*").maybeSingle();
      if (error) raise(error);
      return data ? requestFrom(data as RequestRow) : null;
    },
    async addLog(input: NewAuditLog) {
      const { data, error } = await supabase.from("audit_logs").insert({
        company_id: input.companyId,
        actor_id: input.actorId,
        actor_email: input.actorEmail,
        action: input.action,
        entity_kind: input.entityKind,
        entity_id: input.entityId,
        valor_anterior: input.valorAnterior ?? null,
        valor_atual: input.valorAtual ?? null
      }).select("*").single();
      if (error) raise(error);
      const row = data as LogRow;
      return {
        id: row.id,
        companyId: row.company_id,
        actorId: row.actor_id,
        actorEmail: row.actor_email,
        action: row.action,
        entityKind: row.entity_kind,
        entityId: row.entity_id,
        valorAnterior: row.valor_anterior,
        valorAtual: row.valor_atual,
        createdAt: row.created_at
      };
    },
    async listLogs() {
      const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(300);
      if (error) raise(error);
      return ((data ?? []) as LogRow[]).map((row) => ({
        id: row.id,
        companyId: row.company_id,
        actorId: row.actor_id,
        actorEmail: row.actor_email,
        action: row.action,
        entityKind: row.entity_kind,
        entityId: row.entity_id,
        valorAnterior: row.valor_anterior,
        valorAtual: row.valor_atual,
        createdAt: row.created_at
      }));
    },
    async createSupportTicket(input: NewSupportTicket) {
      const { data, error } = await supabase.from("support_tickets").insert({
        company_id: input.companyId,
        author_id: input.authorId,
        author_name: input.authorName,
        author_email: input.authorEmail,
        subject: input.subject,
        message: input.message
      }).select("*").single();
      if (error) raise(error);
      return ticketFrom(data as TicketRow);
    },
    async listSupportTickets() {
      const { data, error } = await supabase.from("support_tickets").select("*").order("updated_at", { ascending: false });
      if (error) raise(error);
      return ((data ?? []) as TicketRow[]).map(ticketFrom);
    },
    async findSupportTicket(id) {
      const { data, error } = await supabase.from("support_tickets").select("*").eq("id", id).maybeSingle();
      if (error) raise(error);
      return data ? ticketFrom(data as TicketRow) : null;
    },
    async updateSupportTicket(id, patch: SupportTicketPatch) {
      const payload: Record<string, unknown> = {};
      if (patch.status !== undefined) payload.status = patch.status;
      if (patch.reply !== undefined) payload.reply = patch.reply;
      const { data, error } = await supabase.from("support_tickets").update(payload).eq("id", id).select("*").maybeSingle();
      if (error) raise(error);
      return data ? ticketFrom(data as TicketRow) : null;
    },
    async addNotification(input: NewNotification) {
      const { data, error } = await supabase.from("notifications").insert({
        user_id: input.userId,
        title: input.title,
        body: input.body,
        kind: input.kind,
        entity_id: input.entityId
      }).select("*").single();
      if (error) raise(error);
      return notificationFrom(data as NotificationRow);
    },
    async listNotifications(userId) {
      const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(40);
      if (error) raise(error);
      return ((data ?? []) as NotificationRow[]).map(notificationFrom);
    },
    async markNotificationRead(id, userId) {
      const { data, error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId).select("*").maybeSingle();
      if (error) raise(error);
      return data ? notificationFrom(data as NotificationRow) : null;
    },
    async markAllNotificationsRead(userId) {
      const { data, error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", userId).is("read_at", null).select("id");
      if (error) raise(error);
      return data?.length ?? 0;
    }
  };
}
