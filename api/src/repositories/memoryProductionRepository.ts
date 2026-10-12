import { greatestCounter, mergeRecords, toSnapshot, type ProductionRecord } from "../production/merge.js";
import type { ProductionBucket, ProductionRepository, ProductionSyncInput } from "./productionRepository.js";

export function createMemoryProductionRepository(): ProductionRepository {
  const buckets = new Map<string, ProductionBucket>();

  function bucket(companyId: string): ProductionBucket {
    const current = buckets.get(companyId);
    if (current) return current;
    const created = { records: [], nextOrderNum: 1, nextEmployeeNum: 1 };
    buckets.set(companyId, created);
    return created;
  }

  return {
    async load(companyId) {
      const current = bucket(companyId);
      return {
        records: current.records.map((record) => ({ ...record })),
        nextOrderNum: current.nextOrderNum,
        nextEmployeeNum: current.nextEmployeeNum
      };
    },
    async save(companyId, next: ProductionBucket) {
      buckets.set(companyId, {
        records: next.records.map((record) => ({ ...record })),
        nextOrderNum: next.nextOrderNum,
        nextEmployeeNum: next.nextEmployeeNum
      });
    }
  };
}

export function applyProductionSync(current: ProductionBucket, input: ProductionSyncInput): ProductionBucket {
  return {
    records: mergeRecords(current.records, input.records),
    nextOrderNum: greatestCounter(current.nextOrderNum, input.nextOrderNum),
    nextEmployeeNum: greatestCounter(current.nextEmployeeNum, input.nextEmployeeNum)
  };
}

export function snapshotOf(bucket: ProductionBucket) {
  return toSnapshot(bucket.records, bucket.nextOrderNum, bucket.nextEmployeeNum);
}

export type { ProductionRecord };
