import { Transaction } from '@domain/entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionRepository } from '@domain/interfaces/transaction.repository';
import { plainToInstance } from 'class-transformer';

export class CreateTransactionUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepository,
    ) {}

    async execute(
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        const transaction = plainToInstance(Transaction, createTransactionDto);
        return this.transactionRepository.saveTransaction(transaction);
    }
}
