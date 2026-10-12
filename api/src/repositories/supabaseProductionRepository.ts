import { createClient } from "@supabase/supabase-js";
import { HttpError } from "../http.js";
import type { ProductionKind, ProductionRecord } from "../production/merge.js";
import type { ProductionBucket, ProductionRepository } from "./productionRepository.js";

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

  return {
    async load(companyId) {
      const [recordsResult, metaResult] = await Promise.all([
        supabase.from("production_records").select("kind,id,payload,updated_at,deleted_at").eq("company_id", companyId),
        supabase.from("production_counters").select("next_order_num,next_employee_num").eq("company_id", companyId).maybeSingle()
      ]);
      if (recordsResult.error || metaResult.error) {
        throw new HttpError(500, "DATABASE_ERROR", "Não foi possível ler a produção.");
      }
      return {
        records: ((recordsResult.data ?? []) as RecordRow[]).map(toRecord),
        nextOrderNum: metaResult.data?.next_order_num ?? 1,
        nextEmployeeNum: metaResult.data?.next_employee_num ?? 1
      };
    },
    async save(companyId, bucket: ProductionBucket) {
      if (bucket.records.length) {
        const { error } = await supabase.from("production_records").upsert(
          bucket.records.map((record) => ({
            company_id: companyId,
            kind: record.kind,
            id: record.id,
            payload: record.payload,
            updated_at: record.updatedAt,
            deleted_at: record.deletedAt
          })),
          { onConflict: "company_id,kind,id" }
        );
        if (error) throw new HttpError(500, "DATABASE_ERROR", "Não foi possível gravar a produção.");
      }
      const { error: metaError } = await supabase.from("production_counters").upsert({
        company_id: companyId,
        next_order_num: bucket.nextOrderNum,
        next_employee_num: bucket.nextEmployeeNum,
        updated_at: new Date().toISOString()
      });
      if (metaError) throw new HttpError(500, "DATABASE_ERROR", "Não foi possível gravar os contadores.");
    }
  };
}
