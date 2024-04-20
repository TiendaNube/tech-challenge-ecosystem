import express from "express";
import { transactionsController } from "../controller/transaction_controllers";

const transactionsRouter = express.Router();

transactionsRouter.post("/", transactionsController.newTransaction);

export default transactionsRouter;
