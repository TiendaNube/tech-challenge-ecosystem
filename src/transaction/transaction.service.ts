import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // TODO transaction + create payable

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

    return this.transactionRepository.save(newTransaction);
  }
}
