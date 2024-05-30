import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../models/transaction';
import { TransactionDatasource } from '../../constracts/data/transaction.datasource';
import { TransactionMessageProducer } from '../../../messaging/producer/transaction/transaction.message.producer';

export const TRANSACTION_SERVICE_PROVIDE = 'TRANSACTION_SERVICE_PROVIDE';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TransactionDatasource)
    private transactionDatasource: TransactionDatasource,
    private transactionMessageProducer: TransactionMessageProducer
  ) {}
  
  public async createTransaction(transaction: Transaction): Promise<Transaction> {
    const createdTransaction = await this.transactionDatasource.create(transaction);

    await this.transactionMessageProducer.sendMessage(createdTransaction)

    return createdTransaction
  }
}
