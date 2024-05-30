import { Transaction } from '../../../../core/models/Transaction';

export class TransactionServiceFixture {
  createTransaction(transaction: Transaction): Promise<Transaction> {
    return Promise.resolve(transaction);
  }
}
