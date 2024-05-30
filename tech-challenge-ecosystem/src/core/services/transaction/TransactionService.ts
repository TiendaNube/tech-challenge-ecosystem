import { Injectable } from '@nestjs/common';
import { Transaction } from '../../models/Transaction';

@Injectable()
export class TransactionService {
  createTransaction(transaction: Transaction): Transaction {
    return transaction;
  }
}
