import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Payable } from './entities/payable.entity';
import { AmqpModule } from 'src/amqp/amqp.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Payable]), AmqpModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
