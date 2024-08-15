import ITransactionRepository from '@domain/ITransactionRepository';
import Transaction from '@domain/Transaction';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

@injectable()
class TransactionRepository implements ITransactionRepository {
  constructor(
    @inject('Database')
    private database: PrismaClient,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const insertedTransaction = await this.database.transaction.create({
      data: {
        description: transaction.description,
        card_number: transaction.card_number,
        card_holder: transaction.card_holder,
        expiration_date: transaction.expiration_date,
        merchant_id: transaction.merchant_id,
        payment_method: transaction.payment_method,
        cvv: transaction.cvv,
        total: transaction.total,
      },
      include: {
        merchant: true,
      },
    });

    return insertedTransaction;
  }
}

export default TransactionRepository;
