import { Transaction } from './transaction';

export enum PayableStatus {
  PAID = 'PAID',
  WAITING_FUNDS = 'WAITING_FUNDS',
}

export class Payable {
  constructor(
    public merchantId: number,
    public status: PayableStatus,
    public date: Date,
    public discount: number,
    public amount: number,
    public subtotal: number,
    public transaction: Transaction = undefined,
    public id: string = undefined,
  ) {}
}
