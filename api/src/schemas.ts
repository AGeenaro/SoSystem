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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
