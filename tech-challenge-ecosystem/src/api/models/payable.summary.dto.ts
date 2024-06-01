import { PayableStatus } from '../../core/models/payable';
import { SummarizedPayables } from '../../core/models/summarized.payables';

export class PayableSummaryDTO {
  public paidAmount: number = 0;
  public paidFee: number = 0;
  public futureAmount: number = 0;

  public static fromSummarizedPayables(
    summaries: SummarizedPayables[],
  ): PayableSummaryDTO {
    return summaries.reduce((summaryDTO, summary) => {
      if (summary.status === PayableStatus.PAID) {
        summaryDTO.paidAmount = summary.amount;
        summaryDTO.paidFee = summary.discount;
      }
      if (summary.status === PayableStatus.WAITING_FUNDS) {
        summaryDTO.futureAmount = summary.amount;
      }
      return summaryDTO;
    }, new PayableSummaryDTO());
  }
}
