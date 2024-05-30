import { Module } from '@nestjs/common';
import { TRANSACTION_SERVICE_PROVIDE, TransactionService } from './transaction/transaction.service';
import { DatabaseModule } from '../../data/database.module';
import { TRANSACTION_MESSAGE_PRODUCER_PROVIDE } from '../constracts/messaging/transaction.message.producer';
import { TransactionSQSMessageProducer } from 'src/messaging/producer/transaction/transaction.message.producer';

@Module({
    imports: [DatabaseModule],
    providers: [
      {
        provide: TRANSACTION_SERVICE_PROVIDE,
        useClass: TransactionService,
      },
      {
        provide: TRANSACTION_MESSAGE_PRODUCER_PROVIDE,
        useClass: TransactionSQSMessageProducer,
      }
],
  exports: [      {
    provide: TRANSACTION_SERVICE_PROVIDE,
    useClass: TransactionService,
  }],
})
export class ServicesModule {}
