import 'dotenv/config';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? '',
      port: +(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
      database: process.env.POSTGRES_DATABASE ?? '',
      entities: [],
      migrations: [],
      migrationsRun: process.env.RUN_MIGRATIONS === 'true',
      synchronize: false,
    }),
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
