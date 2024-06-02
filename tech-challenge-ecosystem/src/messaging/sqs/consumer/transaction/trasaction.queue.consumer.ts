import { Inject, Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from 'aws-sdk/clients/sqs';
import { validateAndTransform } from 'src/messaging/validators/validateAndTransform';
import { TransactionMessageDTO } from 'src/messaging/sqs/models/transaction.message.dto';
import {
  PAYABLE_SERVICE_PROVIDE,
  PayableService,
} from '../../../../core/services/payable/payable.service';

@Injectable()
export class TransactionSQSQueueConsumer {
  constructor(
    @Inject(PAYABLE_SERVICE_PROVIDE)
    private payableService: PayableService,
  ) {}

  private logger = new Logger(TransactionSQSQueueConsumer.name);

  @SqsMessageHandler(
    /** name: */ process.env.TRANSACTIONS_QUEUE_NAME,
    /** batch: */ false,
  )
  async handleMessage(message: Message) {
    try {
      const msgBody = JSON.parse(message.Body);

      this.logger.log(
        `Starting consuming ${process.env.TRANSACTIONS_QUEUE_NAME}: ${JSON.stringify(msgBody)}`,
      );

      const transactionMessage = await validateAndTransform(
        msgBody,
        TransactionMessageDTO,
      );
      await this.payableService.createPayableFromTransaction(
        transactionMessage.toTransaction(),
      );
      this.logger.log('Consumed message successfully');
    } catch (err) {
      this.logger.error(
        `Error on consuming ${process.env.TRANSACTIONS_QUEUE_NAME}: ${err}`,
      );
      throw err;
    }
  }
}
