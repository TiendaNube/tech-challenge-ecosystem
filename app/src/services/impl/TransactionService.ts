import ITransactionService from '@services/ITransactionService';
import { injectable, inject } from 'tsyringe';
import * as _ from 'lodash';
import AppError from '@errors/AppError';
import Transaction from '@domain/Transaction';
import IMerchantRepository from '@domain/IMerchantRepository';
import ITransactionRepository from '@domain/ITransactionRepository';
import { CreatePayableEvent } from '@domain/events/CreatePayableEvent';
import { EventPublisher } from '@domain/events/EventPublisher';

@injectable()
class TransactionService implements ITransactionService {
  constructor(
    @inject('MerchantRepository')
    private merchantRepository: IMerchantRepository,

    @inject('TransactionRepository')
    private transactionRepository: ITransactionRepository,

    @inject('EventPublisher')
    private eventPublisher: EventPublisher,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const merchant = await this.merchantRepository.findById(
      transaction.merchant_id,
    );

    if (!merchant) {
      throw new AppError('Merchant not found');
    }

    transaction.merchant = merchant;
    transaction.card_number = transaction.card_number.substring(
      transaction.card_number.length - 4,
    );

    const insertedTransaction = await this.transactionRepository.create(
      transaction,
    );

    const createPayableEvent = new CreatePayableEvent(insertedTransaction);
    this.eventPublisher.publish(createPayableEvent);

    return insertedTransaction;
  }
}

export default TransactionService;
