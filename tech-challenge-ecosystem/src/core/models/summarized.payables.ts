import { PayableStatus } from './payable';

export class SummarizedPayables {
  constructor(
    public status: PayableStatus,
    public amount: number = 0,
    public subtotal: number = 0,
    public discount: number = 0,
  ) {}
}
