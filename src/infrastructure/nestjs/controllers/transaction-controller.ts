import { Transaction } from '@domain/entities/transaction.entity';
import { CreateTransactionDto } from '@application/controllers/dtos/create-transaction.dto';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ITransactionController } from 'src/application/controllers/interfaces/transaction-controller';
import { TRANSACTION_CONTROLLER } from '../helpers/constants';
import { CreateValidatedTransactionDto } from './dtos/create-validated-transaction.dto';
import { plainToInstance } from 'class-transformer';

@Controller('transactions')
export class TransactionController {
    constructor(
        @Inject(TRANSACTION_CONTROLLER)
        private readonly transactionController: ITransactionController,
    ) {}

    @Post()
    createTransaction(
        @Body() createValidatedTransactionDto: CreateValidatedTransactionDto,
    ): Promise<Transaction> {
        return this.transactionController.createTransaction(
            createValidatedTransactionDto,
        );
    }
}
