import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../impl/create-transaction.command';
import { MerchantsService } from 'src/merchants/merchants.service';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private readonly merchantsService: MerchantsService,
    private readonly publisher: EventPublisher,
  ) {}

  private readonly logger = new Logger(CreateTransactionHandler.name);

  async execute(command: CreateTransactionCommand) {
    this.logger.debug('CreateTransactionHandler', JSON.stringify(command));
    const { merchantId, transaction } = command;
    const merchant = this.publisher.mergeObjectContext(
      await this.merchantsService.findOne(merchantId),
    );
    this.logger.debug(
      'CreateTransactionHandler.merchant',
      JSON.stringify(merchant),
    );
    merchant.createTransaction(transaction);
    merchant.commit();
  }
}
