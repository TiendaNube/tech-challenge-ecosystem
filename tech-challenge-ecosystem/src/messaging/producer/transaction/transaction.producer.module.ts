import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { TransactionSQSMessageProducer } from './transaction.message.producer';
import { TRANSACTION_MESSAGE_PRODUCER_PROVIDE } from '../../../core/constracts/messaging/transaction.message.producer';
import { TransactionSQSQueueConsumer } from '../../consumer/transaction/trasaction.queue.consumer';
import { ServicesModule } from 'src/core/services/services.module';
import { TransactionSQSDLQConsumer } from '../../consumer/transaction/trasaction.dlq.consumer';

// TODO: isolate into config service
const config = {
    AWS_REGION: "us-east-1",
    ACCESS_KEY_ID: "ACCESS_KEY_ID",
    SECRET_ACCESS_KEY: "SECRET_ACCESS_KEY"
}

const sharedSQSRegistry = {
  region: config.AWS_REGION, // url of the queue
  sqs: new SQSClient({
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.ACCESS_KEY_ID,
        secretAccessKey: config.SECRET_ACCESS_KEY
      },
    }),
}

@Module({
    imports: [
        ServicesModule,
        SqsModule.registerAsync({
            useFactory: () => {
              return {
                consumers: [{
                  // TODO: isolate into config service
                  name: "transactions-queue",
                  // TODO: isolate into config service
                  queueUrl: "http://localhost:4566/000000000000/transactions-queue", 
                  ...sharedSQSRegistry,
              },
              {
                // TODO: isolate into config service
                name: "transactions-dlq",
                // TODO: isolate into config service
                queueUrl: "http://localhost:4566/000000000000/transactions-dlq", 
                ...sharedSQSRegistry,
            }
            ],
                producers: [
                    {
                        // TODO: isolate into config service
                        name: "transactions-queue",
                        // TODO: isolate into config service
                        queueUrl: "http://localhost:4566/000000000000/transactions-queue", 
                        ...sharedSQSRegistry,
                    },
                ],
              };
            },
          })
    ],
    controllers: [],
    providers: [
      {
        provide: TRANSACTION_MESSAGE_PRODUCER_PROVIDE,
        useClass: TransactionSQSMessageProducer,
      }, 
      TransactionSQSQueueConsumer,
      TransactionSQSDLQConsumer
    ],
    exports: [{
      provide: TRANSACTION_MESSAGE_PRODUCER_PROVIDE,
      useClass: TransactionSQSMessageProducer,
    }]
})

export class TransactionProducerModule { }