import { Transaction } from '../../models/Transaction';

export const TransactionDatasource = 'TransactionDatasource';
export interface TransactionDatasource {
  create(transaction: Transaction): Promise<Transaction>;
}
