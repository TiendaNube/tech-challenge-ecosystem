import { TransactionInput } from '../../../models/TransactionInput';
import { CardInputFixture } from './CardInputFixture';

export class TransactionInputFixture {
  public static default() {
    const transactionInput = new TransactionInput();
    transactionInput.merchantId = 123;
    transactionInput.description = 'T-Shirt Black/M';
    transactionInput.paymentMethod = 'Credit_Card';
    transactionInput.card = CardInputFixture.default();
    return transactionInput;
  }
}
