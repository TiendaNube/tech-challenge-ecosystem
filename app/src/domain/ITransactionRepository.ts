import Transaction from './Transaction';

export default interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
}
