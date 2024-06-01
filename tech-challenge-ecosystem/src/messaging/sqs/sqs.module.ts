import { Module } from '@nestjs/common';
import { TransactionSQSModule } from './transaction/transaction.sqs.module';

@Module({
  imports: [TransactionSQSModule],
  exports: [TransactionSQSModule],
})
export class SQSModule {}
