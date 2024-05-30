import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { TransactionMessageProducer } from './transaction.message.producer';

// TODO: isolate into config service
const config = {
    AWS_REGION: "us-east-1",
    ACCESS_KEY_ID: "ACCESS_KEY_ID",
    SECRET_ACCESS_KEY: "SECRET_ACCESS_KEY"
}

@Module({
    imports: [
        SqsModule.registerAsync({
            useFactory: () => {
              return {
                consumers: [],
                producers: [
                    {
                        // TODO: isolate into config service
                        name: "transactions-queue",
                        // TODO: isolate into config service
                        queueUrl: "http://localhost:4566/000000000000/transactions-queue", 
                        region: config.AWS_REGION, // url of the queue
                        sqs: new SQSClient({
                            region: config.AWS_REGION,
                            credentials: {
                              accessKeyId: config.ACCESS_KEY_ID,
                              secretAccessKey: config.SECRET_ACCESS_KEY
                            }
                          })
                    },
                ],
              };
            },
          })
    ],
    controllers: [],
    providers: [TransactionMessageProducer],
    exports: [TransactionMessageProducer]
})

export class TransactionProducerModule { }