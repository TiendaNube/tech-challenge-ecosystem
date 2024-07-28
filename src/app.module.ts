import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigEnv } from '@commons/config-module.env';
import { HomeModule } from '@modules/home/home.module';
import { HealthModule } from '@modules/health/health.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: ConfigEnv,
        }),
        HomeModule,
        HealthModule,
        TransactionModule,
    ],
})
export class AppModule {}
