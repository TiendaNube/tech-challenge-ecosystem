import { Module } from '@nestjs/common';
import { TransactionModule } from './domain/Transaction/transaction.module';
import { PayableModule } from './domain/Payable/payable.module';

@Module({
  imports: [TransactionModule, PayableModule],
})
export class AppModule {}
