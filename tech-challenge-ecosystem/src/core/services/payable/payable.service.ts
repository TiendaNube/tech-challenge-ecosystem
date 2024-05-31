import { Inject, Injectable, Logger } from '@nestjs/common';
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

  private logger = new Logger(PayableService.name);

  public async createPayableFromTransaction(
    transaction: Transaction,
  ): Promise<Payable> {
    this.logger.log(`Creating payable from transaction (id=${transaction.id})`);

    const payable =
      this.payableFromTransactionBusiness.createPayable(transaction);

    const createdPayable = await this.payableDatasource.create(payable);

    this.logger.log(
      `Created payable (id=${createdPayable.id}) from transaction (id=${transaction.id})`,
    );

    return createdPayable;
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

    // this.logger.log('Found payables for summary');

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
