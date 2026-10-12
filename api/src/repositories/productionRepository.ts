import type { ProductionRecord } from "../production/merge.js";

export type ProductionSyncInput = {
  records: ProductionRecord[];
  nextOrderNum?: number;
  nextEmployeeNum?: number;
};

export type ProductionBucket = {
  records: ProductionRecord[];
  nextOrderNum: number;
  nextEmployeeNum: number;
};

export interface ProductionRepository {
  load(companyId: string): Promise<ProductionBucket>;
  save(companyId: string, bucket: ProductionBucket): Promise<void>;
}
