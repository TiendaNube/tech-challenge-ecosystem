import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionService } from './transaction.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PayableSummaryDTO } from './dtos/payable-summary.dto';
import { configService } from '../config/config.service';

@Controller('transaction')
export class TransactionController {
  @Inject()
  private readonly transactionService: TransactionService;

  @Post()
  @ApiOkResponse({
    status: 202,
    description: 'Transaction sent',
    type: String,
  })
  @ApiResponse({ status: 500, description: 'Failed to create transaction' })
  @HttpCode(202)
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const queueConfig = configService.getQueueConfig();

    try {
      await this.transactionService.publishTransaction(
        createTransactionDto,
        queueConfig.exchange,
      );
      return { status: 'transaction sent successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to send transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:merchantId')
  @ApiOperation({
    summary: 'Get a merchant`s payable statistics in a date interval',
  })
  @ApiOkResponse({ type: PayableSummaryDTO })
  @ApiParam({ name: 'merchantId', type: String, example: 'merchant123' })
  @ApiQuery({ name: 'startDate', type: Date, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', type: Date, example: '2024-03-31' })
  async getPayableSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Param('merchantId') merchantId: string,
  ): Promise<PayableSummaryDTO> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestException('Start date must be lower than end date');
    }

    return this.transactionService.getPayableSummary(start, end, merchantId);
  }
}
