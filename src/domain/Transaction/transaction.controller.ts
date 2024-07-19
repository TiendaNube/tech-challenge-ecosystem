import { Body, Controller, Get, Post } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionDTO } from './transaction.dto'
import { Transaction } from './transaction'

@Controller('/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  public async createTransaction(@Body() transactionDTO: TransactionDTO): Promise<Transaction> {
    return this.transactionService.createTransaction(transactionDTO)
  }
}
