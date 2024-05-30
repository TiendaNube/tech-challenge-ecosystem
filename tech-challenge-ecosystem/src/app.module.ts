import { Module } from '@nestjs/common';
import { TransactionController } from './api/controller/transaction.controller';
import { TransactionService } from './core/services/transaction/TransactionService';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class AppModule {}
