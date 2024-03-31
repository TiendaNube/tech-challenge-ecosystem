import 'dotenv/config';

import { FactoryProvider, Scope } from '@nestjs/common';
import * as amqp from 'amqplib';
import { configService } from 'src/config/config.service';

export const RabbitMQ = Symbol('__RabbitMQ__');

export const amqpProvider = (): FactoryProvider => ({
  provide: RabbitMQ,
  scope: Scope.DEFAULT,
  useFactory: async () => {
    const config = configService.getRabbiMQConfig();
    let channel: amqp.Channel | null = null;

    try {
      const connection = await amqp.connect(
        `${config.rabbitMQTSL ? 'amqps' : 'amqp'}://${config.rabbitMQUser}:${
          config.rabbitMQPassword
        }@${config.rabbitMQHost}:${config.rabbitMQPort}/${
          config.rabbitMQVhost
        }`,
      );

      channel = await connection.createChannel();

      console.log(
        `Rabbitmq Client ready at ${config.rabbitMQHost}:${config.rabbitMQPort}`,
        'amqpProvider',
      );

      channel.on('error', (error) => {
        console.error(`Rabbitmq Client: ${error.message}`, 'amqpProvider');
        process.exit(1);
      });

      channel.on('close', () => {
        console.log(
          `Rabbitmq Client closed at ${config.rabbitMQHost}:${config.rabbitMQPort}`,
          'amqpProvider',
        );
        process.exit(1);
      });
    } catch (error) {
      console.error(`Rabbitmq Client: ${error.message}`, 'amqpProvider');
      throw error;
    }

    return channel;
  },
});
