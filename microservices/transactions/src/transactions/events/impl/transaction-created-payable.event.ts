import { CreatePayableContract } from 'src/transactions/contract/create-payable.contract';

export class TransactionCreatedPayableEvent {
  constructor(
    public readonly transactionId: string,
    public readonly payable: CreatePayableContract,
  ) {}
}
