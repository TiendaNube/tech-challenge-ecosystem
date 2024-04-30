import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';

export class CreateTransactionCommand {
  constructor(
    public readonly merchantId: string,
    public readonly transaction: CreateTransactionDto,
  ) {}
}
