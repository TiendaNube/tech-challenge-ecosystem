import { Inject, Injectable } from "@nestjs/common";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { Message } from "aws-sdk/clients/sqs";
import { validateAndTransform } from "../../validators/validateAndTransform";
import { TransactionMessageDTO } from "../../models/transaction.message.dto";
import { PAYABLE_SERVICE_PROVIDE, PayableService } from "../../../core/services/payable/payable.service";

@Injectable()
export class TransactionSQSDLQConsumer {
  constructor(
    @Inject(PAYABLE_SERVICE_PROVIDE)
    private payableService: PayableService
  ) {}

  // TODO: isolate into config service
  @SqsMessageHandler(/** name: */ "transactions-dlq", /** batch: */ false)
  async handleMessage(message: Message) {
    try {
      const msgBody = JSON.parse(message.Body);
      console.log('Consumer of DLQ Start ....:', JSON.stringify(msgBody));
      const transactionMessage = await validateAndTransform(msgBody, TransactionMessageDTO)
      await this.payableService.createPayableFromTransaction(transactionMessage.toTransaction())
    } catch(err) {
      console.log(err)
      throw err
    }

    }
}