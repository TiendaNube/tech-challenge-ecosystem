import { PayableTotalSummaryType } from "../../../entities/payable";

export interface FetchTotalPayablesByPeriodPort {
  fetch(
    merchantId: number,
    startDate: Date,
    endDate: Date
  ): Promise<PayableTotalSummaryType>;
}
