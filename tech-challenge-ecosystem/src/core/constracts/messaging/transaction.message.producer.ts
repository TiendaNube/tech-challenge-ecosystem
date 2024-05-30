import { Transaction } from '../../models/transaction';

export const TRANSACTION_MESSAGE_PRODUCER_PROVIDE = 'TransactionMessageProducer';
export interface TransactionMessageProducer {
  sendMessage(transaction: Transaction): Promise<void>;
}
