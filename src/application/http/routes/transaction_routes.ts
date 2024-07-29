import express from "express";
import { transactionsController } from "../controller/transaction_controllers";
import {
  createPayableSummaryByPeriodRequestData,
  payablesTotalSummaryByPeriodCached,
} from "../middlewares/payables_middlewares";

const transactionsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Create a new transaction with a payable to store the amounts and payment date
 * /v1/transactions:
 *   post:
 *     summary: Create a new transaction with a payable to store the amounts and payment date
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchantId:
 *                 type: number
 *               description:
 *                 type: string
 *               cardExpirationDate:
 *                 type: string
 *               cardHolder:
 *                 type: string
 *               cardNumber:
 *                 type: string
 *               cardCVV:
 *                 type: string
 *               paymentMethod:
 *                 enum: [debit_card, credit_card]
 *               subtotal:
 *                 type: number
 *
 *     responses:
 *       201:
 *         description: Transaction created.
 *       400:
 *         description: Request invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorType:
 *                   type: string
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: number
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorType:
 *                   type: string
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: number
 *
 */
transactionsRouter.post("/", transactionsController.newTransaction);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Total of Payables by merchant and time range
 * /v1/transactions/payables/total:
 *   get:
 *     summary: Total of Payables by merchant and time range
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: merchantId
 *         schema:
 *           type: number
 *         required: true
 *         description: merchant id
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         required: true
 *         description: start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         required: true
 *         description: end date
 *     responses:
 *       200:
 *         description: The total of payables.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPaid:
 *                   type: number
 *                 totalPending:
 *                   type: number
 *                 totalDiscountPaid:
 *                   type: number
 *       400:
 *         description: Request invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorType:
 *                   type: string
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: number
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorType:
 *                   type: string
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: number
 *
 */
transactionsRouter.get(
  "/payables/total",
  createPayableSummaryByPeriodRequestData,
  payablesTotalSummaryByPeriodCached,
  transactionsController.payablesSummaryByPeriod
);

export default transactionsRouter;
