import { Payable } from "../../../../domain/entities/payable";
import { Transaction } from "../../../../domain/entities/transaction";
import { CreateNewTransactionPort } from "../../../../domain/ports/outbound/database/create_new_transaction_port";

export class CreateNewTransactionAdapter implements CreateNewTransactionPort {
  async create(transaction: Transaction, payable: Payable): Promise<void> {
    throw new Error("not yet implemented");
  }
}
