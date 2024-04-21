import { Response, NextFunction } from "express";
import { getDependency } from "../../../../dependency_injection";
import { RetrieveTotalPayablesByPeriodAdapter } from "../../../infrastructure/cache/redis/retrieve_total_payables_by_period_adapter";
import { PayableSummaryByPeriodRequest } from "../requests/payable_summary_by_period_request";

export function createPayableSummaryByPeriodRequestData(
  req: any,
  res: Response,
  next: NextFunction
) {
  const merchandId = Number(req.query.merchantId);
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  const requestData: any = new PayableSummaryByPeriodRequest(
    merchandId,
    startDate,
    endDate
  );

  req.requestData = requestData;
  next();
}

export async function payablesTotalSummaryByPeriodCached(
  req: any,
  res: Response,
  next: NextFunction
) {
  const requestData: PayableSummaryByPeriodRequest = req.requestData;
  const startDateAsString = req.query.startDate as string;
  const endDateAsString = req.query.endDate as string;

  const cacheDataRetriever: RetrieveTotalPayablesByPeriodAdapter =
    getDependency(RetrieveTotalPayablesByPeriodAdapter);

  req.cacheKey = `${requestData.merchantId}:${startDateAsString}:${endDateAsString}`;

  const cacheData = await cacheDataRetriever.retrieve(req.cacheKey);

  if (cacheData != null) {
    return res.json(cacheData);
  }

  next();
}
