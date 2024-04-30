import { AggregateRoot } from '@nestjs/cqrs';
import { TransactionCreatedPayableEvent } from '../events/impl/transaction-created-payable.event';
import { CreatePayableContract } from '../contract/create-payable.contract';

export class TransactionModel extends AggregateRoot {
  constructor(private readonly id: string) {
    super();
  }

  createPayable(payable: CreatePayableContract) {
    this.apply(new TransactionCreatedPayableEvent(this.id, payable));
  }
}
