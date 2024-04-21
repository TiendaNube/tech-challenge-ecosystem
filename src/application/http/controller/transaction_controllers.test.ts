import request from "supertest";
import { expressApp, startServer } from "../app";
import { loadDependencyInjection } from "../../../../dependency_injection";
import { ProcessTransactionService } from "../../../domain/services/command/process_transaction_service";
import { ValidationError } from "../../../domain/errors/validation_error";
import { DatabaseError } from "../../../domain/errors/database_error";
import { InternalApplicationError } from "../../../domain/errors/internal_application_error";
import { FetchTotalPayablesByPeriodService } from "../../../domain/services/query/fetch_total_payables_by_period_service";
import { PayableTotalSummaryType } from "../../../domain/entities/payable";

beforeEach(() => {
  loadDependencyInjection();
});

describe("newTransaction", () => {
  it("should return status code 400 when data validation fails", async () => {
    jest
      .spyOn(ProcessTransactionService.prototype, "process")
      .mockRejectedValue(new ValidationError("validation error"));

    const res = await request(expressApp()).post("/v1/transactions").send();

    expect(res.statusCode).toBe(400);
    expect(res.body.errorType).toBe(ValidationError.name);
  });

  it("should return status code 500 when database operation fails", async () => {
    jest
      .spyOn(ProcessTransactionService.prototype, "process")
      .mockRejectedValue(new DatabaseError("database error"));

    const res = await request(expressApp()).post("/v1/transactions").send();

    expect(res.statusCode).toBe(500);
    expect(res.body.errorType).toBe(DatabaseError.name);
    expect(res.body.message).toBe("database error");
  });

  it("should return status code 500 and custom message when unexpected error occurs", async () => {
    jest
      .spyOn(ProcessTransactionService.prototype, "process")
      .mockRejectedValue(new Error("unexpected error"));

    const res = await request(expressApp()).post("/v1/transactions").send();

    expect(res.statusCode).toBe(500);
    expect(res.body.errorType).toBe(InternalApplicationError.name);
    expect(res.body.message).toBe(
      "unexpected error occurred, please try again later."
    );
  });

  it("should return status code 201 when transaction saved successfully", async () => {
    jest
      .spyOn(ProcessTransactionService.prototype, "process")
      .mockResolvedValue();

    const res = await request(expressApp()).post("/v1/transactions").send();

    expect(res.statusCode).toBe(201);
  });
});

describe("payablesSummaryByPeriod", () => {
  it("should return status code 400 when merchant id is invalid", async () => {
    const res = await request(expressApp())
      .get("/v1/transactions/payables/total?merchantId=a")
      .send();

    expect(res.statusCode).toBe(400);
    expect(res.body.errorType).toBe(ValidationError.name);
    expect(res.body.message).toBe("merchant id should be a number");
  });

  it("should return status code 400 when startDate is invalid", async () => {
    const res = await request(expressApp())
      .get(
        "/v1/transactions/payables/total?merchantId=1&startDate=2024-14-01&endDate=2024-04-30"
      )
      .send();

    expect(res.statusCode).toBe(400);
    expect(res.body.errorType).toBe(ValidationError.name);
    expect(res.body.message).toBe(
      "invalid date format for startDate, use the pattern: YYYY-MM-DD"
    );
  });

  it("should return status code 400 when endDate is invalid", async () => {
    const res = await request(expressApp())
      .get(
        "/v1/transactions/payables/total?merchantId=1&startDate=2024-01-01&endDate=2024-04-32"
      )
      .send();

    expect(res.statusCode).toBe(400);
    expect(res.body.errorType).toBe(ValidationError.name);
    expect(res.body.message).toBe(
      "invalid date format for endDate, use the pattern: YYYY-MM-DD"
    );
  });

  it("should return status code 400 when endDate is earlier than startDate", async () => {
    const res = await request(expressApp())
      .get(
        "/v1/transactions/payables/total?merchantId=1&startDate=2024-04-20&endDate=2024-04-19"
      )
      .send();

    expect(res.statusCode).toBe(400);
    expect(res.body.errorType).toBe(ValidationError.name);
    expect(res.body.message).toBe("startDate must be earlier than endDate");
  });

  it("should return status code 500 when database operation fails", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodService.prototype, "fetch")
      .mockRejectedValue(new DatabaseError("database error"));

    const res = await request(expressApp())
      .get(
        "/v1/transactions/payables/total?merchantId=1&startDate=2024-04-01&endDate=2024-04-19"
      )
      .send();

    expect(res.statusCode).toBe(500);
    expect(res.body.errorType).toBe(DatabaseError.name);
    expect(res.body.message).toBe("database error");
  });

  it("should return status code 500 and custom message when unexpected error occurs", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodService.prototype, "fetch")
      .mockRejectedValue(new Error("unexpected error"));

    const res = await request(expressApp())
      .get(
        "/v1/transactions/payables/total?merchantId=1&startDate=2024-04-01&endDate=2024-04-19"
      )
      .send();

    expect(res.statusCode).toBe(500);
    expect(res.body.errorType).toBe(InternalApplicationError.name);
    expect(res.body.message).toBe(
      "unexpected error occurred, please try again later."
    );
  });

  it("should return status code 200 and payable summary data when data fetched successfully", async () => {
    const responseData: PayableTotalSummaryType = {
      totalPaid: 10,
      totalPending: 100,
      totalDiscountPaid: 2,
    };

    jest
      .spyOn(FetchTotalPayablesByPeriodService.prototype, "fetch")
      .mockResolvedValue(responseData);

    const res = await request(expressApp())
      .get(
        "/v1/transactions/payables/total?merchantId=1&startDate=2024-04-01&endDate=2024-04-19"
      )
      .send();

    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify(responseData));
  });
});
