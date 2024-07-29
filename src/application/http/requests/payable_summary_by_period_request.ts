import { ValidationError } from "../../../domain/errors/validation_error";

export class PayableSummaryByPeriodRequest {
  _merchantId: number;
  _startDate: Date;
  _endDate: Date;
  _patternData = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

  constructor(merchantId: number, startDate: string, endDate: string) {
    this.validateMerchantId(merchantId);
    this.validateDate("startDate", startDate);
    this.validateDate("endDate", endDate);
    this._merchantId = merchantId;
    this._startDate = new Date(Date.parse(startDate));
    this._endDate = new Date(Date.parse(endDate));
    this.validateDatePeriod(this._startDate, this.endDate);
  }

  get merchantId() {
    return this._merchantId;
  }

  get startDate() {
    return this._startDate;
  }

  get endDate() {
    return this._endDate;
  }

  private validateMerchantId(merchantId: number) {
    if (Number.isNaN(merchantId)) {
      throw new ValidationError("merchant id should be a number");
    }
  }

  private validateDate(fieldName: string, date: string) {
    if (!this._patternData.test(date)) {
      throw new ValidationError(
        `invalid date format for ${fieldName}, use the pattern: YYYY-MM-DD`
      );
    }
  }

  private validateDatePeriod(startDate: Date, endDate: Date) {
    if (startDate > endDate) {
      throw new ValidationError("startDate must be earlier than endDate");
    }
  }
}
