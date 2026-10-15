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
  sectors: string[];
};

const MODULE_SET = new Set<string>(PRODUCTION_MODULES);

export function alphaCode(index: number): string {
  return String(Math.max(0, Math.trunc(index)));
}

export function nextNumericCode(used: Array<string | null | undefined>): string {
  let max = 0;
  for (const value of used) {
    const digits = String(value ?? "").replace(/\D/g, "");
    if (!digits) continue;
    const number = Number(digits);
    if (Number.isFinite(number) && number > max) max = Math.floor(number);
  }
  return String(max + 1);
}

export function nextAlphaCode(used: Array<string | null | undefined>): string {
  return nextNumericCode(used);
}

export function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}

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
  if (role === "visualizador") return { view: all, edit: [], sectors: [] };
  return { view: all, edit: all, sectors: [] };
}

export function sanitizePermissions(role: UserRole, input?: Partial<UserPermissions> | null): UserPermissions {
  const fallback = defaultPermissions(role);
  if (!input) return fallback;
  const view = Array.isArray(input.view) ? uniqueModules(input.view) : fallback.view;
  const editSource = Array.isArray(input.edit) ? uniqueModules(input.edit) : fallback.edit;
  const edit = editSource.filter((module) => view.includes(module));
  const sectors = Array.isArray(input.sectors) ? uniqueSectors(input.sectors) : [];
  return { view, edit, sectors };
}

function uniqueModules(values: ProductionModule[] | undefined): ProductionModule[] {
  if (!values) return [];
  const seen = new Set<ProductionModule>();
  for (const value of values) {
    if (MODULE_SET.has(value) && !seen.has(value)) seen.add(value);
  }
  return [...seen];
}

function uniqueSectors(values: string[] | undefined): string[] {
  if (!values) return [];
  const seen = new Set<string>();
  const names: string[] = [];
  for (const value of values) {
    const name = String(value ?? "").trim();
    const key = name.toLowerCase();
    if (!name || name.length > 80 || seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  return names.slice(0, 80);
}
