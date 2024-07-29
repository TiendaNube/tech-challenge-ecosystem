import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from '../config/config-typorm-module';
import { PaymentEntity } from './entities/payment.entity';
import { PayablesEntity } from './entities/payable.entity';
import { PostgreSqlTransactionsExpService } from './services/postgresql.transactions.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
        }),
        TypeOrmModule.forFeature([PaymentEntity, PayablesEntity]),
    ],
    providers: [PostgreSqlTransactionsExpService],
    exports: [TypeOrmModule, PostgreSqlTransactionsExpService],
})
export class PostgreSqlModule {}
