import { Payable } from "../../entities/payable";
import { Transaction } from "../../entities/transaction";
import { DatabaseError } from "../../errors/database_error";
import { ProcessTransactionUsecase } from "../../ports/inbound/command/process_transaction_usecase";
import { CreateNewTransactionPort } from "../../ports/outbound/database/create_new_transaction_port";

export class ProcessTransactionService implements ProcessTransactionUsecase {
  _createNewTransactionPort: CreateNewTransactionPort;

  constructor(createNewTransactionPort: CreateNewTransactionPort) {
    this._createNewTransactionPort = createNewTransactionPort;
  }

  async process(transactionData: Transaction, payable: Payable): Promise<void> {
    try {
      await this._createNewTransactionPort.create(transactionData, payable);
    } catch (e: any) {
      throw new DatabaseError(`database error: ${e.message}`);
    }
  }
}
