import { PayableTotalSummaryType } from "../../../entities/payable";

export interface FetchTotalPayablesByPeriodPort {
  /**
   * Fetch the data in a persistent database
   * @param merchantId merchant id owner of the payables to be retrieved
   * @param startDate starting date based on the create_date of the payables
   * @param endDate ending date based on the create_date of the payables
   */
  fetch(
    merchantId: number,
    startDate: Date,
    endDate: Date
  ): Promise<PayableTotalSummaryType>;
}
