import { NewPayableType } from "../../../entities/payable";
import { TransactionType } from "../../../entities/transaction";

export interface ProcessTransactionUsecase {
  process(
    transactionData: TransactionType,
    payableData: NewPayableType
  ): Promise<void>;
}
