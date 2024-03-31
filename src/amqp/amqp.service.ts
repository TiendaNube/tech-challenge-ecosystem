import { Inject, Injectable } from '@nestjs/common';
import { RabbitMQ } from './amqp';
import { Channel, Options, ConsumeMessage } from 'amqplib';

@Injectable()
export class AmqpService {
  @Inject(RabbitMQ)
  private readonly rabbitMQ: Channel;

  async bindQueue(
    queue: string,
    exchange: string,
    routingKey: string,
  ): Promise<void> {
    await this.rabbitMQ.bindQueue(queue, exchange, routingKey);
  }

  async assertQueue(
    queue: string,
    options: Options.AssertQueue,
  ): Promise<void> {
    await this.rabbitMQ.assertQueue(queue, options);
  }

  async assertExchange(
    exchange: string,
    type: string,
    options?: Options.AssertExchange,
  ): Promise<void> {
    await this.rabbitMQ.assertExchange(exchange, type, options);
  }

  publishEvent(
    exchange: string,
    routingKey: string,
    content: any,
    options?: Options.Publish,
    serializeFn: (content: any) => Buffer = (content) =>
      Buffer.from(JSON.stringify(content)),
  ) {
    const buffer = serializeFn(content);
    const publishResult = this.rabbitMQ.publish(
      exchange,
      routingKey,
      buffer,
      options,
    );

    if (!publishResult) {
      console.error(`Failed to publish message to exchange: ${exchange}`);
      throw new Error(`Failed to publish message to exchange: ${exchange}`);
    }

    console.log(`Message published to exchange: ${exchange}`);
  }

  async consumeQueue(
    queueName: string,
    callback: (msg: ConsumeMessage) => Promise<void> | void,
    options?: {
      prefetch?: number;
    },
  ) {
    if (options && options.prefetch) {
      await this.rabbitMQ.prefetch(options.prefetch ?? 10);
    }

    await this.rabbitMQ.consume(queueName, (msg: ConsumeMessage) => {
      if (!msg) {
        console.warn('Consume message is null');
        return;
      }

      console.log(
        'Consume message ' +
          msg.fields.exchange +
          ' ' +
          msg.fields.routingKey +
          ' ' +
          JSON.stringify(msg.properties.headers),
      );

      try {
        callback(msg);
      } catch (e) {
        console.error(e);
        throw e;
      }
    });
  }
}
