import { Injectable, Logger } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { Transaction } from '../../../core/models/transaction';
import { v4 as uuid } from 'uuid';
import { TransactionMessageProducer } from '../../../core/constracts/messaging/transaction.message.producer';

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
      `Sending message to transactions-queue: ${JSON.stringify(message)}`,
    );
    try {
      await this.sqsService.send(
        // TODO: isolate into config service
        'transactions-queue',
        message,
      );
    } catch (error) {
      // TODO: improve error handling
      this.logger.error(
        `Error on sending message to transactions-queue: ${error}`,
      );
      console.log('error in producing image!', error);
      throw error;
    }
  }
}
