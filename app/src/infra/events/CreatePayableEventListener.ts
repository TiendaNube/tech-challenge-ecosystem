import { EventListener, DomainEvent } from '../../domain/events/EventPublisher';
import { CreatePayableEvent } from '../../domain/events/CreatePayableEvent';
import { inject, injectable } from 'tsyringe';
import IPayableService, { CreatePayableDTO } from '@services/IPayableService';
import logger from '@infra/logger';

@injectable()
export class CreatePayableEventListener implements EventListener {
  constructor(
    @inject('PayableService')
    private payableService: IPayableService,
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof CreatePayableEvent) {
      logger.info('CreatePayableEvent being handled', event);

      try {
        await this.payableService.create({
          merchant_id: event.transaction.merchant_id,
          total: event.transaction.total,
          payment_method: event.transaction.payment_method,
        } as CreatePayableDTO);
      } catch (e) {
        logger.error('Failed to create payable', e);
      }
    }
  }
}
