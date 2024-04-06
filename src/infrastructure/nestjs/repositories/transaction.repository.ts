import { Repository } from 'typeorm';
import { TransactionEntity } from '../database/entities/transaction.entity';
import { TransactionRepository } from '@domain/interfaces/transaction.repository';
import { Transaction } from '@domain/entities/transaction.entity';
import { plainToInstance } from 'class-transformer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TransactionRepositoryImpl
    extends Repository<TransactionEntity>
    implements TransactionRepository
{
    async saveTransaction(transaction: Transaction): Promise<Transaction> {
        const transactionEntitySerialized = plainToInstance(
            TransactionEntity,
            transaction,
        );
        const transactionSaved = this.save(transactionEntitySerialized);
        return plainToInstance(Transaction, transactionSaved);
    }
}
