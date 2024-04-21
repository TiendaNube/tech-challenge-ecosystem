import express from "express";
import bodyParser from "body-parser";
import transactionsRouter from "./routes/transaction_routes";
import { requestErrorHandler } from "./middlewares/errors_handler";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const expressApp = express();

// middlewares before routers
expressApp.use(bodyParser.json());

// routers
expressApp.use("/v1/transactions", transactionsRouter);

// middlewares after routers
expressApp.use(requestErrorHandler);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Transactions service",
      version: "1.0.0",
      description: "Manage transactions and payments",
      license: {
        name: "ISC",
      },
      contact: {
        name: "Jefferson de Souza Gonçalves",
        email: "jeffsouza@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/application/http/routes/*.ts"],
};

const specs = swaggerJsdoc(options);
expressApp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

export default expressApp;
