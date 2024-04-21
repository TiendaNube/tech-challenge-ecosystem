import { PayableTotalSummaryType } from "../../../entities/payable";

export interface FetchTotalPayablesByPeriodUsecase {
  fetch(
    merchantId: number,
    startDate: Date,
    endDate: Date,
    cacheKey: string
  ): Promise<PayableTotalSummaryType>;
}
