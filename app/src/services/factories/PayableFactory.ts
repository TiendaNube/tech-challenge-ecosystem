import { injectable } from 'tsyringe';
import Payable from '@domain/Payable';
import { CreatePayableDTO } from '@services/IPayableService';
import { PaymentMethod } from '@domain/Transaction';
import AppError from '@errors/AppError';
import { INTERNAL_SERVER_ERROR } from 'http-status';

export enum PayableStatus {
  PAID = 'paid',
  WAITING_FUNDS = 'waiting_funds',
}

enum Discount {
  CREDIT_CARD = 4,
  DEBIT_CARD = 2,
}

const ADD_DAYS_QUANTITY = 30;

@injectable()
export class PayableFactory {
  createPayableFromDTO(createPayableDTO: CreatePayableDTO): Payable {
    const payable: Partial<Payable> = {
      merchant_id: createPayableDTO.merchant_id,
      create_date: new Date(),
      subtotal: createPayableDTO.total,
    };

    switch (createPayableDTO.payment_method) {
      case PaymentMethod.DEBIT_CARD:
        payable.status = PayableStatus.PAID;
        payable.discount = Discount.DEBIT_CARD;
        break;
      case PaymentMethod.CREDIT_CARD:
        payable.status = PayableStatus.WAITING_FUNDS;
        payable.discount = Discount.CREDIT_CARD;
        payable.create_date?.setDate(
          payable.create_date.getDate() + ADD_DAYS_QUANTITY,
        );
        break;
      default:
        throw new AppError('Invalid payment method', INTERNAL_SERVER_ERROR);
    }

    payable.discount = createPayableDTO.total * (payable.discount / 100);
    payable.total = createPayableDTO.total - payable.discount;

    return payable as Payable;
  }
}
