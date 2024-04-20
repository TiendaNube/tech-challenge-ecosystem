import { ContainerBuilder } from "node-dependency-injection";
import { CreateNewTransactionAdapter } from "./src/infrastructure/database/postgresql/command/create_new_transaction_adapter";
import { ProcessTransactionService } from "./src/domain/services/command/process_transaction_service";

let container = new ContainerBuilder();

export function loadDependencyInjection() {
  container.register(
    "CreateNewTransactionAdapter",
    CreateNewTransactionAdapter
  );

  container
    .register("ProcessTransactionService", ProcessTransactionService)
    .addArgument(container.get("CreateNewTransactionAdapter"));
}

export function getDependency(dependency: any): any {
  return container.get(dependency);
}
