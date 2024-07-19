import { Module } from '@nestjs/common'
import { PayableModule } from '../Payable/payable.module'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

export const transactionModuleMetadata = {
  imports: [PayableModule],
  controllers: [TransactionController],
  providers: [TransactionService],
}

@Module(transactionModuleMetadata)
export class TransactionModule {}
