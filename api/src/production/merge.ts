export const PRODUCTION_KINDS = ["employee", "product", "order", "punch", "resource", "group", "family"] as const;

export type ProductionKind = (typeof PRODUCTION_KINDS)[number];

export type ProductionRecord = {
  kind: ProductionKind;
  id: string;
  payload: Record<string, unknown>;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductionSnapshot = {
  employees: Record<string, unknown>[];
  products: Record<string, unknown>[];
  orders: Record<string, unknown>[];
  punches: Record<string, unknown>[];
  resources: Record<string, unknown>[];
  groups: Record<string, unknown>[];
  families: Record<string, unknown>[];
  tombstones: { kind: ProductionKind; id: string; updatedAt: string }[];
  nextOrderNum: number;
  nextEmployeeNum: number;
};

const COLLECTIONS: Record<ProductionKind, keyof ProductionSnapshot> = {
  employee: "employees",
  product: "products",
  order: "orders",
  punch: "punches",
  resource: "resources",
  group: "groups",
  family: "families"
};

export function mergeRecords(current: ProductionRecord[], incoming: ProductionRecord[]): ProductionRecord[] {
  const map = new Map<string, ProductionRecord>();
  for (const record of current) map.set(`${record.kind}:${record.id}`, record);
  for (const record of incoming) {
    const key = `${record.kind}:${record.id}`;
    const existing = map.get(key);
    if (!existing || record.updatedAt >= existing.updatedAt) map.set(key, record);
  }
  return [...map.values()];
}

export function greatestCounter(current: number, incoming: number | undefined): number {
  if (!Number.isFinite(incoming)) return current;
  return Math.max(current, Math.trunc(incoming as number));
}

export function toSnapshot(
  records: ProductionRecord[],
  nextOrderNum: number,
  nextEmployeeNum: number
): ProductionSnapshot {
  const snapshot: ProductionSnapshot = {
    employees: [],
    products: [],
    orders: [],
    punches: [],
    resources: [],
    groups: [],
    families: [],
    tombstones: [],
    nextOrderNum,
    nextEmployeeNum
  };
  for (const record of records) {
    if (record.deletedAt) {
      snapshot.tombstones.push({ kind: record.kind, id: record.id, updatedAt: record.updatedAt });
      continue;
    }
    const collection = COLLECTIONS[record.kind];
    (snapshot[collection] as Record<string, unknown>[]).push({
      ...record.payload,
      updatedAt: record.updatedAt
    });
  }
  return snapshot;
}
