import { DataSource } from 'typeorm';
import { entitiesProviders } from './entities/entities.providers';
import { repositoryProviders } from './repository/repository.providers';

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
  ...repositoryProviders,
];
