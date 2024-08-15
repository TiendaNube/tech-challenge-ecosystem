import Transaction from '@domain/Transaction';
import { DomainEvent } from './EventPublisher';

export class CreatePayableEvent implements DomainEvent {
  constructor(public readonly transaction: Transaction) {}
}
