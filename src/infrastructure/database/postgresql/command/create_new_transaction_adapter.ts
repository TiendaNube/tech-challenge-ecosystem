import { Payable } from "../../../../domain/entities/payable";
import { Transaction } from "../../../../domain/entities/transaction";
import { CreateNewTransactionPort } from "../../../../domain/ports/outbound/database/create_new_transaction_port";
import { PGDatabase } from "../repository/connection";
import { PayableModel } from "../repository/payables";
import { TransactionModel } from "../repository/transactions";

export class CreateNewTransactionAdapter implements CreateNewTransactionPort {
  /**
   * Creates a new transaction with a payable on database.
   * In case an operation fails a rollback takes place.
   */
  async create(transaction: Transaction, payable: Payable): Promise<void> {
    const dbTransaction =
      await PGDatabase.databaseInstance().sequelize.transaction();

    try {
      const transactionCreated = await TransactionModel.create(
        transaction.dataValues(),
        { transaction: dbTransaction }
      );

      payable.transactionId = transactionCreated.dataValues.id;
      await PayableModel.create(payable.dataValues(), {
        transaction: dbTransaction,
      });

      await dbTransaction.commit();
    } catch (error) {
      await dbTransaction.rollback();
      throw error;
    }
  }
}
