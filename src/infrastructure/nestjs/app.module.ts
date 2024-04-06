import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TransactionController } from './controllers/transaction-controller';
import { TransactionControllerImpl } from 'src/application/controllers/transaction.controller';
import { DataSource } from 'typeorm';
import { TransactionRepositoryImpl } from './repositories/transaction.repository';
import { CreateTransactionUseCase } from '@domain/usecases/createTransaction/create-transaction.usecase';
import { DataBaseModule } from './database/database.module';
import { DATA_SOURCE, TRANSACTION_CONTROLLER } from './helpers/constants';
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
            useFactory: (dataSource: DataSource) => {
                const transactionRepositoryImpl = new TransactionRepositoryImpl(
                    dataSource,
                );
                const createTransactionUseCase = new CreateTransactionUseCase(
                    transactionRepositoryImpl,
                );
                const transActionController = new TransactionControllerImpl(
                    createTransactionUseCase,
                );
                return transActionController;
            },
            inject: [DATA_SOURCE],
        },
    ],
})
export class AppModule {}
