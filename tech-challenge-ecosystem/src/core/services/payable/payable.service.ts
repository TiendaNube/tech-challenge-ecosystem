import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transaction } from '../../models/transaction';
import {
  PayableDatasource,
  PAYABLE_DATASOURCE_PROVIDE,
} from '../../../core/constracts/data/payable.datasource';
import { PayableFromTransactionBusiness } from '../../../core/business/payable/payable.from.transaction.business';
import { Payable } from '../../../core/models/payable';
import { SummarizePayableBusiness } from 'src/core/business/payable/summarize.payables.business';

export const PAYABLE_SERVICE_PROVIDE = 'PAYABLE_SERVICE_PROVIDE';

@Injectable()
export class PayableService {
  constructor(
    @Inject(PAYABLE_DATASOURCE_PROVIDE)
    private payableDatasource: PayableDatasource,
    private payableFromTransactionBusiness: PayableFromTransactionBusiness,
    private summarizePayableBusiness: SummarizePayableBusiness,
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

    this.logger.log(`Found ${payables.length} payables for summary `);

    return this.summarizePayableBusiness.summarize(payables);
  }
}
