import { Module } from '@nestjs/common';
import { TransactionController } from './api/controller/transaction.controller';
import { TransactionProducerModule } from './messaging/producer/transaction/transaction.producer.module';
import { ServicesModule } from './core/services/services.module';
import { PayableController } from './api/controller/payable.controller';

@Module({
  imports: [ServicesModule, TransactionProducerModule],
  controllers: [TransactionController, PayableController],
})
export class AppModule {}
