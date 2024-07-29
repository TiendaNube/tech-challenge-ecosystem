import { Module } from '@nestjs/common';
import { PostgreSqlModule } from '@modules/postgresql/postgresl.module';
import { TransactionServiceController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TransactionExpService } from './services/transaction.exp.service';
import { TransactionProfile } from './profiles/transaction.profile';

@Module({
    imports: [PostgreSqlModule],
    controllers: [TransactionServiceController],
    providers: [TransactionProfile, TransactionService, TransactionExpService],
    exports: [TransactionExpService],
})
export class TransactionModule {}
