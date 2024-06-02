import { Module } from '@nestjs/common';
import {
  TRANSACTION_SERVICE_PROVIDE,
  TransactionService,
} from './transaction/transaction.service';
import { DatabaseModule } from '../../data/database.module';
import { TRANSACTION_MESSAGE_PRODUCER_PROVIDE } from '../contracts/messaging/transaction.message.producer';
import { TransactionSQSMessageProducer } from 'src/messaging/sqs/transaction/transaction.message.producer';
import {
  PAYABLE_FROM_TRANSACTION_BUSINESS_PROVIDE,
  PayableFromTransactionBusiness,
} from '../business/payable/payable.from.transaction.business';
import {
  PAYABLE_SERVICE_PROVIDE,
  PayableService,
} from './payable/payable.service';
import {
  SUMMARIZE_PAYABLE_BUSINESS_PROVIDE,
  SummarizePayableBusiness,
} from '../business/payable/summarize.payables.business';

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
    {
      provide: PAYABLE_FROM_TRANSACTION_BUSINESS_PROVIDE,
      useClass: PayableFromTransactionBusiness,
    },
    {
      provide: SUMMARIZE_PAYABLE_BUSINESS_PROVIDE,
      useClass: SummarizePayableBusiness,
    },
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
