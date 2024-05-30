import { DataSource } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

export const TRANSACTION_TYPEORM_REPOSITORY = 'TRANSACTION_TYPEORM_REPOSITORY';

export const entitiesProviders = [
  {
    provide: TRANSACTION_TYPEORM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TransactionEntity),
    inject: ['DATA_SOURCE'],
  },
];
