import { Injectable, Logger } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { Transaction } from '../../../core/models/transaction';
import { v4 as uuid } from 'uuid';
import { TransactionMessageProducer } from '../../../core/contracts/messaging/transaction.message.producer';

@Injectable()
export class TransactionSQSMessageProducer
  implements TransactionMessageProducer
{
  private logger = new Logger(TransactionSQSMessageProducer.name);

  constructor(private readonly sqsService: SqsService) {}
  async sendMessage(body: Transaction) {
    const message = {
      id: uuid(),
      body: JSON.stringify(body),
    };
    this.logger.log(
      `Sending message to ${process.env.TRANSACTIONS_QUEUE_NAME}: ${JSON.stringify(message)}`,
    );
    try {
      await this.sqsService.send(process.env.TRANSACTIONS_QUEUE_NAME, message);
    } catch (error) {
      this.logger.error(
        `Error on sending message to ${process.env.TRANSACTIONS_QUEUE_NAME}: ${error}`,
      );
      console.log('error in producing image!', error);
      throw error;
    }
  }
}
