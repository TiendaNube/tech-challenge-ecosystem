import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionModule } from './domain/Transaction/transaction.module'
import { PayableModule } from './domain/Payable/payable.module'
import { Payable } from './domain/Payable/payable'
import { Transaction } from './domain/Transaction/transaction'

@Module({
  imports: [
    TransactionModule,
    PayableModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nuvemshop',
      password: 'nuvemshop',
      database: 'nuvemshop',
      entities: [Payable, Transaction],
      synchronize: true,
      migrations: [
        'src/migrations/**/*{.ts,.js}',
      ],
    }),
  ],
})
export class AppModule {}
