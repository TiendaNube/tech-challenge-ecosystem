import { PayableTotalSummaryType } from "../../../entities/payable";

export interface RetrieveTotalPayablesByPeriodPort {
  retrieve(key: string): Promise<PayableTotalSummaryType | null>;
}
