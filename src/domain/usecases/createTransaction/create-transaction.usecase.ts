import { Transaction } from '@domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../../application/controllers/dtos/create-transaction.dto';
import { ITransactionRepository } from '@domain/interfaces/transaction.repository';
import { plainToInstance } from 'class-transformer';

export class CreateTransactionUseCase {
    constructor(
        private readonly transactionRepository: ITransactionRepository,
    ) {}

    async execute(
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        const transaction = plainToInstance(Transaction, createTransactionDto);
        return this.transactionRepository.saveTransaction(transaction);
    }
}
