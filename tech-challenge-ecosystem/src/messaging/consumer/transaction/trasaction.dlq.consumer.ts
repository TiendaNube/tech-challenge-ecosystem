import { Inject, Injectable } from "@nestjs/common";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { Message } from "aws-sdk/clients/sqs";
import { TRANSACTION_SERVICE_PROVIDE, TransactionService } from "../../../core/services/transaction/transaction.service";
import { validateAndTransform } from "src/messaging/validators/validateAndTransform";
import { TransactionMessageDTO } from "src/messaging/models/transaction.message.dto";

@Injectable()
export class TransactionSQSDLQConsumer {
  constructor(
    @Inject(TRANSACTION_SERVICE_PROVIDE)
    private transactionService: TransactionService
  ) {}

  // TODO: isolate into config service
  @SqsMessageHandler(/** name: */ "transactions-dlq", /** batch: */ false)
  async handleMessage(message: Message) {
    try {
      const msgBody = JSON.parse(message.Body);
      console.log('Consumer of DLQ Start ....:', JSON.stringify(msgBody));
      const transactionMessage = await validateAndTransform(msgBody, TransactionMessageDTO)
      await this.transactionService.handleTransactionCreation(transactionMessage.toTransaction())
    } catch(err) {
      console.log(err)
      throw err
    }

    }
}