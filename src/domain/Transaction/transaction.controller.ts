import {Body, Controller, Get, Post} from '@nestjs/common'
import { TransactionService } from './transaction.service'
import {Transaction} from "typeorm";
import {TransactionDTO} from "./transaction.dto";

@Controller()
export class TransactionController {
  constructor(private readonly appService: TransactionService) {}

  @Post()
  public async createTransaction( @Body() transactionDTO: TransactionDTO): Promise<TransactionDTO> {
    return transactionDTO
  }
}
