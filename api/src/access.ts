export const USER_ROLES = ["visualizador", "operador", "administrador", "administrador_suporte"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const PRODUCTION_MODULES = [
  "monitoramento",
  "ordens",
  "apontamento",
  "recursos",
  "engenharia",
  "funcionarios",
  "acompanhamento"
] as const;

export type ProductionModule = (typeof PRODUCTION_MODULES)[number];

export type UserPermissions = {
  view: ProductionModule[];
  edit: ProductionModule[];
};

const MODULE_SET = new Set<string>(PRODUCTION_MODULES);

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

export function isManager(role: UserRole): boolean {
  return role === "administrador" || role === "administrador_suporte";
}

export function normalizeRole(role: string): UserRole {
  if (role === "admin" || role === "administrador_suporte") return "administrador_suporte";
  if (role === "user" || role === "operador") return "operador";
  if (role === "administrador" || role === "visualizador") return role;
  return "visualizador";
}

export function defaultPermissions(role: UserRole): UserPermissions {
  const all = [...PRODUCTION_MODULES];
  if (role === "visualizador") return { view: all, edit: [] };
  return { view: all, edit: all };
}

export function sanitizePermissions(role: UserRole, input?: Partial<UserPermissions> | null): UserPermissions {
  const fallback = defaultPermissions(role);
  if (role === "administrador" || role === "administrador_suporte") return fallback;
  const view = uniqueModules(input?.view);
  const edit = role === "visualizador" ? [] : uniqueModules(input?.edit);
  const visible = uniqueModules([...view, ...edit]);
  return {
    view: visible.length ? visible : fallback.view,
    edit
  };
}

function uniqueModules(values: ProductionModule[] | undefined): ProductionModule[] {
  if (!values) return [];
  const seen = new Set<ProductionModule>();
  for (const value of values) {
    if (MODULE_SET.has(value) && !seen.has(value)) seen.add(value);
  }
  return [...seen];
}
