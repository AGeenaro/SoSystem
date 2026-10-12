import { greatestCounter, mergeRecords, toSnapshot, type ProductionRecord } from "../production/merge.js";
import type { ProductionRepository, ProductionSyncInput } from "./productionRepository.js";

export function createMemoryProductionRepository(): ProductionRepository {
  let records: ProductionRecord[] = [];
  let nextOrderNum = 1;
  let nextEmployeeNum = 1;

  return {
    async snapshot() {
      return toSnapshot(records, nextOrderNum, nextEmployeeNum);
    },
    async sync(input: ProductionSyncInput) {
      records = mergeRecords(records, input.records);
      nextOrderNum = greatestCounter(nextOrderNum, input.nextOrderNum);
      nextEmployeeNum = greatestCounter(nextEmployeeNum, input.nextEmployeeNum);
      return toSnapshot(records, nextOrderNum, nextEmployeeNum);
    }
  };
}
