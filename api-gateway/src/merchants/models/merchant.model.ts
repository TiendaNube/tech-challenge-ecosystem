import { AggregateRoot } from '@nestjs/cqrs';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { MerchantCreatedTransactionEvent } from '../events/impl/merchant-created-transaction.event';

export class Merchant extends AggregateRoot {
  constructor(private readonly id: string) {
    super();
  }

  createTransaction(transaction: CreateTransactionDto) {
    this.apply(new MerchantCreatedTransactionEvent(this.id, transaction));
  }
}
