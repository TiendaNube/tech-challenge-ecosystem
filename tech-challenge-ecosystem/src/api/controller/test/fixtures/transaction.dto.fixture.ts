import { TransactionDTO } from '../../../models/transaction.dto';
import { CardDTOFixture } from './card.dto.fixture';

export class TransactionDTOFixture {
  public static default() {
    const transactionInput = new TransactionDTO();
    transactionInput.merchantId = 123;
    transactionInput.description = 'T-Shirt Black/M';
    transactionInput.paymentMethod = 'Credit_Card';
    transactionInput.card = CardDTOFixture.default();
    return transactionInput;
  }
}
