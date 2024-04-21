import { PayableTotalSummaryType } from "../../../entities/payable";

export interface FetchTotalPayablesByPeriodUsecase {
  /**
   * Retrieve total paied, to be paid and discounts for a specific merchant in a time range
   * @param merchantId merchant id
   * @param startDate starting date based on the create_date of the payables
   * @param endDate ending date based on the create_date of the payables
   * @param cacheKey value used as key to put and retrieve the query result to avoid unnecessary trips to database
   */
  fetch(
    merchantId: number,
    startDate: Date,
    endDate: Date,
    cacheKey: string
  ): Promise<PayableTotalSummaryType>;
}
