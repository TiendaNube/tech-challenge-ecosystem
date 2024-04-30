import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { TransactionCreatedPayableEvent } from '../impl/transaction-created-payable.event';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from 'src/transactions/services.constants';

@EventsHandler(TransactionCreatedPayableEvent)
export class TransactionCreatedPayableHandler
  implements IEventHandler<TransactionCreatedPayableEvent>
{
  constructor(
    @Inject('PAYABLES_CLIENT') private readonly client: ClientProxy,
  ) {}

  private readonly logger = new Logger(TransactionCreatedPayableHandler.name);

  handle(event: TransactionCreatedPayableEvent) {
    this.logger.debug('[Request] CreatePayableEvent.handle', event);

    this.client.emit(MESSAGE_PATTERNS.payables.create, {
      transactionId: event.transactionId,
      ...event.payable,
    });
  }
}
