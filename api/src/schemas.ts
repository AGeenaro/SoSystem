import { z } from "zod";

const passwordSchema = z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.").max(72);
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

export const createUserSchema = registerSchema.extend({
  role: z.enum(["admin", "user"]).optional()
}).strict();

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  role: z.enum(["admin", "user"]).optional()
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "Informe ao menos um campo para atualizar."
});

export const idParamSchema = z.object({
  id: z.string().uuid("O id precisa ser um UUID.")
});

export const productionSyncSchema = z.object({
  records: z.array(z.object({
    kind: z.enum(["employee", "product", "order", "punch", "resource"]),
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
