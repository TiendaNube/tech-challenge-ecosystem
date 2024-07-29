import { PayableTotalSummaryType } from "../../../entities/payable";

export interface SaveTotalPayablesByPeriodPort {
  /**
   * Save query result for amounts of payables in a in-memory database for caching
   * @param key value used as key to store the data
   * @param data data to be stored
   */
  save(key: string, data: PayableTotalSummaryType): Promise<void>;
}
