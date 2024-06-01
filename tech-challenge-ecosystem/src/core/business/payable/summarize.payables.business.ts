import { Injectable } from '@nestjs/common';
import { Payable, PayableStatus } from '../../../core/models/payable';
import { SummarizedPayables } from '../../../core/models/summarized.payables';

export const SUMMARIZE_PAYABLE_BUSINESS_PROVIDE =
  'SUMMARIZE_PAYABLE_BUSINESS_PROVIDE';

@Injectable()
export class SummarizePayableBusiness {
  public summarize(payables: Payable[]) {
    const summaryByStatus = new Map<PayableStatus, SummarizedPayables>();

    payables.forEach((payable) => {
      if (!summaryByStatus.get(payable.status)) {
        summaryByStatus.set(
          payable.status,
          new SummarizedPayables(payable.status),
        );
      }

      const summary = summaryByStatus.get(payable.status);
      summary.amount += payable.amount;
      summary.discount += payable.discount;
      summary.subtotal += payable.subtotal;
    });

    return Array.from(summaryByStatus.keys()).map((status) =>
      summaryByStatus.get(status),
    );
  }
}
