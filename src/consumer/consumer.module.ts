import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '../transaction/transaction.module';
import { configService } from '../config/config.service';
import { AmqpModule } from '../amqp/amqp.module';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TransactionModule,
    AmqpModule,
  ],
  providers: [ConsumerService],
})
export class ConsumerModule {}
