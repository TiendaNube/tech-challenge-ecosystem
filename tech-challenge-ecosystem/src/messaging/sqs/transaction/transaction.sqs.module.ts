import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { TransactionSQSMessageProducer } from './transaction.message.producer';
import { TRANSACTION_MESSAGE_PRODUCER_PROVIDE } from '../../../core/contracts/messaging/transaction.message.producer';
import { TransactionSQSQueueConsumer } from '../consumer/transaction/trasaction.queue.consumer';
import { ServicesModule } from 'src/core/services/services.module';
import { TransactionSQSDLQConsumer } from '../consumer/transaction/trasaction.dlq.consumer';

const sharedSQSRegistry = {
  region: process.env.AWS_REGION,
  sqs: new SQSClient({
    region: process.env.AWS_REGIONN,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
    },
  }),
};

@Module({
  imports: [
    ServicesModule,
    SqsModule.registerAsync({
      useFactory: () => {
        return {
          consumers: [
            {
              name: process.env.TRANSACTIONS_QUEUE_NAME,
              queueUrl: process.env.TRANSACTIONS_QUEUE_URL,
              ...sharedSQSRegistry,
            },
            {
              name: process.env.TRANSACTIONS_DLQ_NAME,
              queueUrl: process.env.TRANSACTIONS_DLQ_URL,
              ...sharedSQSRegistry,
            },
          ],
          producers: [
            {
              name: process.env.TRANSACTIONS_QUEUE_NAME,
              queueUrl: process.env.TRANSACTIONS_QUEUE_URL,
              ...sharedSQSRegistry,
            },
          ],
        };
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: TRANSACTION_MESSAGE_PRODUCER_PROVIDE,
      useClass: TransactionSQSMessageProducer,
    },
    TransactionSQSQueueConsumer,
    TransactionSQSDLQConsumer,
  ],
  exports: [
    {
      provide: TRANSACTION_MESSAGE_PRODUCER_PROVIDE,
      useClass: TransactionSQSMessageProducer,
    },
  ],
})
export class TransactionSQSModule {}
