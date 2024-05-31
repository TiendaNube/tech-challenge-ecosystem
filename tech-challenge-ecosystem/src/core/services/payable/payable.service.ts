import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../models/transaction';
import {
  PayableDatasource,
  PAYABLE_DATASOURCE_PROVIDE,
} from '../../../core/constracts/data/payable.datasource';
import { PayableFromTransactionBusiness } from '../../../core/business/payable/payable.from.transaction.business';
import { Payable, PayableStatus } from '../../../core/models/payable';
import { SummarizedPayables } from 'src/core/models/summarized.payables';

export const PAYABLE_SERVICE_PROVIDE = 'PAYABLE_SERVICE_PROVIDE';

@Injectable()
export class PayableService {
  constructor(
    @Inject(PAYABLE_DATASOURCE_PROVIDE)
    private payableDatasource: PayableDatasource,
    private payableFromTransactionBusiness: PayableFromTransactionBusiness,
  ) {}

  public async createPayableFromTransaction(
    transaction: Transaction,
  ): Promise<Payable> {
    const payable =
      this.payableFromTransactionBusiness.createPayable(transaction);
    return this.payableDatasource.create(payable);
  }

  public async summarizeByMerchant(
    merchantId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const payables = await this.payableDatasource.listByMerchantId(
      merchantId,
      startDate,
      endDate,
    );

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

    console.log(summaryByStatus);

    return Array.from(summaryByStatus.keys()).map((status) =>
      summaryByStatus.get(status),
    );
  }
}
