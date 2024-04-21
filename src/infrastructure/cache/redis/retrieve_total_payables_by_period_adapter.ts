import { createClient } from "redis";
import { PayableTotalSummaryType } from "../../../domain/entities/payable";
import { CacheError } from "../../../domain/errors/cache_error";
import { RetrieveTotalPayablesByPeriodPort } from "../../../domain/ports/outbound/cache/retrieve_total_payables_by_period_port";

export class RetrieveTotalPayablesByPeriodAdapter
  implements RetrieveTotalPayablesByPeriodPort
{
  async retrieve(key: string): Promise<PayableTotalSummaryType | null> {
    try {
      const client = await createClient().connect();
      const payableData = await client.get(key);
      await client.disconnect();

      if (payableData != null) {
        return JSON.parse(payableData);
      }
      return null;
    } catch (error: any) {
      throw new CacheError(`cache error: ${error.message}`);
    }
  }
}
