import { Payable } from "../../../entities/payable";
import { Transaction } from "../../../entities/transaction";

export interface CreateNewTransactionPort {
  create(transaction: Transaction, payable: Payable): Promise<void>;
}
