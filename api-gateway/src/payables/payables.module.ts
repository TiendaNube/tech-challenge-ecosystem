import { Module } from '@nestjs/common';
import { PayablesService } from './payables.service';
import { PayablesController } from './payables.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AllConfigType } from 'src/config/config.type';
import { CLIENTS } from 'src/utils/constants';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: CLIENTS.PAYABLES_CLIENT,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>('rabbitmq.host', { infer: true })}:5672`,
            ],
            queue: 'payables',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PayablesController],
  providers: [PayablesService],
})
export class PayablesModule {}
