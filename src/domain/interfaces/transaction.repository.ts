import { Transaction } from '@domain/entities/transaction.entity';

export interface TransactionRepository {
    saveTransaction(transaction: Transaction): Promise<Transaction>;
}
