import { FetchTotalPayablesByPeriodAdapter } from "../../../infrastructure/database/postgresql/query/fetch_total_payables_by_period_adapter";
import { PayableTotalSummaryType } from "../../entities/payable";
import { DatabaseError } from "../../errors/database_error";
import { FetchTotalPayablesByPeriodService } from "./fetch_total_payables_by_period_service";

const merchantId = 1;
const startDate = new Date(2024, 1, 1);
const endDate = new Date(2024, 2, 1);
const validPayableSummary: PayableTotalSummaryType = {
  totalPaid: 10,
  totalDiscountPaid: 2,
  totalPending: 100,
};

describe("FetchTotalPayablesByPeriodService.fetch", () => {
  it("should throw DatabaseError when no merchant id was found in database", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodAdapter.prototype, "fetch")
      .mockRejectedValue(new DatabaseError("no merchant found"));

    const fetchTotalPayablesByPeriodAdapter =
      new FetchTotalPayablesByPeriodAdapter();
    const service = new FetchTotalPayablesByPeriodService(
      fetchTotalPayablesByPeriodAdapter
    );

    expect(async () => {
      await service.fetch(merchantId, startDate, endDate);
    }).rejects.toThrow(DatabaseError);
  });

  it("should throw DatabaseError when other database error occurs", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodAdapter.prototype, "fetch")
      .mockRejectedValue(new Error("generic error"));

    const fetchTotalPayablesByPeriodAdapter =
      new FetchTotalPayablesByPeriodAdapter();
    const service = new FetchTotalPayablesByPeriodService(
      fetchTotalPayablesByPeriodAdapter
    );

    expect(async () => {
      await service.fetch(merchantId, startDate, endDate);
    }).rejects.toThrow("database error: generic error");
  });

  it("should return payable summary data when input data is valid", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodAdapter.prototype, "fetch")
      .mockResolvedValue(validPayableSummary);

    const fetchTotalPayablesByPeriodAdapter =
      new FetchTotalPayablesByPeriodAdapter();
    const service = new FetchTotalPayablesByPeriodService(
      fetchTotalPayablesByPeriodAdapter
    );

    const payableData = await service.fetch(merchantId, startDate, endDate);

    expect(payableData).toBe(validPayableSummary);
  });
});
