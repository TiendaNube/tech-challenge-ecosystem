import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { getLastFourDigits } from 'src/utils/functions';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionRepository.save(
      this.transactionRepository.create({
        ...createTransactionDto,
        cardLastFourDigits: getLastFourDigits(createTransactionDto.card.number),
      }),
    );
  }

  async findOne(id: string) {
    return await this.transactionRepository.findOne({
      where: {
        id,
      },
    });
  }
}
