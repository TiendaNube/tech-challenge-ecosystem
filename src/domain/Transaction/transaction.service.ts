import { Inject, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { PayableService } from '../Payable/payable.service'
import { Payable } from '../Payable/payable'
import { Transaction } from './transaction'

@Injectable()
export class TransactionService {
  constructor(private dataSource: DataSource) {}

  async createTransaction(transactionDTO: Partial<Transaction>) : Promise<Transaction> {
    const newTransaction = await Transaction.create(transactionDTO as Transaction)
    const newPayable = Payable.createPayableFromTransaction(newTransaction)

    return this.dataSource.transaction(async (manager) : Promise<Transaction> => {
      const savedTransaction = await manager.save(newTransaction) as Transaction
      newPayable.originatingTransaction = savedTransaction
      await manager.save(newPayable)
      return savedTransaction
    })
  }
}
