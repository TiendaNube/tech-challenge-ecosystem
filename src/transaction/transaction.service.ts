import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
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

      //TODO do the math
      const newPayable = this.payableRepository.create({
        status: 'paid',
        createDate: new Date(),
        subtotal: createdTransaction.totalValue,
        discount: 0,
        total: createdTransaction.totalValue,
        transaction: { id: createdTransaction.id },
      });

      await queryRunner.manager.save(newPayable);

      await queryRunner.commitTransaction();

      return createdTransaction;
    } catch (err) {
      queryRunner.rollbackTransaction();
      throw err;
    }
  }
}
