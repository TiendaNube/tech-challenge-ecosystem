import { Module } from '@nestjs/common';
import { PostgreSqlModule } from '@modules/postgresql/postgresl.module';
import { TransactionServiceController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TransactionExpService } from './services/transaction.exp.service';
import { TransactionProfile } from './profiles/transaction.profile';
import { ApiKeyGuard } from './guards/apikey.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [PostgreSqlModule],
    controllers: [TransactionServiceController],
    providers: [
        TransactionProfile,
        TransactionService,
        TransactionExpService,
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard,
        },
    ],
    exports: [TransactionExpService],
})
export class TransactionModule {}
