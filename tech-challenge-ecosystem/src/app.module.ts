import { Module } from '@nestjs/common';
import { TransactionController } from './api/controller/transaction.controller';
import {
  TRANSACTION_SERVICE_PROVIDE,
  TransactionService,
} from './core/services/transaction/transaction.service';
import { DatabaseModule } from './data/database.module';
import { entitiesProviders } from './data/entities/entities.providers';
import { TransactionDatasource } from './core/constracts/data/transaction.datasource';
import { TransactionRepoistory } from './data/repository/transaction.repository';
import { TransactionProducerModule } from './messaging/producer/transaction/transaction.producer.module';

@Module({
  imports: [TransactionProducerModule, DatabaseModule],
  controllers: [TransactionController],
  providers: [
    ...entitiesProviders,
    {
      provide: TransactionDatasource,
      useClass: TransactionRepoistory,
    },
    {
      provide: TRANSACTION_SERVICE_PROVIDE,
      useClass: TransactionService,
    },
  ],
})
export class AppModule {}
