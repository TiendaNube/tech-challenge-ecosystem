import { Module } from '@nestjs/common';
import { AmqpService } from './amqp.service';
import { amqpProvider, RabbitMQ } from './amqp';

const providers = [AmqpService, amqpProvider()];

@Module({
  providers,
  exports: providers,
})
export class AmqpModule {}
