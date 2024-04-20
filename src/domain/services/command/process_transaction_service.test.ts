import { CreateNewTransactionAdapter } from "../../../infrastructure/database/postgresql/command/create_new_transaction_adapter";
import { Payable } from "../../entities/payable";
import { Transaction } from "../../entities/transaction";
import { PaymentMethod } from "../../enums/payment_method";
import { DatabaseError } from "../../errors/database_error";
import { ProcessTransactionService } from "./process_transaction_service";

const transaction = new Transaction({
  merchantId: 1,
  description: "teste",
  cardExpirationDate: "11/2222",
  cardHolder: "Jeff",
  cardNumber: "4000",
  cardCVV: "123",
  paymentMethod: PaymentMethod.CREDIT_CARD,
});

const payable = new Payable({
  transactionId: 1,
  merchantId: 1,
  paymentMethod: PaymentMethod.DEBIT_CARD,
  subtotal: 100,
});

describe("ProcessTransactionService.process", () => {
  it("should throw DatabaseError when failed to call database", async () => {
    jest
      .spyOn(CreateNewTransactionAdapter.prototype, "create")
      .mockRejectedValue(new Error("error"));

    const createNewTransactionAdapter = new CreateNewTransactionAdapter();
    const service = new ProcessTransactionService(createNewTransactionAdapter);

    expect(async () => {
      await service.process(transaction, payable);
    }).rejects.toThrow(DatabaseError);
    expect(CreateNewTransactionAdapter.prototype.create).toHaveBeenCalled();
  });

  it("should save on database when calling database successfully", async () => {
    jest
      .spyOn(CreateNewTransactionAdapter.prototype, "create")
      .mockResolvedValue();

    const createNewTransactionAdapter = new CreateNewTransactionAdapter();
    const service = new ProcessTransactionService(createNewTransactionAdapter);

    await service.process(transaction, payable);

    expect(CreateNewTransactionAdapter.prototype.create).toHaveBeenCalled();
  });
});
