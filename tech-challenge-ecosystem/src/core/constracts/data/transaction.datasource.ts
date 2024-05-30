import { Transaction } from '../../models/transaction';

export const TransactionDatasource = 'TransactionDatasource';
export interface TransactionDatasource {
  create(transaction: Transaction): Promise<Transaction>;
}
