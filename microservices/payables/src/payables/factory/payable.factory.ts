import { DeepPartial } from 'typeorm';
import { CreatePayableDto } from '../dto/create-payable.dto';
import {
  Payable,
  PayableStatusEnum,
  PaymentMethodEnum,
} from '../entities/payable.entity';
import { CreditCard } from './credit-card.factory';
import { DebitCard } from './debit-card.factory';
import { AbstractPayable } from './impl/payable.impl';

export class PayableModel {
  private factory: AbstractPayable;
  private payable: CreatePayableDto;

  constructor(payable: CreatePayableDto) {
    this.payable = payable;
    this.factory =
      payable.paymentMethod === PaymentMethodEnum.CREDIT_CARD
        ? new CreditCard()
        : new DebitCard();
  }

  createObject(): DeepPartial<Payable> {
    return {
      ...this.payable,
      total: this.getTotal(),
      discount: this.getDiscount(),
      subtotal: this.getSubTotal(),
      status: this.getStatus(),
      transactionAt: this.getTransactionAt(),
    };
  }

  getTotal(): number {
    return this.factory.setTotal(this.payable);
  }

  getDiscount(): number {
    return this.factory.setDiscount(this.payable);
  }

  getSubTotal(): number {
    return this.factory.setSubTotal(this.payable);
  }

  getStatus(): PayableStatusEnum {
    return this.factory.setStatus();
  }

  getTransactionAt(): Date {
    return this.factory.setTransactionAt();
  }
}
