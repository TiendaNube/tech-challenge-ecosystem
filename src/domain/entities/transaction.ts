import { PaymentMethod } from "../enums/payment_method";
import { ValidationError } from "../errors/validation_error";

type TransactionType = {
  id?: number;
  merchantId: number;
  description: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardHolder: string;
  cardExpirationDate: string;
  cardCVV: string;
};

export class Transaction {
  private _id: number | undefined;
  private _merchantId: number = -1;
  private _description: string = "";
  private _paymentMethod: PaymentMethod = PaymentMethod.DEBIT_CARD;
  private _cardNumber: string = "";
  private _cardHolder: string = "";
  private _cardExpirationDate: string = "";
  private _cardCVV: string = "";

  constructor(transactionData: TransactionType) {
    this.id = transactionData.id;
    this.merchantId = transactionData.merchantId;
    this.description = transactionData.description;
    this.paymentMethod = transactionData.paymentMethod;
    this.cardNumber = transactionData.cardNumber;
    this.cardHolder = transactionData.cardHolder;
    this.cardExpirationDate = transactionData.cardExpirationDate;
    this.cardCVV = transactionData.cardCVV;
  }

  dataValues(): TransactionType {
    return {
      id: this.id,
      merchantId: this.merchantId,
      description: this.description,
      paymentMethod: this.paymentMethod,
      cardNumber: this.cardNumber,
      cardHolder: this.cardHolder,
      cardExpirationDate: this.cardExpirationDate,
      cardCVV: this.cardCVV,
    };
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get merchantId() {
    return this._merchantId;
  }

  set merchantId(merchantId) {
    if (merchantId <= 0) {
      throw new ValidationError("merchant id should be greater than 0");
    }
    this._merchantId = merchantId;
  }

  get description() {
    return this._description;
  }

  set description(description) {
    if (description.length == 0) {
      throw new ValidationError("description should not be empty");
    }
    this._description = description;
  }

  get paymentMethod() {
    return this._paymentMethod;
  }

  set paymentMethod(paymentMethod) {
    this._paymentMethod = paymentMethod;
  }

  get cardNumber() {
    return this._cardNumber;
  }

  set cardNumber(cardNumber) {
    if (cardNumber.length !== 4) {
      throw new ValidationError("card number should have 4 digits");
    }
    this._cardNumber = cardNumber;
  }

  get cardHolder() {
    return this._cardHolder;
  }

  set cardHolder(cardHolder) {
    if (cardHolder.length == 0) {
      throw new ValidationError("card holder should not be empty");
    }
    this._cardHolder = cardHolder;
  }

  get cardExpirationDate() {
    return this._cardExpirationDate;
  }

  set cardExpirationDate(cardExpirationDate) {
    const dateRegex = /^[0-9]{2}\/[0-9]{4}$/;
    if (!dateRegex.test(cardExpirationDate)) {
      throw new ValidationError(
        "card expiration date should have the format: MM/YYYY"
      );
    }

    this._cardExpirationDate = cardExpirationDate;
  }

  get cardCVV() {
    return this._cardCVV;
  }

  set cardCVV(cardCVV) {
    if (cardCVV.length !== 3) {
      throw new ValidationError("card cvv should have 3 digits");
    }
    this._cardCVV = cardCVV;
  }
}
