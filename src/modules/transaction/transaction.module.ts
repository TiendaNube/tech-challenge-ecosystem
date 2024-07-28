import { Module } from '@nestjs/common';
import { TransactionServiceController } from './controllers/transaction.controller';

@Module({
    imports: [],
    controllers: [TransactionServiceController],
    providers: [],
})
export class TransactionModule {}
