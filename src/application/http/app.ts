import express from "express";
import bodyParser from "body-parser";
import transactionsRouter from "./routes/transaction_routes";
import { requestErrorHandler } from "./middlewares/errors_handler";

const expressApp = express();

// middlewares before routers
expressApp.use(bodyParser.json());

// routers
expressApp.use("/transactions", transactionsRouter);

// middlewares after routers
expressApp.use(requestErrorHandler);

export default expressApp;
