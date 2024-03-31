import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AmqpService } from '../amqp/amqp.service';
import { TransactionService } from '../transaction/transaction.service';
import { configService } from '../config/config.service';
import { Channel, ConsumeMessage } from 'amqplib';
import { RabbitMQ } from 'src/amqp/amqp';
import { CreateTransactionDto } from 'src/transaction/dtos/create-transaction.dto';

@Injectable()
export class ConsumerService implements OnModuleInit {
  @Inject()
  private readonly amqpService: AmqpService;

  @Inject(RabbitMQ)
  private rabbitMQ: Channel;

  @Inject()
  private readonly transactionService: TransactionService;

  async onModuleInit() {
    const queueConfig = configService.getQueueConfig();

    await this.amqpService.assertExchange(
      queueConfig.exchange,
      queueConfig.exchangeType,
    );

    await this.amqpService.assertExchange(queueConfig.dlx, 'fanout');

    await this.amqpService.assertQueue(queueConfig.queue, {
      deadLetterExchange: queueConfig.dlx,
    });

    // wildcard routing key for simplicity
    await this.amqpService.bindQueue(
      queueConfig.queue,
      queueConfig.exchange,
      '#',
    );

    await this.amqpService.consumeQueue(
      queueConfig.queue,
      async (msg: ConsumeMessage) => {
        try {
          // if needed create a request context here for each message
          const content: CreateTransactionDto = JSON.parse(
            msg.content.toString(),
          );
          await this.transactionService.createTransaction(content);

          this.rabbitMQ.ack(msg);
        } catch (error) {
          console.error(`Error parsing message`, error);
          this.rabbitMQ.nack(msg, false, false);
        }
      },
      {
        prefetch: queueConfig.prefetch,
      },
    );
  }
}
