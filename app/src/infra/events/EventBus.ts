import logger from '@infra/logger';
import {
  EventPublisher,
  DomainEvent,
  EventListener,
} from '../../domain/events/EventPublisher';

export class EventBus implements EventPublisher {
  private listeners: EventListener[] = [];

  async publish(event: DomainEvent): Promise<void> {
    logger.info('Publishing event');

    await Promise.all(this.listeners.map(listener => listener.handle(event)));
  }

  register(listener: EventListener): void {
    this.listeners.push(listener);
  }
}
