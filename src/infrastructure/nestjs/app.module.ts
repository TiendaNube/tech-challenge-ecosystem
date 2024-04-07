import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TransactionController } from './controllers/transaction-controller';
import { TransactionControllerImpl } from 'src/application/controllers/transaction.controller';
import { DataSource, Repository } from 'typeorm';
import { TransactionRepositoryImpl } from './repositories/transaction.repository';
import { CreateTransactionUseCase } from '@domain/usecases/createTransaction/create-transaction.usecase';
import { DataBaseModule } from './database/database.module';
import {
    DATA_SOURCE,
    PAYABLE_CONTROLLER,
    PAYABLE_REPOSITORY,
    TRANSACTION_CONTROLLER,
} from './helpers/constants';
import { ConfigModule } from '@nestjs/config';
import { PayableEntity } from './database/entities/payable.entity';
import { GetSummaryPayablesUseCase } from '@domain/usecases/getSummaryPayables/get-summary-payables';
import { PayableControllerImpl } from '@application/controllers/payable.controller';
import { PayableController } from './controllers/payable-controller';
import { PayableRepositoryImpl } from './repositories/playable.repository';
import { setupSwagger } from './helpers/swagger';

@Module({
    controllers: [AppController, TransactionController, PayableController],
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
            useFactory: (dataSource: DataSource) => {
                const transactionRepositoryImpl = new TransactionRepositoryImpl(
                    dataSource,
                );
                const createTransactionUseCase = new CreateTransactionUseCase(
                    transactionRepositoryImpl,
                );
                const transactionController = new TransactionControllerImpl(
                    createTransactionUseCase,
                );
                return transactionController;
            },
            inject: [DATA_SOURCE],
        },
        {
            provide: PAYABLE_CONTROLLER,
            useFactory: (payableRepository: Repository<PayableEntity>) => {
                const getSummaryPayablesUseCase = new GetSummaryPayablesUseCase(
                    new PayableRepositoryImpl(payableRepository),
                );

                const payableController = new PayableControllerImpl(
                    getSummaryPayablesUseCase,
                );

                return payableController;
            },
            inject: [PAYABLE_REPOSITORY],
        },
        {
            provide: PAYABLE_REPOSITORY,
            useFactory: (dataSource: DataSource) => {
                return dataSource.getRepository(PayableEntity);
            },
            inject: [DATA_SOURCE],
        },
    ],
})
export class AppModule {}
