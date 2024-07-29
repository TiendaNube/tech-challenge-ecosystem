import { PaymentMethod } from "../enums/payment_method";
import { Transaction } from "./transaction";

const defaultValues = {
  merchantId: 1,
  description: "mock description",
  cardExpirationDate: "11/2024",
  cardHolder: "Jeff",
  cardNumber: "1234",
  cardCVV: "123",
  paymentMethod: PaymentMethod.CREDIT_CARD,
};

describe("Transaction.merchantId", () => {
  it("should throw ValidationError when value is 0", () => {
    expect(() => {
      const values = { ...defaultValues, merchantId: 0 };
      new Transaction(values);
    }).toThrow("merchant id should be greater than 0");
  });

  it("should throw ValidationError when value is negative", () => {
    expect(() => {
      const values = { ...defaultValues, merchantId: -1 };
      new Transaction(values);
    }).toThrow("merchant id should be greater than 0");
  });
});

describe("Transaction.description", () => {
  it("should throw ValidationError when value is empty", () => {
    expect(() => {
      const values = { ...defaultValues, description: "" };
      new Transaction(values);
    }).toThrow("description should not be empty");
  });
});

describe("Transaction.cardNumber", () => {
  it("should throw ValidationError when length is lower than 4", () => {
    expect(() => {
      const values = { ...defaultValues, cardNumber: "123" };
      new Transaction(values);
    }).toThrow("card number should have 4 digits");
  });

  it("should throw ValidationError when length is greater than 4", () => {
    expect(() => {
      const values = { ...defaultValues, cardNumber: "12345" };
      new Transaction(values);
    }).toThrow("card number should have 4 digits");
  });
});

describe("Transaction.cardHolder", () => {
  it("should throw ValidationError when value is empty", () => {
    expect(() => {
      const values = { ...defaultValues, cardHolder: "" };
      new Transaction(values);
    }).toThrow("card holder should not be empty");
  });
});

describe("Transaction.cardExpirationDate", () => {
  it("should throw ValidationError when value is not valid", () => {
    expect(() => {
      const values = { ...defaultValues, cardExpirationDate: "111/2024" };
      new Transaction(values);
    }).toThrow("card expiration date should have the format: MM/YYYY");
  });
});

describe("Transaction.cardCVV", () => {
  it("should throw ValidationError when length is lower than 3", () => {
    expect(() => {
      const values = { ...defaultValues, cardCVV: "12" };
      new Transaction(values);
    }).toThrow("card cvv should have 3 digits");
  });

  it("should throw ValidationError when length is greater than 3", () => {
    expect(() => {
      const values = { ...defaultValues, cardCVV: "1234" };
      new Transaction(values);
    }).toThrow("card cvv should have 3 digits");
  });
});

describe("Transaction", () => {
  it("should return correct values", () => {
    const transaction = new Transaction(defaultValues);

    expect(transaction.description).toBe(defaultValues.description);
    expect(transaction.paymentMethod).toBe(defaultValues.paymentMethod);
    expect(transaction.cardNumber).toBe(defaultValues.cardNumber);
    expect(transaction.cardHolder).toBe(defaultValues.cardHolder);
    expect(transaction.cardExpirationDate).toBe(
      defaultValues.cardExpirationDate
    );
    expect(transaction.cardCVV).toBe(defaultValues.cardCVV);
  });
});
