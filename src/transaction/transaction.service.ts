import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import {
  CreateTransactionDto,
  PaymentMethod,
} from './dtos/create-transaction.dto';
import { Payable } from './entities/payable.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Payable)
    private readonly payableRepository: Repository<Payable>,
    private dataSource: DataSource,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newTransaction = this.transactionRepository.create({
        totalValue: createTransactionDto.totalValue,
        description: createTransactionDto.description,
        paymentMethod: createTransactionDto.paymentMethod,
        cardLastDigits: createTransactionDto.cardLastDigits,
        cardHolderName: createTransactionDto.cardHolderName,
        expirationDate: createTransactionDto.expirationDate,
        cvv: createTransactionDto.cvv,
        merchantId: createTransactionDto.merchantId,
      } as unknown as Transaction);

      const createdTransaction = await queryRunner.manager.save(newTransaction);

      const newPayable = this.generatePayable(createdTransaction);

      await queryRunner.manager.save(newPayable);

      await queryRunner.commitTransaction();

      return createdTransaction;
    } catch (err) {
      queryRunner.rollbackTransaction();
      throw err;
    }
  }

  private generatePayable(transaction: Transaction): Payable {
    const method = transaction.paymentMethod;
    const discountPercentage = method === PaymentMethod.DebitCard ? 2 : 4;
    const discount = transaction.totalValue * (discountPercentage / 100);

    const newPayable = {
      status: method === PaymentMethod.DebitCard ? 'paid' : 'waiting_funds',
      createDate:
        method === PaymentMethod.DebitCard
          ? this.getDate()
          : this.getDate(false),
      subtotal: transaction.totalValue,
      discount,
      total: transaction.totalValue - discount,
      transaction: { id: transaction.id },
    };

    return this.payableRepository.create(newPayable as Payable);
  }

  private getDate(today: boolean = true) {
    const now = new Date();
    const plus30 = new Date();

    plus30.setDate(now.getDate() + 30);
    return today ? now : plus30;
  }
}
