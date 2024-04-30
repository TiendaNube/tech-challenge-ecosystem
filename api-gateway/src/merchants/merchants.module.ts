import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { CLIENTS } from 'src/utils/constants';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: CLIENTS.MERCHANTS_CLIENT,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>('rabbitmq.host', { infer: true })}:5672`,
            ],
            queue: 'merchants',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: CLIENTS.TRANSACTIONS_CLIENT,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>('rabbitmq.host', { infer: true })}:5672`,
            ],
            queue: 'transactions',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [MerchantsService, ...CommandHandlers, ...EventHandlers],
  exports: [MerchantsService],
})
export class MerchantsModule {}
