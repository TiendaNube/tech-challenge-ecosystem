import { Request, Response, NextFunction } from "express";
import { getDependency } from "../../../../dependency_injection";
import { ProcessTransactionService } from "../../../domain/services/command/process_transaction_service";
import {
  buildPayableData,
  buildTransactionData,
} from "../builders/transaction_builders";
import { FetchTotalPayablesByPeriodService } from "../../../domain/services/query/fetch_total_payables_by_period_service";
import { PayableTotalSummaryType } from "../../../domain/entities/payable";
import { PayableSummaryByPeriodRequest } from "../requests/payable_summary_by_period_request";

export const transactionsController = {
  async newTransaction(req: Request, res: Response, next: NextFunction) {
    const transactionData = buildTransactionData(req.body);
    const payableData = buildPayableData(req.body, transactionData);

    const service: ProcessTransactionService = getDependency(
      ProcessTransactionService
    );

    try {
      await service.process(transactionData, payableData);
      res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  },

  async payablesSummaryByPeriod(req: any, res: Response, next: NextFunction) {
    const service: FetchTotalPayablesByPeriodService = getDependency(
      FetchTotalPayablesByPeriodService
    );

    try {
      const requestData = req.requestData;
      const cacheKey = req.cacheKey;

      const response: PayableTotalSummaryType = await service.fetch(
        requestData.merchantId,
        requestData.startDate,
        requestData.endDate,
        cacheKey
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  },
};
