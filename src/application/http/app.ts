import express from "express";
import bodyParser from "body-parser";
import transactionsRouter from "./routes/transaction_routes";
import { requestErrorHandler } from "./middlewares/errors_handler";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cluster from "cluster";
import os from "os";

const app = express();

// config swagger
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

function loadExpressMiddlewares() {
  // endpoint for swagger documentation
  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  // middlewares before routers
  app.use(bodyParser.json());

  // routers
  app.use("/v1/transactions", transactionsRouter);

  // middlewares after routers
  app.use(requestErrorHandler);
}

/**
 * Configuration for express to run on multiple CPUs cores to improve performance and scalability.
 */
export function startServer() {
  const numCPUs = os.cpus().length;

  if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`Worker process ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    loadExpressMiddlewares();

    app.listen(process.env.PORT, () => {
      console.log(`Worker process ${process.pid} is listening on port 3000`);
    });
  }
}

export function expressApp() {
  loadExpressMiddlewares();

  return app;
}
