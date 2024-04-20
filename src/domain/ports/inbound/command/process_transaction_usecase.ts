import { Payable } from "../../../entities/payable";
import { Transaction } from "../../../entities/transaction";

export interface ProcessTransactionUsecase {
  process(transaction: Transaction, payable: Payable): Promise<void>;
}
