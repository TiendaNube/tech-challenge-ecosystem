import { PayableTotalSummaryType } from "../../../entities/payable";

export interface SaveTotalPayablesByPeriodPort {
  save(key: string, data: PayableTotalSummaryType): Promise<void>;
}
