import { Controller, Put } from '@nestjs/common';
import { TransactionService } from '../../core/services/transaction/TransactionService'

@Controller("/transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Put()
  createTransaction(): string {
    return this.transactionService.createTransaction();
  }
}
