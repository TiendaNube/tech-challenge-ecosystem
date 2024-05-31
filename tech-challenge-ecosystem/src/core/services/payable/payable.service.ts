import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../models/transaction';
import { PayableDatasource, PAYABLE_DATASOURCE_PROVIDE } from '../../../core/constracts/data/payable.datasource';
import { PayableFromTransactionBusiness } from '../../../core/business/payable/payable.from.transaction.business';
import { Payable } from '../../../core/models/payable';

export const PAYABLE_SERVICE_PROVIDE = 'PAYABLE_SERVICE_PROVIDE';

@Injectable()
export class PayableService {
  constructor(
    @Inject(PAYABLE_DATASOURCE_PROVIDE)
    private payableDatasource: PayableDatasource,
    private payableFromTransactionBusiness: PayableFromTransactionBusiness
  ) {}
  
  public async createPayableFromTransaction(transaction: Transaction): Promise<Payable> {
    const payable = this.payableFromTransactionBusiness.createPayable(transaction)
    return this.payableDatasource.create(payable)
  }
}
