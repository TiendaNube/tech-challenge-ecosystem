import { Module } from '@nestjs/common';
import {
  TRANSACTION_SERVICE_PROVIDE,
  TransactionService,
} from './transaction/transaction.service';
import { DatabaseModule } from '../../data/database.module';
import { TRANSACTION_MESSAGE_PRODUCER_PROVIDE } from '../constracts/messaging/transaction.message.producer';
import { TransactionSQSMessageProducer } from 'src/messaging/sqs/transaction/transaction.message.producer';
import { PayableFromTransactionBusiness } from '../business/payable/payable.from.transaction.business';
import {
  PAYABLE_SERVICE_PROVIDE,
  PayableService,
} from './payable/payable.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: TRANSACTION_SERVICE_PROVIDE,
      useClass: TransactionService,
    },
    {
      provide: PAYABLE_SERVICE_PROVIDE,
      useClass: PayableService,
    },
    {
      provide: TRANSACTION_MESSAGE_PRODUCER_PROVIDE,
      useClass: TransactionSQSMessageProducer,
    },
    PayableFromTransactionBusiness,
  ],
  exports: [
    {
      provide: TRANSACTION_SERVICE_PROVIDE,
      useClass: TransactionService,
    },
    {
      provide: PAYABLE_SERVICE_PROVIDE,
      useClass: PayableService,
    },
  ],
})
export class ServicesModule {}
