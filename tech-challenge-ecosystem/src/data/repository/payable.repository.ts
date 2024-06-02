import { Between, Repository } from 'typeorm';
import {
  TRANSACTION_TYPEORM_REPOSITORY,
  TransactionEntity,
} from '../entities/transaction.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PayableDatasource } from 'src/core/contracts/data/payable.datasource';
import {
  PAYABLE_TYPEORM_REPOSITORY,
  PayableEntity,
} from '../entities/payable.entity';
import { Payable } from '../../core/models/payable';

@Injectable()
export class PayableRepository implements PayableDatasource {
  constructor(
    @Inject(PAYABLE_TYPEORM_REPOSITORY)
    private payableTypeormRepository: Repository<PayableEntity>,
    @Inject(TRANSACTION_TYPEORM_REPOSITORY)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  public async create(payable: Payable): Promise<Payable> {
    const transaction = await this.transactionRepository.findOneBy({
      id: payable.transaction?.id ?? '',
    });

    if (!transaction) {
      throw new Error('transaction not found');
    }

    const payableEntity = this.payableTypeormRepository.create(
      PayableEntity.fromPayable(payable),
    );
    payableEntity.transaction = transaction;

    const savedPayable =
      await this.payableTypeormRepository.save(payableEntity);

    return savedPayable.toPayable();
  }

  public async listByMerchantId(
    merchantId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Payable[]> {
    const entities = await this.payableTypeormRepository.find({
      where: {
        merchantId,
        date: Between(startDate, endDate),
      },
    });

    return entities.map((entity) => entity.toPayable());
  }
}
