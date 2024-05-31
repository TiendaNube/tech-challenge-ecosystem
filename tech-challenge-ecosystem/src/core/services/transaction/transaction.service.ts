import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transaction } from '../../models/transaction';
import {
  TRANSACTION_DATASOURCE_PROVIDE,
  TransactionDatasource,
} from '../../constracts/data/transaction.datasource';
import {
  TRANSACTION_MESSAGE_PRODUCER_PROVIDE,
  TransactionMessageProducer,
} from '../../constracts/messaging/transaction.message.producer';

export const TRANSACTION_SERVICE_PROVIDE = 'TRANSACTION_SERVICE_PROVIDE';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_DATASOURCE_PROVIDE)
    private transactionDatasource: TransactionDatasource,

    @Inject(TRANSACTION_MESSAGE_PRODUCER_PROVIDE)
    private transactionMessageProducer: TransactionMessageProducer,
  ) {}

  private logger: Logger = new Logger(TransactionService.name)

  public async createTransaction(
    transaction: Transaction,
  ): Promise<Transaction> {
    const createdTransaction =
      await this.transactionDatasource.create(transaction);

    this.logger.log(`Transaction created with id: ${createdTransaction.id}`)

    await this.transactionMessageProducer.sendMessage(createdTransaction);

    return createdTransaction;
  }
}
