import { Payable } from "../../../entities/payable";
import { Transaction } from "../../../entities/transaction";

export interface CreateNewTransactionPort {
  /**
   * Save a new transaction and a payable in a persistent database
   * @param transaction transaction data to be saved
   * @param payable payable data to be sabed
   */
  create(transaction: Transaction, payable: Payable): Promise<void>;
}
