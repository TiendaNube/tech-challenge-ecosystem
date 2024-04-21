import { PayableTotalSummaryType } from "../../entities/payable";
import { DatabaseError } from "../../errors/database_error";
import { FetchTotalPayablesByPeriodUsecase } from "../../ports/inbound/query/fetch_total_payables_by_period_usecase";
import { FetchTotalPayablesByPeriodPort } from "../../ports/outbound/database/fetch_total_payables_by_period_port";
import { DateUtils } from "../../utils/date";

export class FetchTotalPayablesByPeriodService
  implements FetchTotalPayablesByPeriodUsecase
{
  _fetchTotalPayablesByPeriodPort: FetchTotalPayablesByPeriodPort;

  constructor(fetchTotalPayablesByPeriodPort: FetchTotalPayablesByPeriodPort) {
    this._fetchTotalPayablesByPeriodPort = fetchTotalPayablesByPeriodPort;
  }

  async fetch(
    merchantId: number,
    startDate: Date,
    endDate: Date
  ): Promise<PayableTotalSummaryType> {
    endDate.setUTCHours(23, 59, 59, 999);

    try {
      return await this._fetchTotalPayablesByPeriodPort.fetch(
        merchantId,
        startDate,
        endDate
      );
    } catch (e: any) {
      if (e instanceof DatabaseError) {
        throw e;
      }
      throw new DatabaseError(`database error: ${e.message}`);
    }
  }
}
