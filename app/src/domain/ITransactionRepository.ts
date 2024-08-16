import { Prisma } from '@prisma/client';
import Transaction from './Transaction';

export default interface ITransactionRepository {
  create(
    transaction: Transaction,
    tx: Prisma.TransactionClient | null,
  ): Promise<Transaction>;
}
