import { Transaction } from '@domain/entities/transaction.entity';
import { CreateTransactionDto } from '@domain/usecases/createTransaction/dtos/create-transaction.dto';
import { ITransactionController } from './interfaces/transaction-controller';
import { CreateTransactionUseCase } from '@domain/usecases/createTransaction/create-transaction.usecase';

export class TransactionControllerImpl implements ITransactionController {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
    ) {}

    createTransaction(
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        return this.createTransactionUseCase.execute(createTransactionDto);
    }
}
