import { container, instanceCachingFactory } from 'tsyringe';

import { PrismaClient } from '@prisma/client';
import IWorkerService from '@services/ITransactionService';
import WorkerService from '@services/impl/TransactionService';
import ICacheProvider from '@providers/CacheProvider/ICacheProvider';
import RedisCacheProvider from '@infra/providers/RedisCacheProvider';
import MerchantRepository from '@infra/database/repositories/MerchantRepository';
import IMerchantRepository from '@domain/IMerchantRepository';
import IPayableRepository from '@domain/IPayableRepository';
import PayableRepository from '@infra/database/repositories/PayableRepository';
import ITransactionRepository from '@domain/ITransactionRepository';
import TransactionRepository from '@infra/database/repositories/TransactionRepository';
import PayableService from '@services/impl/PayableService';
import IPayableService from '@services/IPayableService';
import ITransactionService from '@services/ITransactionService';
import TransactionService from '@services/impl/TransactionService';
import { EventPublisher } from '@domain/events/EventPublisher';
import { EventBus } from '@infra/events/EventBus';
import { CreatePayableEventListener } from '@infra/events/CreatePayableEventListener';

container.registerSingleton<IMerchantRepository>(
  'MerchantRepository',
  MerchantRepository,
);

container.registerSingleton<IPayableRepository>(
  'PayableRepository',
  PayableRepository,
);

container.registerSingleton<ITransactionRepository>(
  'TransactionRepository',
  TransactionRepository,
);

container.registerSingleton<ITransactionService>(
  'TransactionService',
  TransactionService,
);

container.registerSingleton<IPayableService>('PayableService', PayableService);

container.registerSingleton<IWorkerService>('WorkerService', WorkerService);

container.register<PrismaClient>('Database', {
  useFactory: instanceCachingFactory<PrismaClient>(() => new PrismaClient()),
});

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  RedisCacheProvider,
);

const eventBus = new EventBus();
eventBus.register(
  new CreatePayableEventListener(container.resolve('PayableService')),
);

container.registerInstance<EventPublisher>('EventPublisher', eventBus);
