import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { Transaction } from '../../../core/models/transaction';
import { v4 as uuid } from 'uuid';
import { TransactionMessageProducer } from '../../../core/constracts/messaging/transaction.message.producer';

@Injectable()
export class TransactionSQSMessageProducer
  implements TransactionMessageProducer
{
  constructor(private readonly sqsService: SqsService) {}
  async sendMessage(body: Transaction) {
    const message: any = JSON.stringify(body);

    try {
      await this.sqsService.send(
        // TODO: isolate into config service
        'transactions-queue',
        {
          id: uuid(),
          body: message,
        },
      );
    } catch (error) {
      // TODO: improve error handling
      console.log('error in producing image!', error);
      throw error;
    }
  }
}
