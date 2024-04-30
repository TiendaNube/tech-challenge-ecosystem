import { Module } from '@nestjs/common';
import { MerchantsModule } from './merchants/merchants.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import rabbitMqConfig from './config/rabbit-mq.config';
import { TransactionsModule } from './transactions/transactions.module';
import { PayablesModule } from './payables/payables.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, rabbitMqConfig],
      envFilePath: ['.env'],
    }),
    TransactionsModule,
    MerchantsModule,
    PayablesModule,
  ],
})
export class AppModule {}
