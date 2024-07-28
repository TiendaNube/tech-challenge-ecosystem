import { Module } from '@nestjs/common';
import { TransactionServiceController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';

@Module({
    imports: [],
    controllers: [TransactionServiceController],
    providers: [TransactionService],
})
export class TransactionModule {}
