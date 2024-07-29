import {
  getDependency,
  loadDependencyInjection,
} from "../../../../dependency_injection";
import { SaveTotalPayablesByPeriodAdapter } from "../../../infrastructure/cache/redis/save_total_payables_by_period_adapter";
import { FetchTotalPayablesByPeriodAdapter } from "../../../infrastructure/database/postgresql/query/fetch_total_payables_by_period_adapter";
import { PayableTotalSummaryType } from "../../entities/payable";
import { CacheError } from "../../errors/cache_error";
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

beforeEach(() => {
  loadDependencyInjection();
  jest.spyOn(FetchTotalPayablesByPeriodAdapter.prototype, "fetch").mockReset();
  jest.spyOn(SaveTotalPayablesByPeriodAdapter.prototype, "save").mockReset();
});

describe("FetchTotalPayablesByPeriodService.fetch", () => {
  it("should throw DatabaseError when no merchant id was found in database", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodAdapter.prototype, "fetch")
      .mockRejectedValue(new DatabaseError("no merchant found"));

    const service = getDependency(FetchTotalPayablesByPeriodService);

    expect(async () => {
      await service.fetch(merchantId, startDate, endDate);
    }).rejects.toThrow(DatabaseError);
  });

  it("should throw DatabaseError when other database error occurs", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodAdapter.prototype, "fetch")
      .mockRejectedValue(new DatabaseError("generic error"));

    const service = getDependency(FetchTotalPayablesByPeriodService);

    expect(async () => {
      await service.fetch(merchantId, startDate, endDate);
    }).rejects.toThrow("generic error");
  });

  it("should throw CacheError when cache error occurs", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodAdapter.prototype, "fetch")
      .mockResolvedValue(validPayableSummary);
    jest
      .spyOn(SaveTotalPayablesByPeriodAdapter.prototype, "save")
      .mockRejectedValue(new CacheError("generic error"));

    const service = getDependency(FetchTotalPayablesByPeriodService);

    expect(async () => {
      await service.fetch(merchantId, startDate, endDate);
    }).rejects.toThrow("generic error");
  });

  it("should return payable summary data when input data is valid", async () => {
    jest
      .spyOn(FetchTotalPayablesByPeriodAdapter.prototype, "fetch")
      .mockResolvedValue(validPayableSummary);
    jest
      .spyOn(SaveTotalPayablesByPeriodAdapter.prototype, "save")
      .mockResolvedValue();

    const service = getDependency(FetchTotalPayablesByPeriodService);

    const payableData = await service.fetch(merchantId, startDate, endDate);

    expect(payableData).toBe(validPayableSummary);
    expect(
      FetchTotalPayablesByPeriodAdapter.prototype.fetch
    ).toHaveBeenCalledTimes(1);
    expect(
      SaveTotalPayablesByPeriodAdapter.prototype.save
    ).toHaveBeenCalledTimes(1);
  });
});
