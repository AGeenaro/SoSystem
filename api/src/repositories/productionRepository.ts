import type { ProductionRecord, ProductionSnapshot } from "../production/merge.js";

export type ProductionSyncInput = {
  records: ProductionRecord[];
  nextOrderNum?: number;
  nextEmployeeNum?: number;
};

export interface ProductionRepository {
  snapshot(): Promise<ProductionSnapshot>;
  sync(input: ProductionSyncInput): Promise<ProductionSnapshot>;
}
