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

// Discount in percentage
enum Discount {
  CREDIT_CARD = 4,
  DEBIT_CARD = 2,
}

const ADD_DAYS_QUANTITY = 30;

@injectable()
export class PayableFactory {
  /**
   * Create a payable object following the business rules:
   * Debit card transaction:
   * The payable must be created with status = paid, indicating that the merchant will receive the amount
   * The payable must be created with the date equal to the creation date (D + 0).
   * Credit card transaction:
   * The payable must be created with status = waiting_funds, indicating that the merchant will receive this amount
   * in the future
   * The payable must be created with the date equal to the transaction creation date + 30 days (D + 30)
   * When creating payables, we must discount a processing fee (called a fee). Consider 2% for debit_card
   * transactions and 4% for credit_card transactions. Example: When a payable is created in the amount of
   * R$ 100.00 from a credit_card transaction, it will receive R$ 96.00.
   *
   * @param createPayableDTO
   * @returns Payable
   */
  createPayableFromDTO(createPayableDTO: CreatePayableDTO): Payable {
    const payable: Partial<Payable> = {
      merchant_id: createPayableDTO.merchant_id,
      create_date: createPayableDTO.transaction_date,
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
