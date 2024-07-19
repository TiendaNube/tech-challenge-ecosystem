import { Payable } from '../src/domain/Payable/payable'
import { Transaction } from '../src/domain/Transaction/transaction'

export const databaseTestOptions = {
  type: 'postgres',
  username: 'nuvemshop',
  password: 'nuvemshop',
  database: 'nuvemshop_test',
  port: 5554,
  dropSchema: true,
  entities: [Payable, Transaction],
  synchronize: true,
  logging: false,
}
