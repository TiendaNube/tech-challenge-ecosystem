import { TRANSACTION_DATASOURCE_PROVIDE } from 'src/core/constracts/data/transaction.datasource';
import { TransactionRepository } from './transaction.repository';
import { PAYABLE_DATASOURCE_PROVIDE } from 'src/core/constracts/data/payable.datasource';
import { PayableRepository } from './payable.repository';

export const repositoryProviders = [
  {
    provide: TRANSACTION_DATASOURCE_PROVIDE,
    useClass: TransactionRepository,
  },
  {
    provide: PAYABLE_DATASOURCE_PROVIDE,
    useClass: PayableRepository,
  },
];
