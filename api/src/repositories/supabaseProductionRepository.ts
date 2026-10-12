import { createClient } from "@supabase/supabase-js";
import { HttpError } from "../http.js";
import {
  greatestCounter,
  mergeRecords,
  toSnapshot,
  type ProductionKind,
  type ProductionRecord
} from "../production/merge.js";
import type { ProductionRepository, ProductionSyncInput } from "./productionRepository.js";

type RecordRow = {
  kind: ProductionKind;
  id: string;
  payload: Record<string, unknown>;
  updated_at: string;
  deleted_at: string | null;
};

function toRecord(row: RecordRow): ProductionRecord {
  return {
    kind: row.kind,
    id: row.id,
    payload: row.payload ?? {},
    updatedAt: new Date(row.updated_at).toISOString(),
    deletedAt: row.deleted_at ? new Date(row.deleted_at).toISOString() : null
  };
}

export function createSupabaseProductionRepository(url: string, serviceRoleKey: string): ProductionRepository {
  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  async function load(): Promise<{ records: ProductionRecord[]; nextOrderNum: number; nextEmployeeNum: number }> {
    const [recordsResult, metaResult] = await Promise.all([
      supabase.from("production_records").select("kind,id,payload,updated_at,deleted_at"),
      supabase.from("production_meta").select("next_order_num,next_employee_num").eq("id", 1).maybeSingle()
    ]);
    if (recordsResult.error || metaResult.error) {
      throw new HttpError(500, "DATABASE_ERROR", "Não foi possível ler a produção.");
    }
    return {
      records: ((recordsResult.data ?? []) as RecordRow[]).map(toRecord),
      nextOrderNum: metaResult.data?.next_order_num ?? 1,
      nextEmployeeNum: metaResult.data?.next_employee_num ?? 1
    };
  }

  async function save(records: ProductionRecord[], nextOrderNum: number, nextEmployeeNum: number) {
    if (records.length) {
      const { error } = await supabase.from("production_records").upsert(
        records.map((record) => ({
          kind: record.kind,
          id: record.id,
          payload: record.payload,
          updated_at: record.updatedAt,
          deleted_at: record.deletedAt
        })),
        { onConflict: "kind,id" }
      );
      if (error) throw new HttpError(500, "DATABASE_ERROR", "Não foi possível gravar a produção.");
    }
    const { error: metaError } = await supabase.from("production_meta").upsert({
      id: 1,
      next_order_num: nextOrderNum,
      next_employee_num: nextEmployeeNum,
      updated_at: new Date().toISOString()
    });
    if (metaError) throw new HttpError(500, "DATABASE_ERROR", "Não foi possível gravar os contadores.");
  }

  return {
    async snapshot() {
      const current = await load();
      return toSnapshot(current.records, current.nextOrderNum, current.nextEmployeeNum);
    },
    async sync(input: ProductionSyncInput) {
      const current = await load();
      const records = mergeRecords(current.records, input.records);
      const nextOrderNum = greatestCounter(current.nextOrderNum, input.nextOrderNum);
      const nextEmployeeNum = greatestCounter(current.nextEmployeeNum, input.nextEmployeeNum);
      const changed = input.records.filter((record) => {
        const winner = records.find((item) => item.kind === record.kind && item.id === record.id);
        return winner?.updatedAt === record.updatedAt;
      });
      const countersChanged =
        nextOrderNum !== current.nextOrderNum || nextEmployeeNum !== current.nextEmployeeNum;
      if (changed.length || countersChanged) await save(changed, nextOrderNum, nextEmployeeNum);
      return toSnapshot(records, nextOrderNum, nextEmployeeNum);
    }
  };
}
