import logger from '@infra/logger';
import {
  EventPublisher,
  DomainEvent,
  EventListener,
} from '../../domain/events/EventPublisher';

export class EventBus implements EventPublisher {
  private listeners: EventListener[] = [];

  publish(event: DomainEvent): void {
    logger.info('Publishing event', { event });
    this.listeners.forEach(listener => listener.handle(event));
  }

  register(listener: EventListener): void {
    this.listeners.push(listener);
  }
}
