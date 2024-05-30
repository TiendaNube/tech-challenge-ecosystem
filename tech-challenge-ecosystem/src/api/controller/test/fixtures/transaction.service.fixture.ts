import { Transaction } from '../../../../core/models/transaction';

export class TransactionServiceFixture {
  createTransaction(transaction: Transaction): Promise<Transaction> {
    return Promise.resolve(transaction);
  }
}
