import { ContainerBuilder } from "node-dependency-injection";
import { CreateNewTransactionAdapter } from "./src/infrastructure/database/postgresql/command/create_new_transaction_adapter";
import { ProcessTransactionService } from "./src/domain/services/command/process_transaction_service";
import { FetchTotalPayablesByPeriodAdapter } from "./src/infrastructure/database/postgresql/query/fetch_total_payables_by_period_adapter";
import { FetchTotalPayablesByPeriodService } from "./src/domain/services/query/fetch_total_payables_by_period_service";

let container = new ContainerBuilder();

export function loadDependencyInjection() {
  // injecting ProcessTransactionService dependencies
  container.register(
    "CreateNewTransactionAdapter",
    CreateNewTransactionAdapter
  );

  container
    .register("ProcessTransactionService", ProcessTransactionService)
    .addArgument(container.get("CreateNewTransactionAdapter"));

  // injecting FetchTotalPayablesByPeriodService dependencies
  container.register(
    "FetchTotalPayablesByPeriodAdapter",
    FetchTotalPayablesByPeriodAdapter
  );

  container
    .register(
      "FetchTotalPayablesByPeriodService",
      FetchTotalPayablesByPeriodService
    )
    .addArgument(container.get("FetchTotalPayablesByPeriodAdapter"));
}

export function getDependency(dependency: any): any {
  return container.get(dependency);
}
