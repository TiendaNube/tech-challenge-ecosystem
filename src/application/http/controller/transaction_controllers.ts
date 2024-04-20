import { Request, Response, NextFunction } from "express";
import { getDependency } from "../../../../dependency_injection";
import { ProcessTransactionService } from "../../../domain/services/command/process_transaction_service";
import {
  buildPayableData,
  buildTransactionData,
} from "../builders/transaction_builders";

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
};
