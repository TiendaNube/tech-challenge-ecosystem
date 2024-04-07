import { Transaction } from '@domain/entities/transaction.entity';
import { CreateTransactionDto } from '@application/controllers/dtos/create-transaction.dto';

export interface ITransactionController {
    createTransaction(
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction>;
}
