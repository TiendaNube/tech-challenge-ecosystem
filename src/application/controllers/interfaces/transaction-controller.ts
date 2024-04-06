import { Transaction } from '@domain/entities/transaction.entity';
import { CreateTransactionDto } from '@domain/usecases/createTransaction/dtos/create-transaction.dto';

export interface ITransactionController {
    createTransaction(
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction>;
}
