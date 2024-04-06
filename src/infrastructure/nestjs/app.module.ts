import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TransactionController } from './controllers/transaction-controller';
import { TransactionControllerImpl } from 'src/application/controllers/transaction.controller';
import { DataSource, Repository } from 'typeorm';
import { TransactionEntity } from './database/entities/transaction.entity';
import { TransactionRepositoryImpl } from './repositories/transaction.repository';
import { CreateTransactionUseCase } from '@domain/usecases/createTransaction/create-transaction.usecase';
import { DataBaseModule } from './database/database.module';
import {
    DATA_SOURCE,
    TRANSACTION_CONTROLLER,
    TRANSACTION_REPOSITORY,
} from './helpers/constants';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers: [AppController, TransactionController],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DataBaseModule,
    ],
    providers: [
        TransactionRepositoryImpl,
        {
            provide: TRANSACTION_CONTROLLER,
            inject: [TRANSACTION_REPOSITORY],
            useFactory: (repository: Repository<TransactionEntity>) => {
                const transactionRepository = new TransactionRepositoryImpl(
                    repository.target,
                    repository.manager,
                    repository.queryRunner,
                );

                const createTransactionUseCase = new CreateTransactionUseCase(
                    transactionRepository,
                );
                const transActionController = new TransactionControllerImpl(
                    createTransactionUseCase,
                );

                return transActionController;
            },
        },
        {
            provide: TRANSACTION_REPOSITORY,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(TransactionEntity),
            inject: [DATA_SOURCE],
        },
    ],
})
export class AppModule {}
