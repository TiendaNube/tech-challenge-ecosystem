import { NewPayableType, Payable } from "../../entities/payable";
import { Transaction, TransactionType } from "../../entities/transaction";
import { DatabaseError } from "../../errors/database_error";
import { ValidationError } from "../../errors/validation_error";
import { ProcessTransactionUsecase } from "../../ports/inbound/command/process_transaction_usecase";
import { CreateNewTransactionPort } from "../../ports/outbound/database/create_new_transaction_port";

export class ProcessTransactionService implements ProcessTransactionUsecase {
  _createNewTransactionPort: CreateNewTransactionPort;

  constructor(createNewTransactionPort: CreateNewTransactionPort) {
    this._createNewTransactionPort = createNewTransactionPort;
  }

  async process(
    transactionData: TransactionType,
    payableData: NewPayableType
  ): Promise<void> {
    try {
      const transaction = new Transaction(transactionData);
      const payable = new Payable(payableData);
      await this._createNewTransactionPort.create(transaction, payable);
    } catch (e: any) {
      if (e instanceof ValidationError) {
        throw e;
      }
      throw new DatabaseError(`database error: ${e.message}`);
    }
  }
}
