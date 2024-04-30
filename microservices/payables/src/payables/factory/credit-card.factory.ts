import { CreatePayableDto } from '../dto/create-payable.dto';
import { PayableStatusEnum } from '../entities/payable.entity';
import { AbstractPayable } from './impl/payable.impl';
import { addDays } from 'date-fns';

export class CreditCard implements AbstractPayable {
  private readonly CREDIT_FEE = 4;
  private readonly CREDIT_FUTURE_DAYS = 30;

  public setDiscount(payable: CreatePayableDto): number {
    return (payable.totalValue * this.CREDIT_FEE) / 100;
  }

  public setSubTotal(payable: CreatePayableDto) {
    return payable.totalValue;
  }

  public setTotal(payable: CreatePayableDto) {
    return payable.totalValue - (payable.totalValue * this.CREDIT_FEE) / 100;
  }

  public setTransactionAt() {
    return addDays(new Date(), this.CREDIT_FUTURE_DAYS);
  }

  public setStatus(): PayableStatusEnum {
    return PayableStatusEnum.WAITING_FUNDS;
  }
}
