import { Body, Controller, Inject, Logger, Put } from '@nestjs/common';
import {
  TRANSACTION_SERVICE_PROVIDE,
  TransactionService,
} from '../../core/services/transaction/transaction.service';
import { TransactionInput } from '../models/transaction.input';
import { Transaction } from '../../core/models/transaction';

@Controller('/transaction')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE_PROVIDE)
    private readonly transactionService: TransactionService,
  ) {}

  private readonly logger = new Logger(TransactionController.name)

  @Put()
  createTransaction(
    @Body() transactionInput: TransactionInput,
  ): Promise<Transaction> {
    this.logger.log("Starting creating transaction")
    return this.transactionService.createTransaction(
      transactionInput.toTransaction(),
    );
  }
}
