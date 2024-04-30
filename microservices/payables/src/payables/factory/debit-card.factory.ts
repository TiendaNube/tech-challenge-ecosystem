import { CreatePayableDto } from '../dto/create-payable.dto';
import { PayableStatusEnum } from '../entities/payable.entity';
import { AbstractPayable } from './impl/payable.impl';

export class DebitCard implements AbstractPayable {
  private readonly DEBIT_FEE = 2;

  public setDiscount(payable: CreatePayableDto): number {
    return (payable.totalValue * this.DEBIT_FEE) / 100;
  }

  public setSubTotal(payable: CreatePayableDto) {
    return payable.totalValue;
  }

  public setTotal(payable: CreatePayableDto) {
    return payable.totalValue - (payable.totalValue * this.DEBIT_FEE) / 100;
  }

  public setTransactionAt() {
    return new Date();
  }

  public setStatus(): PayableStatusEnum {
    return PayableStatusEnum.PAID;
  }
}
