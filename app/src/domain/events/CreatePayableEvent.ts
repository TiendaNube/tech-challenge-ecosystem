import Transaction from '@domain/Transaction';
import { DomainEvent } from './EventPublisher';
import { Prisma } from '@prisma/client';

export class CreatePayableEvent implements DomainEvent {
  constructor(
    public readonly transaction: Transaction,
    public readonly tx: Prisma.TransactionClient,
  ) {}
}
