import express from "express";
import { transactionsController } from "../controller/transaction_controllers";

const transactionsRouter = express.Router();

transactionsRouter.post("/", transactionsController.newTransaction);

transactionsRouter.get(
  "/:merchant_id",
  transactionsController.payablesSummaryByPeriod
);

export default transactionsRouter;
