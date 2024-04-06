import { DataSource } from 'typeorm';
import { TransactionEntity } from '../database/entities/transaction.entity';
import { TransactionRepository } from '@domain/interfaces/transaction.repository';
import { Transaction } from '@domain/entities/transaction.entity';
import { plainToInstance } from 'class-transformer';
import { PayableEntity } from '../database/entities/payable.entity';

export class TransactionRepositoryImpl implements TransactionRepository {
    constructor(private dataSource: DataSource) {}

    async saveTransaction(transaction: Transaction): Promise<Transaction> {
        return this.dataSource.transaction(async (manager) => {
            const transactionEntitySerialized = plainToInstance(
                TransactionEntity,
                transaction,
                { excludeExtraneousValues: true },
            );

            const transactionSaved = await manager.save(
                transactionEntitySerialized,
            );

            const payableEntitySerialized = plainToInstance(
                PayableEntity,
                transaction.generatePayable(),
                { excludeExtraneousValues: true },
            );
            await manager.save(payableEntitySerialized);

            return plainToInstance(Transaction, transactionSaved);
        });
    }
}
