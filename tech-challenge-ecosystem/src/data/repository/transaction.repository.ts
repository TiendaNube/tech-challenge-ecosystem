import { TransactionDatasource } from '../../core/constracts/data/transaction.datasource';
import { Repository } from 'typeorm';
import { TRANSACTION_TYPEORM_REPOSITORY, TransactionEntity } from '../entities/transaction.entity';
import { Transaction } from '../../core/models/transaction';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TransactionRepoistory implements TransactionDatasource {
  constructor(
    @Inject(TRANSACTION_TYPEORM_REPOSITORY)
    private transactionTypeormRepository: Repository<TransactionEntity>,
  ) {}

  public async create(transaction: Transaction): Promise<Transaction> {
    const savedTransaction = await this.transactionTypeormRepository.save(
      TransactionEntity.fromTransaction(transaction),
    );

    return savedTransaction.toTransaction();
  }
}
