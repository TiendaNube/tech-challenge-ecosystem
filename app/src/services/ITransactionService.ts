import Transaction from '@domain/Transaction';
import AppError from '@errors/AppError';

export default interface ITransactionService {
  create(transaction: Transaction): Promise<Transaction | AppError | Error>;
}
