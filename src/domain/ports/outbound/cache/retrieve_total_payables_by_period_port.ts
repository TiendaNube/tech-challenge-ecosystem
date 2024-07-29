import { PayableTotalSummaryType } from "../../../entities/payable";

export interface RetrieveTotalPayablesByPeriodPort {
  /**
   * Retrieve cached data in a in-memory database regarding amounts os payables for a merchant
   * @param key value used to retrieve cached data
   */
  retrieve(key: string): Promise<PayableTotalSummaryType | null>;
}
