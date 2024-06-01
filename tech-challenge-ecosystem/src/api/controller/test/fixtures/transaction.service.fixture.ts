import { Transaction } from '../../../../core/models/transaction';

export class TransactionServiceFixture {
  createTransaction = jest.fn((transaction: Transaction) =>
    Promise.resolve(transaction),
  );
}

export const transactionServiceFixture = new TransactionServiceFixture();
