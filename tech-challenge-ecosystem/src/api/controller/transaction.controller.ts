import { Body, Controller, Inject, Put } from '@nestjs/common';
import {
  TRANSACTION_SERVICE_PROVIDE,
  TransactionService,
} from '../../core/services/transaction/TransactionService';
import { TransactionInput } from '../models/TransactionInput';
import { Transaction } from '../../core/models/Transaction';

@Controller('/transaction')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE_PROVIDE)
    private readonly transactionService: TransactionService,
  ) {}

  @Put()
  createTransaction(
    @Body() transactionInput: TransactionInput,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(
      transactionInput.toTransaction(),
    );
  }
}
