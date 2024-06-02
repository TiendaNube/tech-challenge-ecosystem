import { Module } from '@nestjs/common';
import { TransactionController } from './api/controller/transaction.controller';
import { ServicesModule } from './core/services/services.module';
import { PayableController } from './api/controller/payable.controller';
import { SQSModule } from './messaging/sqs/sqs.module';

@Module({
  imports: [ServicesModule, SQSModule],
  controllers: [TransactionController, PayableController],
})
export class AppModule {}
