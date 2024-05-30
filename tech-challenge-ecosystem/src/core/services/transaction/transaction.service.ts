import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../models/transaction';
import { TransactionDatasource } from '../../constracts/data/transaction.datasource';

export const TRANSACTION_SERVICE_PROVIDE = 'TRANSACTION_SERVICE_PROVIDE';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TransactionDatasource)
    private transactionDatasource: TransactionDatasource,
  ) {}
  createTransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionDatasource.create(transaction);
  }
}
