import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';

export class MerchantCreatedTransactionEvent {
  constructor(
    public readonly merchantId: string,
    public readonly transaction: CreateTransactionDto,
  ) {}
}
