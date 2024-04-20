import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import transactionsRouter from "./src/application/http/routes/transaction_routes";
import { requestErrorHandler } from "./src/application/http/middlewares/errors_handler";
import { loadDependencyInjection } from "./dependency_injection";
import { TransactionModel } from "./src/infrastructure/database/postgresql/repository/transactions";
import { PayableModel } from "./src/infrastructure/database/postgresql/repository/payables";

// loading environment variables
dotenv.config();

// loading ORM mapping
TransactionModel.load();
PayableModel.load();

const app = express();

// middlewares before routers
app.use(bodyParser.json());

// routers
app.use("/transactions", transactionsRouter);

// middlewares after routers
app.use(requestErrorHandler);

// loading dependency injection
loadDependencyInjection();

app.listen(process.env.PORT);
