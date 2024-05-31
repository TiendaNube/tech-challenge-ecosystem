import { DataSource } from 'typeorm';
import { TRANSACTION_TYPEORM_REPOSITORY, TransactionEntity } from './transaction.entity';
import { PAYABLE_TYPEORM_REPOSITORY, PayableEntity } from './payable.entity';

export const entitiesProviders = [
  {
    provide: TRANSACTION_TYPEORM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TransactionEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: PAYABLE_TYPEORM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PayableEntity),
    inject: ['DATA_SOURCE'],
  },

];
