import request from "supertest";
import expressApp from "../app";
import { loadDependencyInjection } from "../../../../dependency_injection";
import { ProcessTransactionService } from "../../../domain/services/command/process_transaction_service";
import { ValidationError } from "../../../domain/errors/validation_error";
import { DatabaseError } from "../../../domain/errors/database_error";
import { InternalApplicationError } from "../../../domain/errors/internal_application_error";

beforeEach(() => {
  loadDependencyInjection();
});

describe("newTransaction", () => {
  it("should return status code 400 when data validation fails", async () => {
    jest
      .spyOn(ProcessTransactionService.prototype, "process")
      .mockRejectedValue(new ValidationError("validation error"));

    const res = await request(expressApp).post("/transactions").send();

    expect(res.statusCode).toBe(400);
    expect(res.body.errorType).toBe(ValidationError.name);
  });

  it("should return status code 500 when database operation fails", async () => {
    jest
      .spyOn(ProcessTransactionService.prototype, "process")
      .mockRejectedValue(new DatabaseError("database error"));

    const res = await request(expressApp).post("/transactions").send();

    expect(res.statusCode).toBe(500);
    expect(res.body.errorType).toBe(DatabaseError.name);
  });

  it("should return status code 500 and custom message when unexpected error occurs", async () => {
    jest
      .spyOn(ProcessTransactionService.prototype, "process")
      .mockRejectedValue(new Error("unexpected error"));

    const res = await request(expressApp).post("/transactions").send();

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

    const res = await request(expressApp).post("/transactions").send();

    expect(res.statusCode).toBe(201);
  });
});
