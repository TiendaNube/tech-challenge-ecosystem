import { Transaction } from '@domain/entities/transaction.entity';
import { CreateTransactionDto } from '@domain/usecases/createTransaction/dtos/create-transaction.dto';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ITransactionController } from 'src/application/controllers/interfaces/transaction-controller';
import { TRANSACTION_CONTROLLER } from '../helpers/constants';

@Controller('transactions')
export class TransactionController {
    constructor(
        @Inject(TRANSACTION_CONTROLLER)
        private readonly transactionController: ITransactionController,
    ) {}

    @Post()
    createTransaction(
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        return this.transactionController.createTransaction(
            createTransactionDto,
        );
    }
}
