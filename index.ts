import dotenv from "dotenv";
import { loadDependencyInjection } from "./dependency_injection";
import { TransactionModel } from "./src/infrastructure/database/postgresql/repository/transactions";
import { PayableModel } from "./src/infrastructure/database/postgresql/repository/payables";
import { startServer } from "./src/application/http/app";

// loading environment variables
dotenv.config();

// loading ORM mapping
TransactionModel.load();
PayableModel.load();

// loading dependency injection
loadDependencyInjection();

startServer();
