import { Transaction } from '@domain/entities/transaction.entity';

export interface ITransactionRepository {
    saveTransaction(transaction: Transaction): Promise<Transaction>;
}
