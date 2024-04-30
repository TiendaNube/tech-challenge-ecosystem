import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionModel } from 'src/transactions/models/transaction.model';
import { CreateTransactionCommand } from '../impl/create-transaction.command';
import { transactionToPayableSerialize } from 'src/utils/serializes/transaction-to-payable';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly publisher: EventPublisher,
  ) {}

  private readonly logger = new Logger(CreateTransactionHandler.name);

  async execute({ transaction: command }: CreateTransactionCommand) {
    this.logger.debug('[Request] CreateTransactionHandler.execute', command);

    const createdTranscation = await this.transactionsService.create(command);

    const transaction = this.publisher.mergeObjectContext(
      new TransactionModel(createdTranscation.id),
    );
    transaction.createPayable(transactionToPayableSerialize(command));
    transaction.commit();
  }
}
