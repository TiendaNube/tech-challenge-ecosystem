import { TRANSACTION_DATASOURCE_PROVIDE } from 'src/core/constracts/data/transaction.datasource';
import { DataSource } from 'typeorm';
import { TransactionRepoistory } from './repository/transaction.repository';
import { entitiesProviders } from './entities/entities.providers';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'r00t',
        database: 'tech-challenge-ecosystem-db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
  ...entitiesProviders,
  {
    provide: TRANSACTION_DATASOURCE_PROVIDE,
    useClass: TransactionRepoistory,
  }
];
