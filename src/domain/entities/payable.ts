import { PaymentFee } from "../enums/payment_fee";
import { PaymentMethod } from "../enums/payment_method";
import { PaymentStatus } from "../enums/payment_status";
import { ValidationError } from "../errors/validation_error";
import { DateUtils } from "../utils/date";

export type NewPayableType = {
  transactionId?: number;
  merchantId: number;
  paymentMethod: PaymentMethod;
  subtotal: number;
};

export type PayableType = {
  transactionId: number;
  merchantId: number;
  status: PaymentStatus;
  subtotal: number;
  discount: number;
  total: number;
  createDate: Date;
};

export type PayableTotalSummaryType = {
  totalPaid: number;
  totalPending: number;
  totalDiscountPaid: number;
};

export class Payable {
  private _id: number | undefined;
  private _transactionId: number | undefined = -1;
  private _merchantId: number = -1;
  private _status: PaymentStatus = PaymentStatus.PAID;
  private _subtotal: number = 0;
  private _discount: number = 0;
  private _total: number = 0;
  private _createDate: Date = new Date(Date.now());

  constructor(payableData: NewPayableType) {
    this.transactionId = payableData.transactionId;
    this.merchantId = payableData.merchantId;
    this.subtotal = payableData.subtotal;
    this.setStateByPaymentMethod(payableData.paymentMethod);
    this.setTotal();
  }

  dataValues(): PayableType {
    return {
      transactionId: this.transactionId as number,
      merchantId: this.merchantId,
      status: this.status,
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total,
      createDate: this.createDate,
    };
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get transactionId() {
    return this._transactionId;
  }

  set transactionId(transactionId) {
    if (transactionId != undefined && transactionId <= 0) {
      throw new ValidationError("transaction id should be greater than 0");
    }
    this._transactionId = transactionId;
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

  get subtotal() {
    return this._subtotal;
  }

  set subtotal(subtotal) {
    if (subtotal <= 0) {
      throw new ValidationError("subtotal should be greater than 0");
    }
    this._subtotal = subtotal;
  }

  get total() {
    return this._total;
  }

  get status() {
    return this._status;
  }

  get discount() {
    return this._discount;
  }

  get createDate() {
    return this._createDate;
  }

  private setTotal() {
    this._total = this.subtotal - this.discount;
  }

  /**
   * Fill the status, discount and createDate properties based on the payment method.
   * Discount is calculated based on the fee for the corresponding card used for payment.
   * In case an invalid payment method is provided then an error is thrown.
   * @param paymentMethod debit_card or credit_card
   */
  private setStateByPaymentMethod(paymentMethod: PaymentMethod) {
    switch (paymentMethod) {
      case PaymentMethod.DEBIT_CARD:
        this._status = PaymentStatus.PAID;
        this._discount = this.subtotal * (PaymentFee.DEBIT_CARD / 100);
        this._createDate = new Date(Date.now());
        break;
      case PaymentMethod.CREDIT_CARD:
        this._status = PaymentStatus.WAITING_FUNDS;
        this._discount = this.subtotal * (PaymentFee.CREDIT_CARD / 100);
        this._createDate = DateUtils.addDays(new Date(Date.now()), 30);
        break;
      default:
        throw new ValidationError("wrong payment method");
    }
  }
}
