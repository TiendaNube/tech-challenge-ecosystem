import { PaymentFee } from "../enums/payment_fee";
import { PaymentMethod } from "../enums/payment_method";
import { PaymentStatus } from "../enums/payment_status";
import { DateUtils } from "../utils/date";
import { Payable } from "./payable";

const defaultValues = {
  transactionId: 1,
  merchantId: 1,
  paymentMethod: PaymentMethod.DEBIT_CARD,
  subtotal: 100,
};

describe("Transaction.transactionId", () => {
  it("should throw ValidationError when value is 0", () => {
    expect(() => {
      const values = { ...defaultValues, transactionId: 0 };
      new Payable(values);
    }).toThrow("transaction id should be greater than 0");
  });

  it("should throw ValidationError when value is negative", () => {
    expect(() => {
      const values = { ...defaultValues, transactionId: -1 };
      new Payable(values);
    }).toThrow("transaction id should be greater than 0");
  });
});

describe("Transaction.merchantId", () => {
  it("should throw ValidationError when value is 0", () => {
    expect(() => {
      const values = { ...defaultValues, merchantId: 0 };
      new Payable(values);
    }).toThrow("merchant id should be greater than 0");
  });

  it("should throw ValidationError when value is negative", () => {
    expect(() => {
      const values = { ...defaultValues, merchantId: -1 };
      new Payable(values);
    }).toThrow("merchant id should be greater than 0");
  });
});

describe("Transaction.subtotal", () => {
  it("should throw ValidationError when value is 0", () => {
    expect(() => {
      const values = { ...defaultValues, subtotal: 0 };
      new Payable(values);
    }).toThrow("subtotal should be greater than 0");
  });

  it("should throw ValidationError when value is negative", () => {
    expect(() => {
      const values = { ...defaultValues, subtotal: -1 };
      new Payable(values);
    }).toThrow("subtotal should be greater than 0");
  });
});

describe("Transaction.status", () => {
  it("should throw ValidationError when payment method not valid", () => {
    expect(() => {
      const values = {
        ...defaultValues,
        paymentMethod: "mock" as PaymentMethod,
      };
      new Payable(values);
    }).toThrow("wrong payment method");
  });

  it("should return 'paid' when payment method is 'debit_card'", () => {
    const values = {
      ...defaultValues,
      paymentMethod: PaymentMethod.DEBIT_CARD,
    };
    const payable = new Payable(values);

    expect(payable.status).toBe(PaymentStatus.PAID);
  });

  it("should return 'waiting_funds' when payment method is 'credit_card'", () => {
    const values = {
      ...defaultValues,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    };
    const payable = new Payable(values);

    expect(payable.status).toBe(PaymentStatus.WAITING_FUNDS);
  });
});

describe("Transaction.discount", () => {
  it("should throw ValidationError when payment method not valid", () => {
    expect(() => {
      const values = {
        ...defaultValues,
        paymentMethod: "mock" as PaymentMethod,
      };
      new Payable(values);
    }).toThrow("wrong payment method");
  });

  it("should return 2 when payment method is 'debit_card'", () => {
    const values = {
      ...defaultValues,
      paymentMethod: PaymentMethod.DEBIT_CARD,
    };
    const payable = new Payable(values);

    expect(payable.discount).toBe(PaymentFee.DEBIT_CARD);
  });

  it("should return 4 when payment method is 'credit_card'", () => {
    const values = {
      ...defaultValues,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    };
    const payable = new Payable(values);

    expect(payable.discount).toBe(PaymentFee.CREDIT_CARD);
  });
});

describe("Transaction.createDate", () => {
  it("should throw ValidationError when payment method not valid", () => {
    expect(() => {
      const values = {
        ...defaultValues,
        paymentMethod: "mock" as PaymentMethod,
      };
      new Payable(values);
    }).toThrow("wrong payment method");
  });

  it("should return current date when payment method is 'debit_card'", () => {
    const dateMock = new Date(2024, 1, 1);
    jest.spyOn(Date, "now").mockReturnValue(dateMock.getTime());
    jest.spyOn(DateUtils, "addDays").mockReturnValue(new Date());

    const values = {
      ...defaultValues,
      paymentMethod: PaymentMethod.DEBIT_CARD,
    };
    const payable = new Payable(values);

    expect(payable.createDate.getTime()).toBe(dateMock.getTime());
    expect(DateUtils.addDays).toHaveBeenCalledTimes(0);
  });

  it("should return current date plus 30 days when payment method is 'credit_card'", () => {
    const dateMock = new Date(2024, 1, 1);
    jest.spyOn(DateUtils, "addDays").mockReturnValue(dateMock);

    const values = {
      ...defaultValues,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    };
    const payable = new Payable(values);

    expect(payable.createDate.getDate()).toBe(dateMock.getDate());
    expect(DateUtils.addDays).toHaveBeenCalledTimes(1);
  });
});

describe("Transaction.total", () => {
  it("should return subtotal minus fee amount", () => {
    const payable = new Payable(defaultValues);
    const expectedValue =
      defaultValues.subtotal -
      defaultValues.subtotal * (PaymentFee.DEBIT_CARD / 100);

    expect(payable.total).toBe(expectedValue);
  });
});
