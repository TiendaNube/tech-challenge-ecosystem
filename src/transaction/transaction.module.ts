import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Payable } from './entities/payable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Payable])],
  providers: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {}
