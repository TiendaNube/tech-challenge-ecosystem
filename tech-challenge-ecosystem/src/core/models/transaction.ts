import { Card } from './card';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

export class Transaction {
  constructor(
    public merchantId: number,
    public description: string,
    public paymentMethod: PaymentMethod,
    public amount: number,
    public card: Card,
    public id: string = undefined,
    public createdAt: Date = undefined,
  ) {}
}
