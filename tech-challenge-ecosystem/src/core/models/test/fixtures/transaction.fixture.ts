import { PaymentMethod, Transaction } from '../../transaction';
import { CardFixture } from './card.fixture';

export class TransactionFixture {
  public static default() {
    return new Transaction(
      1,
      'transaction',
      PaymentMethod.CREDIT_CARD,
      98,
      CardFixture.default(),
      'id',
      new Date(),
    );
  }
}
