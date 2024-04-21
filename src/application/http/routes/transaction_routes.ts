import express from "express";
import { transactionsController } from "../controller/transaction_controllers";
import {
  createPayableSummaryByPeriodRequestData,
  payablesTotalSummaryByPeriodCached,
} from "../middlewares/payables_middlewares";

const transactionsRouter = express.Router();

transactionsRouter.post("/", transactionsController.newTransaction);

transactionsRouter.get(
  "/:merchant_id",
  createPayableSummaryByPeriodRequestData,
  payablesTotalSummaryByPeriodCached,
  transactionsController.payablesSummaryByPeriod
);

export default transactionsRouter;
