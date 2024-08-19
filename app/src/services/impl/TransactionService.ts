import ITransactionService from '@services/ITransactionService';
import { injectable, inject } from 'tsyringe';
import * as _ from 'lodash';
import AppError from '@errors/AppError';
import Transaction from '@domain/Transaction';
import IMerchantRepository from '@domain/IMerchantRepository';
import ITransactionRepository from '@domain/ITransactionRepository';
import { CreatePayableEvent } from '@domain/events/CreatePayableEvent';
import { EventPublisher } from '@domain/events/EventPublisher';
import { PrismaClient } from '@prisma/client';
import { NOT_FOUND } from 'http-status';

@injectable()
class TransactionService implements ITransactionService {
  constructor(
    @inject('MerchantRepository')
    private merchantRepository: IMerchantRepository,

    @inject('TransactionRepository')
    private transactionRepository: ITransactionRepository,

    @inject('EventPublisher')
    private eventPublisher: EventPublisher,

    @inject('Database')
    private database: PrismaClient,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const merchant = await this.merchantRepository.findById(
      transaction.merchant_id,
    );

    if (!merchant) {
      throw new AppError('Merchant not found', NOT_FOUND);
    }

    transaction.merchant = merchant;
    transaction.card_number = transaction.card_number.substring(
      transaction.card_number.length - 4,
    );

    return this.database.$transaction(async tx => {
      const insertedTransaction = await this.transactionRepository.create(
        transaction,
        tx,
      );

      const createPayableEvent = new CreatePayableEvent(
        insertedTransaction,
        tx,
      );

      await this.publishEvent(createPayableEvent);

      return insertedTransaction;
    });
  }

  async publishEvent(event: CreatePayableEvent): Promise<void> {
    await this.eventPublisher.publish(event);
  }
}

export default TransactionService;
