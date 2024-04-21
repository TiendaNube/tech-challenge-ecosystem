import { createClient } from "redis";
import { SaveTotalPayablesByPeriodPort } from "../../../domain/ports/outbound/cache/save_total_payables_by_period_port";
import { PayableTotalSummaryType } from "../../../domain/entities/payable";
import { CacheError } from "../../../domain/errors/cache_error";

export class SaveTotalPayablesByPeriodAdapter
  implements SaveTotalPayablesByPeriodPort
{
  async save(key: string, data: PayableTotalSummaryType): Promise<void> {
    try {
      const client = await createClient().connect();
      await client.set(key, JSON.stringify(data), {
        EX: Number(process.env.CACHE_DEFAULT_TTL),
      });
      await client.disconnect();
    } catch (error: any) {
      throw new CacheError(`cache error: ${error.message}`);
    }
  }
}
