import { RabbitMQModule, RabbitRpcParamsFactory } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQProducerService } from './services/rabbitmq.producer.services';
import { RabbitMQConsumerService } from './services/rabbitmq.consumer.service';
import { TransactionModule } from '../transaction/transaction.module';

@Global()
@Module({
    imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('RABBITMQ_URL'),
                connectionInitOptions: { wait: true, timeout: 5000 },
            }),
            inject: [ConfigService],
        }),
        TransactionModule,
    ],
    controllers: [],
    providers: [RabbitRpcParamsFactory, RabbitMQProducerService, RabbitMQConsumerService],
    exports: [RabbitMQModule, RabbitRpcParamsFactory, RabbitMQProducerService],
})
export class CustomRabbitMQModule {}
