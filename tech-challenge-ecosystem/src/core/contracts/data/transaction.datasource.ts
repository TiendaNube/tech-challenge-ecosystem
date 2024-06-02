import { Transaction } from '../../models/transaction';

export const TRANSACTION_DATASOURCE_PROVIDE = 'TransactionDatasource';
export interface TransactionDatasource {
  create(transaction: Transaction): Promise<Transaction>;
}
