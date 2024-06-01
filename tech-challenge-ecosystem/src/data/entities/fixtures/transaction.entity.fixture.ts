import { PaymentMethod } from '../../../core/models/transaction';
import { TransactionEntity } from '../transaction.entity';

export class TransactionEntityFixture {
  public static default() {
    const entity = new TransactionEntity();

    entity.merchantId = 123;
    entity.amount = 100;
    entity.description = 'description';
    entity.paymentMethod = PaymentMethod.CREDIT_CARD;
    entity.cardNumber = '9876';
    entity.cardHolder = 'John Smith';
    entity.cardExpirationDate = '12/2024';
    entity.cardCvv = '456';

    return entity;
  }
}
