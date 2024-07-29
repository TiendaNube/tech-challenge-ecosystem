import { NewPayableType } from "../../../entities/payable";
import { TransactionType } from "../../../entities/transaction";

export interface ProcessTransactionUsecase {
  /**
   * Create a new transaction and a payable associated with it
   * @param transactionData main information about the transaction
   * @param payableData amounts and date of payment
   */
  process(
    transactionData: TransactionType,
    payableData: NewPayableType
  ): Promise<void>;
}
