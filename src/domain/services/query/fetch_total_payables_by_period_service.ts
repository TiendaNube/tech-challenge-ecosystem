import { SaveTotalPayablesByPeriodAdapter } from "../../../infrastructure/cache/redis/save_total_payables_by_period_adapter";
import { PayableTotalSummaryType } from "../../entities/payable";
import { CacheError } from "../../errors/cache_error";
import { DatabaseError } from "../../errors/database_error";
import { InternalApplicationError } from "../../errors/internal_application_error";
import { FetchTotalPayablesByPeriodUsecase } from "../../ports/inbound/query/fetch_total_payables_by_period_usecase";
import { FetchTotalPayablesByPeriodPort } from "../../ports/outbound/database/fetch_total_payables_by_period_port";

export class FetchTotalPayablesByPeriodService
  implements FetchTotalPayablesByPeriodUsecase
{
  _fetchTotalPayablesByPeriodPort: FetchTotalPayablesByPeriodPort;
  _saveTotalPayablesByPeriodAdapter: SaveTotalPayablesByPeriodAdapter;

  constructor(
    fetchTotalPayablesByPeriodPort: FetchTotalPayablesByPeriodPort,
    saveTotalPayablesByPeriodAdapter: SaveTotalPayablesByPeriodAdapter
  ) {
    this._fetchTotalPayablesByPeriodPort = fetchTotalPayablesByPeriodPort;
    this._saveTotalPayablesByPeriodAdapter = saveTotalPayablesByPeriodAdapter;
  }

  async fetch(
    merchantId: number,
    startDate: Date,
    endDate: Date
  ): Promise<PayableTotalSummaryType> {
    endDate.setUTCHours(23, 59, 59, 999);

    try {
      const payables: PayableTotalSummaryType =
        await this._fetchTotalPayablesByPeriodPort.fetch(
          merchantId,
          startDate,
          endDate
        );

      const cacheKey = `${merchantId}:${startDate.getTime()}:${endDate.getTime()}`;
      await this._saveTotalPayablesByPeriodAdapter.save(cacheKey, payables);

      return payables;
    } catch (e: any) {
      if (e instanceof DatabaseError || e instanceof CacheError) {
        throw e;
      }
      throw new InternalApplicationError(e.message);
    }
  }
}
