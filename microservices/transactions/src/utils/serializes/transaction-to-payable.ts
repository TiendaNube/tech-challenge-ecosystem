import { CreatePayableContract } from 'src/transactions/contract/create-payable.contract';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';

export const transactionToPayableSerialize = ({
  card,
  ...transaction
}: CreateTransactionDto): CreatePayableContract => ({
  ...transaction,
  cardCvv: card.cvv,
  cardHolder: card.holder,
  cardNumber: card.number,
  cardExpirationDate: card.expirationDate,
});
