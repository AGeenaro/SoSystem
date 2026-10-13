import { z } from "zod";
import { PRODUCTION_MODULES, USER_ROLES } from "./access.js";
import { isStrongPassword, PASSWORD_HINT } from "./passwordPolicy.js";
import { PRODUCTION_KINDS } from "./production/merge.js";

const roleSchema = z.enum(USER_ROLES);
const permissionsSchema = z.object({
  view: z.array(z.enum(PRODUCTION_MODULES)).max(32),
  edit: z.array(z.enum(PRODUCTION_MODULES)).max(32)
}).strict();

const passwordSchema = z.string().max(72).refine(isStrongPassword, PASSWORD_HINT);
const emailSchema = z.string().trim().email("E-mail inválido.").max(160);
const nameSchema = z.string().trim().min(2, "O nome precisa ter pelo menos 2 caracteres.").max(80);

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
}).strict();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe a senha.").max(72)
}).strict();

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema.optional(),
  role: roleSchema.optional(),
  permissions: permissionsSchema.optional(),
  companyId: z.string().uuid().nullable().optional()
}).strict();

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  role: roleSchema.optional(),
  permissions: permissionsSchema.optional(),
  companyId: z.string().uuid().nullable().optional()
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "Informe ao menos um campo para atualizar."
});

export const idParamSchema = z.object({
  id: z.string().uuid("O id precisa ser um UUID.")
});

export const productionSyncSchema = z.object({
  records: z.array(z.object({
    kind: z.enum(PRODUCTION_KINDS),
    id: z.string().trim().min(1).max(120),
    payload: z.record(z.string(), z.unknown()),
    updatedAt: z.string().datetime({ offset: true }),
    deletedAt: z.string().datetime({ offset: true }).nullable().optional()
  })).max(5000),
  nextOrderNum: z.number().int().min(1).max(1_000_000).optional(),
  nextEmployeeNum: z.number().int().min(1).max(1_000_000).optional()
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const companyCreateSchema = z.object({
  name: z.string().trim().min(2).max(80)
}).strict();

export const companyUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  maxUsers: z.number().int().min(1).max(100_000).optional(),
  maxMachines: z.number().int().min(1).max(100_000).optional(),
  maxRegistrations: z.number().int().min(1).max(1_000_000).optional(),
  usageUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  blocked: z.boolean().optional()
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "Informe ao menos um campo para atualizar."
});

export const passwordRequestSchema = z.object({
  email: emailSchema
}).strict();

export const resolvePasswordRequestSchema = z.object({
  action: z.enum(["reset", "reject"])
}).strict();

export const blockUserSchema = z.object({
  blocked: z.boolean()
}).strict();

export const supportCreateSchema = z.object({
  subject: z.string().trim().min(3, "O assunto precisa ter pelo menos 3 caracteres.").max(120),
  message: z.string().trim().min(3, "Descreva o pedido com pelo menos 3 caracteres.").max(4000)
}).strict();

export const supportUpdateSchema = z.object({
  status: z.enum(["aberto", "em_andamento", "resolvido"]).optional(),
  reply: z.string().trim().max(4000).nullable().optional()
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "Informe o status ou a resposta."
});
