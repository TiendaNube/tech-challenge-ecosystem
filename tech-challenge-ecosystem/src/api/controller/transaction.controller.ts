import { Body, Controller, Put } from '@nestjs/common';
import { TransactionService } from '../../core/services/transaction/TransactionService';
import { TransactionInput } from '../models/TransactionInput';
import { Transaction } from '../../core/models/Transaction';

@Controller('/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Put()
  createTransaction(@Body() transactionInput: TransactionInput): Transaction {
    return this.transactionService.createTransaction(
      transactionInput.toTransaction(),
    );
  }
}
