import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { ApiResponse } from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';

@Controller('transaction')
export class TransactionController {
  @Inject()
  private readonly transactionService: TransactionService;

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: Transaction,
  })
  @ApiResponse({ status: 500, description: 'Failed to create transaction' })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return this.transactionService.createTransaction(createTransactionDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
