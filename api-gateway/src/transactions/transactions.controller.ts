import { Controller, Post, Body, Param } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from 'src/merchants/commands/impl/create-transaction.command';

@ApiTags('Transactions')
@Controller({ path: 'merchants/:id/transactions', version: '1' })
export class TransactionsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  create(
    @Param('id') merchantId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.commandBus.execute(
      new CreateTransactionCommand(merchantId, createTransactionDto),
    );
  }
}
