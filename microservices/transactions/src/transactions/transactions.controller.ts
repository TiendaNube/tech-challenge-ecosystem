import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './commands/impl/create-transaction.command';

@Controller()
export class TransactionsController {
  constructor(private readonly commandBus: CommandBus) {}

  private readonly logger = new Logger(TransactionsController.name);

  @MessagePattern('createTransactions')
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    this.logger.debug(
      '[Request] TransactionsController.create',
      createTransactionDto,
    );
    return this.commandBus.execute(
      new CreateTransactionCommand(createTransactionDto),
    );
  }
}
