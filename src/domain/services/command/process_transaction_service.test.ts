import { CreateNewTransactionAdapter } from "../../../infrastructure/database/postgresql/command/create_new_transaction_adapter";
import { PaymentMethod } from "../../enums/payment_method";
import { DatabaseError } from "../../errors/database_error";
import { ValidationError } from "../../errors/validation_error";
import { ProcessTransactionService } from "./process_transaction_service";

const transactionData = {
  merchantId: 1,
  description: "teste",
  cardExpirationDate: "11/2222",
  cardHolder: "Jeff",
  cardNumber: "4000",
  cardCVV: "123",
  paymentMethod: PaymentMethod.CREDIT_CARD,
};

const payableData = {
  transactionId: 1,
  merchantId: 1,
  paymentMethod: PaymentMethod.DEBIT_CARD,
  subtotal: 100,
};

describe("ProcessTransactionService.process", () => {
  it("should throw ValidationError when failed to create transaction instance", async () => {
    jest
      .spyOn(CreateNewTransactionAdapter.prototype, "create")
      .mockResolvedValue();

    const createNewTransactionAdapter = new CreateNewTransactionAdapter();
    const service = new ProcessTransactionService(createNewTransactionAdapter);

    expect(async () => {
      const transactionDataInvalid = { ...transactionData, description: "" };
      await service.process(transactionDataInvalid, payableData);
    }).rejects.toThrow(ValidationError);
  });

  it("should throw ValidationError when failed to create payable instance", async () => {
    jest
      .spyOn(CreateNewTransactionAdapter.prototype, "create")
      .mockResolvedValue();

    const createNewTransactionAdapter = new CreateNewTransactionAdapter();
    const service = new ProcessTransactionService(createNewTransactionAdapter);

    expect(async () => {
      const payableDataInvalid = { ...payableData, subtotal: 0 };
      await service.process(transactionData, payableDataInvalid);
    }).rejects.toThrow(ValidationError);
  });

  it("should throw DatabaseError when failed to call database", async () => {
    jest
      .spyOn(CreateNewTransactionAdapter.prototype, "create")
      .mockRejectedValue(new Error("error"));

    const createNewTransactionAdapter = new CreateNewTransactionAdapter();
    const service = new ProcessTransactionService(createNewTransactionAdapter);

    expect(async () => {
      await service.process(transactionData, payableData);
    }).rejects.toThrow(DatabaseError);
    expect(CreateNewTransactionAdapter.prototype.create).toHaveBeenCalled();
  });

  it("should save on database when calling database successfully", async () => {
    jest
      .spyOn(CreateNewTransactionAdapter.prototype, "create")
      .mockResolvedValue();

    const createNewTransactionAdapter = new CreateNewTransactionAdapter();
    const service = new ProcessTransactionService(createNewTransactionAdapter);

    await service.process(transactionData, payableData);

    expect(CreateNewTransactionAdapter.prototype.create).toHaveBeenCalled();
  });
});
