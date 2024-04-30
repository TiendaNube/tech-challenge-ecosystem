import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventHandlers } from './events/handlers';
import { CommandHandlers } from './commands/handlers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'PAYABLES_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.RMQ,
          options: {
            queue: 'payables',
            urls: [
              `amqp://${configService.get<string>('rabbitmq.host', { infer: true })}:${configService.get<string>('rabbitmq.port', { infer: true })}`,
            ],
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, ...CommandHandlers, ...EventHandlers],
})
export class TransactionsModule {}
