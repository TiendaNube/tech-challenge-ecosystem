import { Module } from '@nestjs/common';
import { TransactionServiceController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TransactionExpService } from './services/transaction.exp.service';

@Module({
    imports: [],
    controllers: [TransactionServiceController],
    providers: [TransactionService, TransactionExpService],
    exports: [TransactionExpService],
})
export class TransactionModule {}
